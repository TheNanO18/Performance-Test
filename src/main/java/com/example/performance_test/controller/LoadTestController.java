package com.example.performance_test.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.performance_test.dto.LoadConfigDto;

@RestController // 1. 이 클래스가 REST API를 처리함을 스프링에 알림
@RequestMapping("/api/test") // 2. 기본 경로 설정 (/api/test)
public class LoadTestController {
	// private final LoadTestService loadTestService; // 3단계에서 사용할 서비스 주입

    @PostMapping("/start")
    public ResponseEntity<String> startTest(@RequestBody LoadConfigDto config) {
        System.out.println("Received Load Configuration: " + config);

        // TODO: 3단계에서 LoadTestService.start(config) 호출 로직 추가

        return ResponseEntity.ok("Load test initialization requested. Test Name: " + config.getTestName());
    }

    @PostMapping("/stop")
    public ResponseEntity<String> stopTest() {
        // TODO: LoadTestService.stop() 호출 로직 추가
        return ResponseEntity.ok("Load test stopping...");
    }

    // 테스트 이력 조회 API (나중에 구현)
    // @GetMapping("/history")
    // ...
}
