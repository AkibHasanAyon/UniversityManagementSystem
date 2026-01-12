export function ViewGrades() {
  const grades = [
    { courseCode: 'CS301', courseName: 'Database Systems', grade: 'A', credits: 3, semester: 'Fall 2025' },
    { courseCode: 'MATH201', courseName: 'Linear Algebra', grade: 'A-', credits: 4, semester: 'Fall 2025' },
    { courseCode: 'PHY101', courseName: 'Physics I', grade: 'B+', credits: 4, semester: 'Fall 2025' },
    { courseCode: 'ENG202', courseName: 'Technical Writing', grade: 'A', credits: 3, semester: 'Fall 2025' },
    { courseCode: 'CS302', courseName: 'Algorithms', grade: 'A-', credits: 3, semester: 'Fall 2025' },
  ];

  const gradePoints: { [key: string]: number } = {
    'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7,
    'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D': 1.0, 'F': 0.0
  };

  const calculateGPA = () => {
    const totalPoints = grades.reduce((sum, g) => sum + (gradePoints[g.grade] * g.credits), 0);
    const totalCredits = grades.reduce((sum, g) => sum + g.credits, 0);
    return (totalPoints / totalCredits).toFixed(2);
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">View Grades</h2>
        <p className="text-sm text-gray-600">Your academic performance summary</p>
      </div>

      {/* GPA Card */}
      <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 rounded-xl shadow-xl p-6 mb-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-100 mb-1">Current GPA</p>
            <p className="text-4xl font-bold">{calculateGPA()}</p>
            <p className="text-purple-100 text-sm mt-2">Fall 2025 Semester</p>
          </div>
          <div className="text-right">
            <p className="text-purple-100 text-sm">Total Credits</p>
            <p className="text-2xl font-bold">{grades.reduce((sum, g) => sum + g.credits, 0)}</p>
          </div>
        </div>
      </div>

      {/* Grades Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credits</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade Points</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Semester</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {grades.map((grade, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{grade.courseCode}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{grade.courseName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{grade.credits}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      grade.grade.startsWith('A') ? 'bg-green-100 text-green-800' :
                      grade.grade.startsWith('B') ? 'bg-blue-100 text-blue-800' :
                      grade.grade.startsWith('C') ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {grade.grade}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{gradePoints[grade.grade].toFixed(1)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{grade.semester}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-lg p-4 text-white">
          <p className="text-sm text-blue-100 mb-1">Total Courses</p>
          <p className="text-2xl font-bold">{grades.length}</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl shadow-lg p-4 text-white">
          <p className="text-sm text-emerald-100 mb-1">Average Grade</p>
          <p className="text-2xl font-bold">{calculateGPA()}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg p-4 text-white">
          <p className="text-sm text-purple-100 mb-1">Credits Earned</p>
          <p className="text-2xl font-bold">{grades.reduce((sum, g) => sum + g.credits, 0)}</p>
        </div>
      </div>
    </div>
  );
}