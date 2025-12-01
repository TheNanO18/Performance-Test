// src/types/LoadTaskConfig.ts

export interface LoadTaskConfig {
    taskName: string;      // 태스크 이름
    testQuery: string;     // 실행할 SQL 쿼리
    concurrency: number;   // 이 쿼리를 실행할 동시 스레드 수
    delayMillis: number;   // 쿼리 반복 실행 간 대기 시간 (ms)
}