package com.example.performance_test.dto;

public class LoadConfigDto {
	// 타겟DB 커넥션
	private String targetDbUrl;
	private String targetDbUsername;
	private String targetDbPassword;
	private String targetDbDriver;

	// 화면 2: 부하 설정
	private String testQuery; // DB에 실행할 쿼리
	private int concurrency; // 동시 실행 스레드 수 (핵심)
	private int durationSeconds; // 부하 지속 시간 (초)
	private long delayMillis; // 쿼리와 쿼리 사이의 주기 (밀리초)
	private String testName; // 테스트 이름 (이력 저장을 위해)

	public String getTargetDbUrl() {
		return targetDbUrl;
	}

	public void setTargetDbUrl(String targetDbUrl) {
		this.targetDbUrl = targetDbUrl;
	}

	public String getTargetDbUsername() {
		return targetDbUsername;
	}

	public void setTargetDbUsername(String targetDbUsername) {
		this.targetDbUsername = targetDbUsername;
	}

	public String getTargetDbPassword() {
		return targetDbPassword;
	}

	public void setTargetDbPassword(String targetDbPassword) {
		this.targetDbPassword = targetDbPassword;
	}

	public String getTargetDbDriver() {
		return targetDbDriver;
	}

	public void setTargetDbDriver(String targetDbDriver) {
		this.targetDbDriver = targetDbDriver;
	}

	public String getTestQuery() {
		return testQuery;
	}

	public void setTestQuery(String testQuery) {
		this.testQuery = testQuery;
	}

	public int getConcurrency() {
		return concurrency;
	}

	public void setConcurrency(int concurrency) {
		this.concurrency = concurrency;
	}

	public int getDurationSeconds() {
		return durationSeconds;
	}

	public void setDurationSeconds(int durationSeconds) {
		this.durationSeconds = durationSeconds;
	}

	public long getDelayMillis() {
		return delayMillis;
	}

	public void setDelayMillis(long delayMillis) {
		this.delayMillis = delayMillis;
	}

	public String getTestName() {
		return testName;
	}

	public void setTestName(String testName) {
		this.testName = testName;
	}
}
