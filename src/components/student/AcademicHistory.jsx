import React from 'react';
import '../../styles/StudentDashboard.css';

export function AcademicHistory() {
    const academicHistory = [
        {
            semester: 'Fall 2025',
            courses: [
                { code: 'CS301', name: 'Database Systems', grade: 'A', credits: 3 },
                { code: 'MATH201', name: 'Linear Algebra', grade: 'A-', credits: 4 },
                { code: 'PHY101', name: 'Physics I', grade: 'B+', credits: 4 },
                { code: 'ENG202', name: 'Technical Writing', grade: 'A', credits: 3 },
                { code: 'CS302', name: 'Algorithms', grade: 'A-', credits: 3 },
            ],
            gpa: 3.72
        },
        {
            semester: 'Spring 2025',
            courses: [
                { code: 'CS201', name: 'Data Structures', grade: 'A', credits: 3 },
                { code: 'MATH101', name: 'Calculus II', grade: 'B+', credits: 4 },
                { code: 'ENG101', name: 'English Composition', grade: 'A', credits: 3 },
                { code: 'HIST201', name: 'World History', grade: 'A-', credits: 3 },
            ],
            gpa: 3.77
        },
        {
            semester: 'Fall 2024',
            courses: [
                { code: 'CS101', name: 'Introduction to Programming', grade: 'A', credits: 3 },
                { code: 'MATH100', name: 'Calculus I', grade: 'B+', credits: 4 },
                { code: 'CHEM101', name: 'General Chemistry', grade: 'B', credits: 4 },
                { code: 'PSY101', name: 'Psychology', grade: 'A-', credits: 3 },
            ],
            gpa: 3.61
        },
    ];

    const getBadgeClass = (grade) => {
        if (grade.startsWith('A')) return 'badge grade-A';
        if (grade.startsWith('B')) return 'badge grade-B';
        if (grade.startsWith('C')) return 'badge grade-C';
        return 'badge grade-D';
    };

    return (
        <div>
            <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-gray-900)' }}>Academic Records</h2>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-gray-600)' }}>Complete academic history (Read-only)</p>
            </div>

            {/* Overall Summary */}
            <div style={{
                background: 'linear-gradient(to bottom right, white, #faf5ff)',
                borderRadius: 'var(--radius-xl)',
                boxShadow: 'var(--shadow-lg)',
                border: '1px solid var(--border-color)',
                padding: '24px',
                marginBottom: '24px'
            }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: 'var(--text-gray-900)', marginBottom: '16px' }}>Overall Academic Summary</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                    <StatsCard label="Cumulative GPA" value="3.72" gradient="linear-gradient(to bottom right, #a855f7, #ec4899)" />
                    <StatsCard label="Total Credits" value="51" gradient="linear-gradient(to bottom right, #3b82f6, #06b6d4)" />
                    <StatsCard label="Semesters" value="3" gradient="linear-gradient(to bottom right, #10b981, #14b8a6)" />
                    <StatsCard label="Courses Completed" value="13" gradient="linear-gradient(to bottom right, #f97316, #ef4444)" />
                </div>
            </div>

            {/* Semester by Semester */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {academicHistory.map((semester, idx) => (
                    <div key={idx} className="table-container">
                        <div style={{
                            padding: '16px 24px',
                            background: 'linear-gradient(to bottom right, #faf5ff, #fdf2f8)',
                            borderBottom: '1px solid var(--border-color)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: 'var(--text-gray-900)' }}>{semester.semester}</h3>
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-gray-600)' }}>Semester GPA</p>
                                <p style={{ fontSize: '1.25rem', fontWeight: '700', background: 'linear-gradient(to right, #9333ea, #db2777)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{semester.gpa}</p>
                            </div>
                        </div>

                        <div className="table-wrapper">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Course Code</th>
                                        <th>Course Name</th>
                                        <th>Credits</th>
                                        <th>Grade</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {semester.courses.map((course, courseIdx) => (
                                        <tr key={courseIdx}>
                                            <td style={{ fontWeight: '500' }}>{course.code}</td>
                                            <td>{course.name}</td>
                                            <td>{course.credits}</td>
                                            <td>
                                                <span className={getBadgeClass(course.grade)}>
                                                    {course.grade}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div style={{ padding: '12px 24px', background: '#f9fafb', borderTop: '1px solid var(--border-color)' }}>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-gray-600)' }}>
                                Total Credits: <span style={{ fontWeight: '500', color: 'var(--text-gray-900)' }}>{semester.courses.reduce((sum, c) => sum + c.credits, 0)}</span>
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function StatsCard({ label, value, gradient }) {
    return (
        <div style={{ background: gradient, borderRadius: 'var(--radius-lg)', padding: '16px', color: 'white', boxShadow: 'var(--shadow-md)' }}>
            <p style={{ fontSize: '0.875rem', marginBottom: '4px', opacity: 0.9 }}>{label}</p>
            <p style={{ fontSize: '1.5rem', fontWeight: '700' }}>{value}</p>
        </div>
    )
}
