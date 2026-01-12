import React, { useState } from 'react';
import { Users, BookOpen, GraduationCap, LogOut, Menu, X } from 'lucide-react';
import { ManageStudents } from '../admin/ManageStudents';
import { ManageFaculty } from '../admin/ManageFaculty';
import { ManageCourses } from '../admin/ManageCourses';
import { AssignCourses } from '../admin/AssignCourses';
import { ViewRecords } from '../admin/ViewRecords';
import '../../styles/Dashboard.css';

// Placeholder removed

export function AdminDashboard({ user, onLogout }) {
    const [currentView, setCurrentView] = useState('overview');
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // Navigation Items
    const menuItems = [
        { id: 'overview', label: 'Overview', icon: Menu },
        { id: 'students', label: 'Manage Students', icon: Users },
        { id: 'faculty', label: 'Manage Faculty', icon: Users },
        { id: 'courses', label: 'Manage Courses', icon: BookOpen },
        { id: 'assign', label: 'Assign Courses', icon: GraduationCap },
        { id: 'records', label: 'Academic Records', icon: BookOpen },
    ];

    // Render content based on selected view
    const renderContent = () => {
        switch (currentView) {
            case 'overview': return <OverviewCards />;
            case 'students': return <ManageStudents />;
            case 'faculty': return <ManageFaculty />;
            case 'courses': return <ManageCourses />;
            case 'assign': return <AssignCourses />;
            case 'records': return <ViewRecords />;
            default: return <OverviewCards />;
        }
    };

    return (
        <div className="dashboard-layout">
            {/* Sidebar Navigation */}
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

            {/* Main Content Area */}
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

// Overview Component
function OverviewCards() {
    const stats = [
        { label: 'Total Students', value: '2,847', icon: Users, colorClass: 'blue' },
        { label: 'Total Faculty', value: '186', icon: Users, colorClass: 'green' },
        { label: 'Total Courses', value: '342', icon: BookOpen, colorClass: 'purple' },
    ];

    return (
        <div className="overview-container">
            <h2 style={{ marginBottom: '1.5rem', fontWeight: 'bold', fontSize: '1.25rem' }}>System Overview</h2>

            {/* Statistics Cards */}
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

            {/* Quick Actions Section */}
            <div className="quick-actions">
                <h3>Quick Actions</h3>
                <div className="actions-grid">
                    <button className="action-btn blue">Add New Student</button>
                    <button className="action-btn green">Add New Faculty</button>
                    <button className="action-btn purple">Create New Course</button>
                </div>
            </div>
        </div>
    )
}
