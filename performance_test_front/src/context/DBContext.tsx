import React, { createContext, useContext, useState } from 'react';
import { type ReactNode } from 'react';
import { type LoadConfig } from '../types/LoadConfig'; 

// LoadConfig에서 DB 연결 정보만 추출한 인터페이스
interface ConnectionConfig {
    targetDbUrl: string;
    targetDbUsername: string;
    targetDbPassword: string;
    targetDbDriver: string;
}

// Context가 제공할 값의 타입 정의
interface DBContextType {
    dbConfig: ConnectionConfig;
    setDbConfig: React.Dispatch<React.SetStateAction<ConnectionConfig>>;
}

const defaultConnection: ConnectionConfig = {
    targetDbUrl: 'jdbc:clickhouse://192.168.100.41:8125/default',
    targetDbUsername: 'default',
    targetDbPassword: 'default',
    targetDbDriver: 'com.clickhouse.jdbc.ClickHouseDriver',
};

const DBContext = createContext<DBContextType | undefined>(undefined);

// Provider 컴포넌트: 앱의 최상위에서 상태를 제공합니다.
export const DBProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [dbConfig, setDbConfig] = useState<ConnectionConfig>(defaultConnection);

    return (
        <DBContext.Provider value={{ dbConfig, setDbConfig }}>
            {children}
        </DBContext.Provider>
    );
};

// 훅: 컴포넌트에서 Context 값을 쉽게 사용할 수 있도록 합니다.
export const useDBConfig = () => {
    const context = useContext(DBContext);
    if (!context) {
        throw new Error('useDBConfig must be used within a DBProvider');
    }
    return context;
};