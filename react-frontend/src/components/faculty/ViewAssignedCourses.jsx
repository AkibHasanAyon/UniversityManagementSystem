import React, { useState, useEffect } from 'react';
import { X, Clock, MapPin, Calendar, Book } from 'lucide-react';
import api from '../../services/api';
import '../../styles/Dashboard.css';

export function ViewAssignedCourses() {
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        api.get('/api/academic/courses/')
            .then(res => {
                const data = res.data.data || res.data;
                const results = data.results || data;
                setCourses(Array.isArray(results) ? results.map(c => ({
                    code: c.code,
                    name: c.name,
                    semester: c.semester || '',
                    students: c.students_count ?? c.enrolled_students ?? c.student_count ?? 0,
                    credits: c.credits,
                    time: c.days ? `${Array.isArray(c.days) ? c.days.join(', ') : c.days} ${c.start_time || ''} - ${c.end_time || ''}`.trim() : '',
                    room: c.building ? `${c.building} - ${c.room}` : c.room || '',
                    description: c.description || `Course ${c.code} - ${c.name}`,
                })) : []);
            })
            .catch(err => console.error('Failed to load assigned courses:', err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="text-center py-8">Loading...</div>;

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-xl font-bold">Assigned Courses</h2>
                <p className="text-gray-600 font-sm">View your teaching assignments</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {courses.length === 0 ? (
                    <p className="text-gray-500">No courses assigned.</p>
                ) : (
                    courses.map((course, index) => (
                        <div key={index} className="card p-6">
                            <div className="flex-between-start mb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">{course.code}</h3>
                                    <p className="text-sm text-gray-600">{course.name}</p>
                                </div>
                                <span className="badge badge-success">Active</span>
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
                                <button onClick={() => setSelectedCourse(course)} className="btn-green w-full text-sm">
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {selectedCourse && (
                <CourseDetailsModal course={selectedCourse} onClose={() => setSelectedCourse(null)} />
            )}
        </div>
    );
}

function CourseDetailsModal({ course, onClose }) {
    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '600px' }}>
                <div className="modal-header">
                    <div>
                        <h3 className="text-lg font-bold">{course.code} - {course.name}</h3>
                        <p className="text-sm text-gray-600">Course Details</p>
                    </div>
                    <button onClick={onClose} className="close-btn">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2 mb-2 text-gray-600">
                                <Calendar size={18} />
                                <span className="text-sm font-medium">Semester</span>
                            </div>
                            <p className="font-semibold text-gray-900">{course.semester}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2 mb-2 text-gray-600">
                                <Book size={18} />
                                <span className="text-sm font-medium">Credits</span>
                            </div>
                            <p className="font-semibold text-gray-900">{course.credits} Credits</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2 mb-2 text-gray-600">
                                <Clock size={18} />
                                <span className="text-sm font-medium">Schedule</span>
                            </div>
                            <p className="font-semibold text-gray-900">{course.time || 'N/A'}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2 mb-2 text-gray-600">
                                <MapPin size={18} />
                                <span className="text-sm font-medium">Location</span>
                            </div>
                            <p className="font-semibold text-gray-900">{course.room || 'N/A'}</p>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-2">Description</h4>
                        <p className="text-gray-600 leading-relaxed">{course.description}</p>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex justify-end">
                        <button onClick={onClose} className="btn-primary">Close</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
