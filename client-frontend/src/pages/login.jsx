import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // login logic goes here
    console.log('Logging in:', email, password);
  };

  return (
    <div className="min-h-screen flex">

      {/* Left — Image Panel */}
      <div
        className="hidden lg:block w-1/2 bg-cover bg-center"
        style={{ backgroundImage: "url('green.webp')" }}
      />

      {/* Right — Form Panel */}
      <div className="w-full lg:w-1/2 bg-white dark:bg-gray-950 flex items-center justify-center px-8 py-16"
        style={{ animation: 'fadeSlideIn 0.6s ease forwards' }}>

        <div className="w-full max-w-md flex flex-col gap-8">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img src="badge.png" alt="Tawtheeq Logo" />
            <span className="font-semibold text-2xl">
              <span className="text-gray-900 dark:text-white">Taw</span>
              <span className="text-green-500">theeq</span>
            </span>
          </Link>

          {/* Heading */}
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">
              Welcome back
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Sign in to continue managing your credentials
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
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
              <div className="flex justify-end">
                <Link to="/forgot-password" className="text-sm text-green-500 hover:text-green-600 transition-colors">
                  Forgot password?
                </Link>
              </div>
            </div>

            {/* Sign In Button */}
            <button
              onClick={handleLogin}
              className="w-full bg-green-500 hover:bg-green-600 active:scale-95 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-200"
            >
              Sign In
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </button>





          </div>
        </div>
      </div>

      {/* Animation */}
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateX(30px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>

    </div>
  );
}