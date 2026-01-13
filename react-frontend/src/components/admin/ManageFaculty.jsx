import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, X } from 'lucide-react';
import '../../styles/Dashboard.css';

export function ManageFaculty() {
    const [faculty, setFaculty] = useState([
        { id: 'FAC001', name: 'Prof. Rahman', email: 'rahman@university.edu', department: 'Computer Science', specialization: 'Database Systems', joinDate: '2018-08-15' },
        { id: 'FAC002', name: 'Dr. Farhana', email: 'farhana@university.edu', department: 'Mathematics', specialization: 'Linear Algebra', joinDate: '2015-01-20' },
        { id: 'FAC003', name: 'Prof. Jamal Uddin', email: 'jamal.uddin@university.edu', department: 'Physics', specialization: 'Quantum Mechanics', joinDate: '2017-09-10' },
        { id: 'FAC004', name: 'Dr. Nusrat Jahan', email: 'nusrat.j@university.edu', department: 'Engineering', specialization: 'Thermodynamics', joinDate: '2019-03-05' },
        { id: 'FAC005', name: 'Prof. Rafiqul Islam', email: 'rafiqul.islam@university.edu', department: 'Business', specialization: 'Finance', joinDate: '2016-07-12' },
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingFaculty, setEditingFaculty] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const filteredFaculty = faculty.filter(f =>
        f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.department.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredFaculty.length / itemsPerPage);
    const paginatedFaculty = filteredFaculty.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this faculty member?')) {
            setFaculty(faculty.filter(f => f.id !== id));
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
                        placeholder="Search by name, email, or department..."
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
                            {paginatedFaculty.map((member) => (
                                <tr key={member.id}>
                                    <td className="font-medium">{member.id}</td>
                                    <td>{member.name}</td>
                                    <td className="text-muted">{member.email}</td>
                                    <td>{member.department}</td>
                                    <td className="text-muted">{member.specialization}</td>
                                    <td className="text-muted">{member.joinDate}</td>
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
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="pagination p-4 flex-between-center border-t">
                    <div className="text-sm text-gray-600">
                        Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredFaculty.length)} of {filteredFaculty.length} faculty
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
            </div>

            {/* Add/Edit Modal */}
            {(showAddModal || editingFaculty) && (
                <FacultyModal
                    faculty={editingFaculty}
                    onClose={() => {
                        setShowAddModal(false);
                        setEditingFaculty(null);
                    }}
                    onSave={(facultyMember) => {
                        if (editingFaculty) {
                            setFaculty(faculty.map(f => f.id === facultyMember.id ? facultyMember : f));
                        } else {
                            setFaculty([...faculty, facultyMember]);
                        }
                        setShowAddModal(false);
                        setEditingFaculty(null);
                    }}
                />
            )}
        </div>
    );
}

function FacultyModal({ faculty, onClose, onSave }) {
    const [formData, setFormData] = useState(faculty || {
        id: `FAC${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
        name: '',
        email: '',
        department: '',
        specialization: '',
        joinDate: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h3 className="text-lg font-bold">{faculty ? 'Edit Faculty' : 'Add New Faculty'}</h3>
                    <button onClick={onClose} className="close-btn">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="form-group">
                        <label>Faculty ID</label>
                        <input
                            type="text"
                            value={formData.id}
                            onChange={(e) => setFormData({ ...formData, id: e.target.value })}
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

                    {!faculty && (
                        <div className="form-group">
                            <label>Temporary Password</label>
                            <input
                                type="text"
                                value={formData.tempPassword || ''}
                                onChange={(e) => setFormData({ ...formData, tempPassword: e.target.value })}
                                className="input-field"
                                placeholder="Assign a temporary password"
                                required
                            />
                        </div>
                    )}

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
                        <label>Specialization</label>
                        <input
                            type="text"
                            value={formData.specialization}
                            onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                            className="input-field"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Join Date</label>
                        <input
                            type="date"
                            value={formData.joinDate}
                            onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                            className="input-field"
                            required
                        />
                    </div>

                    <div className="modal-actions">
                        <button type="button" onClick={onClose} className="btn-outline flex-1">
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary flex-1">
                            {faculty ? 'Update' : 'Add'} Faculty
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
