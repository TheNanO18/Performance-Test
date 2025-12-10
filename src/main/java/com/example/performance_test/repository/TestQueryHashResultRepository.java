package com.example.performance_test.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.performance_test.dto.TestEzisHashQueryHistoryDto;
import com.example.performance_test.repository.entity.TestQueryResultEntity;

@Repository
public interface TestQueryHashResultRepository extends JpaRepository<TestQueryResultEntity, Long> {
	//@formatter:off
	@Query(value = 
		    "SELECT new com.example.performance_test.dto.TestEzisHashQueryHistoryDto(" +
		    "   t.testName, " +
		    "   t.testTimeSec, " + 
		    "   t.normalizedQueryHash, " + 
		    "   (SUM(t.totalCpuCores) / (COUNT(t) * t.testTimeSec)) * 10000, " +      
		    "   (SUM(t.totalSystemCpuTime) / (COUNT(t) * t.testTimeSec)) * 10000, " + 
		    "   (SUM(t.totalUserCpuTime) / (COUNT(t) * t.testTimeSec)) * 10000, " +  
		    "   MAX(t.testEndTime)) " +
		    "FROM TestQueryResultEntity t " +
		    "WHERE t.testName = :testName AND " + 
		    "t.query LIKE '%-- EZIS%' " +
		    "GROUP BY t.testName, t.testTimeSec, t.normalizedQueryHash " +
		    "ORDER BY (SUM(t.totalCpuCores) / (COUNT(t) * t.testTimeSec)) * 10000 desc"
		)
		
		
	List<TestEzisHashQueryHistoryDto> findNormalizedResultsByTestName(@Param("testName") String testName);
	//@formatter:on
}