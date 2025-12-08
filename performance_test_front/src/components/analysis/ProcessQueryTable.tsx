import React, { useState } from 'react';
import ResizableTitle from '../ResizableTitle';
import { type TestEzisProcessQueryHistoryDto } from '../../types/LoadConfig';

// 💡 기본 컬럼 너비 정의 (필드에 맞게 조정 필요)
const DEFAULT_PROCESS_WIDTHS = [80, 100, 200, 150, 150, 150, 100]; // 7개 컬럼 가정

const ProcessQueryTable: React.FC<{ data: TestEzisProcessQueryHistoryDto[] }> = ({ data }) => {
    const [columnWidths, setColumnWidths] = useState<number[]>(DEFAULT_PROCESS_WIDTHS);
    
    // 컬럼 헤더 정의 (TestEzisProcessQueryHistoryDto 구조에 맞게 명시)
    const headers = [
        'ID', '테스트명', 'Hash', 'User Agent', '총 코어', 'User CPU', 'System CPU'
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
                {data.map((item: any, index: number) => (
                    <tr key={index}>
                        <td>{item.id || index}</td>
                        <td>{item.testName}</td>
                        <td style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.normalizedQueryHash}</td>
                        <td>{item.httpUserAgent || 'N/A'}</td> 
                        <td>{item.totalCpuCores?.toFixed(4)}</td>
                        <td>{item.totalUserCpuTime?.toFixed(4)}</td>
                        <td>{item.totalSystemCpuTime?.toFixed(4)}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default ProcessQueryTable;