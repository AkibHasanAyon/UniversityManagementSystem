import React, { useState, useEffect, useMemo } from 'react';
import { Search } from 'lucide-react';
import { gradesApi } from '../../api/gradesApi';
import '../../styles/Dashboard.css';

export function ViewRecords() {
    const [records, setRecords] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterSemester, setFilterSemester] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const itemsPerPage = 8;

    useEffect(() => {
        fetchRecords();
    }, []);

    const fetchRecords = async () => {
        try {
            const data = await gradesApi.getAcademicRecords();
            setRecords(data.results || data || []);
        } catch (err) {
            console.error("Failed to fetch records", err);
            setError("Failed to load academic records.");
        } finally {
            setLoading(false);
        }
    };

    const filteredRecords = useMemo(() => {
        return records.filter(record => {
            const studentStr = typeof record.student === 'object'
                ? `${record.student?.first_name} ${record.student?.last_name} ${record.student?.email}`
                : String(record.student || '');

            const courseStr = typeof record.course === 'object'
                ? `${record.course?.code} ${record.course?.name}`
                : String(record.course || '');

            const searchLower = searchTerm.toLowerCase();
            const matchesSearch = studentStr.toLowerCase().includes(searchLower) || courseStr.toLowerCase().includes(searchLower);

            // Access semester either from record itself or from the nested course
            const recordSemester = record.semester || (typeof record.course === 'object' ? record.course?.semester : '');
            const matchesSemester = !filterSemester || recordSemester === filterSemester;

            return matchesSearch && matchesSemester;
        });
    }, [records, searchTerm, filterSemester]);

    const totalPages = Math.ceil(filteredRecords.length / itemsPerPage) || 1;
    const paginatedRecords = useMemo(() => {
        return filteredRecords.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
        );
    }, [filteredRecords, currentPage, itemsPerPage]);

    const semesters = useMemo(() => {
        const sems = new Set();
        records.forEach(r => {
            const s = r.semester || (typeof r.course === 'object' ? r.course?.semester : null);
            if (s) sems.add(s);
        });
        return Array.from(sems);
    }, [records]);

    const getBadgeClass = (grade) => {
        if (!grade) return 'badge badge-secondary';
        if (grade.startsWith('A')) return 'badge badge-success';
        if (grade.startsWith('B')) return 'badge badge-primary';
        if (grade.startsWith('C')) return 'badge badge-warning';
        if (grade.startsWith('F')) return 'badge badge-danger';
        return 'badge badge-secondary'; // for P, W, etc.
    };

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-xl font-bold">Academic Records</h2>
                <p className="text-gray-600 font-sm">View student grades and academic history (Read-only)</p>
            </div>

            {error && (
                <div className="alert-error mb-6" style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '1rem', borderRadius: '0.5rem' }}>
                    <span className="font-medium">{error}</span>
                </div>
            )}

            {/* Filters */}
            <div className="card mb-6 p-4">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by student name, ID, or course..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input-field pl-10"
                        />
                    </div>

                    <select
                        value={filterSemester}
                        onChange={(e) => setFilterSemester(e.target.value)}
                        className="input-field"
                    >
                        <option value="">All Semesters</option>
                        {semesters.map(sem => (
                            <option key={sem} value={sem}>{sem}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Records Table */}
            <div className="table-container">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading records...</div>
                ) : (
                    <div className="table-wrapper">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Student Information</th>
                                    <th>Course Information</th>
                                    <th>Grade</th>
                                    <th>Credits</th>
                                    <th>Semester</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedRecords.length > 0 ? paginatedRecords.map((record, index) => {
                                    const studentName = typeof record.student === 'object'
                                        ? `${record.student?.first_name} ${record.student?.last_name}`
                                        : `Student ID: ${record.student}`;

                                    const courseName = typeof record.course === 'object'
                                        ? `${record.course?.code} - ${record.course?.name}`
                                        : `Course ID: ${record.course}`;

                                    const credits = typeof record.course === 'object' ? record.course?.credits : '-';
                                    const semester = record.semester || (typeof record.course === 'object' ? record.course?.semester : '-');

                                    return (
                                        <tr key={record.id || index}>
                                            <td className="font-medium">{studentName}</td>
                                            <td className="font-medium">{courseName}</td>
                                            <td>
                                                <span className={getBadgeClass(record.grade || record.status)}>
                                                    {record.grade || record.status || 'N/A'}
                                                </span>
                                            </td>
                                            <td>{credits}</td>
                                            <td className="text-muted">{semester}</td>
                                        </tr>
                                    );
                                }) : (
                                    <tr>
                                        <td colSpan="5" className="text-center p-4 text-gray-500">
                                            No records found matching your filters.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {filteredRecords.length > itemsPerPage && (
                    <div className="pagination p-4 flex-between-center border-t">
                        <div className="text-sm text-gray-600">
                            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredRecords.length)} of {filteredRecords.length} records
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                className="btn-outline text-sm"
                            >
                                Previous
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`btn-sm ${page === currentPage ? 'btn-primary' : 'btn-outline'}`}
                                >
                                    {page}
                                </button>
                            ))}
                            <button
                                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                                className="btn-outline text-sm"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
