import React, { useState } from 'react';
import ResizableTitle from '../ResizableTitle'; // 💡 ResizableTitle 임포트
import { type TestEzisHashQueryHistoryDto } from '../../types/LoadConfig'; // DTO 타입 임포트

// 💡 기본 컬럼 너비 정의 (px 단위)
const DEFAULT_COLUMN_WIDTHS = [120, 80, 250, 150, 150, 100]; // 6개 컬럼

const QueryHashTable: React.FC<{ data: TestEzisHashQueryHistoryDto[] }> = ({ data }) => {
    // 💡 컬럼 너비 상태 관리 (컬럼별 너비를 배열로 저장)
    const [columnWidths, setColumnWidths] = useState<number[]>(DEFAULT_COLUMN_WIDTHS);
    
    // 컬럼 헤더 정의
    const headers = [
        '테스트명', '소요 시간(초)', '쿼리 해시', 
        '총 코어 (정규화 * 10k)', 'User CPU (정규화 * 10k)', '종료 시각'
    ];
    
    // 너비 조절 이벤트 핸들러
    const handleResize = (index: number, newWidth: number) => {
        setColumnWidths(prevWidths => {
            const newWidths = [...prevWidths];
            newWidths[index] = newWidth; // 새로운 너비로 업데이트
            return newWidths;
        });
    };
    
    if (data.length === 0) return <p>조회된 쿼리 해시 데이터가 없습니다. 테스트 이름을 확인하세요.</p>;
    
    return (
        <table style={{ 
            width: '100%', 
            tableLayout: 'fixed', // 💡 컬럼 너비 고정 (필수)
            borderCollapse: 'collapse', 
            marginTop: '10px' 
        }}>
            <thead>
                <tr>
                    {headers.map((header, index) => (
                        <ResizableTitle
                            key={index}
                            // 💡 렌더링 시점에 width 상태 전달
                            width={columnWidths[index]}
                            onResize={({ width }) => handleResize(index, width)}
                            style={{ 
                                width: columnWidths[index], 
                                minWidth: '50px', // 최소 너비 설정
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
                        {/* 💡 <tr> 내부 셀은 <td> 너비를 명시적으로 설정할 필요 없이 tableLayout: fixed를 따릅니다 */}
                        <td style={{ width: columnWidths[0] }}>{item.testName}</td>
                        <td style={{ width: columnWidths[1] }}>{item.testTimeSec}</td>
                        <td style={{ width: columnWidths[2], overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {item.normalizedQueryHash}
                        </td>
                        <td style={{ width: columnWidths[3] }}>{item.totalCpuCores?.toFixed(4)}</td>
                        <td style={{ width: columnWidths[4] }}>{item.totalUserCpuTime?.toFixed(4)}</td>
                        <td style={{ width: columnWidths[5] }}>{new Date(item.maxTestEndTime).toLocaleTimeString()}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default QueryHashTable;