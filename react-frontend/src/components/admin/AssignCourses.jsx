import React, { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import api from '../../services/api';
import '../../styles/Dashboard.css';

export function AssignCourses() {
    const [assignments, setAssignments] = useState([]);
    const [facultyList, setFacultyList] = useState([]);
    const [coursesList, setCoursesList] = useState([]);
    const [selectedFaculty, setSelectedFaculty] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [facRes, courseRes, assignRes] = await Promise.all([
                api.get('/api/users/faculty/', { params: { page_size: 100 } }),
                api.get('/api/academic/courses/', { params: { page_size: 100 } }),
                api.get('/api/academic/assignments/'),
            ]);

            const facData = facRes.data.data || facRes.data;
            setFacultyList((facData.results || facData).map(f => ({
                id: f.faculty_id || f.id,
                name: f.name,
            })));

            const courseData = courseRes.data.data || courseRes.data;
            setCoursesList((courseData.results || courseData).map(c => ({
                id: c.id,
                code: c.code,
                name: c.name,
            })));

            const assignData = assignRes.data.data || assignRes.data;
            const assignArr = assignData.results || assignData;
            setAssignments(Array.isArray(assignArr) ? assignArr.map(a => ({
                facultyId: a.facultyId || a.faculty_id || '',
                facultyName: a.facultyName || a.faculty_name || '',
                courseCode: a.courseCode || a.course_code || '',
                courseName: a.courseName || a.course_name || '',
            })) : []);
        } catch (err) {
            console.error('Failed to load data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAssign = async (e) => {
        e.preventDefault();
        if (!selectedFaculty || !selectedCourse) return;
        setSubmitting(true);

        try {
            const course = coursesList.find(c => String(c.id) === selectedCourse || c.code === selectedCourse);
            await api.post('/api/academic/assignments/', {
                faculty_id: selectedFaculty,
                course_code: course?.code || selectedCourse,
            });

            setSelectedFaculty('');
            setSelectedCourse('');
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
            loadData();
        } catch (err) {
            alert('Failed to assign course: ' + (err.response?.data?.message || err.response?.data?.detail || JSON.stringify(err.response?.data) || err.message));
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <div className="text-center py-8">Loading...</div>;
    }

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-xl font-bold">Assign Courses to Faculty</h2>
                <p className="text-gray-600 font-sm">Link faculty members with their teaching courses</p>
            </div>

            {showSuccess && (
                <div className="alert-success mb-6">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Course assigned successfully!</span>
                </div>
            )}

            <div className="card p-6 mb-6">
                <h3 className="text-lg font-bold mb-4">New Assignment</h3>
                <form onSubmit={handleAssign} className="space-y-4">
                    <div className="form-group">
                        <label>Select Faculty <span className="text-red-500">*</span></label>
                        <select value={selectedFaculty} onChange={(e) => setSelectedFaculty(e.target.value)} className="input-field" required>
                            <option value="">Choose a faculty member...</option>
                            {facultyList.map(f => (
                                <option key={f.id} value={f.id}>{f.name} ({f.id})</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Select Course <span className="text-red-500">*</span></label>
                        <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} className="input-field" required>
                            <option value="">Choose a course...</option>
                            {coursesList.map(c => (
                                <option key={c.id} value={c.id}>{c.code} - {c.name}</option>
                            ))}
                        </select>
                    </div>

                    <button type="submit" className="btn-primary w-full py-3" disabled={submitting}>
                        {submitting ? 'Assigning...' : 'Assign Course'}
                    </button>
                </form>
            </div>

            <div className="table-container">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-bold">Current Course Assignments</h3>
                </div>
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Faculty ID</th>
                                <th>Faculty Name</th>
                                <th>Course Code</th>
                                <th>Course Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {assignments.length === 0 ? (
                                <tr><td colSpan="4" className="text-center py-4 text-gray-500">No assignments found.</td></tr>
                            ) : (
                                assignments.map((assignment, index) => (
                                    <tr key={index}>
                                        <td className="font-medium">{assignment.facultyId}</td>
                                        <td>{assignment.facultyName}</td>
                                        <td className="font-medium">{assignment.courseCode}</td>
                                        <td className="text-muted">{assignment.courseName}</td>
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
