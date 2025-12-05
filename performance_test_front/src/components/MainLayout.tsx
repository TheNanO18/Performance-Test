import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

// 이 컴포넌트가 사이드 메뉴와 컨텐츠를 감싸는 역할을 합니다.
export default function MainLayout() {
    const location = useLocation();

    return (
        <div className="full-screen-container">
            <div className="main-layout-grid-v4"> {/* 💡 새로운 Grid 구조 */}
                
                {/* 1. 🟢 좌측 메뉴 패널 (고정 영역) */}
                <div className="side-nav-menu">
                    <h2>메인 메뉴</h2>
                    <nav className="side-nav">
                        {/* /config 링크 */}
                        <Link 
                            to="/config" 
                            className={`nav-item ${location.pathname === '/config' ? 'nav-active' : ''}`}
                        >
                            ⚙️ 쿼리 튜닝 테스트
                        </Link>
                        
                        {/* /analysis 링크 */}
                        <Link 
                            to="/analysis" 
                            className={`nav-item ${location.pathname === '/analysis' ? 'nav-active' : ''}`}
                        >
                            🔬 분석 페이지
                        </Link>

                        
                        <Link 
                            to="/db-setup" 
                            className={`nav-item ${location.pathname === '/db-setup' ? 'nav-active' : ''}`}
                        >
                            🔗 Target DB 설정
                        </Link>
                    </nav>
                </div>
                
                {/* 2. 🟢 우측 컨텐츠 영역 (라우팅된 페이지가 렌더링되는 곳) */}
                <div className="page-content-view">
                    {/* 💡 Outlet: 중첩 라우트의 자식 컴포넌트(Config/AnalysisPage)가 여기에 렌더링됩니다. */}
                    <Outlet />
                </div>
                
            </div>
        </div>
    );
}