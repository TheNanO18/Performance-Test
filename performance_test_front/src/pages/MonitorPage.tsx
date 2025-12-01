import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { type LoadConfig } from '../types/LoadConfig.ts';

// 초기 상태값 설정
// Partial<LoadConfig>를 사용하여 모든 필드가 필수는 아님을 명시
const initialConnectionState: Partial<LoadConfig> = {
    targetDbUrl: '',
    targetDbUsername: '',
    targetDbPassword: '',
    targetDbDriver: 'org.postgresql.Driver', // 기본 드라이버 설정
};

// ==========================================================
// 💡 수정됨: export default function으로 정의
// ==========================================================
export default function ConnectionSetupPage() {
    const [connectionConfig, setConnectionConfig] = 
        useState<Partial<LoadConfig>>(initialConnectionState);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setConnectionConfig(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // 간단한 유효성 검사
        if (!connectionConfig.targetDbUrl || !connectionConfig.targetDbUsername) {
            alert("DB URL과 사용자 이름은 필수 입력 항목입니다.");
            return;
        }

        // 입력 정보를 다음 페이지로 전달하면서 이동
        // useLocation state를 사용하여 데이터를 다음 경로에 전달
        navigate('/config', { state: { connectionConfig } });
    };

    return (
        <div className="page-container">
            <h2>🔗 1/3. 대상 DB 연결 정보 설정</h2>
            <p>부하 테스트를 진행할 대상 데이터베이스의 접속 정보를 입력하세요.</p>
            <form onSubmit={handleSubmit} className="form-layout">
                <label>
                    DB URL (예: jdbc:postgresql://host:port/dbname):
                    <input 
                        type="text" 
                        name="targetDbUrl" 
                        value={connectionConfig.targetDbUrl || ''} 
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    사용자 이름 (Username):
                    <input 
                        type="text" 
                        name="targetDbUsername" 
                        value={connectionConfig.targetDbUsername || ''} 
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    비밀번호 (Password):
                    <input 
                        type="password" 
                        name="targetDbPassword" 
                        value={connectionConfig.targetDbPassword || ''} 
                        onChange={handleChange}
                    />
                </label>
                <label>
                    JDBC 드라이버 클래스:
                    <input 
                        type="text" 
                        name="targetDbDriver" 
                        value={connectionConfig.targetDbDriver || ''} 
                        onChange={handleChange}
                    />
                </label>
                <button type="submit" className="submit-button">다음 단계 (부하 설정) &rarr;</button>
            </form>
        </div>
    );
}