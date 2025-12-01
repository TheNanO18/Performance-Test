package com.example.performance_test.dto;

import java.util.List;

public class LoadConfigDto {
	// DB 연결 정보
	private String targetDbUrl;
	private String targetDbUsername;
	private String targetDbPassword;
	private String targetDbDriver;

	private String testName;
	private int durationSeconds;

	// 핵심 변경: 여러 태스크 설정을 담는 리스트
	private List<LoadTaskConfig> tasks;

	// 기본 생성자
	public LoadConfigDto() {
	}

	public String getTargetDbUrl() {
		return targetDbUrl;
	}

	public void setTargetDbUrl(String targetDbUrl) {
		this.targetDbUrl = targetDbUrl;
	}

	public String getTargetDbUsername() {
		return targetDbUsername;
	}

	public List<LoadTaskConfig> getTasks() {
		return tasks;
	}

	public void setTasks(List<LoadTaskConfig> tasks) {
		this.tasks = tasks;
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

	public int getDurationSeconds() {
		return durationSeconds;
	}

	public void setDurationSeconds(int durationSeconds) {
		this.durationSeconds = durationSeconds;
	}

	public String getTestName() {
		return testName;
	}

	public void setTestName(String testName) {
		this.testName = testName;
	}

	@Override
	public String toString() {
		// 실제 데이터가 출력되도록 수정
		return "LoadConfigDto{" + "targetDbUrl='" + targetDbUrl + '\'' + ", testName='" + testName + '\''
				+ ", durationSeconds=" + durationSeconds + ", tasks=" + (tasks != null ? tasks.toString() : "null")
				+ '}';
	}
}
