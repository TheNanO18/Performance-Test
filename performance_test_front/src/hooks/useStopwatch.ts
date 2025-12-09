import { useState, useEffect, useRef } from 'react';

export interface StopwatchState {
    isRunning: boolean;
    elapsedSeconds: number;
    isFinished: boolean;
    startStopwatch: (duration: number) => void;
    stopStopwatch: () => void;
}

export const useStopwatch = (): StopwatchState => {
    const [isRunning, setIsRunning] = useState(false);
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [duration, setDuration] = useState(0);
    const intervalRef = useRef<number | undefined>(undefined);

    const isFinished = elapsedSeconds >= duration && duration > 0;

    // 💡 1초마다 elapsedSeconds를 증가시키는 타이머 로직
    useEffect(() => {
        if (isRunning && !isFinished) {
            // TypeScript에서 setInterval의 반환 타입을 number로 처리
            intervalRef.current = window.setInterval(() => {
                setElapsedSeconds(prev => prev + 1);
            }, 1000);
        }

        // 💡 테스트 완료 시 타이머 정리
        if (isFinished) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
        }

        // 💡 컴포넌트 언마운트 또는 isRunning 변경 시 정리 함수 실행
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
    };

    // 💡 스톱워치 중지
    const stopStopwatch = () => {
        setIsRunning(false);
        if (intervalRef.current !== undefined) {
            clearInterval(intervalRef.current);
        }
    };

    return {
        isRunning,
        elapsedSeconds,
        isFinished,
        startStopwatch,
        stopStopwatch,
    };
};