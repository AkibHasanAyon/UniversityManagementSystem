import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import '../../styles/Dashboard.css';

export function SubmitGrades() {
    const [selectedCourse, setSelectedCourse] = useState('');
    const [grades, setGrades] = useState([]);
    const [showSuccess, setShowSuccess] = useState(false);

    const courses = [
        { code: 'CS301', name: 'Database Systems' },
        { code: 'CS302', name: 'Algorithms' },
        { code: 'CS405', name: 'Software Engineering' },
        { code: 'CS201', name: 'Data Structures' },
    ];

    const students = {
        'CS301': [
            { id: 'STU001', name: 'Emily Rodriguez' },
            { id: 'STU002', name: 'James Wilson' },
            { id: 'STU006', name: 'Daniel Kim' },
        ],
        'CS302': [
            { id: 'STU007', name: 'Sarah Thompson' },
            { id: 'STU008', name: 'Alex Morgan' },
        ],
        'CS405': [
            { id: 'STU009', name: 'Jessica Lee' },
        ],
        'CS201': [],
    };

    const handleCourseChange = (courseCode) => {
        setSelectedCourse(courseCode);
        const courseStudents = students[courseCode] || [];
        setGrades(courseStudents.map(s => ({ studentId: s.id, studentName: s.name, grade: '' })));
    };

    const handleGradeChange = (studentId, grade) => {
        setGrades(grades.map(g =>
            g.studentId === studentId ? { ...g, grade } : g
        ));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setShowSuccess(true);
        setTimeout(() => {
            setShowSuccess(false);
            setSelectedCourse('');
            setGrades([]);
        }, 2000);
    };

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-xl font-bold">Submit Grades</h2>
                <p className="text-gray-600 font-sm">Enter and submit student grades for your courses</p>
            </div>

            {/* Success Message */}
            {showSuccess && (
                <div className="alert-success mb-6">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Grades submitted successfully!</span>
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
                >
                    <option value="">Choose a course...</option>
                    {courses.map(course => (
                        <option key={course.code} value={course.code}>{course.code} - {course.name}</option>
                    ))}
                </select>
            </div>

            {/* Grade Entry Form */}
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
                                            required
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

                    <button
                        type="submit"
                        className="btn-green w-full py-3"
                    >
                        Submit All Grades
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
