import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { type TestEzisHashQueryHistoryDto } from '../types/LoadConfig';
import { type TestServerHistoryDto } from '../types/LoadConfig';
import { type TestEzisProcessQueryHistoryDto } from '../types/LoadConfig';
import QueryHashTable from '../components/analysis/QueryHashTable.tsx';
import ProcessQueryTable from '../components/analysis/ProcessQueryTable.tsx';
import ServerMetricsTable from '../components/analysis/ServerMetricsTable.tsx';
// DTO를 배열로 간주할 때는 Array<T>를 사용합니다.

// 탭 정의
type AnalysisTab = 'queryHash' | 'serverMetrics' | 'processQuery';

// 탭 버튼 컴포넌트
const TabButton = ({ title, tabKey, activeTab, setActiveTab }: 
    { title: string, tabKey: AnalysisTab, activeTab: AnalysisTab, setActiveTab: (tab: AnalysisTab) => void }) => (
    <button 
        onClick={() => setActiveTab(tabKey)} 
        style={{
            padding: '10px 15px', 
            marginRight: '5px',
            backgroundColor: activeTab === tabKey ? '#007bff' : '#444',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            borderTopLeftRadius: '5px',
            borderTopRightRadius: '5px',
            fontWeight: activeTab === tabKey ? 'bold' : 'normal',
            transition: 'background-color 0.2s'
        }}
    >
        {title}
    </button>
);

// 탭 컨텐츠 렌더링
const RenderTabContent = ({ activeTab, queryHashData, serverMetricsData, processQueryData }: 
    { activeTab: AnalysisTab, 
      queryHashData: TestEzisHashQueryHistoryDto[], 
      serverMetricsData: TestServerHistoryDto[], 
      processQueryData: TestEzisProcessQueryHistoryDto[] 
    }) => {
    switch (activeTab) {
        case 'queryHash':
            // 💡 독립된 컴포넌트 사용 및 데이터 전달
            return <QueryHashTable data={queryHashData} />; 
        case 'serverMetrics':
            // ... (나머지 테이블들은 아직 구현되지 않았지만, 데이터 타입은 유지) ...
            return <ServerMetricsTable data={serverMetricsData} />; 
        case 'processQuery':
            return <ProcessQueryTable data={processQueryData} />;
        default:
            return <p>탭을 선택하세요.</p>;
    }
};


// =================================================================
// 메인 AnalysisPage 컴포넌트
// =================================================================

export default function AnalysisPage() {
    const [testName, setTestName] = useState('CPU Test'); 
    const [tempTestNameInput, setTempTestNameInput] = useState('CPU Test');
    
    const [activeTab, setActiveTab] = useState<AnalysisTab>('queryHash');
    const [loading, setLoading] = useState(false);
    
    const [queryHashData, setQueryHashData] = useState<TestEzisHashQueryHistoryDto[]>([]);
    const [serverMetricsData, setServerMetricsData] = useState<TestServerHistoryDto[]>([]);
    const [processQueryData, setProcessQueryData] = useState<TestEzisProcessQueryHistoryDto[]>([]);

    const fetchTabData = useCallback(async (tab: AnalysisTab, currentTestName: string) => {
        if (!currentTestName) return;
        
        setLoading(true);
        let url = '';
        let setter: React.Dispatch<any> = () => {};

        switch (tab) {
            case 'queryHash':
                url = `/api/history/query-hash?testName=${currentTestName}`;
                setter = setQueryHashData;
                break;
            case 'serverMetrics':
                url = `/api/history/server?testName=${currentTestName}`;
                setter = setServerMetricsData;
                break;
            case 'processQuery':
                url = `/api/history/process?testName=${currentTestName}`;
                setter = setProcessQueryData;
                break;
        }

        try {
            const response = await axios.get(url);
            setter(response.data);
        } catch (error) {
            console.error(`❌ Error fetching ${tab} data:`, error);
            alert(`[${tab}] 데이터 로딩 실패! (콘솔 확인)`);
            setter([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        // activeTab이나 testName이 변경될 때마다 해당 탭의 데이터만 불러옵니다.
        fetchTabData(activeTab, testName);
    }, [activeTab, testName, fetchTabData]);

    // 테스트 이름 변경 핸들러
    const handleTestNameChange = () => {
        if (tempTestNameInput && tempTestNameInput !== testName) {
            setTestName(tempTestNameInput);
        }
    };
    
    // 버튼 클릭 시 수동으로 전체 새로고침
    const handleRefresh = () => {
        fetchTabData(activeTab, testName);
    };

    return (
        <div className="analysis-page-container" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            
            {/* 1. 🟢 상단 파라미터 조정 영역 */}
            <div style={{ padding: '15px', borderBottom: '1px solid #444', backgroundColor: '#2a2a2a' }}>
                <h2 style={{ color: 'white' }}>📊 분석 기준 설정</h2>
                <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                    <label style={{ color: '#ccc', marginRight: '10px', whiteSpace: 'nowrap' }}>
                        테스트 이름 (TestName):
                    </label>
                    <input
                        type="text"
                        value={tempTestNameInput}
                        onChange={(e) => setTempTestNameInput(e.target.value)}
                        placeholder="분석할 테스트 이름"
                        style={{ padding: '8px', border: '1px solid #555', marginRight: '10px', flexGrow: 1 }}
                    />
                    <button onClick={handleTestNameChange} disabled={!tempTestNameInput || loading}
                        style={{ padding: '8px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>
                        분석 적용
                    </button>
                    <button onClick={handleRefresh} disabled={loading}
                        style={{ padding: '8px 15px', backgroundColor: '#555', color: 'white', border: 'none', cursor: 'pointer', marginLeft: '10px' }}>
                        새로고침
                    </button>
                </div>
                <p style={{ marginTop: '5px', fontSize: '0.9em', color: '#888' }}>
                    현재 분석 대상: <strong>{testName}</strong>
                </p>
            </div>
            
            <hr style={{ margin: '0', borderColor: '#444' }} />

            {/* 2. 🟢 분석 탭 영역 */}
            <div className="analysis-tabs-content" style={{ padding: '15px', flexGrow: 1, backgroundColor: '#1e1e1e', color: '#eee' }}>
                
                {/* 탭 네비게이션 */}
                <div className="tab-nav" style={{ display: 'flex', marginBottom: '15px', borderBottom: '2px solid #555' }}>
                    <TabButton title="쿼리 해시 (CPU 지표)" tabKey="queryHash" activeTab={activeTab} setActiveTab={setActiveTab} />
                    <TabButton title="서버 메트릭 (Core)" tabKey="serverMetrics" activeTab={activeTab} setActiveTab={setActiveTab} />
                    <TabButton title="프로세스 쿼리 상세" tabKey="processQuery" activeTab={activeTab} setActiveTab={setActiveTab} />
                </div>

                {/* 탭 컨텐츠 렌더링 */}
                <div className="tab-content" style={{ minHeight: '300px' }}>
                    {loading ? (
                        <p style={{ textAlign: 'center', padding: '50px' }}>데이터 로딩 중... (API: {activeTab})</p>
                    ) : (
                        <RenderTabContent 
                            activeTab={activeTab} 
                            queryHashData={queryHashData} 
                            serverMetricsData={serverMetricsData}
                            processQueryData={processQueryData}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}