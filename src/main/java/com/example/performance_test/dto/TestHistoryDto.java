package com.example.performance_test.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class TestHistoryDto {
	private String testName;
	private Integer testTimeSec;
	private BigDecimal totalCpuCores;
	private BigDecimal totalSystemCpuTime;
	private BigDecimal totalUserCpuTime;
	private LocalDateTime maxTestEndTime;

	public TestHistoryDto(String testName, Integer testTimeSec, BigDecimal totalCpuCores, BigDecimal totalSystemCpuTime, BigDecimal totalUserCpuTime, LocalDateTime maxTestEndTime) {
		this.testName = testName;
		this.testTimeSec = testTimeSec;
		this.totalCpuCores = totalCpuCores;
		this.totalSystemCpuTime = totalSystemCpuTime;
		this.totalUserCpuTime = totalUserCpuTime;
		this.maxTestEndTime = maxTestEndTime;
	}

	public LocalDateTime getMaxTestEndTime() {
		return maxTestEndTime;
	}

	public void setMaxTestEndTime(LocalDateTime maxTestEndTime) {
		this.maxTestEndTime = maxTestEndTime;
	}

	public TestHistoryDto() {}
	
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

	public BigDecimal getTotalSystemCpuTime() {
		return totalSystemCpuTime;
	}

	public void setTotalSystemCpuTime(BigDecimal totalSystemCpuTime) {
		this.totalSystemCpuTime = totalSystemCpuTime;
	}

	public BigDecimal getTotalUserCpuTime() {
		return totalUserCpuTime;
	}

	public void setTotalUserCpuTime(BigDecimal totalUserCpuTime) {
		this.totalUserCpuTime = totalUserCpuTime;
	}

}
