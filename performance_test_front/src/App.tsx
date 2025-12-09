// src/App.tsx (수정된 부분)
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DBProvider } from './context/DBContext.tsx';
import LoadTestConfigurationPage from './pages/LoadTestConfigurationPage';
import DBConnectionSetupPage from './pages/DBConnectionSetupPage';
import AnalysisPage from './pages/AnalysisPage';
import MainLayout from './components/MainLayout.tsx';
import { StopwatchProvider } from './context/StopwatchContext.tsx';

function App() {
  return (
    <Router>
      <StopwatchProvider>
        <DBProvider>
          <div className="app-container">
            <Routes>
              {/* 💡 1. MainLayout을 상위 라우트로 설정 */}
              <Route path="/" element={<MainLayout />}>

                {/* 기본 경로 설정: /로 접근 시 /config로 이동 */}
                <Route index element={<Navigate replace to="config" />} />

                {/* 💡 2. DB Test 페이지 라우트: /config */}
                <Route path="config" element={<LoadTestConfigurationPage />} />

                {/* 💡 3. Analysis 페이지 라우트: /analysis */}
                <Route path="analysis" element={<AnalysisPage />} />

                <Route path="db-setup" element={<DBConnectionSetupPage />} />

                {/* 일치하는 경로가 없을 경우 */}
                <Route path="*" element={<h2>404 Not Found</h2>} />

              </Route>
            </Routes>
          </div>
        </DBProvider>
      </StopwatchProvider>
    </Router>
  );
}

export default App;