import { useState } from 'react';
import { Search } from 'lucide-react';

interface AcademicRecord {
  studentId: string;
  studentName: string;
  courseCode: string;
  courseName: string;
  grade: string;
  semester: string;
  credits: number;
}

export function ViewRecords() {
  const [records] = useState<AcademicRecord[]>([
    { studentId: 'STU001', studentName: 'Emily Rodriguez', courseCode: 'CS301', courseName: 'Database Systems', grade: 'A', semester: 'Fall 2025', credits: 3 },
    { studentId: 'STU001', studentName: 'Emily Rodriguez', courseCode: 'MATH201', courseName: 'Linear Algebra', grade: 'A-', semester: 'Fall 2025', credits: 4 },
    { studentId: 'STU001', studentName: 'Emily Rodriguez', courseCode: 'PHY101', courseName: 'Physics I', grade: 'B+', semester: 'Spring 2025', credits: 4 },
    { studentId: 'STU002', studentName: 'James Wilson', courseCode: 'MATH201', courseName: 'Linear Algebra', grade: 'A', semester: 'Fall 2025', credits: 4 },
    { studentId: 'STU002', studentName: 'James Wilson', courseCode: 'CS301', courseName: 'Database Systems', grade: 'A', semester: 'Fall 2025', credits: 3 },
    { studentId: 'STU003', studentName: 'Sophia Chen', courseCode: 'PHY101', courseName: 'Physics I', grade: 'A', semester: 'Fall 2025', credits: 4 },
    { studentId: 'STU003', studentName: 'Sophia Chen', courseCode: 'MATH201', courseName: 'Linear Algebra', grade: 'A', semester: 'Spring 2025', credits: 4 },
    { studentId: 'STU004', studentName: 'Michael Brown', courseCode: 'ENG202', courseName: 'Technical Writing', grade: 'B', semester: 'Fall 2025', credits: 3 },
    { studentId: 'STU005', studentName: 'Olivia Martinez', courseCode: 'CS302', courseName: 'Algorithms', grade: 'A-', semester: 'Fall 2025', credits: 3 },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterSemester, setFilterSemester] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filteredRecords = records.filter(record => {
    const matchesSearch = 
      record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.courseCode.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSemester = !filterSemester || record.semester === filterSemester;
    
    return matchesSearch && matchesSemester;
  });

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const semesters = Array.from(new Set(records.map(r => r.semester)));

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Academic Records</h2>
        <p className="text-sm text-gray-600">View student grades and academic history (Read-only)</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by student name, ID, or course..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          <select
            value={filterSemester}
            onChange={(e) => setFilterSemester(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            <option value="">All Semesters</option>
            {semesters.map(sem => (
              <option key={sem} value={sem}>{sem}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Records Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credits</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Semester</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedRecords.map((record, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.studentId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.studentName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.courseCode}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{record.courseName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      record.grade.startsWith('A') ? 'bg-green-100 text-green-800' :
                      record.grade.startsWith('B') ? 'bg-blue-100 text-blue-800' :
                      record.grade.startsWith('C') ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {record.grade}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.credits}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{record.semester}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredRecords.length)} of {filteredRecords.length} records
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded-lg text-sm ${
                  page === currentPage
                    ? 'bg-blue-600 text-white'
                    : 'border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
