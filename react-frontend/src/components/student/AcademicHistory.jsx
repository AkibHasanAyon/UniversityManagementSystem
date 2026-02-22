import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import api from '../../services/api';
import '../../styles/StudentDashboard.css';

export function AcademicHistory() {
    const [academicHistory, setAcademicHistory] = useState([]);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);

    const getBadgeClass = (grade) => {
        if (!grade) return 'badge';
        if (grade.startsWith('A')) return 'badge grade-A';
        if (grade.startsWith('B')) return 'badge grade-B';
        if (grade.startsWith('C')) return 'badge grade-C';
        return 'badge grade-D';
    };

    const handleDownloadTranscript = async () => {
        setDownloading(true);
        try {
            const res = await api.get('/api/academic/transcript/', {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'transcript.pdf');
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Failed to download transcript:', err);
            alert('Failed to download transcript. Please try again.');
        } finally {
            setDownloading(false);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                // Fetch history
                const histRes = await api.get('/api/academic/history/');
                const histData = histRes.data.data || histRes.data;
                const histArr = histData.results || histData;

                if (Array.isArray(histArr)) {
                    setAcademicHistory(histArr.map(sem => ({
                        semester: sem.semester,
                        gpa: sem.gpa || sem.semester_gpa || 0,
                        courses: (sem.courses || []).map(c => ({
                            code: c.course_code || c.code || '',
                            name: c.course_name || c.name || '',
                            grade: c.grade,
                            credits: c.credits || 0,
                        })),
                    })));
                }

                // Fetch summary
                try {
                    const sumRes = await api.get('/api/academic/history/summary/');
                    const sumData = sumRes.data.data || sumRes.data;
                    setSummary({
                        cumulativeGpa: sumData.cumulative_gpa ?? sumData.gpa ?? 'N/A',
                        totalCredits: sumData.total_credits ?? 0,
                        totalSemesters: sumData.total_semesters ?? sumData.semesters ?? 0,
                        totalCourses: sumData.total_courses ?? sumData.courses_completed ?? 0,
                    });
                } catch {
                    // Compute summary from history if endpoint not available
                    if (Array.isArray(histArr) && histArr.length > 0) {
                        const allCourses = histArr.flatMap(s => s.courses || []);
                        setSummary({
                            cumulativeGpa: 'N/A',
                            totalCredits: allCourses.reduce((sum, c) => sum + (c.credits || 0), 0),
                            totalSemesters: histArr.length,
                            totalCourses: allCourses.length,
                        });
                    }
                }
            } catch (err) {
                console.error('Failed to load academic history:', err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    if (loading) return <div className="text-center py-8">Loading...</div>;

    return (
        <div>
            <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-gray-900)' }}>Academic Records</h2>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-gray-600)' }}>Complete academic history (Read-only)</p>
                </div>
                <button
                    onClick={handleDownloadTranscript}
                    disabled={downloading}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 20px',
                        background: 'linear-gradient(135deg, #a855f7, #9333ea)',
                        color: 'white',
                        border: 'none',
                        borderRadius: 'var(--radius-lg)',
                        fontWeight: '600',
                        fontSize: '0.875rem',
                        cursor: downloading ? 'not-allowed' : 'pointer',
                        opacity: downloading ? 0.7 : 1,
                        boxShadow: '0 4px 12px rgba(168, 85, 247, 0.3)',
                        transition: 'all 0.2s',
                    }}
                    onMouseOver={(e) => { if (!downloading) e.target.style.transform = 'translateY(-1px)'; }}
                    onMouseOut={(e) => { e.target.style.transform = 'translateY(0)'; }}
                >
                    <Download size={16} />
                    {downloading ? 'Downloading...' : 'Download Transcript'}
                </button>
            </div>

            {/* Overall Summary */}
            {summary && (
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
                        <StatsCard label="Cumulative GPA" value={summary.cumulativeGpa} color="#a855f7" />
                        <StatsCard label="Total Credits" value={summary.totalCredits} color="#3b82f6" />
                        <StatsCard label="Semesters" value={summary.totalSemesters} color="#10b981" />
                        <StatsCard label="Courses Completed" value={summary.totalCourses} color="#f97316" />
                    </div>
                </div>
            )}

            {/* Semester by Semester */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {academicHistory.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">No academic history available.</div>
                ) : (
                    academicHistory.map((semester, idx) => (
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
                                        {semester.courses.map((course, courseIdx) => (
                                            <tr key={courseIdx}>
                                                <td style={{ fontWeight: '500' }}>{course.code}</td>
                                                <td>{course.name}</td>
                                                <td>{course.credits}</td>
                                                <td>
                                                    <span className={getBadgeClass(course.grade)}>{course.grade}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div style={{ padding: '12px 24px', background: '#f9fafb', borderTop: '1px solid var(--border-color)' }}>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-gray-600)' }}>
                                    Total Credits: <span style={{ fontWeight: '500', color: 'var(--text-gray-900)' }}>{semester.courses.reduce((sum, c) => sum + (Number(c.credits) || 0), 0)}</span>
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
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
