import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import { useState, useEffect } from "react";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const [authState, setAuthState] = useState({
    session: null,
    userRole: null,
    loading: true,
  });

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!mounted) return;

        if (session?.user) {
          const userRole = session.user.user_metadata?.user_type;
          setAuthState({
            session,
            userRole,
            loading: false,
          });
        } else {
          setAuthState({
            session: null,
            userRole: null,
            loading: false,
          });
        }
      } catch (error) {
        console.error("Auth error:", error);
        if (mounted) {
          setAuthState((prev) => ({ ...prev, loading: false }));
        }
      }
    };

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      if (session?.user) {
        setAuthState({
          session,
          userRole: session.user.user_metadata?.user_type,
          loading: false,
        });
      } else {
        setAuthState({
          session: null,
          userRole: null,
          loading: false,
        });
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (authState.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!authState.session) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (!allowedRoles.includes(authState.userRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
