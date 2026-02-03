import React from 'react';
import '../../styles/StudentDashboard.css';

export function ViewEnrollment() {
    const enrolledCourses = [
        { code: 'CS301', name: 'Database Systems', instructor: 'Prof. Rahman', credits: 3, semester: 'Fall 2025', status: 'Active', schedule: 'Mon, Wed 10:00-11:30', room: '301 - Block A' },
        { code: 'MATH201', name: 'Linear Algebra', instructor: 'Dr. Farhana', credits: 4, semester: 'Fall 2025', status: 'Active', schedule: 'Tue, Thu 08:30-10:00', room: '202 - Science' },
        { code: 'PHY101', name: 'Physics I', instructor: 'Prof. Jamal Uddin', credits: 4, semester: 'Fall 2025', status: 'Active', schedule: 'Mon, Wed, Fri 11:00-12:00', room: '105 - Science' },
        { code: 'ENG202', name: 'Technical Writing', instructor: 'Dr. Nargis Parvin', credits: 3, semester: 'Fall 2025', status: 'Active', schedule: 'Tue 14:00-17:00', room: '404 - Humanities' },
        { code: 'CS302', name: 'Algorithms', instructor: 'Prof. Rahman', credits: 3, semester: 'Fall 2025', status: 'Active', schedule: 'Mon, Wed 13:00-14:30', room: '302 - Block A' },
    ];

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
                            {enrolledCourses.map((course, index) => (
                                <tr key={index}>
                                    <td style={{ fontWeight: '500' }}>{course.code}</td>
                                    <td>{course.name}</td>
                                    <td className="text-muted">{course.instructor}</td>
                                    <td>{course.credits}</td>
                                    <td className="text-sm">{course.schedule}</td>
                                    <td className="text-sm text-muted">{course.room}</td>
                                    <td>
                                        <span className="badge active">
                                            {course.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
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
                            {enrolledCourses.reduce((sum, course) => sum + course.credits, 0)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
