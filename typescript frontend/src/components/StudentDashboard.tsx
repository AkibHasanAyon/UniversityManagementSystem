import { useState } from 'react';
import { BookOpen, Award, LogOut, Menu, X, GraduationCap, FileText } from 'lucide-react';
import { ViewEnrollment } from './student/ViewEnrollment';
import { ViewGrades } from './student/ViewGrades';
import { AcademicHistory } from './student/AcademicHistory';

interface User {
  role: 'admin' | 'faculty' | 'student';
  name: string;
  email: string;
  id: string;
}

interface StudentDashboardProps {
  user: User;
  onLogout: () => void;
}

type StudentView = 'overview' | 'enrollment' | 'grades' | 'history';

export function StudentDashboard({ user, onLogout }: StudentDashboardProps) {
  const [currentView, setCurrentView] = useState<StudentView>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: Menu },
    { id: 'enrollment', label: 'Course Enrollment', icon: BookOpen },
    { id: 'grades', label: 'View Grades', icon: Award },
    { id: 'history', label: 'Academic Records', icon: FileText },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
      {/* Sidebar */}
      <aside className={`bg-white shadow-xl transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-md">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-bold text-gray-900">UMS</div>
                <div className="text-xs text-gray-500">Student Portal</div>
              </div>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50 rounded-lg transition-colors"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id as StudentView)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  currentView === item.id
                    ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white font-medium shadow-lg'
                    : 'text-gray-700 hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Student Dashboard</h1>
              <p className="text-sm text-gray-600">Track your academic progress</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="font-medium text-gray-900">{user.name}</div>
                <div className="text-sm text-gray-500">{user.email}</div>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-medium shadow-md">
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>
              <button
                onClick={onLogout}
                className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                title="Logout"
              >
                <LogOut className="w-5 h-5 text-gray-600 group-hover:text-red-600" />
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          {currentView === 'overview' && <OverviewCards />}
          {currentView === 'enrollment' && <ViewEnrollment />}
          {currentView === 'grades' && <ViewGrades />}
          {currentView === 'history' && <AcademicHistory />}
        </main>
      </div>
    </div>
  );
}

function OverviewCards() {
  const stats = [
    { label: 'Enrolled Courses', value: '5', icon: BookOpen, color: 'from-purple-500 to-pink-500' },
    { label: 'Current GPA', value: '3.72', icon: Award, color: 'from-blue-500 to-cyan-500' },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">Your Academic Summary</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`bg-gradient-to-br ${stat.color} w-14 h-14 rounded-xl flex items-center justify-center shadow-lg`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 bg-gradient-to-br from-white to-purple-50 rounded-xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Current Semester Courses</h3>
        <div className="space-y-3">
          {['CS301 - Database Systems', 'MATH201 - Linear Algebra', 'PHY101 - Physics I', 'ENG202 - Technical Writing', 'CS302 - Algorithms'].map((course, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm border border-purple-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-900">{course}</span>
              </div>
              <span className="text-xs px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full font-medium">In Progress</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}