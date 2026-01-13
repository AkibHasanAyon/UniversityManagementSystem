import React, { useState } from 'react';
import { GraduationCap } from 'lucide-react';
import '../../styles/LoginPage.css';
import bgImage from '../../assets/login-bg.png';

/**
 * LoginPage Component
 * Handles user login and role selection.
 * @param {function} onLogin - Callback function when user logs in successfully
 */
export function LoginPage({ onLogin }) {
    // State for the selected role (admin, faculty, or student)
    const [selectedRole, setSelectedRole] = useState('student');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real app, validate credentials here.
        // For now, we just pass the role and email to the parent component.
        onLogin(selectedRole, email);
    };

    return (
        <div
            className="login-page"
            style={{
                backgroundImage: `url(${bgImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}
        >
            <div className="login-card">
                {/* Logo and Title */}
                <div className="login-header">
                    <div className="logo-container">
                        <GraduationCap className="logo-icon" size={32} />
                    </div>
                    <h1>University Portal</h1>
                    <p>Management System</p>
                </div>

                {/* Role Selection */}
                <div className="role-section">
                    <label className="section-label">Select Role</label>
                    <div className="role-buttons">
                        <button
                            type="button"
                            onClick={() => setSelectedRole('admin')}
                            className={`role-btn admin ${selectedRole === 'admin' ? 'active' : ''}`}
                        >
                            Admin
                        </button>
                        <button
                            type="button"
                            onClick={() => setSelectedRole('faculty')}
                            className={`role-btn faculty ${selectedRole === 'faculty' ? 'active' : ''}`}
                        >
                            Faculty
                        </button>
                        <button
                            type="button"
                            onClick={() => setSelectedRole('student')}
                            className={`role-btn student ${selectedRole === 'student' ? 'active' : ''}`}
                        >
                            Student
                        </button>
                    </div>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="email">Email / Username</label>
                        <input
                            type="text"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <button type="submit" className="signin-btn">
                        Sign In
                    </button>

                    <div className="forgot-password">
                        <button
                            type="button"
                            className="text-btn"
                            onClick={() => alert('Password reset link has been sent to your email')}
                        >
                            Forgot Password?
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
