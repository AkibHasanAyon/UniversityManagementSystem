import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import api from '../../services/api';
import '../../styles/Dashboard.css';

export function ViewStudents() {
    const [students, setStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCourse, setFilterCourse] = useState('');
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        api.get('/api/academic/enrollments/')
            .then(res => {
                const data = res.data.data || res.data;
                const results = data.results || data;
                const mapped = Array.isArray(results) ? results.map(e => ({
                    id: e.studentId || e.student_id || '',
                    name: e.studentName || e.student_name || '',
                    email: e.student_email || e.email || '',
                    course: `${e.courseCode || e.course_code || ''} - ${e.courseName || e.course_name || ''}`,
                    enrollmentDate: e.enrollment_date || e.enrollmentDate || '',
                })) : [];
                setStudents(mapped);

                const uniqueCourses = [...new Set(mapped.map(s => s.course).filter(Boolean))];
                setCourses(uniqueCourses);
            })
            .catch(err => console.error('Failed to load students:', err))
            .finally(() => setLoading(false));
    }, []);

    const filteredStudents = students.filter(student => {
        const matchesSearch =
            student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCourse = !filterCourse || student.course === filterCourse;
        return matchesSearch && matchesCourse;
    });

    if (loading) return <div className="text-center py-8">Loading...</div>;

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-xl font-bold">View Students</h2>
                <p className="text-gray-600 font-sm">Students enrolled in your courses</p>
            </div>

            <div className="card mb-6 p-4">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                        <input type="text" placeholder="Search by name, email, or ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="input-field pl-10" />
                    </div>
                    <select value={filterCourse} onChange={(e) => setFilterCourse(e.target.value)} className="input-field">
                        <option value="">All Courses</option>
                        {courses.map(course => (
                            <option key={course} value={course}>{course}</option>
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
                                <th>Name</th>
                                <th>Email</th>
                                <th>Course</th>
                                <th>Enrollment Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.length === 0 ? (
                                <tr><td colSpan="5" className="text-center py-4 text-gray-500">No students found.</td></tr>
                            ) : (
                                filteredStudents.map((student, idx) => (
                                    <tr key={`${student.id}-${idx}`}>
                                        <td className="font-medium">{student.id}</td>
                                        <td>{student.name}</td>
                                        <td className="text-muted">{student.email}</td>
                                        <td>{student.course}</td>
                                        <td className="text-muted">{student.enrollmentDate}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
