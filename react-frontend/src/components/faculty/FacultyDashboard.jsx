import React, { useState } from 'react';
import { BookOpen, Users, LogOut, Menu, X, GraduationCap } from 'lucide-react';
import { ViewAssignedCourses } from './ViewAssignedCourses';
import { ViewStudents } from './ViewStudents';
import { SubmitGrades } from './SubmitGrades';
import { UpdateGrades } from './UpdateGrades';
import '../../styles/Dashboard.css';

// Placeholder removed

export function FacultyDashboard({ user, onLogout }) {
    const [currentView, setCurrentView] = useState('overview');
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const menuItems = [
        { id: 'overview', label: 'Overview', icon: Menu },
        { id: 'courses', label: 'Assigned Courses', icon: BookOpen },
        { id: 'students', label: 'View Students', icon: Users },
        { id: 'submit', label: 'Submit Grades', icon: GraduationCap },
        { id: 'update', label: 'Update Grades', icon: BookOpen },
    ];

    const renderContent = () => {
        switch (currentView) {
            case 'overview': return <OverviewCards />;
            case 'courses': return <ViewAssignedCourses />;
            case 'students': return <ViewStudents />;
            case 'submit': return <SubmitGrades />;
            case 'update': return <UpdateGrades />;
            default: return <OverviewCards />;
        }
    };

    return (
        <div className="dashboard-layout">
            {/* Sidebar - using same styles as Admin */}
            <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
                <div className="sidebar-header">
                    {sidebarOpen && (
                        <div className="logo-area">
                            <div className="logo-box" style={{ background: 'var(--faculty-gradient)' }}>
                                <GraduationCap size={20} color="white" />
                            </div>
                            <div className="logo-text">
                                <span className="brand">UMS</span>
                                <span className="subtitle">Faculty Portal</span>
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
                                style={currentView === item.id ? { background: 'var(--faculty-gradient)' } : {}}
                            >
                                <Icon size={20} />
                                {sidebarOpen && <span>{item.label}</span>}
                            </button>
                        )
                    })}
                </nav>
            </aside>

            {/* Main Content */}
            <div className="main-wrapper">
                <header className="top-header">
                    <div className="header-title">
                        <h1 style={{
                            background: 'linear-gradient(to right, var(--emerald-500), var(--teal-500))',
                            WebkitBackgroundClip: 'text',
                            backgroundClip: 'text',
                            color: 'transparent'
                        }}>Faculty Dashboard</h1>
                        <p>Manage your courses and students</p>
                    </div>
                    <div className="header-profile">
                        <div className="user-info">
                            <span className="name">{user.name}</span>
                            <span className="email">{user.email}</span>
                        </div>
                        <div className="avatar" style={{ background: 'var(--faculty-gradient)' }}>
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

function OverviewCards() {
    const stats = [
        { label: 'Assigned Courses', value: '4', icon: BookOpen, colorClass: 'green' },
        { label: 'Total Students', value: '187', icon: Users, colorClass: 'blue' },
    ];

    return (
        <div className="overview-container">
            <h2 style={{ marginBottom: '1.5rem', fontWeight: 'bold' }}>Your Overview</h2>
            <div className="stats-grid">
                {stats.map((stat, i) => {
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
        </div>
    )
}
