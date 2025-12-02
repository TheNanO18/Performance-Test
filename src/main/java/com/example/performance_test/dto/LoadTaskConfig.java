package com.example.performance_test.dto;

public class LoadTaskConfig {
	private String taskName; // 태스크 이름 (예: User Select)
	private String testQuery; // 이 태스크가 실행할 SQL 쿼리
	private int concurrency; // 이 쿼리를 실행할 동시 스레드 수 (VU)
	private int delaySeconds; // 쿼리 반복 실행 간 대기 시간 (ms)

	// 기본 생성자
	public LoadTaskConfig() {
	}

	// 전체 필드 생성자
	public LoadTaskConfig(String taskName, String testQuery, int concurrency, int delaySeconds) {
		this.taskName = taskName;
		this.testQuery = testQuery;
		this.concurrency = concurrency;
		this.delaySeconds = delaySeconds;
	}

	// Getter 및 Setter
	public String getTaskName() {
		return taskName;
	}

	public void setTaskName(String taskName) {
		this.taskName = taskName;
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

	public long getDelaySeconds() {
		return delaySeconds;
	}

	public void setDelaySeconds(int delaySeconds) {
		this.delaySeconds = delaySeconds;
	}

	// 디버깅을 위한 toString() 오버라이딩 (선택)
	@Override
	public String toString() {
		return "LoadTaskConfig{" + "taskName='" + taskName + '\'' + ", testQuery='" + testQuery + '\''
				+ ", concurrency=" + concurrency + ", delayMillis=" + delaySeconds + '}';
	}
}