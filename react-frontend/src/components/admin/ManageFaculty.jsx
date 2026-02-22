import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit2, Trash2, Search, X } from 'lucide-react';
import api from '../../services/api';
import '../../styles/Dashboard.css';

export function ManageFaculty() {
    const [faculty, setFaculty] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingFaculty, setEditingFaculty] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const itemsPerPage = 10;

    const fetchFaculty = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get('/api/users/faculty/', {
                params: { search: searchTerm, page: currentPage, page_size: itemsPerPage }
            });
            const data = res.data.data || res.data;
            setFaculty(data.results || data);
            setTotalCount(res.data.pagination?.count ?? data.count ?? (data.results || data).length);
        } catch (err) {
            console.error('Failed to fetch faculty:', err);
        } finally {
            setLoading(false);
        }
    }, [searchTerm, currentPage]);

    useEffect(() => { fetchFaculty(); }, [fetchFaculty]);
    useEffect(() => { setCurrentPage(1); }, [searchTerm]);

    const totalPages = Math.ceil(totalCount / itemsPerPage);

    const handleDelete = async (facultyId) => {
        if (window.confirm('Are you sure you want to delete this faculty member?')) {
            try {
                await api.delete(`/api/users/faculty/${facultyId}/`);
                fetchFaculty();
            } catch (err) {
                alert('Failed to delete faculty: ' + (err.response?.data?.message || err.message));
            }
        }
    };

    const handleSave = async (formData, isEdit) => {
        try {
            if (isEdit) {
                await api.put(`/api/users/faculty/${formData.faculty_id}/`, {
                    faculty_id: formData.faculty_id,
                    name: formData.name,
                    email: formData.email,
                    department: formData.department,
                    specialization: formData.specialization,
                    join_date: formData.join_date,
                });
            } else {
                await api.post('/api/users/faculty/', {
                    faculty_id: formData.faculty_id,
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    department: formData.department,
                    specialization: formData.specialization,
                    join_date: formData.join_date,
                });
            }
            setShowAddModal(false);
            setEditingFaculty(null);
            fetchFaculty();
        } catch (err) {
            const msg = err.response?.data?.message || err.response?.data?.detail || JSON.stringify(err.response?.data) || err.message;
            alert('Failed to save faculty: ' + msg);
        }
    };

    return (
        <div>
            <div className="flex-between-center mb-6">
                <div>
                    <h2 className="text-xl font-bold">Manage Faculty</h2>
                    <p className="text-gray-600 font-sm">Add, update, or remove faculty information</p>
                </div>
                <button onClick={() => setShowAddModal(true)} className="btn-primary flex-center gap-2">
                    <Plus size={16} />
                    Add Faculty
                </button>
            </div>

            <div className="card mb-6 p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by name, email, or department..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input-field pl-10"
                    />
                </div>
            </div>

            <div className="table-container">
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Faculty ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Department</th>
                                <th>Specialization</th>
                                <th>Join Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="7" className="text-center py-4">Loading...</td></tr>
                            ) : faculty.length === 0 ? (
                                <tr><td colSpan="7" className="text-center py-4 text-gray-500">No faculty found.</td></tr>
                            ) : (
                                faculty.map((member) => (
                                    <tr key={member.faculty_id || member.id}>
                                        <td className="font-medium">{member.faculty_id || member.id}</td>
                                        <td>{member.name}</td>
                                        <td className="text-muted">{member.email}</td>
                                        <td>{member.department}</td>
                                        <td className="text-muted">{member.specialization}</td>
                                        <td className="text-muted">{member.join_date || member.joinDate}</td>
                                        <td>
                                            <div className="flex gap-2">
                                                <button onClick={() => setEditingFaculty(member)} className="text-blue-600 hover:text-blue-800" title="Edit">
                                                    <Edit2 size={16} />
                                                </button>
                                                <button onClick={() => handleDelete(member.faculty_id || member.id)} className="text-red-600 hover:text-red-800" title="Delete">
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
                            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} faculty
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="btn-outline text-sm">Previous</button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <button key={page} onClick={() => setCurrentPage(page)} className={`btn-sm ${page === currentPage ? 'btn-primary' : 'btn-outline'}`}>{page}</button>
                            ))}
                            <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="btn-outline text-sm">Next</button>
                        </div>
                    </div>
                )}
            </div>

            {(showAddModal || editingFaculty) && (
                <FacultyModal
                    faculty={editingFaculty}
                    onClose={() => { setShowAddModal(false); setEditingFaculty(null); }}
                    onSave={handleSave}
                />
            )}
        </div>
    );
}

function FacultyModal({ faculty, onClose, onSave }) {
    const [formData, setFormData] = useState({
        faculty_id: faculty?.faculty_id || faculty?.id || `FAC${String(Math.floor(Math.random() * 9000) + 1000)}`,
        name: faculty?.name || '',
        email: faculty?.email || '',
        password: '',
        department: faculty?.department || '',
        specialization: faculty?.specialization || '',
        join_date: faculty?.join_date || faculty?.joinDate || '',
    });
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        await onSave(formData, !!faculty);
        setSaving(false);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h3 className="text-lg font-bold">{faculty ? 'Edit Faculty' : 'Add New Faculty'}</h3>
                    <button onClick={onClose} className="close-btn"><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="form-group">
                        <label>Faculty ID</label>
                        <input type="text" value={formData.faculty_id} onChange={(e) => setFormData({ ...formData, faculty_id: e.target.value })} className="input-field" required />
                    </div>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="input-field" required />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="input-field" required />
                    </div>
                    {!faculty && (
                        <div className="form-group">
                            <label>Temporary Password</label>
                            <input type="text" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="input-field" placeholder="Assign a temporary password" required />
                        </div>
                    )}
                    <div className="form-group">
                        <label>Department</label>
                        <input type="text" value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} className="input-field" required />
                    </div>
                    <div className="form-group">
                        <label>Specialization</label>
                        <input type="text" value={formData.specialization} onChange={(e) => setFormData({ ...formData, specialization: e.target.value })} className="input-field" required />
                    </div>
                    <div className="form-group">
                        <label>Join Date</label>
                        <input type="date" value={formData.join_date} onChange={(e) => setFormData({ ...formData, join_date: e.target.value })} className="input-field" required />
                    </div>

                    <div className="modal-actions">
                        <button type="button" onClick={onClose} className="btn-outline flex-1">Cancel</button>
                        <button type="submit" className="btn-primary flex-1" disabled={saving}>
                            {saving ? 'Saving...' : (faculty ? 'Update' : 'Add')} Faculty
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
