import React, { useState } from 'react';
import { Search } from 'lucide-react';
import '../../styles/Dashboard.css';

export function ViewRecords() {
    const [records] = useState([
        { studentId: 'STU001', studentName: 'Ayesha Siddiqua', courseCode: 'CS301', courseName: 'Database Systems', grade: 'A', semester: 'Fall 2025', credits: 3 },
        { studentId: 'STU001', studentName: 'Ayesha Siddiqua', courseCode: 'MATH201', courseName: 'Linear Algebra', grade: 'A-', semester: 'Fall 2025', credits: 4 },
        { studentId: 'STU001', studentName: 'Ayesha Siddiqua', courseCode: 'PHY101', courseName: 'Physics I', grade: 'B+', semester: 'Spring 2025', credits: 4 },
        { studentId: 'STU002', studentName: 'Rahim Ahmed', courseCode: 'MATH201', courseName: 'Linear Algebra', grade: 'A', semester: 'Fall 2025', credits: 4 },
        { studentId: 'STU002', studentName: 'Rahim Ahmed', courseCode: 'CS301', courseName: 'Database Systems', grade: 'A', semester: 'Fall 2025', credits: 3 },
        { studentId: 'STU003', studentName: 'Sadia Islam', courseCode: 'PHY101', courseName: 'Physics I', grade: 'A', semester: 'Fall 2025', credits: 4 },
        { studentId: 'STU003', studentName: 'Sadia Islam', courseCode: 'MATH201', courseName: 'Linear Algebra', grade: 'A', semester: 'Spring 2025', credits: 4 },
        { studentId: 'STU004', studentName: 'Karim Uddin', courseCode: 'ENG202', courseName: 'Technical Writing', grade: 'B', semester: 'Fall 2025', credits: 3 },
        { studentId: 'STU005', studentName: 'Fatema Begum', courseCode: 'CS302', courseName: 'Algorithms', grade: 'A-', semester: 'Fall 2025', credits: 3 },
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterSemester, setFilterSemester] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const filteredRecords = records.filter(record => {
        const matchesSearch =
            record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            record.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            record.courseCode.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesSemester = !filterSemester || record.semester === filterSemester;

        return matchesSearch && matchesSemester;
    });

    const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
    const paginatedRecords = filteredRecords.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const semesters = Array.from(new Set(records.map(r => r.semester)));

    const getBadgeClass = (grade) => {
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
                            {paginatedRecords.map((record, index) => (
                                <tr key={index}>
                                    <td className="font-medium">{record.studentId}</td>
                                    <td>{record.studentName}</td>
                                    <td className="font-medium">{record.courseCode}</td>
                                    <td className="text-muted">{record.courseName}</td>
                                    <td>
                                        <span className={getBadgeClass(record.grade)}>
                                            {record.grade}
                                        </span>
                                    </td>
                                    <td>{record.credits}</td>
                                    <td className="text-muted">{record.semester}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
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
            </div>
        </div>
    );
}
