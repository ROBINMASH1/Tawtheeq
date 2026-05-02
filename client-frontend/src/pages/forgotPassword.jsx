import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API_URL from '../config/api';

export default function ForgotPassword() {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [timer, setTimer] = useState(300); // 5 minutes in seconds

  useEffect(() => {
    let interval;
    if (sent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [sent, timer]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSendOtp = async () => {
    if (!email) return;
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const response = await fetch(`${API_URL}/api/students/send-otp-forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message || "OTP sent to your email. Please verify to reset your password.");
        setSent(true);
        setTimer(300); // Reset timer
      } else {
        setError(data.message || 'Failed to send OTP.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || !newPassword || !confirmPassword) {
      setError('Please fill all fields.');
      return;
    }
    if (newPassword.length < 8) {
      setError('Password should be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch(`${API_URL}/api/students/verify-otp-forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      const data = await response.json();
      
      if (response.ok) {
        setMessage(data.message || "Password reset successfully.");
        // Delay redirect slightly so user sees the message
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(data.message || 'Failed to verify OTP or reset password.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* Left — Form Panel */}
      <div
        className="w-full lg:w-1/2 bg-white dark:bg-gray-950 flex items-center justify-center px-8 py-16"
        style={{ animation: 'fadeSlideIn 0.6s ease forwards' }}
      >
        <div className="w-full max-w-md flex flex-col gap-8">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img src="badge.png" alt="Tawtheeq Logo" />
            <span className="font-semibold text-2xl">
              <span className="text-gray-900 dark:text-white">Taw</span>
              <span className="text-green-500">theeq</span>
            </span>
          </Link>

          {!sent ? (
            <>
              {/* Heading */}
              <div className="flex flex-col gap-2">
                <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mb-2">
                  <svg className="w-7 h-7 text-green-500 dark:text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2"/>
                    <path d="M7 11V7a5 5 0 0110 0v4"/>
                  </svg>
                </div>
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">
                  Forgot password?
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                  No worries. Enter your email and we'll send you an OTP to reset your password.
                </p>
              </div>

              {/* Form */}
              <div className="flex flex-col gap-5">

                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm border border-red-200 dark:border-red-800">
                    {error}
                  </div>
                )}
                {message && (
                  <div className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 p-3 rounded-lg text-sm border border-green-200 dark:border-green-800">
                    {message}
                  </div>
                )}

                {/* Email */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendOtp()}
                    placeholder="you@example.com"
                    disabled={loading}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 transition disabled:opacity-50"
                  />
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSendOtp}
                  disabled={loading || !email}
                  className="w-full bg-green-500 hover:bg-green-600 disabled:opacity-70 disabled:cursor-not-allowed active:scale-95 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-200"
                >
                  {loading ? 'Sending...' : 'Send OTP'}
                  {!loading && (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13"/>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                    </svg>
                  )}
                </button>

                {/* Back to login */}
                <Link
                  to="/login"
                  className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"/>
                    <polyline points="12 19 5 12 12 5"/>
                  </svg>
                  Back to Sign In
                </Link>

              </div>
            </>
          ) : (
            /* OTP Verification State */
            <div className="flex flex-col gap-6" style={{ animation: 'fadeSlideIn 0.5s ease forwards' }}>
              <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center">
                <svg className="w-7 h-7 text-green-500 dark:text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <div>
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
                  Check your email
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                  We sent an OTP to{' '}
                  <span className="text-gray-900 dark:text-white font-semibold">{email}</span>
                </p>
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm border border-red-200 dark:border-red-800">
                  {error}
                </div>
              )}
              {message && (
                <div className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 p-3 rounded-lg text-sm border border-green-200 dark:border-green-800">
                  {message}
                </div>
              )}

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    OTP Code
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 6-digit OTP"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleVerifyOtp()}
                    placeholder="Confirm your new password"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                  />
                </div>

                <button
                  onClick={handleVerifyOtp}
                  disabled={loading}
                  className="w-full bg-green-500 hover:bg-green-600 disabled:opacity-70 disabled:cursor-not-allowed active:scale-95 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 mt-2"
                >
                  {loading ? 'Verifying...' : 'Reset Password'}
                </button>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-4 flex flex-col items-center justify-center gap-2">
                {timer > 0 ? (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    OTP expires in <span className="font-bold text-gray-900 dark:text-white">{formatTime(timer)}</span>
                  </p>
                ) : (
                  <p className="text-sm text-gray-600 dark:text-gray-400 flex flex-col items-center gap-2">
                    <span>OTP has expired.</span>
                    <button
                      onClick={handleSendOtp}
                      disabled={loading}
                      className="font-semibold text-green-600 dark:text-green-400 hover:underline"
                    >
                      Request a new OTP
                    </button>
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between text-sm mt-2">
                 <button
                    onClick={() => { setSent(false); setTimer(300); setMessage(''); setError(''); setOtp(''); setNewPassword(''); setConfirmPassword(''); }}
                    className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    Change email address
                  </button>
              </div>

              <Link
                to="/login"
                className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mt-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12"/>
                  <polyline points="12 19 5 12 12 5"/>
                </svg>
                Back to Sign In
              </Link>
            </div>
          )}

        </div>
      </div>

      {/* Right — Image Panel */}
      <div
        className="hidden lg:block w-1/2 bg-cover bg-center"
        style={{ backgroundImage: "url('0x0.webp')" }}
      />

      {/* Animation */}
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateX(-30px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>

    </div>
  );
}