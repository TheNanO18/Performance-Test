package com.example.performance_test.controller;

import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.performance_test.dto.LoadConfigDto;
import com.example.performance_test.service.LoadTestService;

@RestController // 1. 이 클래스가 REST API를 처리함을 스프링에 알림
@RequestMapping("/api/test") // 2. 기본 경로 설정 (/api/test)
public class LoadTestController {// 💡 1. LoadTestService 필드 선언 및 의존성 주입
    private final LoadTestService loadTestService; 

    // 💡 2. 생성자를 통한 의존성 주입 (Spring 권장 방식)
    public LoadTestController(LoadTestService loadTestService) {
        this.loadTestService = loadTestService;
    }

	@PostMapping("/start")
	public ResponseEntity<String> startTest(@RequestBody LoadConfigDto config) {

		String allQueries = config.getTasks().stream().map(t -> t.getTaskName() + ": " + t.getTestQuery())
				.collect(Collectors.joining("; "));

		System.out.println("✅ [Controller] 설정 수신 완료: " + config.getTestName());
		System.out.println("✅ [Controller] 대상 DB URL: " + config.getTargetDbUrl());
		System.out.println("✅ [Controller] 수신된 쿼리 목록: " + allQueries);

		System.out.println("Received Load Configuration: " + config);

		// TODO: 3단계에서 LoadTestService.start(config) 호출 로직 추가

		try {
            // 💡 3. LoadTestService의 실제 로직 호출
            loadTestService.startLoadTest(config);
            System.out.println("✅ [Controller] LoadTestService 호출 완료. 테스트 시작 명령 전송.");

            return ResponseEntity.ok("Load test started successfully. Test Name: " + config.getTestName());

        } catch (Exception e) {
            // 💡 4. 예외 발생 시 상세 로그 출력 및 에러 응답 반환
            System.err.println("❌ [Controller] LoadTestService 호출 실패 또는 테스트 시작 중 오류: " + e.getMessage());
            e.printStackTrace(); 
            
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Failed to start test: " + e.getMessage());
        }
	}

	@PostMapping("/stop")
	public ResponseEntity<String> stopTest() {
		loadTestService.stopLoadTest();
        System.out.println("🛑 [Controller] 테스트 중지 요청 전송.");
        
        return ResponseEntity.ok("Load test stopping...");
	}

	// 테스트 이력 조회 API (나중에 구현)
	// @GetMapping("/history")
	// ...
}
