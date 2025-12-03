import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { type LoadConfig } from '../types/LoadConfig'; 
import { type LoadTaskConfig } from '../types/LoadTaskConfig'; 
import HistoryGraphPanel from '../components/HistoryGraphPanel';

// LoadTaskConfig의 기본값 템플릿
const DEFAULT_TASK: LoadTaskConfig = {
    taskName: 'Task-1',
    testQuery: 'SELECT NOW();',
    concurrency: 10,
    delaySeconds: 5,
};

// 초기 상태값 설정
const initialConfig: LoadConfig = {
    // DB 연결 정보 (상단 우측)
    targetDbUrl: 'jdbc:clickhouse://192.168.100.41:8125/default',
    targetDbUsername: 'default',
    targetDbPassword: 'default',
    targetDbDriver: 'com.clickhouse.jdbc.ClickHouseDriver',
    
    // 전체 테스트 정보 (하단 우측)
    testName: 'Multi_Load_Test',
    durationSeconds: 60,
    
    // Task 목록: 기본값으로 하나의 태스크를 가집니다.
    tasks: [DEFAULT_TASK],
};

export default function LoadTestConfigurationPage() {
    const [config, setConfig] = useState<LoadConfig>(initialConfig);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { startTest, stopTest } = useApi();

    // 1. 일반 입력 필드 핸들러 (DB 정보, TestName, DurationSeconds)
    const handleMainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        
        setConfig((prev: LoadConfig) => {
            const numValue = (name === 'durationSeconds' && !isNaN(Number(value))) ? Number(value) : value;
            return { ...prev, [name]: numValue };
        });
    };

    // 2. 태스크 내부 입력 필드 핸들러 (Query, Concurrency, Delay)
    const handleTaskChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setConfig((prev: LoadConfig) => {
            const newTasks = [...prev.tasks];
            const isNumeric = name === 'concurrency' || name === 'delaySeconds';
            
            const numValue = isNumeric ? (isNaN(Number(value)) ? 0 : Number(value)) : value;
            
            newTasks[index] = {
                ...newTasks[index],
                [name]: numValue,
            };

            return { ...prev, tasks: newTasks };
        });
    };
    
    // 3. 태스크 추가 함수
    const handleAddTask = () => {
        setConfig((prev: LoadConfig) => {
            const newTask: LoadTaskConfig = { 
                ...DEFAULT_TASK, 
                taskName: `Task-${prev.tasks.length + 1}`,
                // 새 태스크는 이전 태스크의 concurrency를 복사할 수도 있습니다.
                concurrency: prev.tasks[prev.tasks.length - 1].concurrency || 10 
            };
            return { ...prev, tasks: [...prev.tasks, newTask] };
        });
    };

    // 4. 태스크 제거 함수
    const handleRemoveTask = (index: number) => {
        if (config.tasks.length <= 1) {
            alert("최소한 하나의 태스크는 남겨두어야 합니다.");
            return;
        }
        setConfig((prev: LoadConfig) => {
            const newTasks = prev.tasks.filter((_, i) => i !== index);
            return { ...prev, tasks: newTasks };
        });
    };
    
    // 'START' 버튼 핸들러 (로직 동일)
    const handleStart = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await startTest(config); 
            
            alert(`🎉 부하 테스트 시작 요청을 성공적으로 전송했습니다!`);
            setIsLoading(false); 
            // navigate(`/monitor/${config.testName}`); // 모니터링 페이지 이동 코드는 추후 활성화
            
        } catch (error) {
            alert('❌ 테스트 시작 실패: 백엔드 서버 또는 DB 연결 상태를 확인해 주세요.');
            console.error(error);
            setIsLoading(false);
        }
    };
    
    // 'STOP' 버튼 핸들러 (로직 동일)
    const handleStop = async () => {
        await stopTest();
        alert('테스트 중지 요청을 전송했습니다.');
    };

    return (
        <div className="full-screen-container">
            <h1>DB 부하 테스트 설정</h1>
            <div className="main-layout-grid">
                
                {/* 1. 좌측: Query 입력 영역 (반복) */}
                <div className="query-area">
                    <h3>쿼리 및 태스크 설정 ({config.tasks.length}개)</h3>
                    {/* 💡 tasks 배열을 순회하며 입력 필드를 생성 */}
                    {config.tasks.map((task, index) => (
                        <div key={index} className="task-input-group">
                            <h4>{task.taskName || `Task ${index + 1}`}</h4>
                            
                            <label>쿼리:
                                <textarea 
                                    name="testQuery" 
                                    rows={5} 
                                    value={task.testQuery} 
                                    onChange={(e) => handleTaskChange(index, e)}
                                    required
                                />
                            </label>

                            <div className="concurrency-delay-group">
                                <label>동시 실행 수:
                                    <input type="number" name="concurrency" value={task.concurrency} onChange={(e) => handleTaskChange(index, e)} min="1" required />
                                </label>
                                
                                <label>주기 (Sec):
                                    <input type="number" name="delaySeconds" value={task.delaySeconds} onChange={(e) => handleTaskChange(index, e)} min="0" />
                                </label>
                            </div>
                            
                            <button onClick={() => handleRemoveTask(index)} className="remove-button" disabled={config.tasks.length <= 1}>
                                Task Delete
                            </button>
                            <hr/>
                        </div>
                    ))}
                    <button onClick={handleAddTask} className="add-task-button">+ 태스크 추가</button>
                    {/* 4. 하단 버튼 영역은 그래프 패널 아래에 오도록 CSS 조정 */}
                    <button onClick={handleStart} disabled={isLoading} className="start-button">
                        {isLoading ? '테스트 시작 중...' : 'START'}
                    </button>
                    <button onClick={handleStop} disabled={isLoading} className="stop-button">
                        STOP
                    </button>
                    
                    {/* 2. 우측 상단: DB 연결 정보 */}
                    <div className="db-info-area">
                        <h3>DB 연결 정보</h3>
                        <label>URL: <input type="text" name="targetDbUrl" value={config.targetDbUrl} onChange={handleMainChange} /></label>
                        <label>Username: <input type="text" name="targetDbUsername" value={config.targetDbUsername} onChange={handleMainChange} /></label>
                        <label>Password: <input type="password" name="targetDbPassword" value={config.targetDbPassword} onChange={handleMainChange} /></label>
                    </div>
                    
                    {/* 3. 우측 하단: 전체 테스트 정보 */}
                    <div className="load-test-info-area">
                        <h3>전체 테스트 정보</h3>
                        <label>테스트 이름: <input type="text" name="testName" value={config.testName} onChange={handleMainChange} /></label>
                        <label>지속 시간 (초): <input type="number" name="durationSeconds" value={config.durationSeconds} onChange={handleMainChange} /></label>
                    </div>
                </div>
                
                <div className="right-panel">
                    
                    {/* 3. 💡 오른쪽 영역에 그래프 패널 배치 (우측 1열의 1~3행 모두 차지) */}
                    <div className="history-panel">
                        <HistoryGraphPanel />
                    </div>
                </div>
            </div>
        </div>
    );
}