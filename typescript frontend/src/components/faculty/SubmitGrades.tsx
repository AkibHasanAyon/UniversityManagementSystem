import { useState } from 'react';
import { CheckCircle } from 'lucide-react';

interface GradeSubmission {
  studentId: string;
  studentName: string;
  grade: string;
}

export function SubmitGrades() {
  const [selectedCourse, setSelectedCourse] = useState('');
  const [grades, setGrades] = useState<GradeSubmission[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const courses = [
    { code: 'CS301', name: 'Database Systems' },
    { code: 'CS302', name: 'Algorithms' },
    { code: 'CS405', name: 'Software Engineering' },
    { code: 'CS201', name: 'Data Structures' },
  ];

  const students = {
    'CS301': [
      { id: 'STU001', name: 'Emily Rodriguez' },
      { id: 'STU002', name: 'James Wilson' },
      { id: 'STU006', name: 'Daniel Kim' },
    ],
    'CS302': [
      { id: 'STU007', name: 'Sarah Thompson' },
      { id: 'STU008', name: 'Alex Morgan' },
    ],
    'CS405': [
      { id: 'STU009', name: 'Jessica Lee' },
    ],
    'CS201': [],
  };

  const handleCourseChange = (courseCode: string) => {
    setSelectedCourse(courseCode);
    const courseStudents = students[courseCode as keyof typeof students] || [];
    setGrades(courseStudents.map(s => ({ studentId: s.id, studentName: s.name, grade: '' })));
  };

  const handleGradeChange = (studentId: string, grade: string) => {
    setGrades(grades.map(g => 
      g.studentId === studentId ? { ...g, grade } : g
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setSelectedCourse('');
      setGrades([]);
    }, 2000);
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Submit Grades</h2>
        <p className="text-sm text-gray-600">Enter and submit student grades for your courses</p>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="mb-6 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg p-4 flex items-center gap-3 shadow-md">
          <CheckCircle className="w-5 h-5 text-emerald-600" />
          <span className="text-emerald-800 font-medium">Grades submitted successfully!</span>
        </div>
      )}

      {/* Course Selection */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Course <span className="text-red-500">*</span>
        </label>
        <select
          value={selectedCourse}
          onChange={(e) => handleCourseChange(e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
        >
          <option value="">Choose a course...</option>
          {courses.map(course => (
            <option key={course.code} value={course.code}>{course.code} - {course.name}</option>
          ))}
        </select>
      </div>

      {/* Grade Entry Form */}
      {selectedCourse && grades.length > 0 && (
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">Enter Grades</h3>
            </div>
            <div className="p-6 space-y-4">
              {grades.map((gradeEntry) => (
                <div key={gradeEntry.studentId} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{gradeEntry.studentName}</div>
                    <div className="text-sm text-gray-600">{gradeEntry.studentId}</div>
                  </div>
                  <div className="w-32">
                    <select
                      value={gradeEntry.grade}
                      onChange={(e) => handleGradeChange(gradeEntry.studentId, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                      required
                    >
                      <option value="">Grade</option>
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
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
          >
            Submit All Grades
          </button>
        </form>
      )}

      {selectedCourse && grades.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <p className="text-gray-600">No students enrolled in this course yet.</p>
        </div>
      )}
    </div>
  );
}