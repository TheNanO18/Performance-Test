import React, { useState } from 'react';
import ResizableTitle from '../ResizableTitle';
import { type TestServerHistoryDto } from '../../types/LoadConfig';

// 💡 기본 컬럼 너비 정의 (px 단위)
const DEFAULT_SERVER_WIDTHS = [150, 100, 200, 150]; // 4개 컬럼

const ServerMetricsTable: React.FC<{ data: TestServerHistoryDto[] }> = ({ data }) => {
    const [columnWidths, setColumnWidths] = useState<number[]>(DEFAULT_SERVER_WIDTHS);
    
    // 컬럼 헤더 정의
    const headers = ['테스트명', '소요 시간(초)', '총 코어 사용량 (정규화 * 10k)', '종료 시각'];
    
    // 너비 조절 이벤트 핸들러
    const handleResize = (index: number, newWidth: number) => {
        setColumnWidths(prevWidths => {
            const newWidths = [...prevWidths];
            newWidths[index] = newWidth;
            return newWidths;
        });
    };
    
    if (data.length === 0) return <p>조회된 서버 메트릭 데이터가 없습니다. 테스트 이름을 확인하세요.</p>;
    
    return (
        <table style={{ 
            width: '100%', 
            tableLayout: 'fixed', 
            borderCollapse: 'collapse', 
            marginTop: '10px' 
        }}>
            <thead>
                <tr>
                    {headers.map((header, index) => (
                        <ResizableTitle
                            key={index}
                            width={columnWidths[index]}
                            onResize={({ width }) => handleResize(index, width)}
                            style={{ 
                                width: columnWidths[index], 
                                minWidth: '50px', 
                                padding: '10px',
                                textAlign: 'left',
                                border: '1px solid #555' 
                            }}
                        >
                            {header}
                        </ResizableTitle>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((item, index) => (
                    <tr key={index}>
                        <td style={{ width: columnWidths[0] }}>{item.testName}</td>
                        <td style={{ width: columnWidths[1] }}>{item.testTimeSec}</td>
                        <td style={{ width: columnWidths[2] }}>{item.totalCpuCores?.toFixed(4)}</td>
                        <td style={{ width: columnWidths[3] }}>{new Date(item.maxTestEndTime).toLocaleTimeString()}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default ServerMetricsTable;