import React, { useState } from 'react';
import '../../styles/Dashboard.css';

export function ViewAssignedCourses() {
    const courses = [
        { code: 'CS301', name: 'Database Systems', semester: 'Fall 2025', students: 48, credits: 3 },
        { code: 'CS302', name: 'Algorithms', semester: 'Spring 2026', students: 52, credits: 3 },
        { code: 'CS405', name: 'Software Engineering', semester: 'Fall 2025', students: 45, credits: 4 },
        { code: 'CS201', name: 'Data Structures', semester: 'Spring 2026', students: 42, credits: 3 },
    ];

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-xl font-bold">Assigned Courses</h2>
                <p className="text-gray-600 font-sm">View your teaching assignments</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {courses.map((course, index) => (
                    <div key={index} className="card p-6">
                        <div className="flex-between-start mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">{course.code}</h3>
                                <p className="text-sm text-gray-600">{course.name}</p>
                            </div>
                            <span className="badge badge-success">
                                Active
                            </span>
                        </div>

                        <div className="space-y-2 mb-4">
                            <div className="flex-between-center text-sm">
                                <span className="text-gray-600">Semester:</span>
                                <span className="font-medium text-gray-900">{course.semester}</span>
                            </div>
                            <div className="flex-between-center text-sm">
                                <span className="text-gray-600">Enrolled Students:</span>
                                <span className="font-medium text-gray-900">{course.students}</span>
                            </div>
                            <div className="flex-between-center text-sm">
                                <span className="text-gray-600">Credits:</span>
                                <span className="font-medium text-gray-900">{course.credits}</span>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-100">
                            <button className="btn-green w-full text-sm">
                                View Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
