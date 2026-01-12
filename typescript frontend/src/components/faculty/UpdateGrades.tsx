import { useState } from 'react';
import { CheckCircle, Search } from 'lucide-react';

interface StudentGrade {
  studentId: string;
  studentName: string;
  courseCode: string;
  courseName: string;
  currentGrade: string;
}

export function UpdateGrades() {
  const [existingGrades, setExistingGrades] = useState<StudentGrade[]>([
    { studentId: 'STU001', studentName: 'Emily Rodriguez', courseCode: 'CS301', courseName: 'Database Systems', currentGrade: 'A' },
    { studentId: 'STU002', studentName: 'James Wilson', courseCode: 'CS301', courseName: 'Database Systems', currentGrade: 'A' },
    { studentId: 'STU006', studentName: 'Daniel Kim', courseCode: 'CS301', courseName: 'Database Systems', currentGrade: 'A-' },
    { studentId: 'STU007', studentName: 'Sarah Thompson', courseCode: 'CS302', courseName: 'Algorithms', currentGrade: 'B+' },
    { studentId: 'STU008', studentName: 'Alex Morgan', courseCode: 'CS302', courseName: 'Algorithms', currentGrade: 'A-' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [editingGrade, setEditingGrade] = useState<StudentGrade | null>(null);
  const [newGrade, setNewGrade] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const filteredGrades = existingGrades.filter(grade =>
    grade.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    grade.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    grade.courseCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (grade: StudentGrade) => {
    setEditingGrade(grade);
    setNewGrade(grade.currentGrade);
  };

  const handleUpdate = (e: React.FormEvent) => {
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

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Update Grades</h2>
        <p className="text-sm text-gray-600">Modify existing student grades</p>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="mb-6 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg p-4 flex items-center gap-3 shadow-md">
          <CheckCircle className="w-5 h-5 text-emerald-600" />
          <span className="text-emerald-800 font-medium">Grade updated successfully!</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by student name, ID, or course..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
          />
        </div>
      </div>

      {/* Grades Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Grade</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredGrades.map((grade, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{grade.studentId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{grade.studentName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{grade.courseCode} - {grade.courseName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      grade.currentGrade.startsWith('A') ? 'bg-green-100 text-green-800' :
                      grade.currentGrade.startsWith('B') ? 'bg-blue-100 text-blue-800' :
                      grade.currentGrade.startsWith('C') ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {grade.currentGrade}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleEdit(grade)}
                      className="px-3 py-1 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors font-medium"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">Update Grade</h3>
            </div>

            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student</label>
                <p className="text-gray-900">{editingGrade.studentName} ({editingGrade.studentId})</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                <p className="text-gray-900">{editingGrade.courseCode} - {editingGrade.courseName}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Grade <span className="text-red-500">*</span>
                </label>
                <select
                  value={newGrade}
                  onChange={(e) => setNewGrade(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
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

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setEditingGrade(null);
                    setNewGrade('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
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