import React, { useState } from 'react';
import { Plus, Trash2, Search } from 'lucide-react';
import '../../styles/Dashboard.css';

export function StudentEnrollment() {
    // Mock Data
    const [enrollments, setEnrollments] = useState([
        { id: 1, studentName: 'Ayesha Siddiqua', studentId: 'STU001', courseCode: 'CS301', courseName: 'Database Systems', semester: 'Fall 2025', instructor: 'Prof. Rahman' },
        { id: 2, studentName: 'Rahim Ahmed', studentId: 'STU002', courseCode: 'MATH201', courseName: 'Linear Algebra', semester: 'Fall 2025', instructor: 'Dr. Farhana' },
    ]);

    const [students] = useState([
        { id: 'STU001', name: 'Ayesha Siddiqua' },
        { id: 'STU002', name: 'Rahim Ahmed' },
        { id: 'STU003', name: 'Sadia Islam' },
        { id: 'STU004', name: 'Karim Uddin' },
        { id: 'STU005', name: 'Fatema Begum' },
    ]);

    const [courses] = useState([
        { code: 'CS301', name: 'Database Systems', instructor: 'Prof. Rahman', semester: 'Fall 2025' },
        { code: 'MATH201', name: 'Linear Algebra', instructor: 'Dr. Farhana', semester: 'Fall 2025' },
        { code: 'PHY101', name: 'Physics I', instructor: 'Prof. Jamal Uddin', semester: 'Fall 2025' },
    ]);

    const [selectedStudent, setSelectedStudent] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const handleEnroll = (e) => {
        e.preventDefault();
        if (!selectedStudent || !selectedCourse) return;

        const student = students.find(s => s.id === selectedStudent);
        const course = courses.find(c => c.code === selectedCourse);

        // Check for duplicate enrollment
        const isEnrolled = enrollments.some(
            enroll => enroll.studentId === student.id && enroll.courseCode === course.code
        );

        if (isEnrolled) {
            alert('Student is already enrolled in this course.');
            return;
        }

        const newEnrollment = {
            id: Date.now(),
            studentName: student.name,
            studentId: student.id,
            courseCode: course.code,
            courseName: course.name,
            semester: course.semester,
            instructor: course.instructor
        };

        setEnrollments([...enrollments, newEnrollment]);
        // Reset selection
        setSelectedStudent('');
        setSelectedCourse('');
    };

    const handleRemove = (id) => {
        if (window.confirm('Are you sure you want to remove this enrollment?')) {
            setEnrollments(enrollments.filter(e => e.id !== id));
        }
    };

    const filteredEnrollments = enrollments.filter(enroll =>
        enroll.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enroll.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enroll.courseCode.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-xl font-bold">Student Enrollment</h2>
                <p className="text-gray-600 font-sm">Assign students to courses</p>
            </div>

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
                                <option key={s.id} value={s.id}>{s.name} ({s.id})</option>
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
                                <option key={c.code} value={c.code}>{c.name} ({c.code})</option>
                            ))}
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="btn-primary flex justify-center items-center gap-2 h-10"
                        disabled={!selectedStudent || !selectedCourse}
                    >
                        <Plus size={18} />
                        Enroll Student
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
                                            <button
                                                onClick={() => handleRemove(enroll.id)}
                                                className="text-red-500 hover:text-red-700 transition-colors p-1"
                                                title="Remove Enrollment"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center py-4 text-gray-500">
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
