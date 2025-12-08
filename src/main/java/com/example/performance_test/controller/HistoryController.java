package com.example.performance_test.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.performance_test.dto.TestEzisHashQueryHistoryDto;
import com.example.performance_test.dto.TestEzisProcessQueryHistoryDto;
import com.example.performance_test.dto.TestServerHistoryDto;
import com.example.performance_test.dto.TestStressHistoryDto;
import com.example.performance_test.repository.TestEzisProcessResultRepository;
import com.example.performance_test.repository.TestQueryHashResultRepository;
import com.example.performance_test.repository.TestServerResultRepository;
import com.example.performance_test.repository.TestStressResultRepository;

//package com.example.performance_test.controller;

@RestController
@RequestMapping("/api/history")
public class HistoryController {

 private final TestStressResultRepository testStressResultRepository;
 private final TestServerResultRepository testServerResultRepository;
 private final TestQueryHashResultRepository testQueryHashResultRepository;
 private final TestEzisProcessResultRepository testEzisQueryResultRepository;

 public HistoryController(TestStressResultRepository testStressResultRepository, TestQueryHashResultRepository testQueryHashResultRepository
		 , TestServerResultRepository testServerResultRepository, TestEzisProcessResultRepository testEzisQueryResultRepository) {
     this.testStressResultRepository = testStressResultRepository;
     this.testServerResultRepository = testServerResultRepository;
     this.testQueryHashResultRepository = testQueryHashResultRepository;
     this.testEzisQueryResultRepository = testEzisQueryResultRepository;
 }

 // 💡 GET /api/history/results?testName=TEST_A
 @GetMapping("/stress-results")
 public ResponseEntity<List<TestStressHistoryDto>> getHistoryResults(@RequestParam String testName, @RequestParam(required = false) String querySearch) {
     
     List<TestStressHistoryDto> results = testStressResultRepository.findNormalizedResultsByTestName(testName, querySearch);
     
     if (results.isEmpty()) {
         return ResponseEntity.notFound().build();
     }
     return ResponseEntity.ok(results);
 }
 
 @GetMapping("/query-hash")
 public ResponseEntity<List<TestEzisHashQueryHistoryDto>> getQueryHashHistory(
     @RequestParam String testName
 ) {
     
     List<TestEzisHashQueryHistoryDto> results = testQueryHashResultRepository.findNormalizedResultsByTestName(testName);
     
     if (results.isEmpty()) {
         return ResponseEntity.ok(List.of()); 
     }
     return ResponseEntity.ok(results);
 }
 
 @GetMapping("/server")
 public ResponseEntity<List<TestServerHistoryDto>> getServerHistory(
     @RequestParam String testName
 ) {
     
     List<TestServerHistoryDto> results = testServerResultRepository.findNormalizedResultsByTestName(testName);
     
     if (results.isEmpty()) {
         return ResponseEntity.ok(List.of()); 
     }
     return ResponseEntity.ok(results);
 }
 
 @GetMapping("/process")
 public ResponseEntity<List<TestEzisProcessQueryHistoryDto>> getProcessHistory(
     @RequestParam String testName
 ) {
     
     List<TestEzisProcessQueryHistoryDto> results = testEzisQueryResultRepository.findNormalizedResultsByTestName(testName);
     
     if (results.isEmpty()) {
         return ResponseEntity.ok(List.of()); 
     }
     return ResponseEntity.ok(results);
 }
}