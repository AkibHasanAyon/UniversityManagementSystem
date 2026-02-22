import { useState, useEffect } from 'react';
import { LoginPage } from './components/login/LoginPage';
import { ForgotPasswordPage } from './components/login/ForgotPasswordPage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { FacultyDashboard } from './components/faculty/FacultyDashboard';
import { StudentDashboard } from './components/student/StudentDashboard';
import { login as apiLogin, logout as apiLogout, getStoredUser, isAuthenticated } from './services/api';
import './App.css';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // Restore session on mount
  useEffect(() => {
    if (isAuthenticated()) {
      const stored = getStoredUser();
      if (stored) {
        setCurrentUser(buildUser(stored));
      }
    }
    setLoading(false);
  }, []);

  // Build a normalized user object from backend response
  function buildUser(apiUser) {
    if (!apiUser) return null;
    const role = apiUser.role;
    const name = apiUser.name || [apiUser.first_name, apiUser.last_name].filter(Boolean).join(' ') || 'User';
    const email = apiUser.email;
    const id = apiUser.student_id || apiUser.faculty_id || apiUser.id || '';
    return { role, name, email, id };
  }

  const handleLogin = async (email, password) => {
    const apiUser = await apiLogin(email, password);
    const user = buildUser(apiUser);
    setCurrentUser(user);
    return user;
  };

  const handleLogout = async () => {
    await apiLogout();
    setCurrentUser(null);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Loading...</p>
      </div>
    );
  }

  // If not logged in, show Login or Forgot Password page
  if (!currentUser) {
    if (showForgotPassword) {
      return <ForgotPasswordPage onBackToLogin={() => setShowForgotPassword(false)} />;
    }
    return (
      <LoginPage
        onLogin={handleLogin}
        onForgotPassword={() => setShowForgotPassword(true)}
      />
    );
  }

  // If logged in, show the appropriate dashboard
  return (
    <div className="app-root">
      {currentUser.role === 'admin' && <AdminDashboard user={currentUser} onLogout={handleLogout} />}
      {currentUser.role === 'faculty' && <FacultyDashboard user={currentUser} onLogout={handleLogout} />}
      {currentUser.role === 'student' && <StudentDashboard user={currentUser} onLogout={handleLogout} />}
    </div>
  );
}

export default App;
