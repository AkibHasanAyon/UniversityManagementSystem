import { useState } from 'react';
import { CheckCircle } from 'lucide-react';

interface Assignment {
  facultyId: string;
  facultyName: string;
  courseId: string;
  courseCode: string;
  courseName: string;
}

export function AssignCourses() {
  const [assignments, setAssignments] = useState<Assignment[]>([
    { facultyId: 'FAC001', facultyName: 'Prof. Michael Chen', courseId: 'CRS001', courseCode: 'CS301', courseName: 'Database Systems' },
    { facultyId: 'FAC001', facultyName: 'Prof. Michael Chen', courseId: 'CRS005', courseCode: 'CS302', courseName: 'Algorithms' },
    { facultyId: 'FAC002', facultyName: 'Dr. Sarah Johnson', courseId: 'CRS002', courseCode: 'MATH201', courseName: 'Linear Algebra' },
    { facultyId: 'FAC003', facultyName: 'Prof. David Martinez', courseId: 'CRS003', courseCode: 'PHY101', courseName: 'Physics I' },
  ]);

  const [selectedFaculty, setSelectedFaculty] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const faculty = [
    { id: 'FAC001', name: 'Prof. Michael Chen' },
    { id: 'FAC002', name: 'Dr. Sarah Johnson' },
    { id: 'FAC003', name: 'Prof. David Martinez' },
    { id: 'FAC004', name: 'Dr. Emily Wang' },
    { id: 'FAC005', name: 'Prof. Robert Taylor' },
  ];

  const courses = [
    { id: 'CRS001', code: 'CS301', name: 'Database Systems' },
    { id: 'CRS002', code: 'MATH201', name: 'Linear Algebra' },
    { id: 'CRS003', code: 'PHY101', name: 'Physics I' },
    { id: 'CRS004', code: 'ENG202', name: 'Technical Writing' },
    { id: 'CRS005', code: 'CS302', name: 'Algorithms' },
    { id: 'CRS006', code: 'BUS101', name: 'Business Fundamentals' },
  ];

  const handleAssign = (e: React.FormEvent) => {
    e.preventDefault();
    
    const facultyData = faculty.find(f => f.id === selectedFaculty);
    const courseData = courses.find(c => c.id === selectedCourse);

    if (facultyData && courseData) {
      const newAssignment: Assignment = {
        facultyId: facultyData.id,
        facultyName: facultyData.name,
        courseId: courseData.id,
        courseCode: courseData.code,
        courseName: courseData.name,
      };

      setAssignments([...assignments, newAssignment]);
      setSelectedFaculty('');
      setSelectedCourse('');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Assign Courses to Faculty</h2>
        <p className="text-sm text-gray-600">Link faculty members with their teaching courses</p>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="mb-6 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg p-4 flex items-center gap-3 shadow-md">
          <CheckCircle className="w-5 h-5 text-emerald-600" />
          <span className="text-emerald-800 font-medium">Course assigned successfully!</span>
        </div>
      )}

      {/* Assignment Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">New Assignment</h3>
        <form onSubmit={handleAssign} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Faculty <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedFaculty}
              onChange={(e) => setSelectedFaculty(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              required
            >
              <option value="">Choose a faculty member...</option>
              {faculty.map(f => (
                <option key={f.id} value={f.id}>{f.name} ({f.id})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Course <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              required
            >
              <option value="">Choose a course...</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.code} - {c.name}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
          >
            Assign Course
          </button>
        </form>
      </div>

      {/* Current Assignments Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">Current Course Assignments</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Faculty ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Faculty Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Name</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {assignments.map((assignment, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{assignment.facultyId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{assignment.facultyName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{assignment.courseCode}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{assignment.courseName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}