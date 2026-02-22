import React, { useState, useEffect } from 'react';
import { BookOpen, Award, LogOut, Menu, X, GraduationCap, FileText } from 'lucide-react';
import { ViewEnrollment } from './ViewEnrollment';
import { ViewGrades } from './ViewGrades';
import { AcademicHistory } from './AcademicHistory';
import { ClassScheduleWidget } from '../ClassScheduleWidget';
import api from '../../services/api';
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
    const [stats, setStats] = useState({
        enrolled_courses: '...',
        current_gpa: '...',
    });
    const [scheduleClasses, setScheduleClasses] = useState([]);
    const [enrolledCourses, setEnrolledCourses] = useState([]);

    useEffect(() => {
        // Fetch stats
        api.get('/api/dashboard/student/stats/')
            .then(res => {
                const d = res.data.data || res.data;
                setStats({
                    enrolled_courses: d.enrolled_courses_count ?? d.enrolled_courses ?? 0,
                    current_gpa: d.current_gpa ?? d.gpa ?? 'N/A',
                });
            })
            .catch(err => console.error('Failed to load student stats:', err));

        // Fetch schedule — API returns {today: [], tomorrow: [], today_day, tomorrow_day}
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
                    instructor: c.instructor || c.instructor_name || '',
                    status: c.status || 'Scheduled',
                })));
            })
            .catch(err => console.error('Failed to load schedule:', err));

        // Fetch enrolled courses for the list
        api.get('/api/academic/enrollments/')
            .then(res => {
                const data = res.data.data || res.data;
                const results = data.results || data;
                setEnrolledCourses(Array.isArray(results) ? results.map(e => ({
                    code: e.courseCode || e.course_code || '',
                    name: e.courseName || e.course_name || '',
                })) : []);
            })
            .catch(err => console.error('Failed to load enrollments:', err));
    }, []);

    const statCards = [
        { label: 'Enrolled Courses', value: stats.enrolled_courses, icon: BookOpen, color: '#a855f7' },
        { label: 'Current GPA', value: stats.current_gpa, icon: Award, color: '#3b82f6' },
    ];

    return (
        <div className="overview-container">
            <h2 style={{ marginBottom: '1.5rem', fontWeight: 'bold', fontSize: '1.25rem' }}>Your Academic Summary</h2>

            <div className="stats-grid">
                {statCards.map((stat, index) => {
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

            <ClassScheduleWidget userRole="student" classes={scheduleClasses} />

            <div className="summary-box" style={{ background: 'white', marginTop: '32px' }}>
                <h3 className="summary-title" style={{ color: 'var(--text-gray-900)', fontSize: '1.125rem', marginBottom: '16px' }}>Current Semester Courses</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {enrolledCourses.length > 0 ? (
                        enrolledCourses.map((course, idx) => (
                            <div key={idx} className="course-item">
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <div className="progress-dot"></div>
                                    <span style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-gray-900)' }}>{course.code} - {course.name}</span>
                                </div>
                                <span className="in-progress-badge">In Progress</span>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-sm">No courses enrolled yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
