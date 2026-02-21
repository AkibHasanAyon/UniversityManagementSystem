import React, { useState, useEffect } from 'react';
import { X, Clock, MapPin, Calendar, Book } from 'lucide-react';
import { academicApi } from '../../api/academicApi';
import '../../styles/Dashboard.css';

export function ViewAssignedCourses() {
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAssignedCourses = async () => {
            try {
                // Fetch courses for the currently logged in faculty
                const data = await academicApi.listCourses('', 'current');
                setCourses(data.results || data || []);
            } catch (err) {
                console.error("Failed to fetch assigned courses", err);
                setError("Failed to load your assigned courses.");
            } finally {
                setLoading(false);
            }
        };

        fetchAssignedCourses();
    }, []);

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-xl font-bold">Assigned Courses</h2>
                <p className="text-gray-600 font-sm">View your teaching assignments</p>
            </div>

            {error && (
                <div className="alert-error mb-6" style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '1rem', borderRadius: '0.5rem' }}>
                    <span className="font-medium">{error}</span>
                </div>
            )}

            {loading ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>Loading courses...</div>
            ) : (
                <div className="courses-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {courses.length > 0 ? courses.map((course, index) => (
                        <div key={course.id || index} className="card p-6 border border-gray-100 hover:shadow-md transition-shadow">
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
                                    <span className="font-medium text-gray-900">{course.semester || 'N/A'}</span>
                                </div>
                                {/* Note: enrolled students count might not be returned directly in course list, fallback to N/A if missing */}
                                <div className="flex-between-center text-sm">
                                    <span className="text-gray-600">Enrolled Students:</span>
                                    <span className="font-medium text-gray-900">{course.students_count || course.enrolled_count || 'N/A'}</span>
                                </div>
                                <div className="flex-between-center text-sm">
                                    <span className="text-gray-600">Credits:</span>
                                    <span className="font-medium text-gray-900">{course.credits || 'N/A'}</span>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-100">
                                <button
                                    onClick={() => setSelectedCourse(course)}
                                    className="btn-primary w-full text-sm py-2 rounded-md font-medium"
                                    style={{ backgroundColor: 'var(--faculty-primary)' }}
                                >
                                    View Details
                                </button>
                            </div>
                        </div>
                    )) : (
                        <div className="p-8 text-center text-gray-500 w-full col-span-full card border-dashed">
                            You have no courses assigned to you at the moment.
                        </div>
                    )}
                </div>
            )}

            {selectedCourse && (
                <CourseDetailsModal
                    course={selectedCourse}
                    onClose={() => setSelectedCourse(null)}
                />
            )}
        </div>
    );
}

function CourseDetailsModal({ course, onClose }) {
    // Helper to format days and time
    const schedDays = Array.isArray(course.days) ? course.days.join(', ') : (course.days || 'TBA');
    const schedTime = (course.startTime && course.endTime) ? `${course.startTime} - ${course.endTime}` : 'TBA';
    const timeDisplay = schedDays !== 'TBA' || schedTime !== 'TBA' ? `${schedDays} | ${schedTime}` : 'TBA';

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
                            <p className="font-semibold text-gray-900">{course.semester || 'N/A'}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2 mb-2 text-gray-600">
                                <Book size={18} />
                                <span className="text-sm font-medium">Credits</span>
                            </div>
                            <p className="font-semibold text-gray-900">{course.credits || 'N/A'} Credits</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2 mb-2 text-gray-600">
                                <Clock size={18} />
                                <span className="text-sm font-medium">Schedule</span>
                            </div>
                            <p className="font-semibold text-gray-900">{timeDisplay}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2 mb-2 text-gray-600">
                                <MapPin size={18} />
                                <span className="text-sm font-medium">Location</span>
                            </div>
                            <p className="font-semibold text-gray-900">{course.building || 'N/A'} {course.room ? `- Room ${course.room}` : ''}</p>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-2">Description</h4>
                        <p className="text-gray-600 leading-relaxed">
                            {course.description || 'No description provided for this course.'}
                        </p>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex justify-end">
                        <button onClick={onClose} className="btn-primary" style={{ backgroundColor: 'var(--faculty-primary)' }}>
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
