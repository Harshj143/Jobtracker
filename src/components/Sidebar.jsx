import React from 'react';
import './Sidebar.css';

const Sidebar = ({ currentView, setCurrentView, jobsCount, followUpCount }) => {
    return (
        <aside className="sidebar glass-panel">
            <div className="sidebar-brand">
                <h2>Career<span className="highlight">Flow</span></h2>
            </div>

            <nav className="sidebar-nav">
                <button
                    className={`nav-item ${currentView === 'dashboard' ? 'active' : ''}`}
                    onClick={() => setCurrentView('dashboard')}
                >
                    <span className="icon">🏠</span>
                    Dashboard
                </button>

                <button
                    className={`nav-item ${currentView === 'applications' ? 'active' : ''}`}
                    onClick={() => setCurrentView('applications')}
                >
                    <span className="icon">📋</span>
                    Applications
                </button>

                <button
                    className={`nav-item ${currentView === 'followups' ? 'active' : ''}`}
                    onClick={() => setCurrentView('followups')}
                >
                    <span className="icon">📧</span>
                    Follow-ups
                    {followUpCount > 0 && <span className="badge warning">{followUpCount}</span>}
                </button>

                <button
                    className={`nav-item ${currentView === 'companies' ? 'active' : ''}`}
                    onClick={() => setCurrentView('companies')}
                >
                    <span className="icon">🏢</span>
                    Company Hub
                </button>

                <button
                    className={`nav-item ${currentView === 'recruiters' ? 'active' : ''}`}
                    onClick={() => setCurrentView('recruiters')}
                >
                    <span className="icon">👤</span>
                    Recruiters
                </button>

                <button
                    className={`nav-item ${currentView === 'yc-startups' ? 'active' : ''}`}
                    onClick={() => setCurrentView('yc-startups')}
                >
                    <span className="icon">🚀</span>
                    YC Hub
                </button>

                <button
                    className={`nav-item ${currentView === 'settings' ? 'active' : ''}`}
                    onClick={() => setCurrentView('settings')}
                >
                    <span className="icon">⚙️</span>
                    Settings
                </button>
            </nav>

            <div className="sidebar-footer">
                <p>Job Tracker v1.4</p>
            </div>
        </aside>
    );
};

export default Sidebar;
