import { useState } from 'react';
import { LoginPage } from './components/LoginPage';
import { AdminDashboard } from './components/AdminDashboard';
import { FacultyDashboard } from './components/FacultyDashboard';
import { StudentDashboard } from './components/StudentDashboard';

type UserRole = 'admin' | 'faculty' | 'student' | null;

interface User {
  role: UserRole;
  name: string;
  email: string;
  id: string;
}

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleLogin = (role: UserRole, email: string) => {
    // Mock login - in real app, this would authenticate with backend
    const mockUsers = {
      admin: { role: 'admin' as UserRole, name: 'Dr. Sarah Johnson', email: email, id: 'ADM001' },
      faculty: { role: 'faculty' as UserRole, name: 'Prof. Michael Chen', email: email, id: 'FAC001' },
      student: { role: 'student' as UserRole, name: 'Emily Rodriguez', email: email, id: 'STU001' }
    };
    
    if (role) {
      setCurrentUser(mockUsers[role]);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <>
      {currentUser.role === 'admin' && <AdminDashboard user={currentUser} onLogout={handleLogout} />}
      {currentUser.role === 'faculty' && <FacultyDashboard user={currentUser} onLogout={handleLogout} />}
      {currentUser.role === 'student' && <StudentDashboard user={currentUser} onLogout={handleLogout} />}
    </>
  );
}
