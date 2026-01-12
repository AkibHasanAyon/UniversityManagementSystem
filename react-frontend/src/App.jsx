import { useState } from 'react';
import { LoginPage } from './components/login/LoginPage';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { FacultyDashboard } from './components/dashboard/FacultyDashboard';
import { StudentDashboard } from './components/dashboard/StudentDashboard';
import './App.css';

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  const handleLogin = (role, email) => {
    // Mock login logic - simulates API response
    const mockUsers = {
      admin: { role: 'admin', name: 'Dr. Ikhtiar Uddin Muhammad Bakhtiyar Khilji', email: email, id: 'ADM001' },
      faculty: { role: 'faculty', name: 'Prof. Michael Chen', email: email, id: 'FAC001' },
      student: { role: 'student', name: 'Emily Rodriguez', email: email, id: 'STU001' }
    };

    if (role && mockUsers[role]) {
      setCurrentUser(mockUsers[role]);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  // If not logged in, show Login Page
  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
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
