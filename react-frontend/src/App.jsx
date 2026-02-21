import React from 'react';
import { LoginPage } from './components/login/LoginPage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { FacultyDashboard } from './components/faculty/FacultyDashboard';
import { StudentDashboard } from './components/student/StudentDashboard';
import { useAuth } from './context/AuthContext.jsx';
import './App.css';

function App() {
  const { user, isAuthenticated, logout } = useAuth();

  // If not logged in, show Login Page
  if (!isAuthenticated || !user) {
    return <LoginPage />;
  }

  // If logged in, show the appropriate dashboard
  return (
    <div className="app-root">
      {user.role === 'admin' && <AdminDashboard user={user} onLogout={logout} />}
      {user.role === 'faculty' && <FacultyDashboard user={user} onLogout={logout} />}
      {user.role === 'student' && <StudentDashboard user={user} onLogout={logout} />}
    </div>
  );
}

export default App;
