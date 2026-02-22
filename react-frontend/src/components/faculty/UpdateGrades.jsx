import React, { useState, useEffect } from 'react';
import { CheckCircle, Search } from 'lucide-react';
import api from '../../services/api';
import '../../styles/Dashboard.css';

export function UpdateGrades() {
    const [existingGrades, setExistingGrades] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingGrade, setEditingGrade] = useState(null);
    const [newGrade, setNewGrade] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    const fetchGrades = () => {
        setLoading(true);
        api.get('/api/academic/grades/')
            .then(res => {
                const data = res.data.data || res.data;
                const results = data.results || data;
                setExistingGrades(Array.isArray(results) ? results.map(g => ({
                    id: g.id,
                    studentId: g.student_id || g.studentId || '',
                    studentName: g.student_name || g.studentName || '',
                    courseCode: g.course_code || g.courseCode || '',
                    courseName: g.course_name || g.courseName || '',
                    currentGrade: g.grade,
                })) : []);
            })
            .catch(err => console.error('Failed to load grades:', err))
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchGrades(); }, []);

    const filteredGrades = existingGrades.filter(grade =>
        grade.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        grade.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        grade.courseCode.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEdit = (grade) => {
        setEditingGrade(grade);
        setNewGrade(grade.currentGrade);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!editingGrade) return;
        setUpdating(true);

        try {
            await api.put(`/api/academic/grades/${editingGrade.id}/`, {
                grade: newGrade,
            });
            setEditingGrade(null);
            setNewGrade('');
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
            fetchGrades();
        } catch (err) {
            alert('Failed to update grade: ' + (err.response?.data?.message || err.response?.data?.detail || JSON.stringify(err.response?.data) || err.message));
        } finally {
            setUpdating(false);
        }
    };

    const getBadgeClass = (grade) => {
        if (!grade) return 'badge';
        if (grade.startsWith('A')) return 'badge badge-success';
        if (grade.startsWith('B')) return 'badge badge-primary';
        if (grade.startsWith('C')) return 'badge badge-warning';
        return 'badge badge-danger';
    };

    if (loading) return <div className="text-center py-8">Loading...</div>;

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-xl font-bold">Update Grades</h2>
                <p className="text-gray-600 font-sm">Modify existing student grades</p>
            </div>

            {showSuccess && (
                <div className="alert-success mb-6">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Grade updated successfully!</span>
                </div>
            )}

            <div className="card mb-6 p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                    <input type="text" placeholder="Search by student name, ID, or course..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="input-field pl-10" />
                </div>
            </div>

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
                            {filteredGrades.length === 0 ? (
                                <tr><td colSpan="5" className="text-center py-4 text-gray-500">No grades found.</td></tr>
                            ) : (
                                filteredGrades.map((grade, index) => (
                                    <tr key={grade.id || index}>
                                        <td className="font-medium">{grade.studentId}</td>
                                        <td>{grade.studentName}</td>
                                        <td className="text-muted">{grade.courseCode} - {grade.courseName}</td>
                                        <td>
                                            <span className={getBadgeClass(grade.currentGrade)}>
                                                {grade.currentGrade}
                                            </span>
                                        </td>
                                        <td>
                                            <button onClick={() => handleEdit(grade)} className="btn-sm btn-green">Edit</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

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
                                <label>New Grade <span className="text-red-500">*</span></label>
                                <select value={newGrade} onChange={(e) => setNewGrade(e.target.value)} className="input-field" required>
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
                                <button type="button" onClick={() => { setEditingGrade(null); setNewGrade(''); }} className="btn-outline flex-1">Cancel</button>
                                <button type="submit" className="btn-green flex-1" disabled={updating}>
                                    {updating ? 'Updating...' : 'Update Grade'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
