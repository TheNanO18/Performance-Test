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

    // 💡 새로운 조회 메서드: 특정 Test Name의 모든 데이터를 집계하여 반환
    @Query(value = 
        "SELECT new com.example.performance_test.dto.TestHistoryDto(" +
        "   t.testName, " +
        "   t.testTimeSec, " + // testTime_sec 컬럼명과 매핑
        "   SUM(t.totalCpuCores), " +
        "   SUM(t.totalSystemCpuTime), " +
        "   SUM(t.totalUserCpuTime)) " +
        "FROM TestResultEntity t " +
        "WHERE t.testName = :testName " + // @Param("testName")과 매핑
        "GROUP BY t.testName, t.testTimeSec"
        // 'testTime_sec'는 Entity에 'testTime'으로 매핑되어 있으므로 t.testTime을 사용
    )
    List<TestHistoryDto> findAggregatedResultsByTestName(@Param("testName") String testName);
}