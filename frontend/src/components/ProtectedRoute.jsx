import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import { useState, useEffect } from "react";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const getSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setSession(session);

        if (session) {
          const {
            data: { user },
          } = await supabase.auth.getUser();
          const userRole = user?.user_metadata?.user_type;
          console.log("User role:", userRole); // Debug log
          setUserRole(userRole);
        }
      } catch (error) {
        console.error("Auth error:", error);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event); // Debug log
      setSession(session);

      if (session) {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        const userRole = user?.user_metadata?.user_type;
        console.log("Updated user role:", userRole); // Debug log
        setUserRole(userRole);
      } else {
        setUserRole(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  console.log("Checking role access:", { userRole, allowedRoles }); // Debug log

  if (!allowedRoles.includes(userRole)) {
    console.log("Access denied - redirecting"); // Debug log
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
