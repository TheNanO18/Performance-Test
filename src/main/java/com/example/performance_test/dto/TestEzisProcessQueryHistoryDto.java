package com.example.performance_test.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class TestEzisProcessQueryHistoryDto {
	private String testName;
	private Integer testTimeSec;
	private String normalizedQueryHash;
	private String httpUserAgent;
	private BigDecimal totalCpuCores;
	private BigDecimal totalSystemCpuTime;
	private BigDecimal totalUserCpuTime;
	private LocalDateTime maxTestEndTime;

	public TestEzisProcessQueryHistoryDto(String testName, Integer testTimeSec, String normalizedQueryHash,
			String httpUserAgent, BigDecimal totalCpuCores, 
			BigDecimal totalSystemCpuTime, 
			BigDecimal totalUserCpuTime, 
			LocalDateTime maxTestEndTime 
	) {
		this.testName = testName;
		this.testTimeSec = testTimeSec;
		this.normalizedQueryHash = normalizedQueryHash;
		this.httpUserAgent = httpUserAgent;
		this.totalCpuCores = totalCpuCores;
		this.totalSystemCpuTime = totalSystemCpuTime;
		this.totalUserCpuTime = totalUserCpuTime;
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

	public String getNormalizedQueryHash() {
		return normalizedQueryHash;
	}

	public void setNormalizedQueryHash(String normalizedQueryHash) {
		this.normalizedQueryHash = normalizedQueryHash;
	}

	public String getHttpUserAgent() {
		return httpUserAgent;
	}

	public void setHttpUserAgent(String httpUserAgent) {
		this.httpUserAgent = httpUserAgent;
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

	public LocalDateTime getMaxTestEndTime() {
		return maxTestEndTime;
	}

	public void setMaxTestEndTime(LocalDateTime maxTestEndTime) {
		this.maxTestEndTime = maxTestEndTime;
	}

}
