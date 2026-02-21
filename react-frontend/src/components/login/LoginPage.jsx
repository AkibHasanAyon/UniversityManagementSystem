import React, { useState } from 'react';
import { GraduationCap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { authApi } from '../../api/authApi';
import '../../styles/LoginPage.css';
import bgImage from '../../assets/login-bg.png';

export function LoginPage() {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(email, password);
        if (!result.success) {
            setError(result.error);
        }
        setLoading(false);
    };

    const handleForgotPassword = async () => {
        if (!email) {
            setError('Please enter your email first to reset password.');
            return;
        }
        try {
            await authApi.forgotPassword(email);
            setMessage('Password reset link has been sent to your email.');
            setError('');
        } catch (err) {
            setError('Failed to send reset link. Please try again.');
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

                {error && <div className="alert-error" style={{ color: '#dc2626', backgroundColor: '#fee2e2', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem', textAlign: 'center', fontSize: '0.875rem' }}>{error}</div>}
                {message && <div className="alert-success" style={{ color: '#16a34a', backgroundColor: '#dcfce7', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem', textAlign: 'center', fontSize: '0.875rem' }}>{message}</div>}

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

                    <button type="submit" className="signin-btn" disabled={loading}>
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>

                    <div className="forgot-password">
                        <button
                            type="button"
                            className="text-btn"
                            onClick={handleForgotPassword}
                        >
                            Forgot Password?
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
