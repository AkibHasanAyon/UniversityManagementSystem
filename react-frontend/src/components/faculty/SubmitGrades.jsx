import React, { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import { academicApi } from '../../api/academicApi';
import { gradesApi } from '../../api/gradesApi';
import '../../styles/Dashboard.css';

export function SubmitGrades() {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [enrollments, setEnrollments] = useState([]);
    const [grades, setGrades] = useState({});

    const [loadingCourses, setLoadingCourses] = useState(true);
    const [loadingStudents, setLoadingStudents] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [showSuccess, setShowSuccess] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const data = await academicApi.listCourses('', 'current');
                setCourses(data.results || data || []);
            } catch (err) {
                console.error("Failed to load courses", err);
                setError("Failed to load your assigned courses.");
            } finally {
                setLoadingCourses(false);
            }
        };
        fetchCourses();
    }, []);

    const handleCourseChange = async (courseId) => {
        setSelectedCourse(courseId);
        setGrades({});
        setError('');

        if (!courseId) {
            setEnrollments([]);
            return;
        }

        setLoadingStudents(true);
        try {
            // Fetch students enrolled in this course
            // The backend listEnrollments might support filtering by course if we pass it, 
            // or we just fetch all for faculty and filter locally. 
            // Assuming academicApi.listEnrollments() returns faculty's enrollments and we filter locally:
            const data = await academicApi.listEnrollments();
            const allEnrollments = data.results || data || [];

            const courseEnrollments = allEnrollments.filter(e => {
                const cId = typeof e.course === 'object' ? e.course?.id : e.course;
                return String(cId) === String(courseId);
            });

            setEnrollments(courseEnrollments);

            // Initialize grades state
            const initialGrades = {};
            courseEnrollments.forEach(e => {
                const sId = typeof e.student === 'object' ? e.student?.id : e.student;
                initialGrades[sId] = '';
            });
            setGrades(initialGrades);

        } catch (err) {
            console.error("Failed to load students", err);
            setError("Failed to load enrolled students for this course.");
        } finally {
            setLoadingStudents(false);
        }
    };

    const handleGradeChange = (studentId, grade) => {
        setGrades(prev => ({ ...prev, [studentId]: grade }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prepare payload: array of { student_id, grade }
        const gradesPayload = Object.entries(grades)
            .filter(([_, grade]) => grade !== '') // Only submit entered grades
            .map(([studentId, grade]) => ({
                student_id: studentId,
                grade: grade
            }));

        if (gradesPayload.length === 0) {
            setError("Please enter at least one grade to submit.");
            return;
        }

        setSubmitting(true);
        setError('');

        try {
            await gradesApi.bulkSubmitGrades(selectedCourse, gradesPayload);

            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
                setSelectedCourse('');
                setEnrollments([]);
                setGrades({});
            }, 3000);
        } catch (err) {
            console.error("Failed to submit grades", err);
            setError(err.response?.data?.detail || "Failed to submit grades. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-xl font-bold">Submit Grades</h2>
                <p className="text-gray-600 font-sm">Enter and submit student grades for your courses</p>
            </div>

            {/* Success/Error Messages */}
            {showSuccess && (
                <div className="alert-success mb-6" style={{ backgroundColor: '#dcfce7', color: '#16a34a', padding: '1rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Grades submitted successfully!</span>
                </div>
            )}

            {error && (
                <div className="alert-error mb-6" style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '1rem', borderRadius: '0.5rem' }}>
                    <span className="font-medium">{error}</span>
                </div>
            )}

            {/* Course Selection */}
            <div className="card p-6 mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Course <span className="text-red-500">*</span>
                </label>
                <select
                    value={selectedCourse}
                    onChange={(e) => handleCourseChange(e.target.value)}
                    className="input-field"
                    disabled={loadingCourses || submitting}
                >
                    <option value="">Choose a course...</option>
                    {courses.map(course => (
                        <option key={course.id} value={course.id}>{course.code} - {course.name}</option>
                    ))}
                </select>
                {loadingCourses && <span className="text-sm text-gray-500 mt-2 block">Loading courses...</span>}
            </div>

            {/* Loading Students */}
            {loadingStudents && (
                <div className="p-8 text-center text-gray-500">Loading students...</div>
            )}

            {/* Grade Entry Form */}
            {selectedCourse && !loadingStudents && enrollments.length > 0 && (
                <form onSubmit={handleSubmit}>
                    <div className="table-container mb-6">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-bold">Enter Grades</h3>
                        </div>
                        <div className="p-6 space-y-4">
                            {enrollments.map((enroll) => {
                                const sId = typeof enroll.student === 'object' ? enroll.student?.id : enroll.student;
                                const studentName = typeof enroll.student === 'object'
                                    ? `${enroll.student?.first_name} ${enroll.student?.last_name}`
                                    : `Student ID: ${sId}`;

                                return (
                                    <div key={sId} className="flex-between-center gap-4 p-4 bg-gray-50 rounded-lg">
                                        <div className="flex-1">
                                            <div className="font-medium text-gray-900">{studentName}</div>
                                            <div className="text-sm text-gray-600">{typeof enroll.student === 'object' ? enroll.student?.email : ''}</div>
                                        </div>
                                        <div className="w-32">
                                            <select
                                                value={grades[sId] || ''}
                                                onChange={(e) => handleGradeChange(sId, e.target.value)}
                                                className="input-field"
                                            >
                                                <option value="">Select</option>
                                                <option value="A">A</option>
                                                <option value="A-">A-</option>
                                                <option value="B+">B+</option>
                                                <option value="B">B</option>
                                                <option value="B-">B-</option>
                                                <option value="C+">C+</option>
                                                <option value="C">C</option>
                                                <option value="C-">C-</option>
                                                <option value="D">D</option>
                                                <option value="F">F</option>
                                            </select>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn-primary w-full py-3"
                        style={{ backgroundColor: 'var(--faculty-primary)' }}
                        disabled={submitting}
                    >
                        {submitting ? 'Submitting...' : 'Submit All Grades'}
                    </button>
                </form>
            )}

            {/* Empty State */}
            {selectedCourse && !loadingStudents && enrollments.length === 0 && (
                <div className="card p-8 text-center border-dashed">
                    <p className="text-gray-600">No students found enrolled in this course.</p>
                </div>
            )}
        </div>
    );
}
