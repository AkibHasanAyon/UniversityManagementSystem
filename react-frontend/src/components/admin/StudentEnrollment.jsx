import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Search } from 'lucide-react';
import api from '../../services/api';
import '../../styles/Dashboard.css';

export function StudentEnrollment() {
    const [enrollments, setEnrollments] = useState([]);
    const [studentsList, setStudentsList] = useState([]);
    const [coursesList, setCoursesList] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [stuRes, courseRes, enrollRes] = await Promise.all([
                api.get('/api/users/students/', { params: { page_size: 100 } }),
                api.get('/api/academic/courses/', { params: { page_size: 100 } }),
                api.get('/api/academic/enrollments/'),
            ]);

            const stuData = stuRes.data.data || stuRes.data;
            setStudentsList((stuData.results || stuData).map(s => ({
                id: s.student_id || s.id,
                name: s.name,
            })));

            const courseData = courseRes.data.data || courseRes.data;
            setCoursesList((courseData.results || courseData).map(c => ({
                code: c.code,
                name: c.name,
                semester: c.semester || '',
                instructor: c.instructor_name || c.instructor || '',
            })));

            const enrollData = enrollRes.data.data || enrollRes.data;
            const enrollArr = enrollData.results || enrollData;
            setEnrollments(Array.isArray(enrollArr) ? enrollArr.map(e => ({
                id: e.id,
                studentName: e.studentName || e.student_name || '',
                studentId: e.studentId || e.student_id || '',
                courseCode: e.courseCode || e.course_code || '',
                courseName: e.courseName || e.course_name || '',
                semester: e.semester || '',
                instructor: e.instructor || e.instructor_name || '',
            })) : []);
        } catch (err) {
            console.error('Failed to load enrollment data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleEnroll = async (e) => {
        e.preventDefault();
        if (!selectedStudent || !selectedCourse) return;

        setSubmitting(true);
        try {
            await api.post('/api/academic/enrollments/', {
                student_id: selectedStudent,
                course_code: selectedCourse,
            });
            setSelectedStudent('');
            setSelectedCourse('');
            loadData();
        } catch (err) {
            alert('Enrollment failed: ' + (err.response?.data?.message || err.response?.data?.detail || JSON.stringify(err.response?.data) || err.message));
        } finally {
            setSubmitting(false);
        }
    };

    const handleRemove = async (id) => {
        if (window.confirm('Are you sure you want to remove this enrollment?')) {
            try {
                await api.delete(`/api/academic/enrollments/${id}/`);
                loadData();
            } catch (err) {
                alert('Failed to remove enrollment: ' + (err.response?.data?.message || err.message));
            }
        }
    };

    const filteredEnrollments = enrollments.filter(enroll =>
        enroll.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enroll.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enroll.courseCode.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="text-center py-8">Loading...</div>;

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-xl font-bold">Student Enrollment</h2>
                <p className="text-gray-600 font-sm">Assign students to courses</p>
            </div>

            <div className="card mb-6 p-6">
                <h3 className="text-lg font-bold mb-4">New Enrollment</h3>
                <form onSubmit={handleEnroll} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div className="form-group">
                        <label className="block text-sm font-medium mb-1">Select Student</label>
                        <select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)} className="input-field w-full" required>
                            <option value="">-- Select Student --</option>
                            {studentsList.map(s => (
                                <option key={s.id} value={s.id}>{s.name} ({s.id})</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="block text-sm font-medium mb-1">Select Course</label>
                        <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} className="input-field w-full" required>
                            <option value="">-- Select Course --</option>
                            {coursesList.map(c => (
                                <option key={c.code} value={c.code}>{c.name} ({c.code})</option>
                            ))}
                        </select>
                    </div>
                    <button type="submit" className="btn-primary flex justify-center items-center gap-2 h-10" disabled={!selectedStudent || !selectedCourse || submitting}>
                        <Plus size={18} />
                        {submitting ? 'Enrolling...' : 'Enroll Student'}
                    </button>
                </form>
            </div>

            <div className="card mb-6 p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                    <input type="text" placeholder="Search by student, ID, or course code..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="input-field pl-10 w-full" />
                </div>
            </div>

            <div className="table-container">
                <div className="table-wrapper">
                    <table className="data-table w-full">
                        <thead>
                            <tr>
                                <th className="text-left">Student Name</th>
                                <th className="text-left">Student ID</th>
                                <th className="text-left">Course Code</th>
                                <th className="text-left">Course Name</th>
                                <th className="text-left">Semester</th>
                                <th className="text-left">Instructor</th>
                                <th className="text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEnrollments.length > 0 ? (
                                filteredEnrollments.map((enroll) => (
                                    <tr key={enroll.id}>
                                        <td className="font-medium">{enroll.studentName}</td>
                                        <td className="text-gray-600">{enroll.studentId}</td>
                                        <td className="font-medium">{enroll.courseCode}</td>
                                        <td>{enroll.courseName}</td>
                                        <td className="text-gray-600">{enroll.semester}</td>
                                        <td>{enroll.instructor}</td>
                                        <td className="text-center">
                                            <button onClick={() => handleRemove(enroll.id)} className="text-red-500 hover:text-red-700 transition-colors p-1" title="Remove Enrollment">
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center py-4 text-gray-500">No enrollments found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
