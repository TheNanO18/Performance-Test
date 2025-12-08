package com.example.performance_test.repository.entity;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "server_cpu_test")
public class TestServerResultEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	// Test_Name (VARCHAR(64))
	@Column(name = "test_name", length = 64)
	private String testName;

	// Test_Time_Sec (INTEGER, 지속 시간)
	@Column(name = "test_time_sec")
	private Integer testTimeSec;

	// Test_End_Time (TIMESTAMP)
	@Column(name = "test_end_time")
	private LocalDateTime testEndTime;

	// Event_Time
	@Column(name = "event_time")
	private Timestamp eventTime;

	// Total_Cpu_Cores (NUMERIC(22,2))
	@Column(name = "total_cpu_core", precision = 22, scale = 6)
	private BigDecimal totalCpuCores;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
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

	public LocalDateTime getTestEndTime() {
		return testEndTime;
	}

	public void setTestEndTime(LocalDateTime testEndTime) {
		this.testEndTime = testEndTime;
	}

	public Timestamp getEventTime() {
		return eventTime;
	}

	public void setEventTime(Timestamp eventTime) {
		this.eventTime = eventTime;
	}

	public BigDecimal getTotalCpuCores() {
		return totalCpuCores;
	}

	public void setTotalCpuCores(BigDecimal totalCpuCores) {
		this.totalCpuCores = totalCpuCores;
	}

}
