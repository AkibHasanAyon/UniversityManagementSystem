export function ViewAssignedCourses() {
  const courses = [
    { code: 'CS301', name: 'Database Systems', semester: 'Fall 2025', students: 48, credits: 3 },
    { code: 'CS302', name: 'Algorithms', semester: 'Spring 2026', students: 52, credits: 3 },
    { code: 'CS405', name: 'Software Engineering', semester: 'Fall 2025', students: 45, credits: 4 },
    { code: 'CS201', name: 'Data Structures', semester: 'Spring 2026', students: 42, credits: 3 },
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Assigned Courses</h2>
        <p className="text-sm text-gray-600">View your teaching assignments</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map((course, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{course.code}</h3>
                <p className="text-sm text-gray-600">{course.name}</p>
              </div>
              <span className="px-3 py-1 bg-gradient-to-br from-emerald-500 to-teal-500 text-white text-xs font-medium rounded-full shadow-md">
                Active
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Semester:</span>
                <span className="font-medium text-gray-900">{course.semester}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Enrolled Students:</span>
                <span className="font-medium text-gray-900">{course.students}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Credits:</span>
                <span className="font-medium text-gray-900">{course.credits}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <button className="w-full px-4 py-2 bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-lg hover:shadow-lg transition-all text-sm font-medium transform hover:scale-105">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}