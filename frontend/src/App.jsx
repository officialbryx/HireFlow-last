import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import LandingPage from "./pages/LandingPage";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Companies from "./pages/Companies";
import JobPosts from "./pages/JobPosts";
import CreateJobPost from "./pages/hr/CreateJobPost";
import Apply from "./pages/Apply";
import Settings from "./pages/Settings";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/hr/Dashboard";
import Jobs from "./pages/hr/Jobs";
import FAQ from "./pages/hr/FAQ";
import Notifications from "./pages/hr/Notifications";
import About from "./pages/About";
import Careers from "./pages/Careers";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Cookies from "./pages/Cookies";
import JobSeekerFAQ from "./pages/FAQ";
import ApplicationNotifications from "./pages/applications/ApplicationNotifications";
import MyApplications from "./pages/applications/MyApplications";
import ApplicationDetails from "./pages/applications/ApplicationDetails";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleProtectedRoute from "./components/RoleProtectedRoute";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthRedirect from "./components/AuthRedirect"; // Adjust the path as needed
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import RoleRedirect from "./components/RoleRedirect"; // Adjust the path as needed
import Profile from "./components/Profile";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // Data considered fresh for 5 minutes
      cacheTime: 30 * 60 * 1000, // Cache kept for 30 minutes
      retry: 2, // Number of retries on failure
    },
  },
});

const App = () => {
  const location = useLocation();

  useEffect(() => {
    // Dynamically set the title based on the current route
    if (location.pathname === "/") {
      document.title = "HireFlow";
    } else if (location.pathname === "/signup") {
      document.title = "Sign Up | HireFlow";
    } else if (location.pathname === "/login") {
      document.title = "Sign In | HireFlow";
    } else if (location.pathname === "/jobposts") {
      document.title = "Job Posts | HireFlow";
    } else if (location.pathname === "/createjobpost") {
      document.title = "Create Job Post | HireFlow";
    } else if (location.pathname.startsWith("/apply/")) {
      const company = decodeURIComponent(location.pathname.split("/")[2]);
      document.title = `Apply Job for ${company} | HireFlow`;
    } else if (location.pathname === "/settings") {
      document.title = "Settings | HireFlow";
    } else if (location.pathname === "/forgot-password") {
      document.title = "Forgot Password | HireFlow";
    } else if (location.pathname === "/hr/dashboard") {
      document.title = "Dashboard | HireFlow";
    } else if (location.pathname === "/hr/jobs") {
      document.title = "Jobs | HireFlow";
    } else if (location.pathname === "/hr/faq") {
      document.title = "FAQ | HireFlow";
    } else if (location.pathname === "/hr/notifications") {
      document.title = "Notifications | HireFlow";
    } else if (location.pathname === "/about") {
      document.title = "About Us | HireFlow";
    } else if (location.pathname === "/careers") {
      document.title = "Careers | HireFlow";
    } else if (location.pathname === "/terms") {
      document.title = "Terms of Service | HireFlow";
    } else if (location.pathname === "/privacy") {
      document.title = "Privacy Policy | HireFlow";
    } else if (location.pathname === "/cookies") {
      document.title = "Cookie Policy | HireFlow";
    } else if (location.pathname === "/companies") {
      document.title = "Companies | HireFlow";
    }
  }, [location]);

  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        {/* Public Routes - Only accessible when not logged in */}
        <Route
          path="/"
          element={
            <AuthRedirect publicOnly>
              <LandingPage />
            </AuthRedirect>
          }
        />
        <Route
          path="/signup"
          element={
            <AuthRedirect publicOnly>
              <Signup />
            </AuthRedirect>
          }
        />
        <Route
          path="/login"
          element={
            <AuthRedirect publicOnly>
              <Login />
            </AuthRedirect>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <AuthRedirect publicOnly>
              <ForgotPassword />
            </AuthRedirect>
          }
        />

        {/* Global public routes - Accessible to everyone */}
        <Route path="/about" element={<About />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/cookies" element={<Cookies />} />

        {/* User settings - Available to both roles */}
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        {/* Protected Jobseeker Routes */}
        <Route
          path="/jobposts"
          element={
            <RoleProtectedRoute requiredRole="jobseeker">
              <JobPosts />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/faq"
          element={
            <RoleProtectedRoute requiredRole="jobseeker">
              <JobSeekerFAQ />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/apply/:company"
          element={
            <RoleProtectedRoute requiredRole="jobseeker">
              <Apply />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/apply/:company/:jobId"
          element={
            <RoleProtectedRoute requiredRole="jobseeker">
              <Apply />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/applications/notifications"
          element={
            <RoleProtectedRoute requiredRole="jobseeker">
              <ApplicationNotifications />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/companies"
          element={
            <RoleProtectedRoute requiredRole="jobseeker">
              <Companies />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/applications/:id"
          element={
            <RoleProtectedRoute requiredRole="jobseeker">
              <ApplicationDetails />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/applications"
          element={
            <RoleProtectedRoute requiredRole="jobseeker">
              <MyApplications />
            </RoleProtectedRoute>
          }
        />

        {/* Protected HR/Employer Routes */}
        <Route
          path="/createjobpost"
          element={
            <RoleProtectedRoute requiredRole="employer">
              <CreateJobPost />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/jobs"
          element={
            <RoleProtectedRoute requiredRole="employer">
              <Jobs />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/hr/dashboard"
          element={
            <RoleProtectedRoute requiredRole="employer">
              <Dashboard />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/hr/jobs/*"
          element={
            <RoleProtectedRoute requiredRole="employer">
              <Jobs />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/hr/faq"
          element={
            <RoleProtectedRoute requiredRole="employer">
              <FAQ />
            </RoleProtectedRoute>
          }
        />
        <Route
          path="/hr/notifications"
          element={
            <RoleProtectedRoute requiredRole="employer">
              <Notifications />
            </RoleProtectedRoute>
          }
        />

        {/* Profile Route */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Catch-all route - Redirect based on user role */}
        <Route path="*" element={<RoleRedirect />} />
      </Routes>
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  );
};

export default App;
