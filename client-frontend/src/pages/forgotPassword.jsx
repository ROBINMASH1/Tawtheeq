import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = () => {
    if (!email) return;
    // send reset email logic goes here
    console.log('Sending reset to:', email);
    setSent(true);
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
                  No worries. Enter your email and we'll send you a reset link.
                </p>
              </div>

              {/* Form */}
              <div className="flex flex-col gap-5">

                {/* Email */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                  />
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  className="w-full bg-green-500 hover:bg-green-600 active:scale-95 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-200"
                >
                  Send Reset Link
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"/>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                  </svg>
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
            /* Success State */
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
                  We sent a password reset link to{' '}
                  <span className="text-gray-900 dark:text-white font-semibold">{email}</span>
                </p>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl px-4 py-3">
                <p className="text-sm text-green-700 dark:text-green-400">
                  Didn't receive the email? Check your spam folder or{' '}
                  <button
                    onClick={() => setSent(false)}
                    className="font-semibold underline hover:no-underline"
                  >
                    try again
                  </button>
                  .
                </p>
              </div>

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