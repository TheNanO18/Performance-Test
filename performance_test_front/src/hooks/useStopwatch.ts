import { useState, useEffect, useRef } from 'react';

export interface StopwatchState {
    isRunning: boolean;
    elapsedSeconds: number;
    duration: number;
    isFinished: boolean;
    isAlertShown: boolean;
    setAlertShown: (shown: boolean) => void;
    startStopwatch: (duration: number) => void;
    stopStopwatch: () => void;
    resetStopwatch: () => void;
}

export const useStopwatch = (): StopwatchState => {
    const [isRunning, setIsRunning] = useState(false);
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isAlertShown, setIsAlertShown] = useState(false);
    
    const intervalRef = useRef<number | undefined>(undefined);

    const isFinished = elapsedSeconds >= duration && duration > 0;

    // 💡 1초마다 elapsedSeconds를 증가시키는 타이머 로직
    useEffect(() => {
        if (isRunning && !isFinished) {
            // TypeScript에서 setInterval의 반환 타입을 number로 처리
            intervalRef.current = window.setInterval(() => {
                setElapsedSeconds(prev => prev + 1);
            }, 1000);

            // 💡 컴포넌트 언마운트 또는 isRunning 변경 시 정리 함수 실행
            return () => {
                if (intervalRef.current !== undefined) {
                    clearInterval(intervalRef.current);
                }
            };
        }

        // 2. 테스트 완료 시 처리 (isRunning 상태만 false로 확실하게 변경)
        //    타이머 중지는 위의 return 함수가 처리합니다.
        if (isFinished) {
            setIsRunning(false);
            // 💡 이 시점에서는 새로운 타이머가 설정되지 않도록 isRunning 상태를 변경하는 것만 중요합니다.
        }


        // 3. 타이머가 설정되지 않는 모든 경우 (isRunning=false 또는 isFinished=true)에 대한 기본 정리 함수.
        return () => {
            if (intervalRef.current !== undefined) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isRunning, isFinished]);

    // 💡 스톱워치 시작
    const startStopwatch = (newDuration: number) => {
        setDuration(newDuration);
        setElapsedSeconds(0);
        setIsRunning(true);
        setIsAlertShown(false);
    };

    // 💡 스톱워치 중지
    const stopStopwatch = () => {
        setIsRunning(false);
        if (intervalRef.current !== undefined) {
            clearInterval(intervalRef.current);
        }
        // elapsedSeconds는 현재 값으로 유지
    };

    const resetStopwatch = () => {
        stopStopwatch();
        setElapsedSeconds(0);
        setDuration(0);
        setIsAlertShown(false);
    };

    return {
        isRunning,
        elapsedSeconds,
        duration,
        isFinished,
        isAlertShown,
        startStopwatch,
        stopStopwatch,
        resetStopwatch,
        setAlertShown: setIsAlertShown,
    };
};