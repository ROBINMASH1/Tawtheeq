import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles, allowedsubRoles, profileSetupRoute }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
        <svg className="w-8 h-8 animate-spin text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 12a9 9 0 11-6.219-8.56"/>
        </svg>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  // Special handling for the profile-setup route itself
  if (profileSetupRoute) {
    // If student is already active, they don't need setup — send to dashboard
    if (user.roleModel?.toLowerCase() === 'student' && user.isActive === true) {
      return <Navigate to="/student-dashboard" replace />;
    }
    // Only students can access profile-setup
    if (user.roleModel?.toLowerCase() !== 'student') {
      return <Navigate to="/" replace />;
    }
    return children;
  }

  // For all other protected routes: if student is inactive, force profile-setup
  if (user.roleModel?.toLowerCase() === 'student' && user.isActive === false) {
    return <Navigate to="/profile-setup" />;
  }

  // Role-based access check
  if (allowedRoles && !allowedRoles.includes(user.roleModel?.toLowerCase())) {
    return <Navigate to="/" replace />;
  }

  if (allowedsubRoles && !allowedsubRoles.includes(user.subRole?.toLowerCase())) {
    return <Navigate to="/" replace />;
  }

  return children;
}