import React, { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import api from '../../services/api';
import '../../styles/Dashboard.css';

export function SubmitGrades() {
    const [selectedCourse, setSelectedCourse] = useState('');
    const [grades, setGrades] = useState([]);
    const [showSuccess, setShowSuccess] = useState(false);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        api.get('/api/academic/courses/', { params: { faculty: 'current' } })
            .then(res => {
                const data = res.data.data || res.data;
                const results = data.results || data;
                setCourses(Array.isArray(results) ? results.map(c => ({
                    code: c.code,
                    name: c.name,
                    id: c.id,
                })) : []);
            })
            .catch(err => console.error('Failed to load courses:', err))
            .finally(() => setLoading(false));
    }, []);

    const handleCourseChange = async (courseCode) => {
        setSelectedCourse(courseCode);
        if (!courseCode) {
            setGrades([]);
            return;
        }

        try {
            const [enrollRes, gradesRes] = await Promise.all([
                api.get('/api/academic/enrollments/', {
                    params: { course_code: courseCode }
                }),
                api.get('/api/academic/grades/', {
                    params: { course_code: courseCode }
                })
            ]);

            const gradesData = gradesRes.data.data || gradesRes.data;
            const gradesResults = gradesData.results || gradesData;
            const gradedStudentIds = new Set();
            if (Array.isArray(gradesResults)) {
                gradesResults.forEach(g => {
                    // Only exclude students graded IN THIS VERY COURSE
                    const courseMatch = String(g.courseCode || g.course_code) === String(courseCode);
                    if (courseMatch) {
                        const studentId = g.studentId || g.student_id;
                        if (studentId) gradedStudentIds.add(studentId);
                    }
                });
            }

            const data = enrollRes.data.data || enrollRes.data;
            let results = data.results || data;

            let fetchedGrades = [];
            if (Array.isArray(results)) {
                const uniqueStudents = new Map();
                results.forEach(e => {
                    const eCourseCode = e.courseCode || e.course_code;
                    if (eCourseCode && String(eCourseCode) !== String(courseCode)) return;

                    const id = e.studentId || e.student_id;
                    if (id && !uniqueStudents.has(id) && !gradedStudentIds.has(id)) {
                        uniqueStudents.set(id, {
                            studentId: id,
                            studentName: e.studentName || e.student_name || '',
                            grade: '',
                        });
                    }
                });
                fetchedGrades = Array.from(uniqueStudents.values());
            }
            setGrades(fetchedGrades);
        } catch (err) {
            console.error('Failed to load enrollments or grades:', err);
            setGrades([]);
        }
    };

    const handleGradeChange = (studentId, grade) => {
        setGrades(grades.map(g =>
            g.studentId === studentId ? { ...g, grade } : g
        ));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const gradesToSubmit = grades.filter(g => g.grade);

        if (gradesToSubmit.length === 0) {
            alert('Please enter at least one grade to submit.');
            setSubmitting(false);
            return;
        }

        try {
            await Promise.all(gradesToSubmit.map(g =>
                api.post('/api/academic/grades/bulk/', {
                    course_code: selectedCourse,
                    grades: [
                        {
                            student_id: g.studentId,
                            grade: g.grade,
                        }
                    ],
                }).catch(err => {
                    console.error("Error submitting grade for", g.studentId, err.response?.data);
                    throw err; // Re-throw to be caught by Promise.all
                })
            ));

            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
                setSelectedCourse('');
                setGrades([]);
            }, 2000);
        } catch (err) {
            alert('Failed to submit some or all grades. Check console for details. Error: ' + (err.response?.data?.message || err.response?.data?.detail || JSON.stringify(err.response?.data) || err.message));
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="text-center py-8">Loading...</div>;

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-xl font-bold">Submit Grades</h2>
                <p className="text-gray-600 font-sm">Enter and submit student grades for your courses</p>
            </div>

            {showSuccess && (
                <div className="alert-success mb-6">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Grades submitted successfully!</span>
                </div>
            )}

            <div className="card p-6 mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Course <span className="text-red-500">*</span>
                </label>
                <select value={selectedCourse} onChange={(e) => handleCourseChange(e.target.value)} className="input-field">
                    <option value="">Choose a course...</option>
                    {courses.map(course => (
                        <option key={course.code} value={course.code}>{course.code} - {course.name}</option>
                    ))}
                </select>
            </div>

            {selectedCourse && grades.length > 0 && (
                <form onSubmit={handleSubmit}>
                    <div className="table-container mb-6">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-bold">Enter Grades</h3>
                        </div>
                        <div className="p-6 space-y-4">
                            {grades.map((gradeEntry) => (
                                <div key={gradeEntry.studentId} className="flex-between-center gap-4 p-4 bg-gray-50 rounded-lg">
                                    <div className="flex-1">
                                        <div className="font-medium text-gray-900">{gradeEntry.studentName}</div>
                                        <div className="text-sm text-gray-600">{gradeEntry.studentId}</div>
                                    </div>
                                    <div className="w-32">
                                        <select
                                            value={gradeEntry.grade}
                                            onChange={(e) => handleGradeChange(gradeEntry.studentId, e.target.value)}
                                            className="input-field"
                                        >
                                            <option value="">Grade</option>
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
                            ))}
                        </div>
                    </div>

                    <button type="submit" className="btn-green w-full py-3" disabled={submitting}>
                        {submitting ? 'Submitting...' : 'Submit All Grades'}
                    </button>
                </form>
            )}

            {selectedCourse && grades.length === 0 && (
                <div className="card p-8 text-center">
                    <p className="text-gray-600">No students enrolled in this course yet.</p>
                </div>
            )}
        </div>
    );
}
