// src/hooks/useApi.ts

import axios from 'axios';
import { type LoadConfig } from '../types/LoadConfig'; 

export const useApi = () => {
  
  // 1. startTest 함수 (기존)
  const startTest = async (configData: LoadConfig) => {
    // API 호출 로직: POST /api/test/start
    const response = await axios.post('/api/test/start', configData);
    return response.data; 
  };
  
  // 2. stopTest 함수 정의 (신규)
  const stopTest = async () => {
    // API 호출 로직: POST /api/test/stop (본문(body)은 필요 없음)
    const response = await axios.post('/api/test/stop');
    return response.data;
  };
  
  // 3. 반환 객체에 두 함수 모두 포함
  return { startTest, stopTest }; // 👈 수정된 부분
};