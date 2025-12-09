import React, { createContext, useContext } from 'react';
import { useStopwatch, type StopwatchState } from '../hooks/useStopwatch'; // 💡 기존 훅 재사용

// 💡 1. Context 타입 정의
interface StopwatchContextValue extends StopwatchState {
  // 추가적으로 테스트 이름을 관리할 수 있습니다.
  testName: string | null; 
  setTestName: (name: string) => void;
}

// 💡 2. Context 객체 생성 (초기값은 null 또는 기본값)
const StopwatchContext = createContext<StopwatchContextValue | undefined>(undefined);

// 💡 3. Provider 컴포넌트 정의
export const StopwatchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const stopwatch = useStopwatch();
  const [currentTestName, setCurrentTestName] = React.useState<string | null>(null);

  // Context로 제공할 최종 값
  const value = {
    ...stopwatch,
    testName: currentTestName,
    setTestName: setCurrentTestName,
  };

  return (
    <StopwatchContext.Provider value={value}>
      {children}
    </StopwatchContext.Provider>
  );
};

// 💡 4. 커스텀 훅 정의 (사용의 편리성을 위해)
export const useGlobalStopwatch = () => {
  const context = useContext(StopwatchContext);
  if (!context) {
    throw new Error('useGlobalStopwatch must be used within a StopwatchProvider');
  }
  return context;
};