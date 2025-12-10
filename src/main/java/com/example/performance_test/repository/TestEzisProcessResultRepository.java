package com.example.performance_test.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.performance_test.dto.TestEzisProcessQueryHistoryDto;
import com.example.performance_test.repository.entity.TestQueryResultEntity;

@Repository
public interface TestEzisProcessResultRepository extends JpaRepository<TestQueryResultEntity, Long> {
	//@formatter:off
	@Query(value = 
		    "SELECT new com.example.performance_test.dto.TestEzisProcessQueryHistoryDto(" +
		    "   case WHEN t.query LIKE '%-- EZIS%' THEN 'Ezis Query Processes ' " + 
		    "        ELSE 'Not Ezis Query Processes' " + 
		    "    END, " + 
		    "   t.testName, " +
		    "   t.testTimeSec, " + 
		    "   t.httpUserAgent, " + 
		    "   (SUM(t.totalCpuCores) / (COUNT(t) * t.testTimeSec)) * 10000, " +
		    "   (SUM(t.totalSystemCpuTime) / (COUNT(t) * t.testTimeSec)) * 10000, " + 
		    "   (SUM(t.totalUserCpuTime) / (COUNT(t) * t.testTimeSec)) * 10000, " +  
		    "   MAX(t.testEndTime)) " +
		    "FROM TestQueryResultEntity t " +
		    "WHERE t.testName = :testName " + 
		    "GROUP BY (case WHEN t.query LIKE '%-- EZIS%' THEN 'Ezis Query Processes ' ELSE 'Not Ezis Query Processes' END), " +
		    "t.testName, t.testTimeSec, t.httpUserAgent, t.testEndTime " +
		    "ORDER BY httpUserAgent"
		)
	
	List<TestEzisProcessQueryHistoryDto> findNormalizedResultsByTestName(@Param("testName") String testName);
	//@formatter:on
}