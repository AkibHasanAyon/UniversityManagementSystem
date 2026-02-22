import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit2, Trash2, Search, X } from 'lucide-react';
import api from '../../services/api';
import '../../styles/Dashboard.css';

export function ManageStudents() {
    const [students, setStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const itemsPerPage = 10;

    const fetchStudents = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get('/api/users/students/', {
                params: { search: searchTerm, page: currentPage, page_size: itemsPerPage }
            });
            const data = res.data.data || res.data;
            setStudents(data.results || data);
            setTotalCount(res.data.pagination?.count ?? data.count ?? (data.results || data).length);
        } catch (err) {
            console.error('Failed to fetch students:', err);
        } finally {
            setLoading(false);
        }
    }, [searchTerm, currentPage]);

    useEffect(() => {
        fetchStudents();
    }, [fetchStudents]);

    // Reset to page 1 when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const totalPages = Math.ceil(totalCount / itemsPerPage);

    const handleDelete = async (studentId) => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            try {
                await api.delete(`/api/users/students/${studentId}/`);
                fetchStudents();
            } catch (err) {
                alert('Failed to delete student: ' + (err.response?.data?.message || err.message));
            }
        }
    };

    const handleSave = async (formData, isEdit) => {
        try {
            if (isEdit) {
                await api.put(`/api/users/students/${formData.student_id}/`, {
                    student_id: formData.student_id,
                    name: formData.name,
                    email: formData.email,
                    major: formData.major,
                    year: formData.year,
                    gpa: formData.gpa,
                });
            } else {
                await api.post('/api/users/students/', {
                    student_id: formData.student_id,
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    major: formData.major,
                    year: formData.year,
                    gpa: formData.gpa,
                });
            }
            setShowAddModal(false);
            setEditingStudent(null);
            fetchStudents();
        } catch (err) {
            const msg = err.response?.data?.message || err.response?.data?.detail || JSON.stringify(err.response?.data) || err.message;
            alert('Failed to save student: ' + msg);
        }
    };

    return (
        <div>
            <div className="flex-between-center mb-6">
                <div>
                    <h2 className="text-xl font-bold">Manage Students</h2>
                    <p className="text-gray-600 font-sm">Add, update, or remove student records</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="btn-primary flex-center gap-2"
                >
                    <Plus size={16} />
                    Add Student
                </button>
            </div>

            {/* Search Bar */}
            <div className="card mb-6 p-4">
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
                                <th>Major</th>
                                <th>Year</th>
                                <th>GPA</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="7" className="text-center py-4">Loading...</td></tr>
                            ) : students.length === 0 ? (
                                <tr><td colSpan="7" className="text-center py-4 text-gray-500">No students found.</td></tr>
                            ) : (
                                students.map((student) => (
                                    <tr key={student.student_id || student.id}>
                                        <td className="font-medium">{student.student_id || student.id}</td>
                                        <td>{student.name}</td>
                                        <td className="text-muted">{student.email}</td>
                                        <td>{student.major}</td>
                                        <td className="text-muted">{student.year}</td>
                                        <td className="font-medium">{student.gpa}</td>
                                        <td>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setEditingStudent(student)}
                                                    className="text-blue-600 hover:text-blue-800"
                                                    title="Edit"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(student.student_id || student.id)}
                                                    className="text-red-600 hover:text-red-800"
                                                    title="Delete"
                                                >
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

                {/* Pagination */}
                {totalCount > 0 && (
                    <div className="pagination p-4 flex-between-center border-t">
                        <div className="text-sm text-gray-600">
                            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} students
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
                                    className={`btn-sm ${page === currentPage ? 'btn-primary' : 'btn-outline'}`}
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
            {(showAddModal || editingStudent) && (
                <StudentModal
                    student={editingStudent}
                    onClose={() => {
                        setShowAddModal(false);
                        setEditingStudent(null);
                    }}
                    onSave={handleSave}
                />
            )}
        </div>
    );
}

function StudentModal({ student, onClose, onSave }) {
    const [formData, setFormData] = useState({
        student_id: student?.student_id || student?.id || `STU${String(Math.floor(Math.random() * 9000) + 1000)}`,
        name: student?.name || '',
        email: student?.email || '',
        password: '',
        major: student?.major || '',
        year: student?.year || '',
        gpa: student?.gpa || '',
    });
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        await onSave(formData, !!student);
        setSaving(false);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h3 className="text-lg font-bold">{student ? 'Edit Student' : 'Add New Student'}</h3>
                    <button onClick={onClose} className="close-btn">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="form-group">
                        <label>Student ID</label>
                        <input
                            type="text"
                            value={formData.student_id}
                            onChange={(e) => setFormData({ ...formData, student_id: e.target.value })}
                            className="input-field"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="input-field"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="input-field"
                            required
                        />
                    </div>

                    {!student && (
                        <div className="form-group">
                            <label>Temporary Password</label>
                            <input
                                type="text"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="input-field"
                                placeholder="Assign a temporary password"
                                required
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label>Major</label>
                        <input
                            type="text"
                            value={formData.major}
                            onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                            className="input-field"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Year</label>
                        <select
                            value={formData.year}
                            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                            className="input-field"
                            required
                        >
                            <option value="">Select Year</option>
                            <option value="1st">1st Year</option>
                            <option value="2nd">2nd Year</option>
                            <option value="3rd">3rd Year</option>
                            <option value="4th">4th Year</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>GPA</label>
                        <input
                            type="text"
                            value={formData.gpa}
                            onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
                            className="input-field"
                            placeholder="e.g., 3.75"
                            required
                        />
                    </div>

                    <div className="modal-actions">
                        <button type="button" onClick={onClose} className="btn-outline flex-1">
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary flex-1" disabled={saving}>
                            {saving ? 'Saving...' : (student ? 'Update' : 'Add')} Student
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
