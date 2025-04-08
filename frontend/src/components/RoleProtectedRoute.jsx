import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';

const RoleProtectedRoute = ({ children, requiredRole }) => {
  const [authState, setAuthState] = useState({
    isLoading: true,
    isAuthenticated: false,
    userRole: null
  });
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setAuthState({
          isLoading: false,
          isAuthenticated: false,
          userRole: null
        });
        return;
      }
      
      const userRole = session.user.user_metadata.user_type;
      
      setAuthState({
        isLoading: false,
        isAuthenticated: true,
        userRole
      });
    };
    
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setAuthState({
          isLoading: false,
          isAuthenticated: false,
          userRole: null
        });
        return;
      }
      
      const userRole = session.user.user_metadata.user_type;
      
      setAuthState({
        isLoading: false,
        isAuthenticated: true,
        userRole
      });
    });

    // Session check interval
    const interval = setInterval(checkAuth, 60000);

    return () => {
      subscription?.unsubscribe();
      clearInterval(interval);
    };
  }, []);

  // Show loading spinner while checking authentication
  if (authState.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-12 w-12 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!authState.isAuthenticated) {
    return <Navigate 
      to="/login" 
      state={{ 
        from: location.pathname,
        message: '' 
      }} 
      replace 
    />;
  }
  
  // Redirect to appropriate dashboard if wrong role
  if (requiredRole && authState.userRole !== requiredRole) {
    const redirectPath = authState.userRole === 'employer' ? '/hr/dashboard' : '/jobposts';
    return <Navigate 
      to={redirectPath} 
      state={{ 
        message: `You don't have permission to access this page.` 
      }} 
      replace 
    />;
  }

  return children;
};

export default RoleProtectedRoute;