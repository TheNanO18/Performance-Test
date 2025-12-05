package com.example.performance_test.service;

import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.sql.Timestamp;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.performance_test.dto.LoadConfigDto;
import com.example.performance_test.dto.LoadTaskConfig;
import com.example.performance_test.repository.TestResultRepository;
import com.example.performance_test.repository.entity.TestResultEntity;
import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

@Service
public class LoadTestService {

	// 전체 테스트를 관리할 ExecutorService
	private ExecutorService loadExecutorService;
	private TestResultRepository testResultRepository;

	// 스레드 안전한 카운터 (실시간 지표 계산에 사용)
	private final AtomicInteger totalExecutedRequests = new AtomicInteger(0);

	private HikariDataSource loadTargetDataSource;

	// 현재 테스트 ID (WebSocket 관리 등에 필요)
	private String currentTestId;

	@Autowired
	public LoadTestService(TestResultRepository testResultRepository) {
		this.testResultRepository = testResultRepository;
	}

	private LocalDateTime testStartTime;
	private LoadConfigDto currentConfig;

	public void startLoadTest(LoadConfigDto config) {
		this.testStartTime = LocalDateTime.now();
		this.currentConfig = config;

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
			saveTestResults(currentConfig);

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

	private void saveTestResults(LoadConfigDto config) {
	    if (loadTargetDataSource == null) {
	        System.err.println("❌ [Service] DataSource가 닫혀있어 결과를 저장할 수 없습니다.");
	        return;
	    }

	    LocalDateTime endTime = LocalDateTime.now(); // 테스트 종료 시간 기록
	    
	    long actualDurationSeconds = 0;
	    if (this.testStartTime != null) {
	        // testStartTime과 endTime 사이의 Duration을 구하고 초(seconds)로 변환
	        actualDurationSeconds = Duration.between(this.testStartTime, endTime).getSeconds();
	    }
	    
	    int finalTestTime = (int) Math.max(1, actualDurationSeconds);
	    
	    try (Connection conn = loadTargetDataSource.getConnection();
	         Statement stmt = conn.createStatement()) {
	         
	        // 1. ClickHouse 쿼리 정의 (event_time에 쉼표 추가 및 GROUP BY 수정 완료)
	        String clickHouseQuery = 
	            "SELECT query, " + 
	            "event_time, " + // 💡 쉼표(,) 추가됨
	            "normalized_query_hash, " +
	            "sum(ProfileEvents['UserTimeMicroseconds']) / 1e6 AS Total_User_CPU_Time_sec, " +
	            "sum(ProfileEvents['SystemTimeMicroseconds']) / 1e6 AS Total_System_CPU_Time_sec, " +
	            "sum(ProfileEvents['OSCPUVirtualTimeMicroseconds']) / 1e6 AS Total_Cores " +
	            "FROM system.query_log WHERE event_time > now() - INTERVAL " + finalTestTime + " SECOND " +
	            "AND CAST(type, 'Int8') IN (2, 4) GROUP BY query, event_time, normalized_query_hash"; // 💡 GROUP BY query, event_time로 개별 실행 건 추출

	        // 2. 쿼리 실행 및 결과 저장
	        try (ResultSet rs = stmt.executeQuery(clickHouseQuery)) {
	            List<TestResultEntity> entitiesToSave = new ArrayList<>();
	            
	            while (rs.next()) {
	                TestResultEntity entity = new TestResultEntity();
	                
	                // --- ClickHouse 결과 매핑 ---
	                entity.setTestName(config.getTestName());
	                entity.setTestTimeSec(finalTestTime);
	                entity.setTestEndTime(endTime);
	                
	                // 💡 추가된 부분: event_time 매핑 (TIMESTAMP -> LocalDateTime)
	                Timestamp timestamp = rs.getTimestamp("event_time");
	                if (timestamp != null) {
	                    entity.setEventTime(timestamp);
	                }
	                
	                // ClickHouse 결과 필드 매핑
	                entity.setQuery(rs.getString("query"));
	                entity.setNormalizedQueryHash(rs.getString("normalized_query_hash"));
	                
	                // NUMERIC(22,2) 타입에 맞춰 BigDecimal로 변환하여 저장
	                entity.setTotalUserCpuTime(BigDecimal.valueOf(rs.getDouble("Total_User_CPU_Time_sec")));
	                entity.setTotalSystemCpuTime(BigDecimal.valueOf(rs.getDouble("Total_System_CPU_Time_sec")));
	                entity.setTotalCpuCores(BigDecimal.valueOf(rs.getDouble("Total_Cores")));
	                
	                entitiesToSave.add(entity);
	            }
	            
	            // 3. JPA Repository를 사용하여 결과 저장
	            testResultRepository.saveAll(entitiesToSave);
	            System.out.println("✅ [Service] 테스트 결과 " + entitiesToSave.size() + "개 JPA DB에 저장 완료.");
	            
	        }
	    } catch (Exception e) {
	        System.err.println("❌ [Service] ClickHouse 결과 추출/저장 실패: " + e.getMessage());
	        e.printStackTrace();
	    }
	}
}