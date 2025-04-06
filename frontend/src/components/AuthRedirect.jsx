import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';

// This component prevents logged-in users from accessing public pages
const AuthRedirect = ({ children, publicOnly }) => {
  const [authState, setAuthState] = useState({
    isLoading: true,
    isAuthenticated: false,
    userRole: null
  });

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
  }, []);

  // Show loading spinner while checking authentication
  if (authState.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-12 w-12 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
      </div>
    );
  }

  // If page is public-only and user is authenticated, redirect to appropriate dashboard
  if (publicOnly && authState.isAuthenticated) {
    const redirectPath = authState.userRole === 'employer' ? '/hr/dashboard' : '/jobposts';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default AuthRedirect;