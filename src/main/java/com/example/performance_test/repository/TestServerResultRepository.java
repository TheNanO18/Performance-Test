package com.example.performance_test.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.performance_test.dto.TestServerHistoryDto;
import com.example.performance_test.repository.entity.TestServerResultEntity;

@Repository
public interface TestServerResultRepository extends JpaRepository<TestServerResultEntity, Long> {
	//@formatter:off
	@Query(value = 
	    "SELECT new com.example.performance_test.dto.TestServerHistoryDto(" +
	    "   t.testName, " +
	    "   t.testTimeSec, " + 
	    "   (SUM(t.totalCpuCores) / (COUNT(t) * t.testTimeSec)) * 10000, " +
	    "   MAX(t.testEndTime)) " +
	    "FROM TestServerResultEntity t " +
	    "WHERE t.testName = :testName " +
	    "GROUP BY t.testName, t.testTimeSec"
	)
	
	List<TestServerHistoryDto> findNormalizedResultsByTestName(@Param("testName") String testName);
	//@formatter:on
}