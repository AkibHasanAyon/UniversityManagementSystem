import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Search } from 'lucide-react';
import { usersApi } from '../../api/usersApi';
import { academicApi } from '../../api/academicApi';
import '../../styles/Dashboard.css';

export function StudentEnrollment() {
    const [enrollments, setEnrollments] = useState([]);
    const [students, setStudents] = useState([]);
    const [courses, setCourses] = useState([]);

    const [selectedStudent, setSelectedStudent] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [stuRes, corRes, enrRes] = await Promise.all([
                usersApi.listStudents('', 1, 500), // Get all active students for dropdown
                academicApi.listCourses(),
                academicApi.listEnrollments()
            ]);

            setStudents(stuRes.results || stuRes || []);
            setCourses(corRes.results || corRes || []);
            setEnrollments(enrRes.results || enrRes || []);
        } catch (err) {
            console.error("Failed to load enrollment data", err);
            setError("Failed to load initial data. Please try again.");
        }
    };

    const handleEnroll = async (e) => {
        e.preventDefault();
        if (!selectedStudent || !selectedCourse) return;

        setLoading(true);
        setError('');

        try {
            await academicApi.enrollStudent(selectedCourse, selectedStudent);

            // Reset selection and refresh enrollments
            setSelectedStudent('');
            setSelectedCourse('');
            fetchData();
        } catch (err) {
            console.error("Failed to enroll student", err);
            setError(err.response?.data?.detail || "Failed to enroll student. They might already be enrolled.");
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (id) => {
        if (window.confirm('Are you sure you want to remove this enrollment?')) {
            try {
                await academicApi.dropCourse(id);
                fetchData();
            } catch (err) {
                console.error("Failed to remove enrollment", err);
                alert("Failed to drop course. Please try again.");
            }
        }
    };

    const filteredEnrollments = enrollments.filter(enroll => {
        const studentStr = typeof enroll.student === 'object'
            ? `${enroll.student?.first_name} ${enroll.student?.last_name} ${enroll.student?.email}`
            : String(enroll.student);

        const courseStr = typeof enroll.course === 'object'
            ? `${enroll.course?.code} ${enroll.course?.name}`
            : String(enroll.course);

        const searchLower = searchTerm.toLowerCase();
        return studentStr.toLowerCase().includes(searchLower) || courseStr.toLowerCase().includes(searchLower);
    });

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-xl font-bold">Student Enrollment</h2>
                <p className="text-gray-600 font-sm">Assign students to courses</p>
            </div>

            {error && (
                <div className="alert-error mb-6" style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '1rem', borderRadius: '0.5rem' }}>
                    <span className="font-medium">{error}</span>
                </div>
            )}

            {/* Enrollment Form */}
            <div className="card mb-6 p-6">
                <h3 className="text-lg font-bold mb-4">New Enrollment</h3>
                <form onSubmit={handleEnroll} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div className="form-group">
                        <label className="block text-sm font-medium mb-1">Select Student</label>
                        <select
                            value={selectedStudent}
                            onChange={(e) => setSelectedStudent(e.target.value)}
                            className="input-field w-full"
                            required
                        >
                            <option value="">-- Select Student --</option>
                            {students.map(s => (
                                <option key={s.id} value={s.id}>{s.first_name} {s.last_name} ({s.email})</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="block text-sm font-medium mb-1">Select Course</label>
                        <select
                            value={selectedCourse}
                            onChange={(e) => setSelectedCourse(e.target.value)}
                            className="input-field w-full"
                            required
                        >
                            <option value="">-- Select Course --</option>
                            {courses.map(c => (
                                <option key={c.id} value={c.id}>{c.code} - {c.name}</option>
                            ))}
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="btn-primary flex justify-center items-center gap-2 h-10"
                        disabled={!selectedStudent || !selectedCourse || loading}
                    >
                        <Plus size={18} />
                        {loading ? 'Enrolling...' : 'Enroll Student'}
                    </button>
                </form>
            </div>

            {/* Search Bar */}
            <div className="card mb-6 p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by student, ID, or course code..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input-field pl-10 w-full"
                    />
                </div>
            </div>

            {/* Enrollments Table */}
            <div className="table-container">
                <div className="table-wrapper">
                    <table className="data-table w-full">
                        <thead>
                            <tr>
                                <th className="text-left">Student Information</th>
                                <th className="text-left">Course Information</th>
                                <th className="text-left">Status</th>
                                <th className="text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEnrollments.length > 0 ? (
                                filteredEnrollments.map((enroll) => {
                                    const studentName = typeof enroll.student === 'object'
                                        ? `${enroll.student?.first_name} ${enroll.student?.last_name}`
                                        : `Student ID: ${enroll.student}`;

                                    const courseName = typeof enroll.course === 'object'
                                        ? `${enroll.course?.code} - ${enroll.course?.name}`
                                        : `Course ID: ${enroll.course}`;

                                    return (
                                        <tr key={enroll.id}>
                                            <td className="font-medium">{studentName}</td>
                                            <td className="font-medium">{courseName}</td>
                                            <td className="text-gray-600">{enroll.status || 'Active'}</td>
                                            <td className="text-center">
                                                <button
                                                    onClick={() => handleRemove(enroll.id)}
                                                    className="text-red-500 hover:text-red-700 transition-colors p-1"
                                                    title="Remove Enrollment"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center py-4 text-gray-500">
                                        No enrollments found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
