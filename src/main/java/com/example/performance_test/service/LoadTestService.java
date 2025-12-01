package com.example.performance_test.service;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

import org.springframework.stereotype.Service;

import com.example.performance_test.dto.LoadConfigDto;
import com.example.performance_test.dto.LoadTaskConfig;
import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

@Service
public class LoadTestService {

	// 전체 테스트를 관리할 ExecutorService
	private ExecutorService loadExecutorService;

	// 스레드 안전한 카운터 (실시간 지표 계산에 사용)
	private final AtomicInteger totalExecutedRequests = new AtomicInteger(0);

	private HikariDataSource loadTargetDataSource;

	// 현재 테스트 ID (WebSocket 관리 등에 필요)
	private String currentTestId;

	public void startLoadTest(LoadConfigDto config) {
		// 기존 실행 중인 테스트 중지
		if (loadExecutorService != null && !loadExecutorService.isShutdown()) {
			stopLoadTest();
		}

		// 1. 총 동시성 수 계산 (모든 태스크의 concurrency 합)
		int totalConcurrency = config.getTasks().stream().mapToInt(LoadTaskConfig::getConcurrency).sum();
		try {
			HikariConfig hikariConfig = new HikariConfig();
			hikariConfig.setJdbcUrl(config.getTargetDbUrl());
			hikariConfig.setUsername(config.getTargetDbUsername());
			hikariConfig.setPassword(config.getTargetDbPassword());
			hikariConfig.setDriverClassName(config.getTargetDbDriver());

			// 풀 사이즈 설정 (총 동시성 수보다 충분히 크게)
			hikariConfig.setMaximumPoolSize(Math.max(totalConcurrency * 2, 20));
			hikariConfig.setPoolName("DynamicClickHousePool_" + config.getTestName());

			this.loadTargetDataSource = new HikariDataSource(hikariConfig);
			System.out.println("✅ [Service] Dynamic ClickHouse Connection Pool Created. Size: "
					+ hikariConfig.getMaximumPoolSize());

		} catch (Exception e) {
			System.err.println("❌ [Service] ClickHouse Connection Pool Initialization Failed: " + e.getMessage());
			e.printStackTrace();
			return; // 풀 생성 실패 시 테스트 시작 중단
		}

		// 2. 총 동시성 수만큼 스레드를 가진 ExecutorService 생성
		loadExecutorService = Executors.newFixedThreadPool(totalConcurrency);
		System.out.println("TEST START: Total concurrency set to " + totalConcurrency + " threads.");
		this.currentTestId = config.getTestName(); // 간단히 testName을 ID로 사용 가정

		// 3. 각 태스크 설정을 순회하며 워커 스레드 할당
		for (LoadTaskConfig taskConfig : config.getTasks()) {

			// 4. 해당 쿼리에 설정된 동시성만큼 워커 스레드를 제출
			for (int i = 0; i < taskConfig.getConcurrency(); i++) {

				// LoadWorker 인스턴스 생성
				Runnable worker = new LoadWorker(this.loadTargetDataSource, // DB 연결 정보
						taskConfig, // 개별 쿼리/설정
						totalExecutedRequests // 카운터
				);
				loadExecutorService.submit(worker); // 스레드 풀에 작업 제출
			}
		}

		// 5. 전체 테스트 지속 시간 이후 종료 예약
		Executors.newSingleThreadScheduledExecutor().schedule(() -> {
			System.out.println("Test duration (" + config.getDurationSeconds() + "s) reached. Shutting down executor.");
			stopLoadTest();
		}, config.getDurationSeconds(), TimeUnit.SECONDS);
	}

	public void stopLoadTest() {
		// 1. ExecutorService 종료
		if (loadExecutorService != null && !loadExecutorService.isShutdown()) {
			loadExecutorService.shutdownNow(); // 실행 중인 모든 태스크 강제 종료
			loadExecutorService = null; // 정리
			System.out.println("Load test Executor has been shut down.");
		}

		// 2. 💡 테스트 종료 시점에 커넥션 풀을 해제 (DB 연결 끊기)
		if (loadTargetDataSource != null) {
			loadTargetDataSource.close(); // 커넥션 풀의 모든 DB 연결 해제
			loadTargetDataSource = null; // 정리
			System.out.println("🛑 [Service] Dynamic ClickHouse Connection Pool Closed.");
		}
	}
}