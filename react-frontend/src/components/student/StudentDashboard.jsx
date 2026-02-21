import React, { useState, useEffect } from 'react';
import { BookOpen, Award, LogOut, Menu, X, GraduationCap, FileText } from 'lucide-react';
import { dashboardApi } from '../../api/dashboardApi';
import { ViewEnrollment } from './ViewEnrollment';
import { ViewGrades } from './ViewGrades';
import { AcademicHistory } from './AcademicHistory';
import { ClassScheduleWidget } from '../ClassScheduleWidget';
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
    const [statData, setStatData] = useState({
        enrolled_courses: '...',
        gpa: '...',
        upcoming_classes: [],
        current_courses: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await dashboardApi.getStudentStats();
                setStatData({
                    enrolled_courses: data.enrolled_courses ?? data.total_courses ?? 0,
                    gpa: data.current_gpa ?? data.gpa ?? 'N/A',
                    upcoming_classes: data.upcoming_classes || [],
                    current_courses: data.current_courses || data.enrolled_courses_list || []
                });
            } catch (err) {
                console.error("Failed to fetch student stats", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const stats = [
        { label: 'Enrolled Courses', value: statData.enrolled_courses, icon: BookOpen, color: '#a855f7' },
        { label: 'Current GPA', value: statData.gpa, icon: Award, color: '#3b82f6' },
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
                            <div className="stat-icon" style={{ background: stat.color }}>
                                <Icon size={24} color="white" />
                            </div>
                        </div>
                    );
                })}
            </div>

            {loading ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>Loading summary...</div>
            ) : (
                <>
                    <ClassScheduleWidget userRole="student" classes={statData.upcoming_classes} />

                    <div className="summary-box" style={{ background: 'white', marginTop: '32px' }}>
                        <h3 className="summary-title" style={{ color: 'var(--text-gray-900)', fontSize: '1.125rem', marginBottom: '16px' }}>Current Semester Courses</h3>
                        {statData.current_courses && statData.current_courses.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {statData.current_courses.map((course, idx) => {
                                    const courseName = typeof course === 'object' ? `${course.code} - ${course.name}` : course;
                                    return (
                                        <div key={idx} className="course-item">
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <div className="progress-dot" style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--emerald-500)' }}></div>
                                                <span style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-gray-900)' }}>{courseName}</span>
                                            </div>
                                            <span className="in-progress-badge" style={{ fontSize: '0.75rem', background: '#e0f2fe', color: '#0369a1', padding: '2px 8px', borderRadius: '12px' }}>In Progress</span>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>No current courses available.</p>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
