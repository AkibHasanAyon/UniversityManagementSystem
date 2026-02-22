import React, { useState, useEffect, useCallback } from 'react';
import { Search } from 'lucide-react';
import api from '../../services/api';
import '../../styles/Dashboard.css';

export function ViewRecords() {
    const [records, setRecords] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterSemester, setFilterSemester] = useState('');
    const [semesters, setSemesters] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const itemsPerPage = 10;

    const fetchRecords = useCallback(async () => {
        setLoading(true);
        try {
            const params = {
                search: searchTerm,
                page: currentPage,
                page_size: itemsPerPage,
            };
            if (filterSemester) params.semester = filterSemester;

            const res = await api.get('/api/academic/records/', { params });
            const data = res.data.data || res.data;
            const results = data.results || data;
            setRecords(Array.isArray(results) ? results : []);
            setTotalCount(res.data.pagination?.count ?? data.count ?? (Array.isArray(results) ? results.length : 0));

            // Extract unique semesters
            if (semesters.length === 0 && Array.isArray(results) && results.length > 0) {
                const uniqueSems = [...new Set(results.map(r => r.semester).filter(Boolean))];
                if (uniqueSems.length > 0) setSemesters(uniqueSems);
            }
        } catch (err) {
            console.error('Failed to fetch records:', err);
        } finally {
            setLoading(false);
        }
    }, [searchTerm, currentPage, filterSemester]);

    useEffect(() => { fetchRecords(); }, [fetchRecords]);
    useEffect(() => { setCurrentPage(1); }, [searchTerm, filterSemester]);

    const totalPages = Math.ceil(totalCount / itemsPerPage);

    const getBadgeClass = (grade) => {
        if (!grade) return 'badge';
        if (grade.startsWith('A')) return 'badge badge-success';
        if (grade.startsWith('B')) return 'badge badge-primary';
        if (grade.startsWith('C')) return 'badge badge-warning';
        return 'badge badge-danger';
    };

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-xl font-bold">Academic Records</h2>
                <p className="text-gray-600 font-sm">View student grades and academic history (Read-only)</p>
            </div>

            <div className="card mb-6 p-4">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                        <input type="text" placeholder="Search by student name, ID, or course..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="input-field pl-10" />
                    </div>
                    <select value={filterSemester} onChange={(e) => setFilterSemester(e.target.value)} className="input-field">
                        <option value="">All Semesters</option>
                        {semesters.map(sem => (
                            <option key={sem} value={sem}>{sem}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="table-container">
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Student ID</th>
                                <th>Student Name</th>
                                <th>Course Code</th>
                                <th>Course Name</th>
                                <th>Grade</th>
                                <th>Credits</th>
                                <th>Semester</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="7" className="text-center py-4">Loading...</td></tr>
                            ) : records.length === 0 ? (
                                <tr><td colSpan="7" className="text-center py-4 text-gray-500">No records found.</td></tr>
                            ) : (
                                records.map((record, index) => (
                                    <tr key={index}>
                                        <td className="font-medium">{record.student_id || record.studentId}</td>
                                        <td>{record.student_name || record.studentName}</td>
                                        <td className="font-medium">{record.course_code || record.courseCode}</td>
                                        <td className="text-muted">{record.course_name || record.courseName}</td>
                                        <td>
                                            <span className={getBadgeClass(record.grade)}>
                                                {record.grade}
                                            </span>
                                        </td>
                                        <td>{record.credits}</td>
                                        <td className="text-muted">{record.semester}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {totalCount > 0 && (
                    <div className="pagination p-4 flex-between-center border-t">
                        <div className="text-sm text-gray-600">
                            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} records
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="btn-outline text-sm">Previous</button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button key={page} onClick={() => setCurrentPage(page)} className={`btn-sm ${page === currentPage ? 'btn-primary' : 'btn-outline'}`}>{page}</button>
                            ))}
                            <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="btn-outline text-sm">Next</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
