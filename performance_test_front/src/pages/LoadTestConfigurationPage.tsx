import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { type LoadConfig } from '../types/LoadConfig';
import { type LoadTaskConfig } from '../types/LoadTaskConfig';
import HistoryGraphPanel from '../components/HistoryGraphPanel';
import { useDBConfig } from '../context/DBContext';
import { useGlobalStopwatch } from '../context/StopwatchContext';

// LoadTaskConfig의 기본값 템플릿
const DEFAULT_TASK: LoadTaskConfig = {
    taskName: 'Task-1',
    testQuery: 'SELECT NOW();',
    concurrency: 1,
    delaySeconds: 60,
};

// 초기 상태값 설정
const initialConfig: LoadConfig = {
    // DB 연결 정보 (상단 우측)
    targetDbUrl: 'jdbc:clickhouse://192.168.100.41:8125/default',
    targetDbUsername: 'default',
    targetDbPassword: 'default',
    targetDbDriver: 'com.clickhouse.jdbc.ClickHouseDriver',

    // 전체 테스트 정보 (하단 우측)
    testName: 'CPU Test',
    durationSeconds: 60,

    // Task 목록: 기본값으로 하나의 태스크를 가집니다.
    tasks: [DEFAULT_TASK],
};

export default function LoadTestConfigurationPage() {
    const { dbConfig } = useDBConfig();
    const [config, setConfig] = useState<LoadConfig>(initialConfig);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { startTest, stopTest } = useApi();

    const stopwatch = useGlobalStopwatch();
    const { startStopwatch, stopStopwatch, resetStopwatch, setAlertShown, duration, isFinished, isAlertShown, isRunning } = stopwatch;

    useEffect(() => {
        if (isFinished && !isAlertShown) { // stopwatch.isFinished 대신 isFinished 사용
            alert(`✅ 테스트 지속 시간(${config.durationSeconds}초)이 경과되었습니다. 테스트가 종료됩니다.`);

            setAlertShown(true);
        }
    }, [isFinished, isAlertShown, setAlertShown, config.durationSeconds]);

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

    // 💡 [새로 추가] 설정값 변경 시 스톱워치 디스플레이 초기화
    useEffect(() => {
        // 1. 테스트가 종료된 상태(isFinished)이고
        // 2. 현재 실행 중이 아닐 때(!isRunning)
        if (isFinished && !isRunning) {
            // resetStopwatch를 호출하여 elapsedSeconds, duration, isFinished 상태를 모두 초기화합니다.
            // 이렇게 하면 스톱워치 디스플레이가 "00:00:00 / 00:00:00"로 초기화되고 "대기 중" 상태로 돌아갑니다.
            resetStopwatch();
        }
    }, [
        // config.durationSeconds가 변경되거나 (새 테스트를 위한 값 입력), 
        // isFinished 상태가 변경되거나,
        // isRunning 상태가 변경될 때마다 이 로직을 확인합니다.
        config.durationSeconds, 
        isFinished, 
        isRunning, 
        resetStopwatch
    ]);

    // 'START' 버튼 핸들러 (로직 동일)
    const handleStart = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const fullConfig: LoadConfig = {
            ...dbConfig, // 💡 DB 연결 정보
            ...config    // 💡 로컬 부하 설정 (tasks, testName, duration)
        } as LoadConfig;

        resetStopwatch();

        const duration = config.durationSeconds;

        try {
            await startTest(config);

            startStopwatch(config.durationSeconds); // stopwatch.startStopwatch 대신 startStopwatch 사용

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
        try {
            // 💡 1. 스톱워치 강제 중지
            stopStopwatch();

            await stopTest();
            alert('🛑 테스트 중지 요청을 성공적으로 전송했습니다. 스톱워치가 중지되었습니다.');
        } catch (error) {
            alert('❌ 테스트 중지 요청 실패: 서버 연결을 확인해 주세요.');
            console.error(error);
        }
    };

    const formatTime = (totalSeconds: number): string => {
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = Math.floor(totalSeconds % 60);

        const pad = (num: number) => num.toString().padStart(2, '0');

        return `${pad(h)}:${pad(m)}:${pad(s)}`;
    };

    return (
        <div className="full-screen-container">
            <h1>쿼리 튜닝 테스트</h1>
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
                            <hr />
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

                    {/* 2. 우측 하단: 전체 테스트 정보 */}
                    <div className="load-test-info-area">
                        <h3>전체 테스트 정보</h3>
                        <label>테스트 이름: <input type="text" name="testName" value={config.testName} onChange={handleMainChange} /></label>
                        <label>지속 시간 (초): <input type="number" name="durationSeconds" value={config.durationSeconds} onChange={handleMainChange} /></label>
                    </div>
                </div>

                <div className="right-panel">

                    <div className="stopwatch-area" style={{
                        padding: '15px',
                        margin: '10px 0',
                        border: '1px solid #777',
                        borderRadius: '5px',
                        textAlign: 'center',
                        backgroundColor: stopwatch.isRunning ? 'rgba(0, 128, 0, 0.2)' : (stopwatch.isFinished ? 'rgba(255, 0, 0, 0.2)' : 'transparent')
                    }}>
                        <h3>테스트 진행 시간</h3>
                        <div style={{ fontSize: '2em', fontWeight: 'bold', color: stopwatch.isRunning ? 'lime' : (stopwatch.isFinished ? 'red' : 'gray') }}>
                            {formatTime(stopwatch.elapsedSeconds)} / {formatTime(duration)}
                        </div>
                        <p style={{ color: 'white', marginTop: '5px' }}>
                            {stopwatch.isRunning ? `테스트 실행 중 (${duration}초 목표)` : (stopwatch.isFinished ? '지속 시간 경과 (종료)' : '대기 중')}
                        </p>
                    </div>

                    {/* 3. 💡 오른쪽 영역에 그래프 패널 배치 (우측 1열의 1~3행 모두 차지) */}
                    <div className="history-panel">
                        <HistoryGraphPanel />
                    </div>
                </div>
            </div>
        </div>
    );
}