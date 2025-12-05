// src/types/LoadConfig.ts

// LoadTaskConfig 타입을 임포트
import { type LoadTaskConfig } from './LoadTaskConfig.ts';

export interface LoadConfig {
    // DB 연결 정보
    targetDbUrl: string;
    targetDbUsername: string;
    targetDbPassword?: string; 
    targetDbDriver: string;

    // 전체 테스트 정보
    testName: string;
    durationSeconds: number;

    // LoadTaskConfig 배열을 사용
    tasks: LoadTaskConfig[]; 
}

// 테스트 결과 인터페이스 (MonitorPage에서 사용)
export interface TestResult {
    testId: string;
    timestamp: number;
    cpuTime: number; 
    // ... 기타 실시간 지표
}

export interface TestHistoryDto {
    testName: string;
    testTimeSec: number;
    totalCpuCores: number; // BigDecimal은 number로 매핑
    totalSystemCpuTime: number;
    totalUserCpuTime: number;
    maxTestEndTime: Date;
}

export interface TestResultDto {
    id: number;
    testName: string;
    testTimeSec: number;
    maxTestEndTime: Date;
    normalizedQueryHash: string; // BigDecimal은 number로 매핑
    totalCpuCores: number; // BigDecimal은 number로 매핑
    totalSystemCpuTime: number;
    totalUserCpuTime: number;
}