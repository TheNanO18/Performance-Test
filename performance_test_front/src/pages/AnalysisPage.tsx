import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { type TestResultDto } from '../types/LoadConfig';

export default function AnalysisPage() {
    const [historyList, setHistoryList] = useState<TestResultDto[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllHistory = async () => {
            try {
                // 백엔드 API 호출
                const response = await axios.get('/api/history/all');
                setHistoryList(response.data);
            } catch (error) {
                console.error("전체 이력 로딩 실패:", error);
                alert("이력 데이터를 불러오는 데 실패했습니다.");
            } finally {
                setLoading(false);
            }
        };
        fetchAllHistory();
    }, []);

    // 💡 표(Table)를 구성하는 JSX 코드
    const renderTable = () => {
        if (loading) return <p>데이터 로딩 중...</p>;
        if (historyList.length === 0) return <p>저장된 테스트 이력이 없습니다.</p>;

        return (
            <table className="history-table">
                <thead>
                    <tr>
                        <th>테스트 이름</th>
                        <th>실행 시간 (초)</th>
                        <th>종료 시간</th>
                        <th>Hash Value</th>
                        <th>Total Cores</th>
                        <th>User CPU Time</th>
                        <th>System CPU Time</th>
                    </tr>
                </thead>
                <tbody>
                    {historyList.map((item) => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.testName}</td>
                            <td>{item.testTimeSec}</td>
                            <td>{new Date(item.maxTestEndTime).toLocaleString()}</td>
                            <td>{item.normalizedQueryHash}</td>
                            <td>{item.totalCpuCores}</td>
                            <td>{item.totalUserCpuTime}</td>
                            <td>{item.totalSystemCpuTime}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>📊 저장된 테스트 이력 상세 분석</h2>
            <div className="table-container">
                {renderTable()}
            </div>
        </div>
    );
}