package com.example.performance_test.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.performance_test.dto.TestHistoryDto;
import com.example.performance_test.repository.entity.TestResultEntity;

@Repository
public interface TestResultRepository extends JpaRepository<TestResultEntity, Long> {

	// com.example.performance_test.repository.TestResultRepository.java

	@Query(value = 
	    "SELECT new com.example.performance_test.dto.TestHistoryDto(" +
	    "   t.testName, " +
	    "   t.testTimeSec, " + 
	    "   (SUM(t.totalCpuCores) / (COUNT(t) * t.testTimeSec)) * 10000, " +      
	    "   (SUM(t.totalSystemCpuTime) / (COUNT(t) * t.testTimeSec)) * 10000, " + 
	    "   (SUM(t.totalUserCpuTime) / (COUNT(t) * t.testTimeSec)) * 10000, " +  
	    "   MAX(t.testEndTime)) " +
	    "FROM TestResultEntity t " +
	    "WHERE t.testName = :testName AND " + 
	    "(:querySearch IS NULL OR t.query LIKE CONCAT('%', :querySearch, '%')) " +
	    "GROUP BY t.testName, t.testTimeSec" 
	)
	
	
	List<TestHistoryDto> findNormalizedResultsByTestName(@Param("testName") String testName, @Param("querySearch") String querySearch);
}