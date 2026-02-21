import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit2, Trash2, Search, X } from 'lucide-react';
import { academicApi } from '../../api/academicApi';
import '../../styles/Dashboard.css';

export function ManageCourses() {
    const [courses, setCourses] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setCurrentPage(1);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const fetchCourses = useCallback(async () => {
        try {
            const data = await academicApi.listCourses(debouncedSearch);
            // Handle both paginated and non-paginated responses
            setCourses(data.results || data);
        } catch (error) {
            console.error("Failed to fetch courses", error);
        }
    }, [debouncedSearch]);

    useEffect(() => {
        fetchCourses();
    }, [fetchCourses]);

    // Local pagination since API might not paginate courses
    const totalPages = Math.ceil(courses.length / itemsPerPage) || 1;
    const paginatedCourses = courses.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            try {
                await academicApi.deleteCourse(id);
                fetchCourses();
            } catch (error) {
                console.error("Failed to delete course", error);
                alert("Failed to delete course. Please try again.");
            }
        }
    };

    return (
        <div>
            <div className="flex-between-center mb-6">
                <div>
                    <h2 className="text-xl font-bold">Manage Courses</h2>
                    <p className="text-gray-600 font-sm">Add, update, or remove course information</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="btn-purple flex-center gap-2"
                >
                    <Plus size={16} />
                    Add Course
                </button>
            </div>

            {/* Search Bar */}
            <div className="card mb-6 p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by name, code, or department..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input-field pl-10"
                    />
                </div>
            </div>

            {/* Courses Table */}
            <div className="table-container">
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Course Code</th>
                                <th>Course Name</th>
                                <th>Department</th>
                                <th>Schedule</th>
                                <th>Location</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedCourses.length > 0 ? paginatedCourses.map((course) => (
                                <tr key={course.id}>
                                    <td className="font-medium">{course.code}</td>
                                    <td>{course.name}</td>
                                    <td className="text-muted">{course.department}</td>
                                    <td className="text-sm">
                                        <div className="text-gray-900 font-medium">
                                            {Array.isArray(course.days) ? course.days.join(', ') : (course.days || 'N/A')}
                                        </div>
                                        <div className="text-gray-500">{course.startTime || 'N/A'} - {course.endTime || 'N/A'}</div>
                                    </td>
                                    <td className="text-sm text-muted">
                                        <div>{course.building || 'N/A'}</div>
                                        <div>Room: {course.room || 'N/A'}</div>
                                    </td>
                                    <td>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setEditingCourse(course)}
                                                className="text-blue-600 hover:text-blue-800"
                                                title="Edit"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(course.id)}
                                                className="text-red-600 hover:text-red-800"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6" className="text-center py-4 text-gray-500">No courses found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {courses.length > itemsPerPage && (
                    <div className="pagination p-4 flex-between-center border-t">
                        <div className="text-sm text-gray-600">
                            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, courses.length)} of {courses.length} courses
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                className="btn-outline text-sm"
                            >
                                Previous
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`btn-sm ${page === currentPage ? 'btn-blue' : 'btn-outline'}`}
                                >
                                    {page}
                                </button>
                            ))}
                            <button
                                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                                className="btn-outline text-sm"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Add/Edit Modal */}
            {(showAddModal || editingCourse) && (
                <CourseModal
                    course={editingCourse}
                    onClose={() => {
                        setShowAddModal(false);
                        setEditingCourse(null);
                    }}
                    onSave={fetchCourses}
                />
            )}
        </div>
    );
}

function CourseModal({ course, onClose, onSave }) {
    const [formData, setFormData] = useState({
        code: course?.code || '',
        name: course?.name || '',
        department: course?.department || '',
        credits: course?.credits || 3,
        semester: course?.semester || '',
        days: Array.isArray(course?.days) ? course.days : [],
        startTime: course?.startTime || '',
        endTime: course?.endTime || '',
        room: course?.room || '',
        building: course?.building || ''
    });

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const possibleDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    const handleDayToggle = (day) => {
        if (formData.days.includes(day)) {
            setFormData({ ...formData, days: formData.days.filter(d => d !== day) });
        } else {
            setFormData({ ...formData, days: [...formData.days, day] });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        try {
            if (course) {
                await academicApi.updateCourse(course.id, formData);
            } else {
                await academicApi.createCourse(formData);
            }
            onSave();
            onClose();
        } catch (err) {
            console.error("Failed to save course", err);
            setError(err.response?.data?.detail || "Failed to save course. Please check inputs.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
                <div className="modal-header">
                    <h3 className="text-lg font-bold">{course ? 'Edit Course' : 'Add New Course'}</h3>
                    <button onClick={onClose} className="close-btn" disabled={saving}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

                    <div className="grid grid-cols-2 gap-4">
                        <div className="form-group">
                            <label>Course Code</label>
                            <input
                                type="text"
                                value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                className="input-field"
                                placeholder="e.g., CS301"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Credits</label>
                            <input
                                type="number"
                                value={formData.credits}
                                onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) || 0 })}
                                className="input-field"
                                min="1"
                                max="6"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Course Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="input-field"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="form-group">
                            <label>Department</label>
                            <input
                                type="text"
                                value={formData.department}
                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                className="input-field"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Semester</label>
                            <input
                                type="text"
                                value={formData.semester}
                                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                                className="input-field"
                                placeholder="e.g., Fall 2025"
                                required
                            />
                        </div>
                    </div>

                    {/* Schedule Section */}
                    <div className="border-t pt-4 mt-4">
                        <h4 className="font-bold mb-3 text-gray-700">Class Schedule & Location</h4>

                        <div className="form-group mb-4">
                            <label className="mb-2 block">Class Days</label>
                            <div className="flex flex-wrap gap-2">
                                {possibleDays.map(day => (
                                    <button
                                        key={day}
                                        type="button"
                                        onClick={() => handleDayToggle(day)}
                                        className={`px-3 py-1 text-sm rounded-full border transition-colors ${formData.days.includes(day)
                                            ? 'bg-purple-600 text-white border-purple-600'
                                            : 'bg-white text-gray-600 border-gray-300 hover:border-purple-400'
                                            }`}
                                    >
                                        {day}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="form-group">
                                <label>Start Time</label>
                                <input
                                    type="time"
                                    value={formData.startTime}
                                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                    className="input-field"
                                />
                            </div>
                            <div className="form-group">
                                <label>End Time</label>
                                <input
                                    type="time"
                                    value={formData.endTime}
                                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                    className="input-field"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="form-group">
                                <label>Room Number</label>
                                <input
                                    type="text"
                                    value={formData.room}
                                    onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                                    className="input-field"
                                    placeholder="e.g., 301"
                                />
                            </div>
                            <div className="form-group">
                                <label>Building Name</label>
                                <input
                                    type="text"
                                    value={formData.building}
                                    onChange={(e) => setFormData({ ...formData, building: e.target.value })}
                                    className="input-field"
                                    placeholder="e.g., Academic Block A"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="modal-actions pt-4">
                        <button type="button" onClick={onClose} className="btn-outline flex-1" disabled={saving}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-blue flex-1" disabled={saving}>
                            {saving ? 'Saving...' : (course ? 'Update Course' : 'Add Course')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
