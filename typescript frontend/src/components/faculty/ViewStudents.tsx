import { useState } from 'react';
import { Search } from 'lucide-react';

interface Student {
  id: string;
  name: string;
  email: string;
  course: string;
  enrollmentDate: string;
}

export function ViewStudents() {
  const [students] = useState<Student[]>([
    { id: 'STU001', name: 'Emily Rodriguez', email: 'emily.r@university.edu', course: 'CS301 - Database Systems', enrollmentDate: '2025-08-25' },
    { id: 'STU002', name: 'James Wilson', email: 'james.w@university.edu', course: 'CS301 - Database Systems', enrollmentDate: '2025-08-25' },
    { id: 'STU006', name: 'Daniel Kim', email: 'daniel.k@university.edu', course: 'CS301 - Database Systems', enrollmentDate: '2025-08-25' },
    { id: 'STU007', name: 'Sarah Thompson', email: 'sarah.t@university.edu', course: 'CS302 - Algorithms', enrollmentDate: '2026-01-15' },
    { id: 'STU008', name: 'Alex Morgan', email: 'alex.m@university.edu', course: 'CS302 - Algorithms', enrollmentDate: '2026-01-15' },
    { id: 'STU009', name: 'Jessica Lee', email: 'jessica.l@university.edu', course: 'CS405 - Software Engineering', enrollmentDate: '2025-08-25' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCourse, setFilterCourse] = useState('');

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCourse = !filterCourse || student.course === filterCourse;
    
    return matchesSearch && matchesCourse;
  });

  const courses = Array.from(new Set(students.map(s => s.course)));

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">View Students</h2>
        <p className="text-sm text-gray-600">Students enrolled in your courses</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
            />
          </div>

          <select
            value={filterCourse}
            onChange={(e) => setFilterCourse(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
          >
            <option value="">All Courses</option>
            {courses.map(course => (
              <option key={course} value={course}>{course}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrollment Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{student.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.course}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{student.enrollmentDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
