import React, { useState } from 'react';
import ResizableTitle from '../ResizableTitle';
import { type TestEzisProcessQueryHistoryDto } from '../../types/LoadConfig';

// 💡 기본 컬럼 너비 정의 (필드에 맞게 조정 필요)
const DEFAULT_PROCESS_WIDTHS = [80, 100, 80, 150, 150, 150, 150, 100]; // 7개 컬럼 가정

const ProcessQueryTable: React.FC<{ data: TestEzisProcessQueryHistoryDto[] }> = ({ data }) => {
    const [columnWidths, setColumnWidths] = useState<number[]>(DEFAULT_PROCESS_WIDTHS);
    
    // 컬럼 헤더 정의 (TestEzisProcessQueryHistoryDto 구조에 맞게 명시)
    const headers = [
        '테스트명', '분류', '소요 시간(초)', 'User Agent', 'CPU 코어 사용량 ((total_core / (row count * time)) * 10k)', 'User CPU (정규화 * 10k)', 'System CPU (정규화 * 10k)', '테스트 종료 시간'
    ]; 
    
    // 너비 조절 이벤트 핸들러
    const handleResize = (index: number, newWidth: number) => {
        setColumnWidths(prevWidths => {
            const newWidths = [...prevWidths];
            newWidths[index] = newWidth;
            return newWidths;
        });
    };
    
    if (data.length === 0) return <p>조회된 프로세스 쿼리 상세 데이터가 없습니다.</p>;
    
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
                            style={{ width: columnWidths[index], minWidth: '50px', padding: '10px', textAlign: 'left', border: '1px solid #555' }}
                        >
                            {header}
                        </ResizableTitle>
                    ))}
                </tr>
            </thead>
            <tbody>
                {/* ⚠️ 데이터를 렌더링할 때 DTO의 필드명에 맞게 정확히 매핑해야 합니다! */}
                {data.map((item, index) => (
                    <tr key={index}>
                        <td style={{ width: columnWidths[0] }}>{item.testName}</td>
                        <td style={{ width: columnWidths[1] }}>{item.category}</td>
                        <td style={{ width: columnWidths[2] }}>{item.testTimeSec}</td>
                        <td style={{ width: columnWidths[3], overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.httpUserAgent || 'N/A'}</td> 
                        <td style={{ width: columnWidths[4] }}>{item.totalCpuCores?.toFixed(4)}</td>
                        <td style={{ width: columnWidths[5] }}>{item.totalUserCpuTime?.toFixed(4)}</td>
                        <td style={{ width: columnWidths[6] }}>{item.totalSystemCpuTime?.toFixed(4)}</td>
                        <td style={{ width: columnWidths[7] }}>{new Date(item.maxTestEndTime).toLocaleTimeString()}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default ProcessQueryTable;