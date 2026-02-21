import React, { useState, useEffect } from 'react';
import { academicApi } from '../../api/academicApi';
import '../../styles/StudentDashboard.css';

export function ViewEnrollment() {
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchEnrollments = async () => {
            try {
                // Fetch enrollments for the current student
                const data = await academicApi.listEnrollments('', 'current');
                setEnrolledCourses(data.results || data || []);
            } catch (err) {
                console.error("Failed to fetch enrollments", err);
                setError("Failed to load your enrolled courses.");
            } finally {
                setLoading(false);
            }
        };

        fetchEnrollments();
    }, []);

    const totalCredits = enrolledCourses.reduce((sum, enroll) => {
        const credits = typeof enroll.course === 'object' ? (enroll.course?.credits || 0) : 0;
        return sum + Number(credits);
    }, 0);

    return (
        <div>
            <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-gray-900)' }}>Course Enrollment</h2>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-gray-600)' }}>Your currently enrolled courses</p>
            </div>

            {error && (
                <div className="alert-error" style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '1rem', borderRadius: '0.5rem', marginBottom: '24px' }}>
                    <span className="font-medium">{error}</span>
                </div>
            )}

            <div className="table-container">
                {loading ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>Loading enrolled courses...</div>
                ) : (
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
                                {enrolledCourses.length > 0 ? enrolledCourses.map((enroll, index) => {
                                    const course = typeof enroll.course === 'object' ? enroll.course : null;

                                    // If course is an ID string/number and exact nested data is missing
                                    const code = course?.code || `Course ID: ${enroll.course}`;
                                    const name = course?.name || '-';
                                    const instructor = course?.instructor ? `${course.instructor.first_name || ''} ${course.instructor.last_name || ''}` : 'TBA';
                                    const credits = course?.credits || '-';

                                    const schedDays = Array.isArray(course?.days) ? course.days.join(', ') : (course?.days || '');
                                    const schedTime = (course?.startTime && course?.endTime) ? `${course.startTime}-${course.endTime}` : '';
                                    const schedule = schedDays || schedTime ? `${schedDays} ${schedTime}` : 'TBA';

                                    const room = course?.room ? `${course.building || ''} ${course.room}` : 'TBA';

                                    return (
                                        <tr key={enroll.id || index}>
                                            <td style={{ fontWeight: '500' }}>{code}</td>
                                            <td>{name}</td>
                                            <td className="text-muted">{instructor}</td>
                                            <td>{credits}</td>
                                            <td className="text-sm">{schedule}</td>
                                            <td className="text-sm text-muted">{room}</td>
                                            <td>
                                                <span className={`badge ${enroll.status === 'Dropped' ? 'badge-danger' : 'badge-success'}`}>
                                                    {enroll.status || 'Active'}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                }) : (
                                    <tr>
                                        <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                                            You are not enrolled in any courses.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {!loading && enrolledCourses.length > 0 && (
                <div className="summary-box">
                    <h3 className="summary-title" style={{ color: 'var(--text-gray-900)' }}>Enrollment Summary</h3>
                    <div className="summary-grid">
                        <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                            <span className="summary-label" style={{ color: '#64748b', fontSize: '0.875rem' }}>Total Courses:</span>
                            <span className="summary-value" style={{ display: 'block', fontSize: '1.5rem', fontWeight: 'bold', color: '#0f172a', marginTop: '4px' }}>{enrolledCourses.length}</span>
                        </div>
                        <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                            <span className="summary-label" style={{ color: '#64748b', fontSize: '0.875rem' }}>Total Credits:</span>
                            <span className="summary-value" style={{ display: 'block', fontSize: '1.5rem', fontWeight: 'bold', color: '#0f172a', marginTop: '4px' }}>{totalCredits}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
