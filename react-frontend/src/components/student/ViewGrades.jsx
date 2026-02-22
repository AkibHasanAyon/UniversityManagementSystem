import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import api from '../../services/api';
import '../../styles/StudentDashboard.css';

export function ViewGrades() {
    const [grades, setGrades] = useState([]);
    const [loading, setLoading] = useState(true);

    const gradePoints = {
        'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7,
        'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D': 1.0, 'F': 0.0
    };

    useEffect(() => {
        api.get('/api/academic/grades/')
            .then(res => {
                const data = res.data.data || res.data;
                const results = data.results || data;
                setGrades(Array.isArray(results) ? results.map(g => ({
                    courseCode: g.course_code || g.courseCode || '',
                    courseName: g.course_name || g.courseName || '',
                    grade: g.grade,
                    credits: g.credits || 0,
                    semester: g.semester || '',
                })) : []);
            })
            .catch(err => console.error('Failed to load grades:', err))
            .finally(() => setLoading(false));
    }, []);

    const calculateGPA = () => {
        if (grades.length === 0) return '0.00';
        const totalPoints = grades.reduce((sum, g) => sum + ((gradePoints[g.grade] || 0) * (Number(g.credits) || 0)), 0);
        const totalCredits = grades.reduce((sum, g) => sum + (Number(g.credits) || 0), 0);
        return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';
    };

    const getBadgeClass = (grade) => {
        if (!grade) return 'badge';
        if (grade.startsWith('A')) return 'badge grade-A';
        if (grade.startsWith('B')) return 'badge grade-B';
        if (grade.startsWith('C')) return 'badge grade-C';
        return 'badge grade-D';
    };

    const handleExport = async () => {
        try {
            const res = await api.get('/api/academic/transcript/', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'transcript.pdf');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            // Fallback: show a summary alert if transcript endpoint not available
            alert('Transcript download is not available at this time.');
            console.error('Transcript download failed:', err);
        }
    };

    if (loading) return <div className="text-center py-8">Loading...</div>;

    return (
        <div>
            <div style={{ marginBottom: '24px' }} className="flex justify-between items-center">
                <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-gray-900)' }}>View Grades</h2>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-gray-600)' }}>Your academic performance summary</p>
                </div>
                <button
                    onClick={handleExport}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
                    style={{ fontSize: '0.9rem' }}
                >
                    <Download size={18} />
                    Export Transcript
                </button>
            </div>

            <div className="gpa-card">
                <div className="gpa-header">
                    <div>
                        <p className="gpa-label">Current GPA</p>
                        <p className="gpa-value">{calculateGPA()}</p>
                        <p className="gpa-label" style={{ fontSize: '0.875rem', marginTop: '8px' }}>
                            {grades.length > 0 ? grades[0].semester : 'N/A'}
                        </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <p className="gpa-label" style={{ fontSize: '0.875rem' }}>Total Credits</p>
                        <p style={{ fontSize: '1.5rem', fontWeight: '700' }}>{grades.reduce((sum, g) => sum + (Number(g.credits) || 0), 0)}</p>
                    </div>
                </div>
            </div>

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
                            {grades.length === 0 ? (
                                <tr><td colSpan="6" className="text-center py-4 text-gray-500">No grades found.</td></tr>
                            ) : (
                                grades.map((grade, index) => (
                                    <tr key={index}>
                                        <td style={{ fontWeight: '500' }}>{grade.courseCode}</td>
                                        <td>{grade.courseName}</td>
                                        <td>{grade.credits}</td>
                                        <td>
                                            <span className={getBadgeClass(grade.grade)}>{grade.grade}</span>
                                        </td>
                                        <td>{(gradePoints[grade.grade] || 0).toFixed(1)}</td>
                                        <td className="text-muted">{grade.semester}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <StatsCard label="Total Courses" value={grades.length} gradient="linear-gradient(to bottom right, #3b82f6, #06b6d4)" />
                <StatsCard label="Average Grade" value={calculateGPA()} gradient="linear-gradient(to bottom right, #10b981, #14b8a6)" />
                <StatsCard label="Credits Earned" value={grades.reduce((sum, g) => sum + (Number(g.credits) || 0), 0)} gradient="linear-gradient(to bottom right, #a855f7, #ec4899)" />
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
