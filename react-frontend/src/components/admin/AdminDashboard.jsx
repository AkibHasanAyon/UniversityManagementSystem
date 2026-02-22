import React, { useState, useEffect } from 'react';
import { Users, BookOpen, GraduationCap, LogOut, Menu, X } from 'lucide-react';
import { ManageStudents } from './ManageStudents';
import { ManageFaculty } from './ManageFaculty';
import { ManageCourses } from './ManageCourses';
import { AssignCourses } from './AssignCourses';
import { ViewRecords } from './ViewRecords';
import { StudentEnrollment } from './StudentEnrollment';
import api from '../../services/api';

import '../../styles/Dashboard.css';

export function AdminDashboard({ user, onLogout }) {
    const [currentView, setCurrentView] = useState('overview');
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const menuItems = [
        { id: 'overview', label: 'Overview', icon: Menu },
        { id: 'students', label: 'Manage Students', icon: Users },
        { id: 'faculty', label: 'Manage Faculty', icon: Users },
        { id: 'courses', label: 'Manage Courses', icon: BookOpen },
        { id: 'assign', label: 'Assign Courses', icon: GraduationCap },
        { id: 'enrollment', label: 'Student Enrollment', icon: Users },
        { id: 'records', label: 'Academic Records', icon: BookOpen },
    ];

    const renderContent = () => {
        switch (currentView) {
            case 'overview': return <OverviewCards onNavigate={setCurrentView} />;
            case 'students': return <ManageStudents />;
            case 'faculty': return <ManageFaculty />;
            case 'courses': return <ManageCourses />;
            case 'assign': return <AssignCourses />;
            case 'enrollment': return <StudentEnrollment />;
            case 'records': return <ViewRecords />;
            default: return <OverviewCards onNavigate={setCurrentView} />;
        }
    };

    return (
        <div className="dashboard-layout">
            <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
                <div className="sidebar-header">
                    {sidebarOpen && (
                        <div className="logo-area">
                            <div className="logo-box">
                                <GraduationCap size={20} color="white" />
                            </div>
                            <div className="logo-text">
                                <span className="brand">UMS</span>
                                <span className="subtitle">Admin Panel</span>
                            </div>
                        </div>
                    )}
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="toggle-btn">
                        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                <nav className="sidebar-nav">
                    {menuItems.map(item => {
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
                        )
                    })}
                </nav>
            </aside>

            <div className="main-wrapper">
                <header className="top-header">
                    <div className="header-title">
                        <h1>Administrator Dashboard</h1>
                        <p>Manage university operations</p>
                    </div>
                    <div className="header-profile">
                        <div className="user-info">
                            <span className="name">{user.name}</span>
                            <span className="email">{user.email}</span>
                        </div>
                        <div className="avatar">
                            {user.name.charAt(0)}
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

function OverviewCards({ onNavigate }) {
    const [stats, setStats] = useState({
        total_students: '...',
        total_faculty: '...',
        total_courses: '...',
    });

    useEffect(() => {
        api.get('/api/dashboard/admin/stats/')
            .then(res => {
                const d = res.data.data || res.data;
                setStats({
                    total_students: d.total_students ?? d.student_count ?? 0,
                    total_faculty: d.total_faculty ?? d.faculty_count ?? 0,
                    total_courses: d.total_courses ?? d.course_count ?? 0,
                });
            })
            .catch(err => console.error('Failed to load admin stats:', err));
    }, []);

    const statCards = [
        { label: 'Total Students', value: stats.total_students, icon: Users, colorClass: 'blue' },
        { label: 'Total Faculty', value: stats.total_faculty, icon: Users, colorClass: 'green' },
        { label: 'Total Courses', value: stats.total_courses, icon: BookOpen, colorClass: 'purple' },
    ];

    return (
        <div className="overview-container">
            <h2 style={{ marginBottom: '1.5rem', fontWeight: 'bold', fontSize: '1.25rem' }}>System Overview</h2>

            <div className="stats-grid">
                {statCards.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <div key={i} className="stat-card">
                            <div className="stat-info">
                                <span className="label">{stat.label}</span>
                                <span className="value">{stat.value}</span>
                            </div>
                            <div className={`stat-icon ${stat.colorClass}`}>
                                <Icon size={24} color="white" />
                            </div>
                        </div>
                    )
                })}
            </div>

            <div className="quick-actions">
                <h3>Quick Actions</h3>
                <div className="actions-grid">
                    <button className="action-btn blue" onClick={() => onNavigate('students')}>Add New Student</button>
                    <button className="action-btn green" onClick={() => onNavigate('faculty')}>Add New Faculty</button>
                    <button className="action-btn purple" onClick={() => onNavigate('courses')}>Create New Course</button>
                </div>
            </div>
        </div>
    )
}
