import React, { useState, useEffect } from 'react';
import { studentApi } from '../../api/studentApi';
import '../../styles/StudentDashboard.css';

export function AcademicHistory() {
    const [academicHistory, setAcademicHistory] = useState([]);
    const [summary, setSummary] = useState({
        gpa: 0,
        totalCredits: 0,
        semestersCount: 0,
        coursesCompleted: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchHistoryAndSummary = async () => {
            try {
                const [historyData, summaryData] = await Promise.all([
                    studentApi.getAcademicHistory(),
                    studentApi.getAcademicSummary().catch(() => null)
                ]);

                // Adjust based on typical DRF list/dict return forms
                let historyList = historyData.results || historyData.history || historyData || [];

                // If the backend returns a flat list, we should group it by semester to match UI expectations
                if (historyList.length > 0 && !historyList[0].hasOwnProperty('courses')) {
                    const grouped = historyList.reduce((acc, record) => {
                        const sem = record.semester || (typeof record.course === 'object' ? record.course?.semester : 'Unknown');
                        if (!acc[sem]) {
                            acc[sem] = { semester: sem, courses: [], gpa: 0 };
                        }

                        // formatting course
                        const cCode = typeof record.course === 'object' ? record.course?.code : `course-${record.course}`;
                        const cName = typeof record.course === 'object' ? record.course?.name : '-';
                        const credits = typeof record.course === 'object' ? (record.course?.credits || 0) : 0;

                        acc[sem].courses.push({
                            code: cCode,
                            name: cName,
                            grade: record.grade,
                            credits: Number(credits)
                        });
                        return acc;
                    }, {});

                    // Simple GPA calc for each semester group
                    const gradePointsMapping = { 'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7, 'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D': 1.0, 'F': 0.0 };
                    historyList = Object.values(grouped).map(sem => {
                        let tPts = 0, tCreds = 0;
                        sem.courses.forEach(c => {
                            if (gradePointsMapping[c.grade] && c.credits) {
                                tPts += gradePointsMapping[c.grade] * c.credits;
                                tCreds += c.credits;
                            }
                        });
                        sem.gpa = tCreds > 0 ? (tPts / tCreds).toFixed(2) : 0;
                        return sem;
                    });
                }

                setAcademicHistory(historyList);

                // Populate Summary
                if (summaryData) {
                    setSummary({
                        gpa: summaryData.overall_gpa || summaryData.gpa || 0,
                        totalCredits: summaryData.total_credits_earned || summaryData.total_credits || 0,
                        semestersCount: historyList.length,
                        coursesCompleted: historyList.reduce((acc, sem) => acc + (sem.courses?.length || 0), 0)
                    });
                } else {
                    // Fallback calc
                    const tCredits = historyList.reduce((acc, sem) => acc + sem.courses.reduce((sum, c) => sum + (c.credits || 0), 0), 0);
                    const cCount = historyList.reduce((acc, sem) => acc + (sem.courses?.length || 0), 0);
                    // Approximation of overall GPA from semester GPAs (not perfect, requires weighting, but close fallback)
                    let totalPt = 0, totalCr = 0;
                    historyList.forEach(sem => {
                        sem.courses.forEach(c => {
                            const gradePointsMapping = { 'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7, 'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D': 1.0, 'F': 0.0 };
                            if (gradePointsMapping[c.grade] && c.credits) {
                                totalPt += gradePointsMapping[c.grade] * c.credits;
                                totalCr += c.credits;
                            }
                        });
                    });

                    setSummary({
                        gpa: totalCr > 0 ? (totalPt / totalCr).toFixed(2) : 0,
                        totalCredits: tCredits,
                        semestersCount: historyList.length,
                        coursesCompleted: cCount
                    });
                }

            } catch (err) {
                console.error("Failed to fetch academic history", err);
                setError("Failed to load academic history.");
            } finally {
                setLoading(false);
            }
        };

        fetchHistoryAndSummary();
    }, []);

    const getBadgeClass = (grade) => {
        if (!grade) return 'badge badge-secondary';
        if (grade.startsWith('A')) return 'badge grade-A';
        if (grade.startsWith('B')) return 'badge grade-B';
        if (grade.startsWith('C')) return 'badge grade-C';
        if (grade.startsWith('F')) return 'badge grade-D';
        return 'badge badge-secondary';
    };

    return (
        <div>
            <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-gray-900)' }}>Academic Records</h2>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-gray-600)' }}>Complete academic history (Read-only)</p>
            </div>

            {error && (
                <div className="alert-error" style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '1rem', borderRadius: '0.5rem', marginBottom: '24px' }}>
                    <span className="font-medium">{error}</span>
                </div>
            )}

            {/* Overall Summary */}
            <div style={{
                background: 'white',
                borderRadius: 'var(--radius-xl)',
                boxShadow: 'var(--shadow-lg)',
                border: '1px solid var(--border-color)',
                padding: '24px',
                marginBottom: '24px'
            }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: 'var(--text-gray-900)', marginBottom: '16px' }}>Overall Academic Summary</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                    <StatsCard label="Cumulative GPA" value={summary.gpa} color="#a855f7" />
                    <StatsCard label="Total Credits" value={summary.totalCredits} color="#3b82f6" />
                    <StatsCard label="Semesters" value={summary.semestersCount} color="#10b981" />
                    <StatsCard label="Courses Completed" value={summary.coursesCompleted} color="#f97316" />
                </div>
            </div>

            {loading ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>Loading academic history...</div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {academicHistory.length > 0 ? academicHistory.map((semester, idx) => (
                        <div key={idx} className="table-container">
                            <div style={{
                                padding: '16px 24px',
                                background: '#faf5ff',
                                borderBottom: '1px solid var(--border-color)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}>
                                <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: 'var(--text-gray-900)' }}>{semester.semester}</h3>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--text-gray-600)' }}>Semester GPA</p>
                                    <p style={{ fontSize: '1.25rem', fontWeight: '700', color: '#9333ea' }}>{semester.gpa}</p>
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
                                        {semester.courses && semester.courses.length > 0 ? semester.courses.map((course, courseIdx) => (
                                            <tr key={courseIdx}>
                                                <td style={{ fontWeight: '500' }}>{course.code || '-'}</td>
                                                <td>{course.name || '-'}</td>
                                                <td>{course.credits || '-'}</td>
                                                <td>
                                                    <span className={getBadgeClass(course.grade)}>
                                                        {course.grade || 'N/A'}
                                                    </span>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="4" style={{ textAlign: 'center', padding: '1rem', color: '#6b7280' }}>No courses recorded.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div style={{ padding: '12px 24px', background: '#f9fafb', borderTop: '1px solid var(--border-color)' }}>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-gray-600)' }}>
                                    Total Credits: <span style={{ fontWeight: '500', color: 'var(--text-gray-900)' }}>
                                        {semester.courses ? semester.courses.reduce((sum, c) => sum + Number(c.credits || 0), 0) : 0}
                                    </span>
                                </p>
                            </div>
                        </div>
                    )) : (
                        <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280', background: 'white', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
                            No academic history records found.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function StatsCard({ label, value, color }) {
    return (
        <div style={{ background: color, borderRadius: 'var(--radius-lg)', padding: '16px', color: 'white', boxShadow: 'var(--shadow-md)' }}>
            <p style={{ fontSize: '0.875rem', marginBottom: '4px', opacity: 0.9 }}>{label}</p>
            <p style={{ fontSize: '1.5rem', fontWeight: '700' }}>{value}</p>
        </div>
    )
}
