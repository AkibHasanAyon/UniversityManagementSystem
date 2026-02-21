import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import { gradesApi } from '../../api/gradesApi';
import { studentApi } from '../../api/studentApi';
import '../../styles/StudentDashboard.css';

export function ViewGrades() {
    const [grades, setGrades] = useState([]);
    const [summary, setSummary] = useState({ gpa: 0, totalCredits: 0 });
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchGradesAndSummary = async () => {
            try {
                const [gradesData, summaryData] = await Promise.all([
                    gradesApi.listGrades('', 'current'),
                    studentApi.getAcademicSummary().catch(() => null) // Optional, fallback to local calc if fails
                ]);

                const fetchedGrades = gradesData.results || gradesData || [];
                setGrades(fetchedGrades);

                if (summaryData) {
                    setSummary({
                        gpa: summaryData.overall_gpa || summaryData.gpa || 0,
                        totalCredits: summaryData.total_credits_earned || 0
                    });
                } else {
                    // Local fallback calculation
                    const gradePoints = {
                        'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7,
                        'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D': 1.0, 'F': 0.0
                    };

                    let tPoints = 0;
                    let tCredits = 0;

                    fetchedGrades.forEach(g => {
                        const credits = typeof g.course === 'object' ? (g.course?.credits || 0) : 0;
                        const pt = gradePoints[g.grade] || 0;
                        if (credits > 0 && pt > 0) {
                            tPoints += (pt * credits);
                            tCredits += Number(credits);
                        }
                    });

                    setSummary({
                        gpa: tCredits > 0 ? (tPoints / tCredits).toFixed(2) : 0,
                        totalCredits: fetchedGrades.reduce((sum, g) => sum + Number((typeof g.course === 'object' ? g.course?.credits : 0) || 0), 0)
                    });
                }
            } catch (err) {
                console.error("Failed to load grades", err);
                setError("Failed to load your grades.");
            } finally {
                setLoading(false);
            }
        };

        fetchGradesAndSummary();
    }, []);

    const gradePointsMapping = {
        'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7,
        'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D': 1.0, 'F': 0.0
    };

    const getBadgeClass = (grade) => {
        if (!grade) return 'badge badge-secondary';
        if (grade.startsWith('A')) return 'badge grade-A';
        if (grade.startsWith('B')) return 'badge grade-B';
        if (grade.startsWith('C')) return 'badge grade-C';
        return 'badge grade-D'; // Includes F for simplicity in styling
    };

    const handleExport = async () => {
        setDownloading(true);
        try {
            const blob = await studentApi.downloadTranscript();
            // Create a URL for the blob
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Academic_Transcript.pdf');

            // Append to html code
            document.body.appendChild(link);
            link.click();

            // Clean up
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Failed to download transcript", err);
            alert("Failed to download transcript. Please try again later.");
        } finally {
            setDownloading(false);
        }
    };

    return (
        <div>
            <div style={{ marginBottom: '24px' }} className="flex justify-between items-center">
                <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-gray-900)' }}>View Grades</h2>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-gray-600)' }}>Your academic performance summary</p>
                </div>
                <button
                    onClick={handleExport}
                    disabled={downloading}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm disabled:opacity-50"
                    style={{ fontSize: '0.9rem' }}
                >
                    <Download size={18} />
                    {downloading ? 'Exporting...' : 'Export Transcript'}
                </button>
            </div>

            {error && (
                <div className="alert-error" style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '1rem', borderRadius: '0.5rem', marginBottom: '24px' }}>
                    <span className="font-medium">{error}</span>
                </div>
            )}

            {/* GPA Card */}
            <div className="gpa-card">
                <div className="gpa-header">
                    <div>
                        <p className="gpa-label">Current / Overall GPA</p>
                        <p className="gpa-value">{summary.gpa}</p>
                        <p className="gpa-label" style={{ fontSize: '0.875rem', marginTop: '8px' }}>Accumulated over semesters</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <p className="gpa-label" style={{ fontSize: '0.875rem' }}>Total Credits Earned</p>
                        <p style={{ fontSize: '1.5rem', fontWeight: '700' }}>{summary.totalCredits}</p>
                    </div>
                </div>
            </div>

            {/* Grades Table */}
            <div className="table-container">
                {loading ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>Loading grades...</div>
                ) : (
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
                                {grades.length > 0 ? grades.map((gradeRow, index) => {
                                    const cCode = typeof gradeRow.course === 'object' ? gradeRow.course?.code : `Course ID: ${gradeRow.course}`;
                                    const cName = typeof gradeRow.course === 'object' ? gradeRow.course?.name : '-';
                                    const credits = typeof gradeRow.course === 'object' ? gradeRow.course?.credits : '-';
                                    const semester = gradeRow.semester || (typeof gradeRow.course === 'object' ? gradeRow.course?.semester : '-');

                                    const pt = gradePointsMapping[gradeRow.grade] !== undefined
                                        ? gradePointsMapping[gradeRow.grade].toFixed(1)
                                        : '-';

                                    return (
                                        <tr key={gradeRow.id || index}>
                                            <td style={{ fontWeight: '500' }}>{cCode}</td>
                                            <td>{cName}</td>
                                            <td>{credits}</td>
                                            <td>
                                                <span className={getBadgeClass(gradeRow.grade)}>
                                                    {gradeRow.grade || 'N/A'}
                                                </span>
                                            </td>
                                            <td>{pt}</td>
                                            <td className="text-muted">{semester}</td>
                                        </tr>
                                    );
                                }) : (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                                            No grades found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <StatsCard label="Total Courses Graded" value={grades.filter(g => g.grade).length} gradient="linear-gradient(to bottom right, #3b82f6, #06b6d4)" />
                <StatsCard label="Cumulative GPA" value={summary.gpa} gradient="linear-gradient(to bottom right, #10b981, #14b8a6)" />
                <StatsCard label="Credits Earned" value={summary.totalCredits} gradient="linear-gradient(to bottom right, #a855f7, #ec4899)" />
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
