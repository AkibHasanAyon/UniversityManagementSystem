import React, { useState } from 'react';
import { GraduationCap } from 'lucide-react';
import '../../styles/LoginPage.css';
import bgImage from '../../assets/login-bg.png';

/**
 * LoginPage Component
 * Handles user login and role selection.
 * @param {function} onLogin - Callback: onLogin(email, password) => Promise
 * @param {function} onForgotPassword - Callback to navigate to forgot password page
 */
export function LoginPage({ onLogin, onForgotPassword }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await onLogin(email, password);
        } catch (err) {
            const msg =
                err.response?.data?.detail ||
                err.response?.data?.message ||
                err.response?.data?.error ||
                'Invalid credentials. Please try again.';
            setError(msg);
        } finally {
            setIsLoading(false);
        }
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

                {/* Welcome subtitle */}
                <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '0.9rem', marginBottom: '8px' }}>
                    Sign in with your university credentials
                </p>

                {/* Error Message */}
                {error && (
                    <div style={{
                        background: '#fef2f2',
                        border: '1px solid #fecaca',
                        color: '#dc2626',
                        padding: '10px 16px',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        marginBottom: '8px'
                    }}>
                        {error}
                    </div>
                )}

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

                    <button type="submit" className="signin-btn" disabled={isLoading}>
                        {isLoading ? 'Signing In...' : 'Sign In'}
                    </button>

                    <div className="forgot-password">
                        <button
                            type="button"
                            className="text-btn"
                            onClick={onForgotPassword}
                        >
                            Forgot Password?
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
