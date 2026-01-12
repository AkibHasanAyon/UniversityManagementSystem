import { useState } from 'react';
import { Users, BookOpen, GraduationCap, LogOut, Menu, X } from 'lucide-react';
import { ManageStudents } from './admin/ManageStudents';
import { ManageFaculty } from './admin/ManageFaculty';
import { ManageCourses } from './admin/ManageCourses';
import { AssignCourses } from './admin/AssignCourses';
import { ViewRecords } from './admin/ViewRecords';

interface User {
  role: 'admin' | 'faculty' | 'student';
  name: string;
  email: string;
  id: string;
}

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
}

type AdminView = 'overview' | 'students' | 'faculty' | 'courses' | 'assign' | 'records';

export function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const [currentView, setCurrentView] = useState<AdminView>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: Menu },
    { id: 'students', label: 'Manage Students', icon: Users },
    { id: 'faculty', label: 'Manage Faculty', icon: Users },
    { id: 'courses', label: 'Manage Courses', icon: BookOpen },
    { id: 'assign', label: 'Assign Courses', icon: GraduationCap },
    { id: 'records', label: 'Academic Records', icon: BookOpen },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Sidebar */}
      <aside className={`bg-white shadow-xl transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-md">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-bold text-gray-900">UMS</div>
                <div className="text-xs text-gray-500">Admin Panel</div>
              </div>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gradient-to-br hover:from-blue-50 hover:to-cyan-50 rounded-lg transition-colors"
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
                onClick={() => setCurrentView(item.id as AdminView)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  currentView === item.id
                    ? 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white font-medium shadow-lg'
                    : 'text-gray-700 hover:bg-gradient-to-br hover:from-blue-50 hover:to-cyan-50'
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
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Administrator Dashboard</h1>
              <p className="text-sm text-gray-600">Manage university operations</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="font-medium text-gray-900">{user.name}</div>
                <div className="text-sm text-gray-500">{user.email}</div>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-medium shadow-md">
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
          {currentView === 'students' && <ManageStudents />}
          {currentView === 'faculty' && <ManageFaculty />}
          {currentView === 'courses' && <ManageCourses />}
          {currentView === 'assign' && <AssignCourses />}
          {currentView === 'records' && <ViewRecords />}
        </main>
      </div>
    </div>
  );
}

function OverviewCards() {
  const stats = [
    { label: 'Total Students', value: '2,847', icon: Users, color: 'from-blue-500 to-cyan-500' },
    { label: 'Total Faculty', value: '186', icon: Users, color: 'from-emerald-500 to-teal-500' },
    { label: 'Total Courses', value: '342', icon: BookOpen, color: 'from-purple-500 to-pink-500' },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">System Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

      <div className="mt-8 bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button className="px-4 py-3 bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-lg hover:shadow-lg transition-all transform hover:scale-105 text-left font-medium">
            Add New Student
          </button>
          <button className="px-4 py-3 bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-lg hover:shadow-lg transition-all transform hover:scale-105 text-left font-medium">
            Add New Faculty
          </button>
          <button className="px-4 py-3 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all transform hover:scale-105 text-left font-medium">
            Create New Course
          </button>
        </div>
      </div>
    </div>
  );
}