import React, { useState } from 'react';
import { Search } from 'lucide-react';
import '../../styles/Dashboard.css';

export function ViewStudents() {
    const [students] = useState([
        { id: 'STU001', name: 'Ayesha Siddiqua', email: 'ayesha.s@university.edu', course: 'CS301 - Database Systems', enrollmentDate: '2025-08-25' },
        { id: 'STU002', name: 'Rahim Ahmed', email: 'rahim.a@university.edu', course: 'CS301 - Database Systems', enrollmentDate: '2025-08-25' },
        { id: 'STU006', name: 'Tanvir Hasan', email: 'tanvir.h@university.edu', course: 'CS301 - Database Systems', enrollmentDate: '2025-08-25' },
        { id: 'STU007', name: 'Salma Begum', email: 'salma.b@university.edu', course: 'CS302 - Algorithms', enrollmentDate: '2026-01-15' },
        { id: 'STU008', name: 'Ali Hossain', email: 'ali.h@university.edu', course: 'CS302 - Algorithms', enrollmentDate: '2026-01-15' },
        { id: 'STU009', name: 'Jasmine Akter', email: 'jasmine.a@university.edu', course: 'CS405 - Software Engineering', enrollmentDate: '2025-08-25' },
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterCourse, setFilterCourse] = useState('');

    const filteredStudents = students.filter(student => {
        const matchesSearch =
            student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.id.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCourse = !filterCourse || student.course === filterCourse;

        return matchesSearch && matchesCourse;
    });

    const courses = Array.from(new Set(students.map(s => s.course)));

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-xl font-bold">View Students</h2>
                <p className="text-gray-600 font-sm">Students enrolled in your courses</p>
            </div>

            {/* Filters */}
            <div className="card mb-6 p-4">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by name, email, or ID..."
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
                        {courses.map(course => (
                            <option key={course} value={course}>{course}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Students Table */}
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
                            {filteredStudents.map((student) => (
                                <tr key={student.id}>
                                    <td className="font-medium">{student.id}</td>
                                    <td>{student.name}</td>
                                    <td className="text-muted">{student.email}</td>
                                    <td>{student.course}</td>
                                    <td className="text-muted">{student.enrollmentDate}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
