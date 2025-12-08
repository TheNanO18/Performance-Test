package com.example.performance_test.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class TestServerHistoryDto {
	private String testName;
    private Integer testTimeSec;
    private BigDecimal totalCpuCores; // 정규화된 서버 코어 사용량
    private LocalDateTime maxTestEndTime;

    // 💡 JPQL 쿼리 결과 순서와 타입이 완벽하게 일치해야 합니다.
    public TestServerHistoryDto(
        String testName,
        Integer testTimeSec,
        BigDecimal totalCpuCores,
        LocalDateTime maxTestEndTime
    ) {
        this.testName = testName;
        this.testTimeSec = testTimeSec;
        this.totalCpuCores = totalCpuCores;
        this.maxTestEndTime = maxTestEndTime;
    }

	public String getTestName() {
		return testName;
	}

	public void setTestName(String testName) {
		this.testName = testName;
	}

	public Integer getTestTimeSec() {
		return testTimeSec;
	}

	public void setTestTimeSec(Integer testTimeSec) {
		this.testTimeSec = testTimeSec;
	}

	public BigDecimal getTotalCpuCores() {
		return totalCpuCores;
	}

	public void setTotalCpuCores(BigDecimal totalCpuCores) {
		this.totalCpuCores = totalCpuCores;
	}

	public LocalDateTime getMaxTestEndTime() {
		return maxTestEndTime;
	}

	public void setMaxTestEndTime(LocalDateTime maxTestEndTime) {
		this.maxTestEndTime = maxTestEndTime;
	}
}
