import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect, useRef } from 'react';

export default function Navbar() {
  const { dark, toggleDark } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [visible, setVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastScrollY = useRef(0);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < lastScrollY.current || currentScrollY < 10) {
        setVisible(true);
      } else {
        setVisible(false);
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDashboardRedirect = () => {
    setMenuOpen(false);
    switch (user?.roleModel?.toLowerCase()) {
      case "student":
        return navigate("/student-dashboard");
      case "uniuser": {
        const subRole = user?.subRole?.toLowerCase();
        if (subRole === "uniadmin") return navigate("/admin-dashboard");
        if (subRole === "unistaff") return navigate("/staff-dashboard");
        return navigate("/");
      }
      case "moheadmin":
        return navigate("/mohe-dashboard");
      default:
        return navigate("/");
    }
  };

  const isActive = (path) => location.pathname === path;
  const isDashboardActive = location.pathname.includes('-dashboard');

  return (
    <nav
      ref={menuRef}
      className={`fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700 transition-transform duration-300 ${visible ? 'translate-y-0' : '-translate-y-full'
        }`}
    >
      {/* Main bar */}
      <div className="px-4 sm:px-8 py-3 flex items-center justify-between">

        {/* Left: Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105">
            <img src="/badge.png" alt="Tawtheeq Logo" />
          </div>
          <span className="font-semibold text-2xl tracking-tight">
            <span className="text-black dark:text-white">Taw</span>
            <span className="text-green-500">theeq</span>
          </span>
        </Link>

        {/* Right: Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">

          {/* Main Navigation Links */}
          <div className="flex items-center gap-1">
            <Link
              to="/verify"
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${isActive('/verify')
                ? 'bg-green-50 dark:bg-green-900/20 text-green-600'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
            >
              Verify Credentials
            </Link>

            <Link
              to="/"
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${isActive('/')
                ? 'bg-green-50 dark:bg-green-900/20 text-green-600'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
            >
              Home
            </Link>
          </div>

          {/* Separator */}
          <div className="h-6 w-[1px] bg-gray-200 dark:bg-gray-700"></div>

          {/* Auth & Utilities */}
          <div className="flex items-center gap-2">
            {!user && (
              <Link
                to="/login"
                className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${isActive('/login')
                  ? 'bg-green-500 text-white shadow-lg shadow-green-500/20'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
              >
                Login
              </Link>
            )}

            {user && (
              <div className="flex items-center gap-3">
                <button
                  onClick={handleDashboardRedirect}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${isDashboardActive
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-600'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                  <span>Dashboard</span>
                </button>

                <div className="flex items-center gap-3 pl-3 border-l border-gray-100 dark:border-gray-800">
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 leading-tight">
                      {user?.name || user?.email?.split('@')[0] || 'User'}
                    </span>
                    <span className="text-[10px] font-bold text-green-500 uppercase tracking-wider">{user?.role}</span>
                  </div>

                  <div className="w-9 h-9 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 font-bold text-sm ring-2 ring-transparent hover:ring-green-500/20 transition-all cursor-pointer">
                    {(user?.name || user?.identifier || 'U')[0].toUpperCase()}
                  </div>

                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                    title="Logout"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={toggleDark}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-400 transition-all hover:rotate-12"
              aria-label="Toggle dark mode"
            >
              {dark ? (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile: dark toggle + hamburger */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={toggleDark}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-400 transition-all"
            aria-label="Toggle dark mode"
          >
            {dark ? (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
              </svg>
            )}
          </button>

          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-400 transition-all"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 pb-4 pt-2 flex flex-col gap-1">

          {/* User info (if logged in) */}
          {user && (
            <div className="flex items-center gap-3 px-3 py-3 mb-1 rounded-xl bg-gray-50 dark:bg-gray-800/60">
              <div className="w-9 h-9 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 font-bold text-sm shrink-0">
                {(user?.name || user?.identifier || 'U')[0].toUpperCase()}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 leading-tight truncate">
                  {user?.name || user?.email?.split('@')[0] || 'User'}
                </span>
                <span className="text-[10px] font-bold text-green-500 uppercase tracking-wider">{user?.role}</span>
              </div>
            </div>
          )}

          {/* Nav Links */}
          <Link
            to="/"
            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive('/')
              ? 'bg-green-50 dark:bg-green-900/20 text-green-600'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Home
          </Link>

          <Link
            to="/verify"
            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive('/verify')
              ? 'bg-green-50 dark:bg-green-900/20 text-green-600'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 12l2 2 4-4" />
              <path d="M12 2a10 10 0 100 20A10 10 0 0012 2z" />
            </svg>
            Verify Credentials
          </Link>

          {/* Dashboard (if logged in) */}
          {user && (
            <button
              onClick={handleDashboardRedirect}
              className={`flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isDashboardActive
                ? 'bg-green-50 dark:bg-green-900/20 text-green-600'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
              Dashboard
            </button>
          )}

          <div className="h-[1px] bg-gray-100 dark:bg-gray-700 my-1"></div>

          {/* Login / Logout */}
          {!user && (
            <Link
              to="/login"
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${isActive('/login')
                ? 'bg-green-500 text-white shadow-lg shadow-green-500/20'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
              Login
            </Link>
          )}

          {user && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
