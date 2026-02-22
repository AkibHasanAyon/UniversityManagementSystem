import React, { useState, useEffect } from 'react';
import { BookOpen, Users, LogOut, Menu, X, GraduationCap } from 'lucide-react';
import { ViewAssignedCourses } from './ViewAssignedCourses';
import { ViewStudents } from './ViewStudents';
import { SubmitGrades } from './SubmitGrades';
import { UpdateGrades } from './UpdateGrades';
import { ClassScheduleWidget } from '../ClassScheduleWidget';
import api from '../../services/api';
import '../../styles/Dashboard.css';

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

            <div className="main-wrapper">
                <header className="top-header">
                    <div className="header-title">
                        <h1 style={{ color: 'var(--emerald-500)' }}>Faculty Dashboard</h1>
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
    const [stats, setStats] = useState({
        assigned_courses: '...',
        total_students: '...',
    });
    const [scheduleClasses, setScheduleClasses] = useState([]);

    useEffect(() => {
        api.get('/api/dashboard/faculty/stats/')
            .then(res => {
                const d = res.data.data || res.data;
                setStats({
                    assigned_courses: d.assigned_courses_count ?? d.assigned_courses ?? d.total_courses ?? 0,
                    total_students: d.total_students_count ?? d.total_students ?? 0,
                });
            })
            .catch(err => console.error('Failed to load faculty stats:', err));

        api.get('/api/academic/schedules/today/')
            .then(res => {
                const d = res.data.data || res.data;
                // Merge today + tomorrow classes, keeping their original days arrays
                const allClasses = [...(d.today || []), ...(d.tomorrow || [])];
                setScheduleClasses(allClasses.map(c => ({
                    courseCode: c.courseCode || c.course_code || '',
                    courseName: c.courseName || c.course_name || '',
                    startTime: c.startTime || c.start_time || '',
                    endTime: c.endTime || c.end_time || '',
                    days: c.days || [],
                    room: c.room || '',
                    building: c.building || '',
                    type: c.type || 'Lecture',
                    status: c.status || 'Scheduled',
                })));
            })
            .catch(err => console.error('Failed to load schedule:', err));
    }, []);

    const statCards = [
        { label: 'Assigned Courses', value: stats.assigned_courses, icon: BookOpen, colorClass: 'green' },
        { label: 'Total Students', value: stats.total_students, icon: Users, colorClass: 'blue' },
    ];

    return (
        <div className="overview-container">
            <h2 style={{ marginBottom: '1.5rem', fontWeight: 'bold' }}>Your Overview</h2>
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

            <ClassScheduleWidget userRole="faculty" classes={scheduleClasses} />
        </div>
    )
}
