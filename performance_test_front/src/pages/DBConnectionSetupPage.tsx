import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDBConfig } from '../context/DBContext';

export default function DBConnectionSetupPage() {
    // 💡 전역 Context에서 설정값과 Setter를 가져옵니다.
    const { dbConfig, setDbConfig } = useDBConfig();
    const [localConfig, setLocalConfig] = useState(dbConfig);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLocalConfig(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        // 💡 Context에 최종 설정값 저장
        setDbConfig(localConfig);
        alert('DB 연결 정보가 저장되었습니다.');
        // 설정 후 부하 설정 페이지로 이동
        navigate('/config'); 
    };

    return (
        <div className="page-container" style={{ padding: '40px' }}>
            <h2>🔗 Target DB Connection 설정</h2>
            <p>테스트 대상 DB의 접속 정보를 입력하고 저장하세요.</p>
            
            <div className="db-info-area" style={{ maxWidth: '400px', margin: '20px 0' }}>
                <label>URL: <input type="text" name="targetDbUrl" value={localConfig.targetDbUrl} onChange={handleChange} /></label>
                <label>Username: <input type="text" name="targetDbUsername" value={localConfig.targetDbUsername} onChange={handleChange} /></label>
                <label>Password: <input type="password" name="targetDbPassword" value={localConfig.targetDbPassword} onChange={handleChange} /></label>
                <label>Driver: <input type="text" name="targetDbDriver" value={localConfig.targetDbDriver} onChange={handleChange} /></label>
            </div>

            <button onClick={handleSave} className="submit-button" style={{ backgroundColor: '#007bff', color: 'white' }}>
                정보 저장 및 계속
            </button>
        </div>
    );
}