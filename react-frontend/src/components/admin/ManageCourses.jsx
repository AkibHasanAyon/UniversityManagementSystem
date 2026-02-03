import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, X } from 'lucide-react';
import '../../styles/Dashboard.css';

export function ManageCourses() {
    const [courses, setCourses] = useState([
        { id: 'CRS001', code: 'CS301', name: 'Database Systems', department: 'Computer Science', credits: 3, semester: 'Fall 2025', days: ['Mon', 'Wed'], startTime: '10:00', endTime: '11:30', room: '301', building: 'Academic Block A' },
        { id: 'CRS002', code: 'MATH201', name: 'Linear Algebra', department: 'Mathematics', credits: 4, semester: 'Fall 2025', days: ['Tue', 'Thu'], startTime: '08:30', endTime: '10:00', room: '202', building: 'Science Wing' },
        { id: 'CRS003', code: 'PHY101', name: 'Physics I', department: 'Physics', credits: 4, semester: 'Fall 2025', days: ['Mon', 'Wed', 'Fri'], startTime: '11:00', endTime: '12:00', room: '105', building: 'Science Wing' },
        { id: 'CRS004', code: 'ENG202', name: 'Technical Writing', department: 'English', credits: 3, semester: 'Spring 2026', days: ['Tue'], startTime: '14:00', endTime: '17:00', room: '404', building: 'Humanities' },
        { id: 'CRS005', code: 'CS302', name: 'Algorithms', department: 'Computer Science', credits: 3, semester: 'Spring 2026', days: ['Mon', 'Wed'], startTime: '13:00', endTime: '14:30', room: '302', building: 'Academic Block A' },
        { id: 'CRS006', code: 'BUS101', name: 'Business Fundamentals', department: 'Business', credits: 3, semester: 'Fall 2025', days: ['Fri'], startTime: '09:00', endTime: '12:00', room: '101', building: 'Business Center' },
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const filteredCourses = courses.filter(course =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.department.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
    const paginatedCourses = filteredCourses.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this course?')) {
            setCourses(courses.filter(c => c.id !== id));
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
                            {paginatedCourses.map((course) => (
                                <tr key={course.id}>
                                    <td className="font-medium">{course.code}</td>
                                    <td>{course.name}</td>
                                    <td className="text-muted">{course.department}</td>
                                    <td className="text-sm">
                                        <div className="text-gray-900 font-medium">{course.days ? course.days.join(', ') : 'N/A'}</div>
                                        <div className="text-gray-500">{course.startTime} - {course.endTime}</div>
                                    </td>
                                    <td className="text-sm text-muted">
                                        <div>{course.building}</div>
                                        <div>Room: {course.room}</div>
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
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="pagination p-4 flex-between-center border-t">
                    <div className="text-sm text-gray-600">
                        Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredCourses.length)} of {filteredCourses.length} courses
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
            </div>

            {/* Add/Edit Modal */}
            {(showAddModal || editingCourse) && (
                <CourseModal
                    course={editingCourse}
                    onClose={() => {
                        setShowAddModal(false);
                        setEditingCourse(null);
                    }}
                    onSave={(course) => {
                        if (editingCourse) {
                            setCourses(courses.map(c => c.id === course.id ? course : c));
                        } else {
                            setCourses([...courses, course]);
                        }
                        setShowAddModal(false);
                        setEditingCourse(null);
                    }}
                />
            )}
        </div>
    );
}

function CourseModal({ course, onClose, onSave }) {
    const [formData, setFormData] = useState(course || {
        id: `CRS${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
        code: '',
        name: '',
        department: '',
        credits: 3,
        semester: '',
        days: [],
        startTime: '',
        endTime: '',
        room: '',
        building: ''
    });

    const possibleDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    const handleDayToggle = (day) => {
        if (formData.days.includes(day)) {
            setFormData({ ...formData, days: formData.days.filter(d => d !== day) });
        } else {
            setFormData({ ...formData, days: [...formData.days, day] });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
                <div className="modal-header">
                    <h3 className="text-lg font-bold">{course ? 'Edit Course' : 'Add New Course'}</h3>
                    <button onClick={onClose} className="close-btn">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
                                onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) })}
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
                        <button type="button" onClick={onClose} className="btn-outline flex-1">
                            Cancel
                        </button>
                        <button type="submit" className="btn-blue flex-1">
                            {course ? 'Update' : 'Add'} Course
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
