import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles,allowedsubRoles }) {
  const { user, loading } = useAuth();

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

  // use roleModel instead of role, and for uniUser also check subRole
  if (allowedRoles && !allowedRoles.includes(user.roleModel?.toLowerCase())) {
    return <Navigate to="/" replace />;
  }

   if (allowedsubRoles && !allowedsubRoles.includes(user.subRole?.toLowerCase())){
    return <Navigate to="/" replace />; 
  }
    
  

  return children;
}