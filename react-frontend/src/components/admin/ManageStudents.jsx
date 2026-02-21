import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit2, Trash2, Search, X } from 'lucide-react';
import { usersApi } from '../../api/usersApi';
import '../../styles/Dashboard.css';

export function ManageStudents() {
    const [students, setStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const itemsPerPage = 5;

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setCurrentPage(1); // Reset to first page on search
        }, 300);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const fetchStudents = useCallback(async () => {
        try {
            // Note: API returns array directly if no pagination, or { count, next, previous, results } if paginated
            const data = await usersApi.listStudents(debouncedSearch, currentPage, itemsPerPage);
            if (data.results) {
                setStudents(data.results);
                setTotalItems(data.count);
            } else {
                // Not paginated fallback
                setStudents(data);
                setTotalItems(data.length);
            }
        } catch (error) {
            console.error("Failed to fetch students", error);
        }
    }, [debouncedSearch, currentPage]);

    useEffect(() => {
        fetchStudents();
    }, [fetchStudents]);

    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            try {
                await usersApi.deleteStudent(id);
                fetchStudents();
            } catch (error) {
                console.error("Failed to delete student", error);
                alert("Failed to delete student. Please try again.");
            }
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
                        placeholder="Search by name or email..."
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
                                <th>Name</th>
                                <th>Email</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.length > 0 ? students.map((student) => (
                                <tr key={student.id}>
                                    <td className="font-medium">{student.first_name} {student.last_name}</td>
                                    <td className="text-muted">{student.email}</td>
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
                                                onClick={() => handleDelete(student.id)}
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
                                    <td colSpan="3" className="text-center py-4 text-gray-500">No students found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalItems > itemsPerPage && (
                    <div className="pagination p-4 flex-between-center border-t">
                        <div className="text-sm text-gray-600">
                            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} students
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
                    onSave={fetchStudents}
                />
            )}
        </div>
    );
}

function StudentModal({ student, onClose, onSave }) {
    const [formData, setFormData] = useState({
        email: student?.email || '',
        first_name: student?.first_name || '',
        last_name: student?.last_name || '',
        password: '',
        role: 'student'
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        try {
            if (student) {
                // Edit mode
                // Don't send password if empty on edit
                const dataToUpdate = { ...formData };
                if (!dataToUpdate.password) delete dataToUpdate.password;
                await usersApi.updateStudent(student.id, dataToUpdate);
            } else {
                // Add mode
                if (!formData.password) {
                    setError("Password is required for new students.");
                    setSaving(false);
                    return;
                }
                await usersApi.createStudent(formData);
            }
            onSave(); // Refresh list
            onClose();
        } catch (err) {
            console.error("Failed to save student", err);
            setError(err.response?.data?.detail || "Failed to save student details. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h3 className="text-lg font-bold">{student ? 'Edit Student' : 'Add New Student'}</h3>
                    <button onClick={onClose} className="close-btn" disabled={saving}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

                    <div className="form-group grid grid-cols-2 gap-4">
                        <div>
                            <label>First Name</label>
                            <input
                                type="text"
                                value={formData.first_name}
                                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                className="input-field w-full"
                                required
                            />
                        </div>
                        <div>
                            <label>Last Name</label>
                            <input
                                type="text"
                                value={formData.last_name}
                                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                className="input-field w-full"
                                required
                            />
                        </div>
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

                    <div className="form-group">
                        <label>{student ? 'New Password (leave blank to keep current)' : 'Password'}</label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="input-field"
                            placeholder={student ? '' : 'Enter password'}
                            required={!student}
                        />
                    </div>

                    <div className="modal-actions">
                        <button type="button" onClick={onClose} className="btn-outline flex-1" disabled={saving}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary flex-1" disabled={saving}>
                            {saving ? 'Saving...' : (student ? 'Update Student' : 'Add Student')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
