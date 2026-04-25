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
  const lastScrollY = useRef(0);

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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDashboardRedirect = () => {
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

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700 px-8 py-3 flex items-center justify-between transition-transform duration-300 ${
      visible ? 'translate-y-0' : '-translate-y-full'
    }`}>

      {/* Logo */}
      <Link to="/" className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center">
          <img src="/badge.png" alt="Tawtheeq Logo" />
        </div>
        <span className="font-semibold text-2xl">
          <span className="text-black dark:text-white">Taw</span>
          <span className="text-green-500">theeq</span>
        </span>
      </Link>

      {/* Nav links */}
      <div className="flex items-center gap-2">

        <Link
          to="/verify"
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
            isActive('/verify')
              ? 'bg-green-200 dark:bg-green-900/30 text-green-600'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          Verify Credentials
        </Link>

        <Link
          to="/"
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
            isActive('/')
              ? 'bg-green-200 dark:bg-green-900/30 text-green-600'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          Home
        </Link>

        {/* Show Login link only when logged out */}
        {!user && (
          <Link
            to="/login"
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              isActive('/login')
                ? 'bg-green-200 dark:bg-green-900/30 text-green-600'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            Login
          </Link>
        )}

        {/* Dark mode toggle */}
        <button
          onClick={toggleDark}
          className="ml-1 w-9 h-9 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300 transition-colors"
          aria-label="Toggle dark mode"
        >
          {dark ? (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/>
              <line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
          ) : (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
            </svg>
          )}
        </button>

        {/* Show user info + logout only when logged in */}
        {user && (
          <div className="flex items-center gap-3 ml-2 pl-3 border-l border-gray-200 dark:border-gray-700">
            
            <button 
              onClick={handleDashboardRedirect}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800" 
              
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>

              Dashboard
            </button>

            <div className="flex flex-col items-end">
              <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                {user?.name || user?.email || 'User'}
              </span>
              <span className="text-xs text-green-500 capitalize">{user?.role}</span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 font-bold text-sm">
              {(user?.name || user?.identifier || 'U')[0].toUpperCase()}
              
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Logout
            </button>
            
          </div>
        )}

      </div>
    </nav>
  );
}