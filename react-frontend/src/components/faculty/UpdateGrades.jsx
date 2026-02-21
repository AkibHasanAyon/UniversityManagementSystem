import React, { useState, useEffect, useMemo } from 'react';
import { CheckCircle, Search } from 'lucide-react';
import { gradesApi } from '../../api/gradesApi';
import '../../styles/Dashboard.css';

export function UpdateGrades() {
    const [existingGrades, setExistingGrades] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingGrade, setEditingGrade] = useState(null);
    const [newGrade, setNewGrade] = useState('');

    const [loading, setLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchGrades();
    }, []);

    const fetchGrades = async () => {
        try {
            setLoading(true);
            const data = await gradesApi.listGrades('current');
            setExistingGrades(data.results || data || []);
        } catch (err) {
            console.error("Failed to load grades", err);
            setError("Failed to load grades.");
        } finally {
            setLoading(false);
        }
    };

    const filteredGrades = useMemo(() => {
        return existingGrades.filter(grade => {
            const studentStr = typeof grade.student === 'object'
                ? `${grade.student?.first_name} ${grade.student?.last_name} ${grade.student?.email}`
                : String(grade.student || '');

            const courseStr = typeof grade.course === 'object'
                ? `${grade.course?.code} ${grade.course?.name}`
                : String(grade.course || '');

            const searchLower = searchTerm.toLowerCase();
            return studentStr.toLowerCase().includes(searchLower) || courseStr.toLowerCase().includes(searchLower);
        });
    }, [existingGrades, searchTerm]);

    const handleEdit = (grade) => {
        setEditingGrade(grade);
        setNewGrade(grade.grade);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!editingGrade) return;

        setIsUpdating(true);
        setError('');

        try {
            await gradesApi.updateGrade(editingGrade.id, newGrade);

            setExistingGrades(prevGrades => prevGrades.map(g =>
                g.id === editingGrade.id ? { ...g, grade: newGrade } : g
            ));

            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
                setEditingGrade(null);
                setNewGrade('');
            }, 3000);
        } catch (err) {
            console.error("Failed to update grade", err);
            setError(err.response?.data?.detail || "Failed to update grade. Please try again.");
        } finally {
            setIsUpdating(false);
        }
    };

    const getBadgeClass = (gradeVal) => {
        if (!gradeVal) return 'badge badge-secondary';
        if (gradeVal.startsWith('A')) return 'badge badge-success';
        if (gradeVal.startsWith('B')) return 'badge badge-primary';
        if (gradeVal.startsWith('C')) return 'badge badge-warning';
        if (gradeVal.startsWith('F')) return 'badge badge-danger';
        return 'badge badge-secondary';
    };

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-xl font-bold">Update Grades</h2>
                <p className="text-gray-600 font-sm">Modify existing student grades</p>
            </div>

            {/* Messages */}
            {showSuccess && (
                <div className="alert-success mb-6" style={{ backgroundColor: '#dcfce7', color: '#16a34a', padding: '1rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Grade updated successfully!</span>
                </div>
            )}

            {error && !editingGrade && (
                <div className="alert-error mb-6" style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '1rem', borderRadius: '0.5rem' }}>
                    <span className="font-medium">{error}</span>
                </div>
            )}

            {/* Search Bar */}
            <div className="card mb-6 p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by student name, email, or course..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input-field pl-10 w-full"
                    />
                </div>
            </div>

            {/* Grades Table */}
            <div className="table-container">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading grades...</div>
                ) : (
                    <div className="table-wrapper">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Student Name</th>
                                    <th>Course</th>
                                    <th>Current Grade</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredGrades.length > 0 ? filteredGrades.map((gradeItem, index) => {
                                    const studentName = typeof gradeItem.student === 'object'
                                        ? `${gradeItem.student?.first_name} ${gradeItem.student?.last_name}`
                                        : `Student ID: ${gradeItem.student}`;

                                    const courseName = typeof gradeItem.course === 'object'
                                        ? `${gradeItem.course?.code} - ${gradeItem.course?.name}`
                                        : `Course ID: ${gradeItem.course}`;

                                    return (
                                        <tr key={gradeItem.id || index}>
                                            <td className="font-medium">{studentName}</td>
                                            <td className="text-muted">{courseName}</td>
                                            <td>
                                                <span className={getBadgeClass(gradeItem.grade)}>
                                                    {gradeItem.grade || 'N/A'}
                                                </span>
                                            </td>
                                            <td>
                                                <button
                                                    onClick={() => handleEdit(gradeItem)}
                                                    className="btn-sm btn-primary"
                                                    style={{ backgroundColor: 'var(--faculty-primary)', borderColor: 'var(--faculty-primary)' }}
                                                >
                                                    Edit
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                }) : (
                                    <tr>
                                        <td colSpan="4" className="text-center p-4 text-gray-500">
                                            No grades found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            {editingGrade && (
                <div className="modal-overlay">
                    <div className="modal-content text-left">
                        <div className="modal-header">
                            <h3 className="text-lg font-bold">Update Grade</h3>
                        </div>

                        {error && editingGrade && (
                            <div className="m-6 mb-0 alert-error" style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '1rem', borderRadius: '0.5rem' }}>
                                <span className="font-medium">{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleUpdate} className="p-6 space-y-4">
                            <div className="form-group">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Student</label>
                                <p className="text-gray-900 border border-gray-200 p-2 rounded bg-gray-50">
                                    {typeof editingGrade.student === 'object'
                                        ? `${editingGrade.student?.first_name} ${editingGrade.student?.last_name}`
                                        : `Student ID: ${editingGrade.student}`}
                                </p>
                            </div>

                            <div className="form-group">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                                <p className="text-gray-900 border border-gray-200 p-2 rounded bg-gray-50">
                                    {typeof editingGrade.course === 'object'
                                        ? `${editingGrade.course?.code} - ${editingGrade.course?.name}`
                                        : `Course ID: ${editingGrade.course}`}
                                </p>
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
                                    disabled={isUpdating}
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

                            <div className="modal-actions pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditingGrade(null);
                                        setNewGrade('');
                                        setError('');
                                    }}
                                    className="btn-outline flex-1"
                                    disabled={isUpdating}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn-primary flex-1"
                                    style={{ backgroundColor: 'var(--faculty-primary)', borderColor: 'var(--faculty-primary)' }}
                                    disabled={isUpdating || newGrade === editingGrade.grade}
                                >
                                    {isUpdating ? 'Updating...' : 'Update Grade'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
