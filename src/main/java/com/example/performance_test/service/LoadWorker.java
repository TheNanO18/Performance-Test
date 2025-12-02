package com.example.performance_test.service;

import java.sql.Connection;
import java.sql.Statement;
import java.util.concurrent.atomic.AtomicInteger;

import javax.sql.DataSource;

import com.example.performance_test.dto.LoadTaskConfig;

// JDBC 연결을 위해 java.sql.* 패키지를 import해야 합니다.

public class LoadWorker implements Runnable {

	private final DataSource dataSource;
	private final LoadTaskConfig taskConfig;
	private final AtomicInteger counter;

	public LoadWorker(DataSource dataSource, LoadTaskConfig taskConfig, AtomicInteger counter) {
		this.dataSource = dataSource;
		this.taskConfig = taskConfig;
		this.counter = counter;

	}

	@Override

	public void run() {
		// 이 스레드가 종료될 때까지 무한 반복 (ExecutorService.shutdownNow() 호출 시 Interrupted)
		while (!Thread.currentThread().isInterrupted()) {
			long startTime = System.currentTimeMillis();
			// 1. DB 연결 및 쿼리 실행
			try {
				try (Connection conn = dataSource.getConnection(); Statement stmt = conn.createStatement()) {
					System.out.println("⭐ [Worker " + Thread.currentThread().getName() + "] 쿼리 실행 중: "
							+ taskConfig.getTestQuery());
					stmt.execute(taskConfig.getTestQuery());
					counter.incrementAndGet();
					System.out.println("⭐ [Worker " + Thread.currentThread().getName() + "] 쿼리 실행 완료!");
				}

			} catch (Exception e) {
				System.err.println("❌ [Worker " + Thread.currentThread().getName() + "] Task ["
						+ taskConfig.getTaskName() + "] 실패: " + e.getMessage());
				e.printStackTrace();
			}
			long executionTime = System.currentTimeMillis() - startTime;
			// 2. 지연 시간(Delay) 적용

			try {
				// 쿼리 실행 시간 외에 추가로 대기해야 할 시간 계산
				long waitTime = (taskConfig.getDelaySeconds() * 1000) - executionTime;

				if (waitTime > 0) {
					Thread.sleep(waitTime);
				}
			} catch (InterruptedException e) {
				// sleep 중 인터럽트 발생 시 스레드 종료
				Thread.currentThread().interrupt();
			}
		}
	}
}