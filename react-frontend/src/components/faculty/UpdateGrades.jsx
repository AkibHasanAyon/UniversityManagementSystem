import React, { useState } from 'react';
import { CheckCircle, Search } from 'lucide-react';
import '../../styles/Dashboard.css';

export function UpdateGrades() {
    const [existingGrades, setExistingGrades] = useState([
        { studentId: 'STU001', studentName: 'Emily Rodriguez', courseCode: 'CS301', courseName: 'Database Systems', currentGrade: 'A' },
        { studentId: 'STU002', studentName: 'James Wilson', courseCode: 'CS301', courseName: 'Database Systems', currentGrade: 'A' },
        { studentId: 'STU006', studentName: 'Daniel Kim', courseCode: 'CS301', courseName: 'Database Systems', currentGrade: 'A-' },
        { studentId: 'STU007', studentName: 'Sarah Thompson', courseCode: 'CS302', courseName: 'Algorithms', currentGrade: 'B+' },
        { studentId: 'STU008', studentName: 'Alex Morgan', courseCode: 'CS302', courseName: 'Algorithms', currentGrade: 'A-' },
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [editingGrade, setEditingGrade] = useState(null);
    const [newGrade, setNewGrade] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);

    const filteredGrades = existingGrades.filter(grade =>
        grade.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        grade.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        grade.courseCode.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEdit = (grade) => {
        setEditingGrade(grade);
        setNewGrade(grade.currentGrade);
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        if (editingGrade) {
            setExistingGrades(existingGrades.map(g =>
                g.studentId === editingGrade.studentId && g.courseCode === editingGrade.courseCode
                    ? { ...g, currentGrade: newGrade }
                    : g
            ));
            setEditingGrade(null);
            setNewGrade('');
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        }
    };

    const getBadgeClass = (grade) => {
        if (grade.startsWith('A')) return 'badge badge-success';
        if (grade.startsWith('B')) return 'badge badge-primary';
        if (grade.startsWith('C')) return 'badge badge-warning';
        return 'badge badge-danger';
    };

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-xl font-bold">Update Grades</h2>
                <p className="text-gray-600 font-sm">Modify existing student grades</p>
            </div>

            {/* Success Message */}
            {showSuccess && (
                <div className="alert-success mb-6">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Grade updated successfully!</span>
                </div>
            )}

            {/* Search Bar */}
            <div className="card mb-6 p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by student name, ID, or course..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input-field pl-10"
                    />
                </div>
            </div>

            {/* Grades Table */}
            <div className="table-container">
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Student ID</th>
                                <th>Student Name</th>
                                <th>Course</th>
                                <th>Current Grade</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredGrades.map((grade, index) => (
                                <tr key={index}>
                                    <td className="font-medium">{grade.studentId}</td>
                                    <td>{grade.studentName}</td>
                                    <td className="text-muted">{grade.courseCode} - {grade.courseName}</td>
                                    <td>
                                        <span className={getBadgeClass(grade.currentGrade)}>
                                            {grade.currentGrade}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => handleEdit(grade)}
                                            className="btn-sm btn-green"
                                        >
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Modal */}
            {editingGrade && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3 className="text-lg font-bold">Update Grade</h3>
                        </div>

                        <form onSubmit={handleUpdate} className="p-6 space-y-4">
                            <div className="form-group">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Student</label>
                                <p className="text-gray-900">{editingGrade.studentName} ({editingGrade.studentId})</p>
                            </div>

                            <div className="form-group">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                                <p className="text-gray-900">{editingGrade.courseCode} - {editingGrade.courseName}</p>
                            </div>

                            <div className="form-group">
                                <label>
                                    New Grade <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={newGrade}
                                    onChange={(e) => setNewGrade(e.target.value)}
                                    className="input-field"
                                    required
                                >
                                    <option value="">Select Grade</option>
                                    <option value="A">A</option>
                                    <option value="A-">A-</option>
                                    <option value="B+">B+</option>
                                    <option value="B">B</option>
                                    <option value="B-">B-</option>
                                    <option value="C+">C+</option>
                                    <option value="C">C</option>
                                    <option value="C-">C-</option>
                                    <option value="D">D</option>
                                    <option value="F">F</option>
                                </select>
                            </div>

                            <div className="modal-actions">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditingGrade(null);
                                        setNewGrade('');
                                    }}
                                    className="btn-outline flex-1"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn-green flex-1"
                                >
                                    Update Grade
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
