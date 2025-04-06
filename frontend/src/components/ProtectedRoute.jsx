import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ requiredUserType }) => {
  const { user, loading, isAuthenticated } = useAuth();
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Check for specific user type if required
  if (requiredUserType && user.user_metadata.user_type !== requiredUserType) {
    // Redirect to appropriate dashboard
    const redirectPath = user.user_metadata.user_type === 'employer' 
      ? '/hr/dashboard'
      : '/jobposts';
    return <Navigate to={redirectPath} replace />;
  }
  
  return <Outlet />;
};

export default ProtectedRoute;