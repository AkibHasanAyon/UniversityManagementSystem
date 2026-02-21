import React, { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import { usersApi } from '../../api/usersApi';
import { academicApi } from '../../api/academicApi';
import '../../styles/Dashboard.css';

export function AssignCourses() {
    const [facultyList, setFacultyList] = useState([]);
    const [courseList, setCourseList] = useState([]);
    const [assignments, setAssignments] = useState([]);

    const [selectedFaculty, setSelectedFaculty] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('');

    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [facRes, corRes] = await Promise.all([
                usersApi.listFaculty('', 1, 100), // Get a large list or all
                academicApi.listCourses()
            ]);

            const fetchedFaculty = facRes.results || facRes || [];
            const fetchedCourses = corRes.results || corRes || [];

            setFacultyList(fetchedFaculty);
            setCourseList(fetchedCourses);

            // Extract existing assignments from courses if backend returns faculty inline
            const existingAssignments = fetchedCourses
                .filter(c => c.faculty)
                .map(c => ({
                    facultyId: c.faculty?.id || c.faculty,
                    facultyName: c.faculty?.first_name ? `${c.faculty.first_name} ${c.faculty.last_name}` : `Faculty ID: ${c.faculty?.id || c.faculty}`,
                    courseId: c.id,
                    courseCode: c.code,
                    courseName: c.name
                }));

            setAssignments(existingAssignments);
        } catch (err) {
            console.error("Failed to load assignment data", err);
            setError("Failed to load data. Please refresh.");
        }
    };

    const handleAssign = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await academicApi.assignFaculty(selectedCourse, selectedFaculty);

            setshowSuccessAndReset();
            fetchData(); // Refresh list
        } catch (err) {
            console.error("Assignment failed", err);
            setError(err.response?.data?.detail || "Failed to assign course.");
        } finally {
            setLoading(false);
        }
    };

    const setshowSuccessAndReset = () => {
        setSelectedFaculty('');
        setSelectedCourse('');
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-xl font-bold">Assign Courses to Faculty</h2>
                <p className="text-gray-600 font-sm">Link faculty members with their teaching courses</p>
            </div>

            {/* Success/Error Messages */}
            {showSuccess && (
                <div className="alert-success mb-6" style={{ backgroundColor: '#dcfce7', color: '#16a34a', padding: '1rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Course assigned successfully!</span>
                </div>
            )}

            {error && (
                <div className="alert-error mb-6" style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '1rem', borderRadius: '0.5rem' }}>
                    <span className="font-medium">{error}</span>
                </div>
            )}

            {/* Assignment Form */}
            <div className="card p-6 mb-6">
                <h3 className="text-lg font-bold mb-4">New Assignment</h3>
                <form onSubmit={handleAssign} className="space-y-4">
                    <div className="form-group">
                        <label>
                            Select Faculty <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={selectedFaculty}
                            onChange={(e) => setSelectedFaculty(e.target.value)}
                            className="input-field"
                            required
                        >
                            <option value="">Choose a faculty member...</option>
                            {facultyList.map(f => (
                                <option key={f.id} value={f.id}>{f.first_name} {f.last_name} ({f.email})</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>
                            Select Course <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={selectedCourse}
                            onChange={(e) => setSelectedCourse(e.target.value)}
                            className="input-field"
                            required
                        >
                            <option value="">Choose a course...</option>
                            {courseList.map(c => (
                                <option key={c.id} value={c.id}>{c.code} - {c.name}</option>
                            ))}
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="btn-primary w-full py-3"
                        disabled={loading}
                    >
                        {loading ? 'Assigning...' : 'Assign Course'}
                    </button>
                </form>
            </div>

            {/* Current Assignments Table */}
            <div className="table-container">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-bold">Current Course Assignments</h3>
                </div>
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Faculty Name</th>
                                <th>Course Code</th>
                                <th>Course Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {assignments.length > 0 ? assignments.map((assignment, index) => (
                                <tr key={index}>
                                    <td className="font-medium">{assignment.facultyName}</td>
                                    <td className="font-medium">{assignment.courseCode}</td>
                                    <td className="text-muted">{assignment.courseName}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="3" className="text-center py-4 text-gray-500">No current assignments found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
