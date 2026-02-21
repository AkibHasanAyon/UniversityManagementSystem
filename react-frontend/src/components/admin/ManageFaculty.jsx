import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit2, Trash2, Search, X } from 'lucide-react';
import { usersApi } from '../../api/usersApi';
import '../../styles/Dashboard.css';

export function ManageFaculty() {
    const [faculty, setFaculty] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingFaculty, setEditingFaculty] = useState(null);
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

    const fetchFaculty = useCallback(async () => {
        try {
            const data = await usersApi.listFaculty(debouncedSearch, currentPage, itemsPerPage);
            if (data.results) {
                setFaculty(data.results);
                setTotalItems(data.count);
            } else {
                setFaculty(data);
                setTotalItems(data.length);
            }
        } catch (error) {
            console.error("Failed to fetch faculty", error);
        }
    }, [debouncedSearch, currentPage]);

    useEffect(() => {
        fetchFaculty();
    }, [fetchFaculty]);

    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this faculty member?')) {
            try {
                await usersApi.deleteFaculty(id);
                fetchFaculty();
            } catch (error) {
                console.error("Failed to delete faculty", error);
                alert("Failed to delete faculty. Please try again.");
            }
        }
    };

    return (
        <div>
            <div className="flex-between-center mb-6">
                <div>
                    <h2 className="text-xl font-bold">Manage Faculty</h2>
                    <p className="text-gray-600 font-sm">Add, update, or remove faculty information</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="btn-primary flex-center gap-2"
                >
                    <Plus size={16} />
                    Add Faculty
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

            {/* Faculty Table */}
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
                            {faculty.length > 0 ? faculty.map((member) => (
                                <tr key={member.id}>
                                    <td className="font-medium">{member.first_name} {member.last_name}</td>
                                    <td className="text-muted">{member.email}</td>
                                    <td>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setEditingFaculty(member)}
                                                className="text-blue-600 hover:text-blue-800"
                                                title="Edit"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(member.id)}
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
                                    <td colSpan="3" className="text-center py-4 text-gray-500">No faculty found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalItems > itemsPerPage && (
                    <div className="pagination p-4 flex-between-center border-t">
                        <div className="text-sm text-gray-600">
                            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} faculty
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
            {(showAddModal || editingFaculty) && (
                <FacultyModal
                    faculty={editingFaculty}
                    onClose={() => {
                        setShowAddModal(false);
                        setEditingFaculty(null);
                    }}
                    onSave={fetchFaculty}
                />
            )}
        </div>
    );
}

function FacultyModal({ faculty, onClose, onSave }) {
    const [formData, setFormData] = useState({
        email: faculty?.email || '',
        first_name: faculty?.first_name || '',
        last_name: faculty?.last_name || '',
        password: '',
        role: 'faculty'
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        try {
            if (faculty) {
                // Edit mode
                const dataToUpdate = { ...formData };
                if (!dataToUpdate.password) delete dataToUpdate.password;
                await usersApi.updateFaculty(faculty.id, dataToUpdate);
            } else {
                // Add mode
                if (!formData.password) {
                    setError("Password is required for new faculty.");
                    setSaving(false);
                    return;
                }
                await usersApi.createFaculty(formData);
            }
            onSave(); // Refresh list
            onClose();
        } catch (err) {
            console.error("Failed to save faculty", err);
            setError(err.response?.data?.detail || "Failed to save faculty details. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h3 className="text-lg font-bold">{faculty ? 'Edit Faculty' : 'Add New Faculty'}</h3>
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
                        <label>{faculty ? 'New Password (leave blank to keep current)' : 'Password'}</label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="input-field"
                            placeholder={faculty ? '' : 'Enter password'}
                            required={!faculty}
                        />
                    </div>

                    <div className="modal-actions">
                        <button type="button" onClick={onClose} className="btn-outline flex-1" disabled={saving}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary flex-1" disabled={saving}>
                            {saving ? 'Saving...' : (faculty ? 'Update Faculty' : 'Add Faculty')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
