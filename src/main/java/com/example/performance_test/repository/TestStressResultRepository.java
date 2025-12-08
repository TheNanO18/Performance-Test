package com.example.performance_test.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.performance_test.dto.TestStressHistoryDto;
import com.example.performance_test.repository.entity.TestQueryResultEntity;

@Repository
public interface TestStressResultRepository extends JpaRepository<TestQueryResultEntity, Long> {
	//@formatter:off
	@Query(value = 
	    "SELECT new com.example.performance_test.dto.TestStressHistoryDto(" +
	    "   t.testName, " +
	    "   t.testTimeSec, " + 
	    "   (SUM(t.totalCpuCores) / (COUNT(t) * t.testTimeSec)) * 10000, " +      
	    "   (SUM(t.totalSystemCpuTime) / (COUNT(t) * t.testTimeSec)) * 10000, " + 
	    "   (SUM(t.totalUserCpuTime) / (COUNT(t) * t.testTimeSec)) * 10000, " +  
	    "   MAX(t.testEndTime)) " +
	    "FROM TestQueryResultEntity t " +
	    "WHERE t.testName = :testName AND " + 
	    "(:querySearch IS NULL OR t.query LIKE CONCAT('%', :querySearch, '%')) " +
	    "GROUP BY t.testName, t.testTimeSec" 
	)
	
	List<TestStressHistoryDto> findNormalizedResultsByTestName(@Param("testName") String testName, @Param("querySearch") String querySearch);
	//@formatter:on
}