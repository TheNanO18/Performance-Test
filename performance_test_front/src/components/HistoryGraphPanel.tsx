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

const COLOR_PALETTE = [
    'rgba(255, 99, 132, 0.8)',   // 밝은 빨강
    'rgba(54, 162, 235, 0.8)',   // 파랑
    'rgba(255, 206, 86, 0.8)',   // 노랑
    'rgba(75, 192, 192, 0.8)',   // 초록/청록
    'rgba(153, 102, 255, 0.8)',  // 보라
    'rgba(255, 159, 64, 0.8)',   // 주황
];

export default function HistoryGraphPanel() {
    // 비교할 테스트 이름 목록을 상태로 관리
    const [testNames, setTestNames] = useState<string[]>(['Multi_Load_Test']);
    // chartData 상태에 ChartData<'line'> 타입을 명시
    const [chartData, setChartData] = useState<ChartData<'bar'>>(initialChartData);
    const [statusMessage, setStatusMessage] = useState('테스트 이력 조회 준비 완료.');
    const [tempTestName, setTempTestName] = useState('');

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

        setStatusMessage('데이터 로딩 중...');

        const dataPromises = testNames.map(name =>
            axios.get(`/api/history/results?testName=${name}`)
        );

        try {
            const responses = await Promise.all(dataPromises);
            // 💡 res.data를 TestHistoryDto 배열로 타입 변환 (Any 오류 해결)
            const labels: string[] = [];      // 💡 X축 레이블 (테스트 이름)
            const dataValues: number[] = [];  // 💡 Y축 데이터 (CPU 총합)
            const barColors: string[] = [];   // 💡 각 막대의 색상
    
            responses.forEach((res: any, index: number) => {
                const historyData: TestHistoryDto[] = res.data; 
                const testName = testNames[index];
                
                // Y축 값 합산
                const combinedTotalCpu = historyData.reduce((acc, item) => {
                    const combinedMetric = item.totalCpuCores + item.totalSystemCpuTime + item.totalUserCpuTime;
                    return acc + combinedMetric;
                }, 0);
    
                // 데이터 수집
                labels.push(testName); // X축 레이블 수집
                dataValues.push(combinedTotalCpu); // Y축 데이터 수집
                
                // 색상 할당
                const colorIndex = index % COLOR_PALETTE.length;
                barColors.push(COLOR_PALETTE[colorIndex]);
            });

            // 2. 차트 데이터셋 생성
            const datasets = [{
                    label: "총 CPU 사용량 합계 (sec + cores)",
                    data: dataValues, // 🚨 모든 Y축 값을 가진 단일 배열
                    
                    // 💡 모든 막대의 색상 배열을 여기에 설정
                    backgroundColor: barColors, 
                    
                    borderColor: barColors.map(color => color.replace('0.8', '1')), 
                    borderWidth: 1,
                }];
                
                // 3. 차트 데이터 설정
                setChartData({
                    labels: labels, // 🚨 X축 레이블은 수집된 모든 테스트 이름
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
    }, [testNames]);

    // Chart Options (그래프 설정)
    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top' as const },
            title: { display: true, text: '테스트 CPU 사용량 비교 (Total Cores)' },
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
                    value={tempTestName}
                    onChange={(e) => setTempTestName(e.target.value)}
                    placeholder="비교할 테스트 이름 입력 (예: TEST_A)"
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