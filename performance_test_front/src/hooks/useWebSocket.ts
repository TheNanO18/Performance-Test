// src/hooks/useWebSocket.js (간소화된 예시)
import { useState, useEffect } from 'react';
import { type TestResult } from '../types/LoadConfig.ts';

export const useWebSocket = (url: string): TestResult | null => {
  const [data, setData] = useState<TestResult | null>(null);

  useEffect(() => {
    // WebSocket 연결 로직 구현
    const ws = new WebSocket(url);

    ws.onmessage = (event) => {
      // 서버에서 받은 데이터를 JSON으로 파싱하여 상태 업데이트
      const receivedData = JSON.parse(event.data);
      setData(receivedData);
    };
    
    // 컴포넌트 언마운트 시 연결 종료
    return () => {
      ws.close();
    };
  }, [url]);

  return data; // 실시간 수신 데이터 반환
};