import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit2, Trash2, Search, X } from 'lucide-react';
import api from '../../services/api';
import '../../styles/Dashboard.css';

export function ManageCourses() {
    const [courses, setCourses] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const itemsPerPage = 10;

    const fetchCourses = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get('/api/academic/courses/', {
                params: { search: searchTerm, page: currentPage, page_size: itemsPerPage }
            });
            const data = res.data.data || res.data;
            const results = data.results || data;
            setCourses(Array.isArray(results) ? results : []);
            setTotalCount(res.data.pagination?.count ?? data.count ?? (Array.isArray(results) ? results.length : 0));
        } catch (err) {
            console.error('Failed to fetch courses:', err);
        } finally {
            setLoading(false);
        }
    }, [searchTerm, currentPage]);

    useEffect(() => { fetchCourses(); }, [fetchCourses]);
    useEffect(() => { setCurrentPage(1); }, [searchTerm]);

    const totalPages = Math.ceil(totalCount / itemsPerPage);

    const handleDelete = async (courseId) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            try {
                await api.delete(`/api/academic/courses/${courseId}/`);
                fetchCourses();
            } catch (err) {
                alert('Failed to delete course: ' + (err.response?.data?.message || err.message));
            }
        }
    };

    const handleSave = async (formData, isEdit) => {
        try {
            const payload = {
                code: formData.code,
                name: formData.name,
                department: formData.department,
                credits: formData.credits,
                semester: formData.semester,
                days: formData.days,
                start_time: formData.startTime || formData.start_time,
                end_time: formData.endTime || formData.end_time,
                room: formData.room,
                building: formData.building,
            };

            if (isEdit) {
                await api.put(`/api/academic/courses/${formData.id}/`, payload);
            } else {
                await api.post('/api/academic/courses/', payload);
            }
            setShowAddModal(false);
            setEditingCourse(null);
            fetchCourses();
        } catch (err) {
            const msg = err.response?.data?.message || err.response?.data?.detail || JSON.stringify(err.response?.data) || err.message;
            alert('Failed to save course: ' + msg);
        }
    };

    return (
        <div>
            <div className="flex-between-center mb-6">
                <div>
                    <h2 className="text-xl font-bold">Manage Courses</h2>
                    <p className="text-gray-600 font-sm">Add, update, or remove course information</p>
                </div>
                <button onClick={() => setShowAddModal(true)} className="btn-purple flex-center gap-2">
                    <Plus size={16} />
                    Add Course
                </button>
            </div>

            <div className="card mb-6 p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                    <input type="text" placeholder="Search by name, code, or department..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="input-field pl-10" />
                </div>
            </div>

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
                            {loading ? (
                                <tr><td colSpan="6" className="text-center py-4">Loading...</td></tr>
                            ) : courses.length === 0 ? (
                                <tr><td colSpan="6" className="text-center py-4 text-gray-500">No courses found.</td></tr>
                            ) : (
                                courses.map((course) => (
                                    <tr key={course.id || course.code}>
                                        <td className="font-medium">{course.code}</td>
                                        <td>{course.name}</td>
                                        <td className="text-muted">{course.department}</td>
                                        <td className="text-sm">
                                            <div className="text-gray-900 font-medium">{course.days ? (Array.isArray(course.days) ? course.days.join(', ') : course.days) : 'N/A'}</div>
                                            <div className="text-gray-500">{course.start_time || course.startTime} - {course.end_time || course.endTime}</div>
                                        </td>
                                        <td className="text-sm text-muted">
                                            <div>{course.building}</div>
                                            <div>Room: {course.room}</div>
                                        </td>
                                        <td>
                                            <div className="flex gap-2">
                                                <button onClick={() => setEditingCourse(course)} className="text-blue-600 hover:text-blue-800" title="Edit">
                                                    <Edit2 size={16} />
                                                </button>
                                                <button onClick={() => handleDelete(course.id)} className="text-red-600 hover:text-red-800" title="Delete">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {totalCount > 0 && (
                    <div className="pagination p-4 flex-between-center border-t">
                        <div className="text-sm text-gray-600">
                            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} courses
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="btn-outline text-sm">Previous</button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button key={page} onClick={() => setCurrentPage(page)} className={`btn-sm ${page === currentPage ? 'btn-blue' : 'btn-outline'}`}>{page}</button>
                            ))}
                            <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="btn-outline text-sm">Next</button>
                        </div>
                    </div>
                )}
            </div>

            {(showAddModal || editingCourse) && (
                <CourseModal
                    course={editingCourse}
                    onClose={() => { setShowAddModal(false); setEditingCourse(null); }}
                    onSave={handleSave}
                />
            )}
        </div>
    );
}

function CourseModal({ course, onClose, onSave }) {
    const [formData, setFormData] = useState({
        id: course?.id || '',
        code: course?.code || '',
        name: course?.name || '',
        department: course?.department || '',
        credits: course?.credits || 3,
        semester: course?.semester || '',
        days: course?.days || [],
        startTime: course?.start_time || course?.startTime || '',
        endTime: course?.end_time || course?.endTime || '',
        room: course?.room || '',
        building: course?.building || ''
    });
    const [saving, setSaving] = useState(false);

    const possibleDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    const handleDayToggle = (day) => {
        const currentDays = Array.isArray(formData.days) ? formData.days : [];
        if (currentDays.includes(day)) {
            setFormData({ ...formData, days: currentDays.filter(d => d !== day) });
        } else {
            setFormData({ ...formData, days: [...currentDays, day] });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        await onSave(formData, !!course);
        setSaving(false);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
                <div className="modal-header">
                    <h3 className="text-lg font-bold">{course ? 'Edit Course' : 'Add New Course'}</h3>
                    <button onClick={onClose} className="close-btn"><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="form-group">
                            <label>Course Code</label>
                            <input type="text" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} className="input-field" placeholder="e.g., CS301" required />
                        </div>
                        <div className="form-group">
                            <label>Credits</label>
                            <input type="number" value={formData.credits} onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) })} className="input-field" min="1" max="6" required />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Course Name</label>
                        <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="input-field" required />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="form-group">
                            <label>Department</label>
                            <input type="text" value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} className="input-field" required />
                        </div>
                        <div className="form-group">
                            <label>Semester</label>
                            <input type="text" value={formData.semester} onChange={(e) => setFormData({ ...formData, semester: e.target.value })} className="input-field" placeholder="e.g., Fall 2025" required />
                        </div>
                    </div>

                    <div className="border-t pt-4 mt-4">
                        <h4 className="font-bold mb-3 text-gray-700">Class Schedule & Location</h4>
                        <div className="form-group mb-4">
                            <label className="mb-2 block">Class Days</label>
                            <div className="flex flex-wrap gap-2">
                                {possibleDays.map(day => (
                                    <button
                                        key={day} type="button"
                                        onClick={() => handleDayToggle(day)}
                                        className={`px-3 py-1 text-sm rounded-full border transition-colors ${(Array.isArray(formData.days) ? formData.days : []).includes(day)
                                            ? 'bg-purple-600 text-white border-purple-600'
                                            : 'bg-white text-gray-600 border-gray-300 hover:border-purple-400'}`}
                                    >
                                        {day}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="form-group">
                                <label>Start Time</label>
                                <input type="time" value={formData.startTime} onChange={(e) => setFormData({ ...formData, startTime: e.target.value })} className="input-field" />
                            </div>
                            <div className="form-group">
                                <label>End Time</label>
                                <input type="time" value={formData.endTime} onChange={(e) => setFormData({ ...formData, endTime: e.target.value })} className="input-field" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="form-group">
                                <label>Room Number</label>
                                <input type="text" value={formData.room} onChange={(e) => setFormData({ ...formData, room: e.target.value })} className="input-field" placeholder="e.g., 301" />
                            </div>
                            <div className="form-group">
                                <label>Building Name</label>
                                <input type="text" value={formData.building} onChange={(e) => setFormData({ ...formData, building: e.target.value })} className="input-field" placeholder="e.g., Academic Block A" />
                            </div>
                        </div>
                    </div>

                    <div className="modal-actions pt-4">
                        <button type="button" onClick={onClose} className="btn-outline flex-1">Cancel</button>
                        <button type="submit" className="btn-blue flex-1" disabled={saving}>
                            {saving ? 'Saving...' : (course ? 'Update' : 'Add')} Course
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
