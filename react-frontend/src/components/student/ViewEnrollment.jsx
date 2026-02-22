import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import '../../styles/StudentDashboard.css';

export function ViewEnrollment() {
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/api/academic/enrollments/')
            .then(res => {
                const data = res.data.data || res.data;
                const results = data.results || data;
                setEnrolledCourses(Array.isArray(results) ? results.map(e => ({
                    code: e.courseCode || e.course_code || '',
                    name: e.courseName || e.course_name || '',
                    instructor: e.instructor || e.instructor_name || '',
                    credits: e.credits || 0,
                    semester: e.semester || '',
                    status: e.status || 'Active',
                    schedule: e.schedule || '',
                    room: e.room || '',
                })) : []);
            })
            .catch(err => console.error('Failed to load enrollments:', err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="text-center py-8">Loading...</div>;

    return (
        <div>
            <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-gray-900)' }}>Course Enrollment</h2>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-gray-600)' }}>Your currently enrolled courses</p>
            </div>

            <div className="table-container">
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Course Code</th>
                                <th>Course Name</th>
                                <th>Instructor</th>
                                <th>Credits</th>
                                <th>Schedule</th>
                                <th>Room</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {enrolledCourses.length === 0 ? (
                                <tr><td colSpan="7" className="text-center py-4 text-gray-500">No enrollments found.</td></tr>
                            ) : (
                                enrolledCourses.map((course, index) => (
                                    <tr key={index}>
                                        <td style={{ fontWeight: '500' }}>{course.code}</td>
                                        <td>{course.name}</td>
                                        <td className="text-muted">{course.instructor}</td>
                                        <td>{course.credits}</td>
                                        <td className="text-sm">{course.schedule || 'N/A'}</td>
                                        <td className="text-sm text-muted">{course.room || 'N/A'}</td>
                                        <td>
                                            <span className="badge active">{course.status}</span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="summary-box">
                <h3 className="summary-title">Enrollment Summary</h3>
                <div className="summary-grid">
                    <div>
                        <span className="summary-label">Total Courses:</span>
                        <span className="summary-value">{enrolledCourses.length}</span>
                    </div>
                    <div>
                        <span className="summary-label">Total Credits:</span>
                        <span className="summary-value">
                            {enrolledCourses.reduce((sum, course) => sum + (Number(course.credits) || 0), 0)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
