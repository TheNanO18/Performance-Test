package com.example.performance_test.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.performance_test.dto.TestHistoryDto;
import com.example.performance_test.repository.TestResultRepository;

//package com.example.performance_test.controller;

@RestController
@RequestMapping("/api/history")
public class HistoryController {

 private final TestResultRepository testResultRepository;

 public HistoryController(TestResultRepository testResultRepository) {
     this.testResultRepository = testResultRepository;
 }

 // 💡 GET /api/history/results?testName=TEST_A
 @GetMapping("/results")
 public ResponseEntity<List<TestHistoryDto>> getHistoryResults(@RequestParam String testName) {
     
     List<TestHistoryDto> results = testResultRepository.findNormalizedResultsByTestName(testName);
     
     if (results.isEmpty()) {
         return ResponseEntity.notFound().build();
     }
     return ResponseEntity.ok(results);
 }
}