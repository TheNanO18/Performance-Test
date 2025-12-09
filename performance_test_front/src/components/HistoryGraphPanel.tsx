import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    Title,
    Tooltip,
    Legend,
    BarElement
} from 'chart.js';

// 💡 LoadConfig.ts에 정의된 타입을 임포트합니다.
import { type TestHistoryDto } from '../types/LoadConfig.ts';
import { type ChartData } from 'chart.js'; // Chart.js의 기본 ChartData 타입을 사용

// Chart.js 필수 요소 등록 (이 컴포넌트 파일 상단에서 한 번만 실행되도록 보장)
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    Title,
    Tooltip,
    Legend,
    BarElement
);

// 💡 ChartData 상태의 초기값 정의
const initialChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [],
};

const METRIC_LABELS = {
    cores: '총 CPU 코어 사용량 (Cores)',
    system: '총 시스템 CPU 시간 (sec)',
    user: '총 사용자 CPU 시간 (sec)',
};

const METRIC_COLORS = {
    cores: 'rgba(54, 162, 235, 0.8)',   // 파랑 (Cores)
    system: 'rgba(255, 99, 132, 0.8)',   // 빨강 (System Time)
    user: 'rgba(75, 192, 192, 0.8)',    // 청록 (User Time)
};

export default function HistoryGraphPanel() {
    // 비교할 테스트 이름 목록을 상태로 관리
    const [testNames, setTestNames] = useState<string[]>(['CPU Test']);
    // chartData 상태에 ChartData<'line'> 타입을 명시
    const [chartData, setChartData] = useState<ChartData<'bar'>>(initialChartData);
    const [statusMessage, setStatusMessage] = useState('테스트 이력 조회 준비 완료.');
    const [tempTestName, setTempTestName] = useState('');
    const [querySearch, setQuerySearch] = useState('');

    // 💡 API 응답 전체를 저장할 상태 (툴팁 콜백에서 참조할 데이터)
    const [historyDataMap, setHistoryDataMap] = useState<Map<string, TestHistoryDto>>(() => new Map());

    // Test Name을 비교 목록에 추가하는 함수
    const handleAddTestName = () => {
        if (tempTestName && !testNames.includes(tempTestName)) {
            setTestNames(prev => [...prev, tempTestName]);
            setTempTestName(''); // 입력 필드 초기화
        } else if (tempTestName && testNames.includes(tempTestName)) {
            alert(`"${tempTestName}"은 이미 비교 목록에 있습니다.`);
        }
    };

    // Test Name을 비교 목록에서 제거하는 함수
    const handleRemoveTestName = (name: string) => {
        setTestNames(prev => prev.filter(n => n !== name));
    };

    // 이 함수는 testNames 배열의 모든 테스트에 대해 API를 호출하고 데이터를 합쳐 그래프를 그립니다.
    const fetchDataAndDrawGraph = async () => {
        if (testNames.length === 0) {
            setChartData(initialChartData);
            setStatusMessage('비교할 테스트 이름을 입력하세요.');
            return;
        }

        const dataPromises = testNames.map(name => {
            let url = `/api/history/stress-results?testName=${name}`;

            url += `&querySearch=${encodeURIComponent(querySearch)}`;

            return axios.get(url);
        });

        setStatusMessage('데이터 로딩 중...');

        try {
            const responses = await Promise.all(dataPromises);
            // 💡 res.data를 TestHistoryDto 배열로 타입 변환 (Any 오류 해결)
            const labels: string[] = [];
            const coresData: number[] = [];      // totalCpuCores 값
            const systemTimeData: number[] = []; // totalSystemCpuTime 값
            const userTimeData: number[] = [];   // totalUserCpuTime 값

            const newMap = new Map<string, TestHistoryDto>();
            responses.forEach((res: any) => {
                // API 응답은 List<TestHistoryDto> 형태이지만, X축이 testName이므로 
                // 각 응답 리스트의 첫 번째 요소를 대표로 사용합니다.
                const representativeItem: TestHistoryDto = res.data[0];
                if (representativeItem) {
                    newMap.set(representativeItem.testName, representativeItem);
                }
            });
            setHistoryDataMap(newMap);
            responses.forEach((res: any, index: number) => {
                const historyData: TestHistoryDto[] = res.data;
                const testName = testNames[index];

                // Y축 값 합산
                const aggregated = historyData.reduce((acc, item) => {
                    acc.cores += item.totalCpuCores;
                    acc.system += item.totalSystemCpuTime;
                    acc.user += item.totalUserCpuTime;
                    return acc;
                }, { cores: 0, system: 0, user: 0 });

                // 3. 배열에 데이터 저장
                labels.push(testName);
                coresData.push(aggregated.cores);
                systemTimeData.push(aggregated.system);
                userTimeData.push(aggregated.user);
            });

            // 2. 차트 데이터셋 생성
            const datasets = [
                {
                    label: METRIC_LABELS.cores,
                    data: coresData,
                    backgroundColor: METRIC_COLORS.cores,
                    stack: 'cpu_stack'
                },
                {
                    label: METRIC_LABELS.system,
                    data: systemTimeData,
                    backgroundColor: METRIC_COLORS.system,
                    stack: 'cpu_stack',
                },
                {
                    label: METRIC_LABELS.user,
                    data: userTimeData,
                    backgroundColor: METRIC_COLORS.user,
                    stack: 'cpu_stack',
                },
            ];

            // 5. 차트 데이터 설정
            setChartData({
                labels: labels,
                datasets: datasets
            });
            setStatusMessage('그래프 데이터 로딩 성공.');

        } catch (error) {
            console.error('이력 데이터 로딩 실패:', error);
            setStatusMessage('❌ 이력 데이터를 불러오는 데 실패했습니다. 백엔드 API를 확인하세요.');
            setChartData(initialChartData);
        }
    };

    // testNames 상태가 변경되거나 컴포넌트가 마운트될 때 데이터 로딩 시작
    useEffect(() => {
        fetchDataAndDrawGraph();
    }, [testNames, querySearch]);

    // Chart Options (그래프 설정)
    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top' as const },
            title: { display: true, text: 'Test Data 비교 (정규화 값 * 10000)' },
            tooltip: { // 💡 Tooltip 콜백 추가
                callbacks: {
                    title: function (context: any) {
                        const testName = context[0].label;
                        const item = historyDataMap.get(testName); // 💡 상태에서 데이터 조회

                        // Test Name과 종료 시간을 결합하여 제목 생성
                        if (item && item.maxTestEndTime) {
                            const endTime = item.maxTestEndTime.toLocaleString();
                            return `테스트: ${testName} (종료: ${endTime})`;
                        }
                        return testName; // 데이터가 없으면 기존 Test Name만 반환
                    },
                    // 💡 label 콜백을 사용하여 Y축 값을 보기 좋게 포맷할 수도 있습니다.
                    // label: function(context) { /* ... */ }
                }
            }
        },

        interaction: {
            mode: 'index' as 'index',    // 👈 동일 X축 위치의 모든 데이터셋을 표시
            intersect: false, // 👈 막대 위에 있지 않아도 가까이 있으면 표시 (선택 사항)
        },

        scales: {
            y: {
                title: { display: true, text: 'Total Sum CPU Data' }
            },
            x: {
                title: { display: true, text: 'Test Name' }
            }
        },
        
    };

    return (
        <div className="history-panel" style={{ padding: '20px', borderLeft: '1px solid #ccc' }}>
            <h3>📈 테스트 이력 비교</h3>
            <p>상태: {statusMessage}</p>

            {/* 임시 UI: 비교할 테스트 이름 추가/입력 필드 */}
            {/* 💡 실제 구현 시, 사용자가 Test Name을 입력/선택하고 setTestNames를 호출하도록 해야 합니다. */}
 

            <div style={{ marginBottom: '15px' }}>
                <input
                    type="text"
                    value={querySearch}
                    onChange={(e) => setQuerySearch(e.target.value)}
                    placeholder="EX) -- EZIS"
                    style={{ width: '150px', marginRight: '10px' }}
                />
                <label>쿼리 패턴 검색 (LIKE %) </label>
                <button onClick={() => fetchDataAndDrawGraph()}>
                    적용/검색
                </button>
            </div>
            <div style={{ marginBottom: '15px' }}>
                <input
                    type="text"
                    value={tempTestName}
                    onChange={(e) => setTempTestName(e.target.value)}
                    placeholder="테스트 이름(예: CPU Test)"
                    onKeyDown={(e) => { if (e.key === 'Enter') handleAddTestName(); }}
                />
                <button onClick={handleAddTestName} style={{ marginLeft: '10px' }}>
                    비교 추가
                </button>
            </div>

            {/* 2. 💡 현재 비교 중인 목록 표시 */}
            <div style={{ marginBottom: '15px', border: '1px solid #eee', padding: '5px' }}>
                <strong>비교 목록:</strong>
                {testNames.map(name => (
                    <span
                        key={name}
                        onClick={() => handleRemoveTestName(name)}
                        style={{ cursor: 'pointer', margin: '0 5px', padding: '2px 5px', backgroundColor: '#0b525cff' }}
                    >
                        {name} [X]
                    </span>
                ))}
            </div>

            <p>상태: {statusMessage}</p>

            <button
                onClick={() => fetchDataAndDrawGraph()}
                style={{ marginBottom: '15px' }}
            >
                데이터 새로고침
            </button>

            <div style={{ width: '100%', height: '350px' }}>
                {chartData.labels!.length > 0 ? (
                    <Bar data={chartData} options={chartOptions} />
                ) : (
                    <p style={{ textAlign: 'center', marginTop: '50px' }}>
                        {statusMessage.includes('성공') ? '표시할 데이터가 없습니다.' : '그래프 데이터를 로딩 중이거나, 저장된 이력이 없습니다.'}
                    </p>
                )}
            </div>

        </div>
    );
}