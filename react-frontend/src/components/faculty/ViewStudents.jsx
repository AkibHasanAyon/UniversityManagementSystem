import React, { useState, useEffect, useMemo } from 'react';
import { Search } from 'lucide-react';
import { academicApi } from '../../api/academicApi';
import '../../styles/Dashboard.css';

export function ViewStudents() {
    const [enrollments, setEnrollments] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCourse, setFilterCourse] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                // Assuming the backend filters enrollments to only show students in this faculty's courses
                const data = await academicApi.listEnrollments();
                setEnrollments(data.results || data || []);
            } catch (err) {
                console.error("Failed to load students", err);
                setError("Failed to load enrolled students.");
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, []);

    const filteredStudents = useMemo(() => {
        return enrollments.filter(enroll => {
            const studentStr = typeof enroll.student === 'object'
                ? `${enroll.student?.first_name} ${enroll.student?.last_name} ${enroll.student?.email}`
                : String(enroll.student || '');

            const courseStr = typeof enroll.course === 'object'
                ? `${enroll.course?.code} ${enroll.course?.name}`
                : String(enroll.course || '');

            const searchLower = searchTerm.toLowerCase();
            const matchesSearch = studentStr.toLowerCase().includes(searchLower) || courseStr.toLowerCase().includes(searchLower);

            const courseCode = typeof enroll.course === 'object' ? enroll.course?.code : enroll.course;
            const matchesCourse = !filterCourse || courseCode === filterCourse;

            return matchesSearch && matchesCourse;
        });
    }, [enrollments, searchTerm, filterCourse]);

    const coursesList = useMemo(() => {
        const cSet = new Set();
        enrollments.forEach(enroll => {
            const cCode = typeof enroll.course === 'object' ? enroll.course?.code : enroll.course;
            if (cCode) cSet.add(cCode);
        });
        return Array.from(cSet);
    }, [enrollments]);

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-xl font-bold">View Students</h2>
                <p className="text-gray-600 font-sm">Students enrolled in your courses</p>
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
                            placeholder="Search by name, email, or course..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input-field pl-10"
                        />
                    </div>

                    <select
                        value={filterCourse}
                        onChange={(e) => setFilterCourse(e.target.value)}
                        className="input-field"
                    >
                        <option value="">All Courses</option>
                        {coursesList.map(course => (
                            <option key={course} value={course}>{course}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Students Table */}
            <div className="table-container">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading students...</div>
                ) : (
                    <div className="table-wrapper">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Student Name</th>
                                    <th>Email</th>
                                    <th>Course</th>
                                    <th>Enrollment Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStudents.length > 0 ? filteredStudents.map((enroll, index) => {
                                    const studentName = typeof enroll.student === 'object'
                                        ? `${enroll.student?.first_name} ${enroll.student?.last_name}`
                                        : `Student ID: ${enroll.student}`;
                                    const studentEmail = typeof enroll.student === 'object' ? enroll.student?.email : 'N/A';

                                    const courseName = typeof enroll.course === 'object'
                                        ? `${enroll.course?.code} - ${enroll.course?.name}`
                                        : `Course ID: ${enroll.course}`;

                                    return (
                                        <tr key={enroll.id || index}>
                                            <td className="font-medium">{studentName}</td>
                                            <td className="text-muted">{studentEmail}</td>
                                            <td>{courseName}</td>
                                            <td className="text-muted">
                                                {enroll.enrollment_date
                                                    ? new Date(enroll.enrollment_date).toLocaleDateString()
                                                    : 'N/A'
                                                }
                                            </td>
                                        </tr>
                                    );
                                }) : (
                                    <tr>
                                        <td colSpan="4" className="text-center p-4 text-gray-500">
                                            No students found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
