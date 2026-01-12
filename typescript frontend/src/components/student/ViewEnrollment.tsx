export function ViewEnrollment() {
  const enrolledCourses = [
    { code: 'CS301', name: 'Database Systems', instructor: 'Prof. Michael Chen', credits: 3, semester: 'Fall 2025', status: 'Active' },
    { code: 'MATH201', name: 'Linear Algebra', instructor: 'Dr. Sarah Johnson', credits: 4, semester: 'Fall 2025', status: 'Active' },
    { code: 'PHY101', name: 'Physics I', instructor: 'Prof. David Martinez', credits: 4, semester: 'Fall 2025', status: 'Active' },
    { code: 'ENG202', name: 'Technical Writing', instructor: 'Dr. Rebecca Smith', credits: 3, semester: 'Fall 2025', status: 'Active' },
    { code: 'CS302', name: 'Algorithms', instructor: 'Prof. Michael Chen', credits: 3, semester: 'Fall 2025', status: 'Active' },
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Course Enrollment</h2>
        <p className="text-sm text-gray-600">Your currently enrolled courses</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instructor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credits</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Semester</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {enrolledCourses.map((course, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{course.code}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{course.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{course.instructor}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{course.credits}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{course.semester}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                      {course.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4 shadow-md">
        <h3 className="font-medium text-blue-900 mb-2">Enrollment Summary</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-blue-700">Total Courses:</span>
            <span className="ml-2 font-medium text-blue-900">{enrolledCourses.length}</span>
          </div>
          <div>
            <span className="text-blue-700">Total Credits:</span>
            <span className="ml-2 font-medium text-blue-900">
              {enrolledCourses.reduce((sum, course) => sum + course.credits, 0)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}