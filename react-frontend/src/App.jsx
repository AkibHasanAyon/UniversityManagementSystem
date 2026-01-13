import { useState } from 'react';
import { LoginPage } from './components/login/LoginPage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { FacultyDashboard } from './components/faculty/FacultyDashboard';
import { StudentDashboard } from './components/student/StudentDashboard';
import './App.css';

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  const handleLogin = (role, email) => {
    // Mock login logic - simulates API response
    const mockUsers = {
      admin: { role: 'admin', name: 'Dr. Harun Ur Rashid', email: email, id: 'ADM001' },
      faculty: { role: 'faculty', name: 'Prof. Rahman', email: email, id: 'FAC001' },
      student: { role: 'student', name: 'Ayesha Siddiqua', email: email, id: 'STU001' }
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
