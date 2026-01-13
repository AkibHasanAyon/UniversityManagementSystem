import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, X } from 'lucide-react';
import '../../styles/Dashboard.css';

export function ManageStudents() {
    const [students, setStudents] = useState([
        { id: 'STU001', name: 'Ayesha Siddiqua', email: 'ayesha.s@university.edu', major: 'Computer Science', year: '3rd', gpa: '3.72' },
        { id: 'STU002', name: 'Rahim Ahmed', email: 'rahim.a@university.edu', major: 'Mathematics', year: '2nd', gpa: '3.85' },
        { id: 'STU003', name: 'Sadia Islam', email: 'sadia.i@university.edu', major: 'Physics', year: '4th', gpa: '3.91' },
        { id: 'STU004', name: 'Karim Uddin', email: 'karim.u@university.edu', major: 'Engineering', year: '1st', gpa: '3.65' },
        { id: 'STU005', name: 'Fatema Begum', email: 'fatema.b@university.edu', major: 'Business', year: '3rd', gpa: '3.78' },
        { id: 'STU006', name: 'Tanvir Hasan', email: 'tanvir.h@university.edu', major: 'Computer Science', year: '2nd', gpa: '3.88' },
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
    const paginatedStudents = filteredStudents.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            setStudents(students.filter(s => s.id !== id));
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
                            {paginatedStudents.map((student) => (
                                <tr key={student.id}>
                                    <td className="font-medium">{student.id}</td>
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
                                                onClick={() => handleDelete(student.id)}
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
                        Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredStudents.length)} of {filteredStudents.length} students
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
            {(showAddModal || editingStudent) && (
                <StudentModal
                    student={editingStudent}
                    onClose={() => {
                        setShowAddModal(false);
                        setEditingStudent(null);
                    }}
                    onSave={(student) => {
                        if (editingStudent) {
                            setStudents(students.map(s => s.id === student.id ? student : s));
                        } else {
                            setStudents([...students, student]);
                        }
                        setShowAddModal(false);
                        setEditingStudent(null);
                    }}
                />
            )}
        </div>
    );
}

function StudentModal({ student, onClose, onSave }) {
    const [formData, setFormData] = useState(student || {
        id: `STU${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
        name: '',
        email: '',
        major: '',
        year: '',
        gpa: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
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
                        <button type="submit" className="btn-primary flex-1">
                            {student ? 'Update' : 'Add'} Student
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
