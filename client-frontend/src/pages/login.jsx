import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

const redirectByRole = (decoded) => {
  const roleModel = decoded?.roleModel?.toLowerCase();

  switch (roleModel) {
    case "student":
      if (decoded?.isActive === false) return navigate("/profile-setup");
      return navigate("/student-dashboard");

    case "uniuser": {
      const subRole = decoded?.subRole?.toLowerCase();
      if (subRole === "uniadmin") return navigate("/admin-dashboard");
      if (subRole === "unistuff") return navigate("/staff-dashboard");
      return navigate("/");
    }

    case "moheadmin":
      return navigate("/mohe-dashboard");

    default:
      return navigate("/");
  }
};

  const handleLogin = async () => {
    setError("");

    if (!identifier || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await response.json();
      console.log("Login response:", data);
      if (!response.ok) {
        setError(data.message || "Invalid email or password.");
        return;
      }

      const { token } = data;

      login(token);

      // read role from AuthContext's decoded user
      const decoded = JSON.parse(atob(token.split(".")[1]));
      if (!decoded) {
        setError("Invalid token received. Please try again.");
        return;
      }

      redirectByRole(decoded);
    } catch {
      setError("Unable to connect to the server. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex">
      {/* Left — Image Panel */}
      <div
        className="hidden lg:block w-1/2 bg-cover bg-center"
        style={{ backgroundImage: "url('green.webp')" }}
      />

      {/* Right — Form Panel */}
      <div
        className="w-full lg:w-1/2 bg-white dark:bg-gray-950 flex items-center justify-center px-8 py-16"
        style={{ animation: "fadeSlideIn 0.6s ease forwards" }}
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
            {/* Error message */}
            {error && (
              <div className="flex items-center gap-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm px-4 py-3 rounded-xl">
                <svg
                  className="w-4 h-4 shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </div>
            )}

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Nashonal ID / Username
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="Enter your National ID or Username"
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
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <svg
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
              <div className="flex justify-end">
                <Link
                  to="/forgot-password"
                  className="text-sm text-green-500 hover:text-green-600 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            {/* Sign In Button */}
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-600 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-200"
            >
              {loading ? (
                <>
                  <svg
                    className="w-4 h-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M21 12a9 9 0 11-6.219-8.56" />
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </>
              )}
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
