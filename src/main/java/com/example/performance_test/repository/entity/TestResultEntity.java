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

// 테이블 이름 명시
@Entity
@Table(name = "cpu_test")
public class TestResultEntity {

	// 💡 PK 필드: PostgreSQL의 SERIAL 타입에 맞춰 IDENTITY 전략 사용
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

	// Normalized_Query_Hash (VARCHAR(64))
	@Column(name = "normalized_query_hash", length = 64)
	private String normalizedQueryHash;

	// Query (TEXT)
	@Column(name = "query", columnDefinition = "TEXT")
	private String query;

	// Total_User_Cpu_Time (NUMERIC(22,2))
	@Column(name = "total_user_cpu_time", precision = 22, scale = 6)
	private BigDecimal totalUserCpuTime;

	// Total_System_Cpu_Time (NUMERIC(22,2))
	@Column(name = "total_system_cpu_time", precision = 22, scale = 6)
	private BigDecimal totalSystemCpuTime;

	// Total_Cpu_Cores (NUMERIC(22,2))
	@Column(name = "total_cpu_cores", precision = 22, scale = 6)
	private BigDecimal totalCpuCores;

	// --- Getter, Setter, Constructors (Lombok 없이 수동 구현 필요) ---

	// 기본 생성자 (JPA 필수)
	public TestResultEntity() {
	}

	// 💡 모든 필드에 대한 Getter 및 Setter를 여기에 수동으로 추가해야 합니다.
	// (예시: getId, setId, getTestName, setTestName 등)

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

	public String getNormalizedQueryJash() {
		return normalizedQueryHash;
	}

	public void setNormalizedQueryHash(String normalizedQueryHash) {
		this.normalizedQueryHash = normalizedQueryHash;
	}

	public String getQuery() {
		return query;
	}

	public void setQuery(String query) {
		this.query = query;
	}

	public BigDecimal getTotalUserCpuTime() {
		return totalUserCpuTime;
	}

	public void setTotalUserCpuTime(BigDecimal totalUserCpuTime) {
		this.totalUserCpuTime = totalUserCpuTime;
	}

	public BigDecimal getTotalSystemCpuTime() {
		return totalSystemCpuTime;
	}

	public void setTotalSystemCpuTime(BigDecimal totalSystemCpuTime) {
		this.totalSystemCpuTime = totalSystemCpuTime;
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