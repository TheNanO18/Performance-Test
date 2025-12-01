package com.example.performance_test.Service;

import org.springframework.stereotype.Service;

import com.example.performance_test.dto.LoadConfigDto;

@Service
public class LoadTestService {
	// 부하 테스트 실행 상태 관리 변수 (예: AtomicBoolean isRunning = new AtomicBoolean(false);)

    // 동시성 관리를 위한 스레드 풀
    // private ExecutorService executor; 

    public void startLoadTest(LoadConfigDto config) {
        // 1. 대상 DB 커넥션 설정 및 테스트 시작 (ExecutorService 활용)
        // 2. ClickHouse 모니터링 스레드 시작
        // 3. WebSocket을 통해 실시간 상태 업데이트 시작
        System.out.println("Starting load test with " + config.getConcurrency() + " concurrent users.");
    }

    public void stopLoadTest() {
        // 1. 스레드 풀 종료 요청
        // 2. 모니터링 중단
    }
}
