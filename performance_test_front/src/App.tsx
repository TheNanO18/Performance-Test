// src/App.tsx (수정된 부분)
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoadTestConfigurationPage from './pages/LoadTestConfigurationPage'; 
// import HistoryPage from './pages/HistoryPage';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          {/* ⭐️ 문제 해결: "/" 경로를 명시적으로 "/config"로 리다이렉트하거나 
            LoadTestConfigurationPage 컴포넌트를 렌더링하도록 수정
          */}
          
          {/* 방법 A (권장): 루트 경로를 /config로 리다이렉트 */}
          <Route path="/" element={<Navigate replace to="/config" />} />
          

          {/* LoadTestConfigurationPage 컴포넌트가 렌더링될 경로 */}
          <Route path="/config" element={<LoadTestConfigurationPage />} />
          
          {/* 일치하는 경로가 없을 경우의 처리 (선택 사항) */}
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;