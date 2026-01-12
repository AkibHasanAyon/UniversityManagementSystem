import React, { useState } from 'react';
import { BookOpen, Award, LogOut, Menu, X, GraduationCap, FileText } from 'lucide-react';
import { ViewEnrollment } from '../student/ViewEnrollment';
import { ViewGrades } from '../student/ViewGrades';
import { AcademicHistory } from '../student/AcademicHistory';
import '../../styles/Dashboard.css';
import '../../styles/StudentDashboard.css';

export function StudentDashboard({ user, onLogout }) {
    const [currentView, setCurrentView] = useState('overview');
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const menuItems = [
        { id: 'overview', label: 'Overview', icon: Menu },
        { id: 'enrollment', label: 'Course Enrollment', icon: BookOpen },
        { id: 'grades', label: 'View Grades', icon: Award },
        { id: 'history', label: 'Academic Records', icon: FileText },
    ];

    const renderContent = () => {
        switch (currentView) {
            case 'overview': return <OverviewCards />;
            case 'enrollment': return <ViewEnrollment />;
            case 'grades': return <ViewGrades />;
            case 'history': return <AcademicHistory />;
            default: return <OverviewCards />;
        }
    };

    return (
        <div className="dashboard-layout student-theme">
            {/* Sidebar */}
            <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
                <div className="sidebar-header">
                    {sidebarOpen && (
                        <div className="logo-area">
                            <div className="logo-box">
                                <GraduationCap size={20} color="white" />
                            </div>
                            <div className="logo-text">
                                <span className="brand">UMS</span>
                                <span className="subtitle">Student Portal</span>
                            </div>
                        </div>
                    )}
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="toggle-btn">
                        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                <nav className="sidebar-nav">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setCurrentView(item.id)}
                                className={`nav-item ${currentView === item.id ? 'active' : ''}`}
                                title={!sidebarOpen ? item.label : ''}
                            >
                                <Icon size={20} />
                                {sidebarOpen && <span>{item.label}</span>}
                            </button>
                        );
                    })}
                </nav>
            </aside>

            {/* Main Content */}
            <div className="main-wrapper">
                <header className="top-header">
                    <div className="header-title">
                        <h1>Student Dashboard</h1>
                        <p>Track your academic progress</p>
                    </div>
                    <div className="header-profile">
                        <div className="user-info">
                            <span className="name">{user.name}</span>
                            <span className="email">{user.email}</span>
                        </div>
                        <div className="avatar">
                            {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <button onClick={onLogout} className="logout-btn" title="Logout">
                            <LogOut size={20} />
                        </button>
                    </div>
                </header>

                <main className="content-area">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
}

function OverviewCards() {
    const stats = [
        { label: 'Enrolled Courses', value: '5', icon: BookOpen, gradient: 'linear-gradient(to bottom right, #a855f7, #ec4899)' },
        { label: 'Current GPA', value: '3.72', icon: Award, gradient: 'linear-gradient(to bottom right, #3b82f6, #06b6d4)' },
    ];

    return (
        <div className="overview-container">
            <h2 style={{ marginBottom: '1.5rem', fontWeight: 'bold', fontSize: '1.25rem' }}>Your Academic Summary</h2>

            <div className="stats-grid">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="stat-card">
                            <div className="stat-info">
                                <span className="label">{stat.label}</span>
                                <span className="value">{stat.value}</span>
                            </div>
                            <div className="stat-icon" style={{ background: stat.gradient }}>
                                <Icon size={24} color="white" />
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="summary-box" style={{ background: 'white', marginTop: '32px' }}>
                <h3 className="summary-title" style={{ color: 'var(--text-gray-900)', fontSize: '1.125rem', marginBottom: '16px' }}>Current Semester Courses</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {['CS301 - Database Systems', 'MATH201 - Linear Algebra', 'PHY101 - Physics I', 'ENG202 - Technical Writing', 'CS302 - Algorithms'].map((course, idx) => (
                        <div key={idx} className="course-item">
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div className="progress-dot"></div>
                                <span style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-gray-900)' }}>{course}</span>
                            </div>
                            <span className="in-progress-badge">In Progress</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
