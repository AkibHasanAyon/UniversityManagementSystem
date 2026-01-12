import React from 'react';
import '../../styles/StudentDashboard.css';

export function ViewEnrollment() {
    const enrolledCourses = [
        { code: 'CS301', name: 'Database Systems', instructor: 'Prof. Michael Chen', credits: 3, semester: 'Fall 2025', status: 'Active' },
        { code: 'MATH201', name: 'Linear Algebra', instructor: 'Dr. Sarah Johnson', credits: 4, semester: 'Fall 2025', status: 'Active' },
        { code: 'PHY101', name: 'Physics I', instructor: 'Prof. David Martinez', credits: 4, semester: 'Fall 2025', status: 'Active' },
        { code: 'ENG202', name: 'Technical Writing', instructor: 'Dr. Rebecca Smith', credits: 3, semester: 'Fall 2025', status: 'Active' },
        { code: 'CS302', name: 'Algorithms', instructor: 'Prof. Michael Chen', credits: 3, semester: 'Fall 2025', status: 'Active' },
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
                                <th>Semester</th>
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
                                    <td className="text-muted">{course.semester}</td>
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
