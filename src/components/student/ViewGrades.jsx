import React from 'react';
import '../../styles/StudentDashboard.css';

export function ViewGrades() {
    const grades = [
        { courseCode: 'CS301', courseName: 'Database Systems', grade: 'A', credits: 3, semester: 'Fall 2025' },
        { courseCode: 'MATH201', courseName: 'Linear Algebra', grade: 'A-', credits: 4, semester: 'Fall 2025' },
        { courseCode: 'PHY101', courseName: 'Physics I', grade: 'B+', credits: 4, semester: 'Fall 2025' },
        { courseCode: 'ENG202', courseName: 'Technical Writing', grade: 'A', credits: 3, semester: 'Fall 2025' },
        { courseCode: 'CS302', courseName: 'Algorithms', grade: 'A-', credits: 3, semester: 'Fall 2025' },
    ];

    const gradePoints = {
        'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7,
        'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D': 1.0, 'F': 0.0
    };

    const calculateGPA = () => {
        const totalPoints = grades.reduce((sum, g) => sum + (gradePoints[g.grade] * g.credits), 0);
        const totalCredits = grades.reduce((sum, g) => sum + g.credits, 0);
        return (totalPoints / totalCredits).toFixed(2);
    };

    const getBadgeClass = (grade) => {
        if (grade.startsWith('A')) return 'badge grade-A';
        if (grade.startsWith('B')) return 'badge grade-B';
        if (grade.startsWith('C')) return 'badge grade-C';
        return 'badge grade-D'; // Includes F for simplicity in styling
    };

    return (
        <div>
            <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-gray-900)' }}>View Grades</h2>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-gray-600)' }}>Your academic performance summary</p>
            </div>

            {/* GPA Card */}
            <div className="gpa-card">
                <div className="gpa-header">
                    <div>
                        <p className="gpa-label">Current GPA</p>
                        <p className="gpa-value">{calculateGPA()}</p>
                        <p className="gpa-label" style={{ fontSize: '0.875rem', marginTop: '8px' }}>Fall 2025 Semester</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <p className="gpa-label" style={{ fontSize: '0.875rem' }}>Total Credits</p>
                        <p style={{ fontSize: '1.5rem', fontWeight: '700' }}>{grades.reduce((sum, g) => sum + g.credits, 0)}</p>
                    </div>
                </div>
            </div>

            {/* Grades Table */}
            <div className="table-container">
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Course Code</th>
                                <th>Course Name</th>
                                <th>Credits</th>
                                <th>Grade</th>
                                <th>Grade Points</th>
                                <th>Semester</th>
                            </tr>
                        </thead>
                        <tbody>
                            {grades.map((grade, index) => (
                                <tr key={index}>
                                    <td style={{ fontWeight: '500' }}>{grade.courseCode}</td>
                                    <td>{grade.courseName}</td>
                                    <td>{grade.credits}</td>
                                    <td>
                                        <span className={getBadgeClass(grade.grade)}>
                                            {grade.grade}
                                        </span>
                                    </td>
                                    <td>{gradePoints[grade.grade].toFixed(1)}</td>
                                    <td className="text-muted">{grade.semester}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <StatsCard label="Total Courses" value={grades.length} gradient="linear-gradient(to bottom right, #3b82f6, #06b6d4)" />
                <StatsCard label="Average Grade" value={calculateGPA()} gradient="linear-gradient(to bottom right, #10b981, #14b8a6)" />
                <StatsCard label="Credits Earned" value={grades.reduce((sum, g) => sum + g.credits, 0)} gradient="linear-gradient(to bottom right, #a855f7, #ec4899)" />
            </div>
        </div>
    );
}

function StatsCard({ label, value, gradient }) {
    return (
        <div style={{ background: gradient, borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-lg)', padding: '16px', color: 'white' }}>
            <p style={{ fontSize: '0.875rem', marginBottom: '4px', opacity: 0.9 }}>{label}</p>
            <p style={{ fontSize: '1.5rem', fontWeight: '700' }}>{value}</p>
        </div>
    )
}
