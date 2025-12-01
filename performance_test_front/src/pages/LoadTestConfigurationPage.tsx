import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../hooks/useApi.ts';
// LoadConfig는 타입이므로 'type' 키워드 사용.
// LoadTaskConfig는 LoadConfig 내부에서 이미 임포트되었거나, 
// LoadConfig.ts에 함께 정의되어 있다고 가정하고 임포트 구문 정리.
import { type LoadConfig } from '../types/LoadConfig.ts'; 


// 초기 상태값 설정 (하나의 객체로 통합)
const initialConfig: LoadConfig = {
    // DB 연결 정보
    targetDbUrl: 'jdbc:clickhouse://localhost:8123/default',
    targetDbUsername: 'user',
    targetDbPassword: 'password',
    targetDbDriver: 'com.clickhouse.jdbc.ClickHouseDriver',
    
    // 전체 테스트 정보
    testName: 'Simple_Load_Test',
    durationSeconds: 60,
    
    // Task 목록 (하나의 쿼리만 입력받는 UI에 맞게 List로 변환 필요)
    tasks: [{
        taskName: 'Main Query',
        testQuery: 'SELECT NOW();', 
        concurrency: 10,
        delayMillis: 100,
    }]
};

export default function LoadTestConfigurationPage() {
    const [config, setConfig] = useState<LoadConfig>(initialConfig);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { startTest, stopTest } = useApi();

    // 쿼리(좌측 영역) 및 일반 입력 필드 핸들러
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
        setConfig((prev: LoadConfig) => {
            // Task 내부 속성 (Query, Concurrency, DelayMillis)
            if (['testQuery', 'concurrency', 'delayMillis'].includes(name)) {
                const isNumeric = name !== 'testQuery';
                const newValue = isNumeric ? (isNaN(Number(value)) ? 0 : Number(value)) : value;
                
                // 💡 주의: tasks[0]이 항상 존재한다고 가정합니다.
                const updatedTasks = [{ ...prev.tasks[0], [name]: newValue }];
                return { ...prev, tasks: updatedTasks };
            } 
            
            // LoadConfigDto 직접 속성 (URL, Username, DurationSeconds, TestName)
            else {
                const isDuration = name === 'durationSeconds';
                const newValue = isDuration ? (isNaN(Number(value)) ? 0 : Number(value)) : value;
                
                return { ...prev, [name]: newValue };
            }
        });
    };

    // 'START' 버튼 핸들러
    const handleStart = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
  
      try {
          // 백엔드에 테스트 시작 요청을 전송
          const response = await startTest(config);
          
          // 백엔드가 반환한 testId 또는 설정된 테스트 이름 사용 (현재는 사용하지 않음)
          // const testId = response.testId || config.testName; 
          
          // 1. 🚨 성공 alert 메시지 표시
          alert(`🎉 부하 테스트 시작 요청을 성공적으로 전송했습니다!`);
          
          // 2. 로딩 상태 해제 (버튼을 다시 클릭 가능하게 만듭니다)
          setIsLoading(false); 
          
          // 3. 🚫 페이지 이동 로직을 주석 처리 (이 부분이 이전에는 바로 모니터링 페이지로 이동시켰습니다)
          // navigate(`/monitor/${testId}`); 
          
      } catch (error) {
          alert('❌ 테스트 시작 실패: 백엔드 서버 또는 DB 연결 상태를 확인해 주세요.');
          console.error(error);
          setIsLoading(false);
      }
   };
    
    // 'STOP' 버튼 핸들러
    const handleStop = async () => {
        await stopTest();
        alert('테스트 중지 요청을 전송했습니다.');
    };

    return (
        <div className="full-screen-container">
            <h1>DB 부하 테스트 설정</h1>
            <div className="main-layout-grid">
                
                {/* 1. 좌측: Query 입력 영역 */}
                <div className="query-area">
                    <h3>Query</h3>
                    <textarea 
                        name="testQuery" 
                        rows={20} 
                        // tasks 배열이 비어 있지 않음을 가정하고 접근
                        value={config.tasks[0]?.testQuery || ''} 
                        onChange={handleChange}
                        required
                    />
                </div>
                
                {/* 2. 우측 상단: DB 연결 정보 */}
                <div className="db-info-area">
                    <h3>DB 연결 정보</h3>
                    <label>URL: <input type="text" name="targetDbUrl" value={config.targetDbUrl} onChange={handleChange} /></label>
                    <label>Username: <input type="text" name="targetDbUsername" value={config.targetDbUsername} onChange={handleChange} /></label>
                    <label>Password: <input type="password" name="targetDbPassword" value={config.targetDbPassword} onChange={handleChange} /></label>
                </div>
                
                {/* 3. 우측 하단: 부하 테스트 정보 */}
                <div className="load-test-info-area">
                    <h3>부하 테스트 정보</h3>
                    <label>테스트 이름: <input type="text" name="testName" value={config.testName} onChange={handleChange} /></label>
                    <label>지속 시간 (초): <input type="number" name="durationSeconds" value={config.durationSeconds} onChange={handleChange} /></label>
                    {/* tasks[0]에 안전하게 접근 */}
                    <label>동시 실행 수: <input type="number" name="concurrency" value={config.tasks[0]?.concurrency || 0} onChange={handleChange} /></label>
                    <label>쿼리 간 주기 (ms): <input type="number" name="delayMillis" value={config.tasks[0]?.delayMillis || 0} onChange={handleChange} /></label>
                </div>
                
                {/* 4. 하단 버튼 */}
                <div className="control-buttons">
                    <button onClick={handleStart} disabled={isLoading} className="start-button">
                        {isLoading ? '테스트 시작 중...' : 'START'}
                    </button>
                    <button onClick={handleStop} disabled={isLoading} className="stop-button">
                        STOP
                    </button>
                </div>
            </div>
        </div>
    );
}