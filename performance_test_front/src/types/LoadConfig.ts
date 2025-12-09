// src/types/LoadConfig.ts

// LoadTaskConfig 타입을 임포트
import { type LoadTaskConfig } from './LoadTaskConfig.ts';

type BigDecimal = number;

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
    totalCpuCores: number; // BigDecimal은 number로 매핑
    totalSystemCpuTime: number;
    totalUserCpuTime: number;
}

export interface TestEzisHashQueryHistoryDto {
    testName: string;
    testTimeSec: number;
    normalizedQueryHash: string;
    
    // 정규화된 CPU 지표들
    totalCpuCores: BigDecimal;
    totalSystemCpuTime: BigDecimal;
    totalUserCpuTime: BigDecimal;
    
    maxTestEndTime: string; // LocalDateTime 매핑
}

// 3-B. 서버 메트릭 집계 결과 (4개 필드)
export interface TestServerHistoryDto {
    testName: string;
    testTimeSec: number;
    
    // 정규화된 서버 코어 사용량
    totalCpuCores: BigDecimal;
    
    maxTestEndTime: string; // LocalDateTime 매핑
}

// 3-C. 프로세스 쿼리 상세 결과
export interface TestEzisProcessQueryHistoryDto {
    id: number;
    category: string;
    testName: string;
    testTimeSec: number;
    maxTestEndTime: Date;
    httpUserAgent: string; // BigDecimal은 number로 매핑
    totalCpuCores: number; // BigDecimal은 number로 매핑
    totalSystemCpuTime: number;
    totalUserCpuTime: number;
}