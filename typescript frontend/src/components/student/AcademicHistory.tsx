export function AcademicHistory() {
  const academicHistory = [
    {
      semester: 'Fall 2025',
      courses: [
        { code: 'CS301', name: 'Database Systems', grade: 'A', credits: 3 },
        { code: 'MATH201', name: 'Linear Algebra', grade: 'A-', credits: 4 },
        { code: 'PHY101', name: 'Physics I', grade: 'B+', credits: 4 },
        { code: 'ENG202', name: 'Technical Writing', grade: 'A', credits: 3 },
        { code: 'CS302', name: 'Algorithms', grade: 'A-', credits: 3 },
      ],
      gpa: 3.72
    },
    {
      semester: 'Spring 2025',
      courses: [
        { code: 'CS201', name: 'Data Structures', grade: 'A', credits: 3 },
        { code: 'MATH101', name: 'Calculus II', grade: 'B+', credits: 4 },
        { code: 'ENG101', name: 'English Composition', grade: 'A', credits: 3 },
        { code: 'HIST201', name: 'World History', grade: 'A-', credits: 3 },
      ],
      gpa: 3.77
    },
    {
      semester: 'Fall 2024',
      courses: [
        { code: 'CS101', name: 'Introduction to Programming', grade: 'A', credits: 3 },
        { code: 'MATH100', name: 'Calculus I', grade: 'B+', credits: 4 },
        { code: 'CHEM101', name: 'General Chemistry', grade: 'B', credits: 4 },
        { code: 'PSY101', name: 'Psychology', grade: 'A-', credits: 3 },
      ],
      gpa: 3.61
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Academic Records</h2>
        <p className="text-sm text-gray-600">Complete academic history (Read-only)</p>
      </div>

      {/* Overall Summary */}
      <div className="bg-gradient-to-br from-white to-purple-50 rounded-xl shadow-lg border border-gray-100 p-6 mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Overall Academic Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg p-4 text-white shadow-md">
            <p className="text-sm text-purple-100 mb-1">Cumulative GPA</p>
            <p className="text-2xl font-bold">3.72</p>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg p-4 text-white shadow-md">
            <p className="text-sm text-blue-100 mb-1">Total Credits</p>
            <p className="text-2xl font-bold">51</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg p-4 text-white shadow-md">
            <p className="text-sm text-emerald-100 mb-1">Semesters</p>
            <p className="text-2xl font-bold">3</p>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-lg p-4 text-white shadow-md">
            <p className="text-sm text-orange-100 mb-1">Courses Completed</p>
            <p className="text-2xl font-bold">13</p>
          </div>
        </div>
      </div>

      {/* Semester by Semester */}
      <div className="space-y-6">
        {academicHistory.map((semester, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-br from-purple-50 to-pink-50 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">{semester.semester}</h3>
              <div className="text-right">
                <p className="text-sm text-gray-600">Semester GPA</p>
                <p className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{semester.gpa}</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Code</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credits</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {semester.courses.map((course, courseIdx) => (
                    <tr key={courseIdx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{course.code}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{course.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{course.credits}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          course.grade.startsWith('A') ? 'bg-green-100 text-green-800' :
                          course.grade.startsWith('B') ? 'bg-blue-100 text-blue-800' :
                          course.grade.startsWith('C') ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {course.grade}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Total Credits: <span className="font-medium text-gray-900">{semester.courses.reduce((sum, c) => sum + c.credits, 0)}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}