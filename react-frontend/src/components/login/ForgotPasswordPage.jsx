import React, { useState, useRef, useEffect } from 'react';
import { GraduationCap, ArrowLeft, Mail, KeyRound, ShieldCheck, CheckCircle } from 'lucide-react';
import { forgotPassword, verifyOtp, resetPassword } from '../../services/api';
import '../../styles/LoginPage.css';
import '../../styles/ForgotPassword.css';
import bgImage from '../../assets/login-bg.png';

/**
 * ForgotPasswordPage — Multi-step OTP password reset flow.
 * Steps: 1) Enter Email → 2) Enter OTP → 3) New Password → 4) Success
 */
export function ForgotPasswordPage({ onBackToLogin }) {
    const [step, setStep] = useState(1); // 1=email, 2=otp, 3=password, 4=success
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '']);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);

    const otpRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

    // Resend countdown timer
    useEffect(() => {
        if (resendTimer <= 0) return;
        const t = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
        return () => clearTimeout(t);
    }, [resendTimer]);

    // Auto-focus first OTP input when entering step 2
    useEffect(() => {
        if (step === 2 && otpRefs[0].current) {
            otpRefs[0].current.focus();
        }
    }, [step]);

    // ─── Step 1: Send OTP ──────────────────────────────────────────────
    const handleSendOtp = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await forgotPassword(email);
            setStep(2);
            setResendTimer(60);
            setSuccessMsg('');
        } catch (err) {
            const errData = err.response?.data;
            const msg =
                errData?.errors?.email?.[0] ||
                errData?.message ||
                errData?.detail ||
                'Failed to send OTP. Please try again.';
            setError(msg);
        } finally {
            setIsLoading(false);
        }
    };

    // ─── Step 2: Verify OTP ────────────────────────────────────────────
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        const otpString = otp.join('');
        if (otpString.length !== 4) {
            setError('Please enter the complete 4-digit code.');
            return;
        }
        setError('');
        setIsLoading(true);

        try {
            await verifyOtp(email, otpString);
            setStep(3);
            setSuccessMsg('');
        } catch (err) {
            const errData = err.response?.data;
            const msg =
                errData?.errors?.non_field_errors?.[0] ||
                errData?.message ||
                errData?.detail ||
                'Invalid OTP. Please try again.';
            setError(msg);
        } finally {
            setIsLoading(false);
        }
    };

    // ─── Step 3: Reset Password ────────────────────────────────────────
    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        setError('');
        setIsLoading(true);

        try {
            const otpString = otp.join('');
            await resetPassword(email, otpString, newPassword);
            setStep(4);
        } catch (err) {
            const errData = err.response?.data;
            const msg =
                errData?.errors?.non_field_errors?.[0] ||
                errData?.message ||
                errData?.detail ||
                'Failed to reset password. Please try again.';
            setError(msg);
        } finally {
            setIsLoading(false);
        }
    };

    // ─── Resend OTP ────────────────────────────────────────────────────
    const handleResend = async () => {
        setError('');
        setSuccessMsg('');
        try {
            await forgotPassword(email);
            setOtp(['', '', '', '']);
            setResendTimer(60);
            setSuccessMsg('A new OTP has been sent to your email.');
            if (otpRefs[0].current) otpRefs[0].current.focus();
        } catch {
            setError('Failed to resend OTP. Please try again.');
        }
        setTimeout(() => setSuccessMsg(''), 4000);
    };

    // ─── OTP Input Handlers ────────────────────────────────────────────
    const handleOtpChange = (index, value) => {
        // Only accept digits
        if (value && !/^\d$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 3) {
            otpRefs[index + 1].current?.focus();
        }
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs[index - 1].current?.focus();
        }
    };

    const handleOtpPaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').trim();
        if (/^\d{4}$/.test(pasted)) {
            setOtp(pasted.split(''));
            otpRefs[3].current?.focus();
        }
    };

    // ─── Step Indicator ────────────────────────────────────────────────
    const renderStepIndicator = () => (
        <div className="step-indicator">
            {[1, 2, 3].map((s, i) => (
                <React.Fragment key={s}>
                    <div className={`step-dot ${step > s ? 'completed' : step === s ? 'active' : ''}`}>
                        {step > s ? '✓' : s}
                    </div>
                    {i < 2 && <div className={`step-line ${step > s ? 'active' : ''}`} />}
                </React.Fragment>
            ))}
        </div>
    );

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
                    <p>Password Recovery</p>
                </div>

                {step < 4 && renderStepIndicator()}

                {/* Error Alert */}
                {error && <div className="alert-error">{error}</div>}

                {/* Success Alert */}
                {successMsg && <div className="alert-success">{successMsg}</div>}

                {/* ─── STEP 1: Enter Email ─── */}
                {step === 1 && (
                    <>
                        <p className="forgot-subtitle">
                            Enter the email address associated with your account and we'll send you a verification code.
                        </p>
                        <form onSubmit={handleSendOtp} className="login-form">
                            <div className="form-group">
                                <label htmlFor="forgot-email">
                                    <Mail size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="forgot-email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    required
                                    autoFocus
                                />
                            </div>
                            <button type="submit" className="signin-btn" disabled={isLoading}>
                                {isLoading ? 'Sending...' : 'Send Verification Code'}
                            </button>
                        </form>
                        <div className="forgot-password">
                            <button type="button" className="back-link" onClick={onBackToLogin}>
                                <ArrowLeft size={14} /> Back to Login
                            </button>
                        </div>
                    </>
                )}

                {/* ─── STEP 2: Enter OTP ─── */}
                {step === 2 && (
                    <>
                        <p className="forgot-subtitle">
                            We've sent a 4-digit verification code to your email
                        </p>
                        <div className="email-display">{email}</div>
                        <form onSubmit={handleVerifyOtp} className="login-form">
                            <div className="otp-input-group" onPaste={handleOtpPaste}>
                                {otp.map((digit, i) => (
                                    <input
                                        key={i}
                                        ref={otpRefs[i]}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        className={`otp-input ${digit ? 'filled' : ''}`}
                                        value={digit}
                                        onChange={(e) => handleOtpChange(i, e.target.value)}
                                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                                        autoComplete="off"
                                    />
                                ))}
                            </div>
                            <button type="submit" className="signin-btn" disabled={isLoading}>
                                {isLoading ? 'Verifying...' : 'Verify Code'}
                            </button>
                        </form>
                        <div className="resend-section">
                            {resendTimer > 0 ? (
                                <span>Resend code in <strong>{resendTimer}s</strong></span>
                            ) : (
                                <button className="resend-btn" onClick={handleResend}>
                                    Resend Code
                                </button>
                            )}
                        </div>
                        <div className="forgot-password" style={{ marginTop: '0.75rem' }}>
                            <button type="button" className="back-link" onClick={() => { setStep(1); setError(''); setOtp(['', '', '', '']); }}>
                                <ArrowLeft size={14} /> Change Email
                            </button>
                        </div>
                    </>
                )}

                {/* ─── STEP 3: New Password ─── */}
                {step === 3 && (
                    <>
                        <p className="forgot-subtitle">
                            Create a new password for your account
                        </p>
                        <form onSubmit={handleResetPassword} className="login-form">
                            <div className="form-group">
                                <label htmlFor="new-password">
                                    <KeyRound size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    id="new-password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Enter new password"
                                    required
                                    autoFocus
                                />
                                <p className="password-requirements">Minimum 6 characters</p>
                            </div>
                            <div className="form-group">
                                <label htmlFor="confirm-password">
                                    <ShieldCheck size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    id="confirm-password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm new password"
                                    required
                                />
                            </div>
                            <button type="submit" className="signin-btn" disabled={isLoading}>
                                {isLoading ? 'Resetting...' : 'Reset Password'}
                            </button>
                        </form>
                    </>
                )}

                {/* ─── STEP 4: Success ─── */}
                {step === 4 && (
                    <div className="success-container">
                        <div className="success-icon-wrapper">
                            <CheckCircle size={40} color="white" />
                        </div>
                        <h2>Password Reset Complete!</h2>
                        <p>Your password has been changed successfully. You can now sign in with your new password.</p>
                        <button className="signin-btn" onClick={onBackToLogin}>
                            Back to Login
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
