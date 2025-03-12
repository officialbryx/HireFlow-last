import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import LandingPage from "./pages/LandingPage";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import JobPosts from "./pages/JobPosts";
import CreateJobPost from "./pages/hr/CreateJobPost";
import Apply from "./pages/Apply";
import Messages from "./pages/Messages";
import Settings from "./pages/Settings";
import ViewApplicants from "./components/jobs/ViewApplicants";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/hr/Dashboard";
import Jobs from "./pages/hr/Jobs";
import Profile from "./pages/Profile";
import FAQ from "./pages/hr/FAQ";
import Notifications from "./pages/hr/Notifications";
import About from "./pages/About";
import Careers from "./pages/Careers";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Cookies from "./pages/Cookies";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import ProtectedRoute from "./components/ProtectedRoute";

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
    } else if (location.pathname === "/messages") {
      document.title = "Messaging | HireFlow";
    } else if (location.pathname === "/viewapplicants") {
      document.title = "View Applicants | HireFlow";
    } else if (location.pathname === "/settings") {
      document.title = "Settings | HireFlow";
    } else if (location.pathname === "/forgot-password") {
      document.title = "Forgot Password | HireFlow";
    } else if (location.pathname === "/profile") {
      document.title = "My Profile | HireFlow";
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
    }
  }, [location]);

  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/about" element={<About />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/cookies" element={<Cookies />} />

        {/* Routes accessible by both roles */}
        <Route path="/messages" element={<Messages />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={<Profile />} />

        {/* JobSeeker Routes */}
        <Route
          path="/jobposts"
          element={
            <ProtectedRoute allowedRoles={["jobseeker", "employer"]}>
              {" "}
              {/* Allow both roles */}
              <JobPosts />
            </ProtectedRoute>
          }
        />

        {/* JobSeeker specific routes */}
        <Route
          path="/apply/:company"
          element={
            <ProtectedRoute allowedRoles={["jobseeker"]}>
              <Apply />
            </ProtectedRoute>
          }
        />
        <Route
          path="/apply/:company/:jobId"
          element={
            <ProtectedRoute allowedRoles={["jobseeker"]}>
              <Apply />
            </ProtectedRoute>
          }
        />

        {/* Employer only routes */}
        <Route
          path="/createjobpost"
          element={
            <ProtectedRoute allowedRoles={["employer"]}>
              <CreateJobPost />
            </ProtectedRoute>
          }
        />
        <Route
          path="/jobs"
          element={
            <ProtectedRoute allowedRoles={["employer"]}>
              <Jobs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hr/dashboard"
          element={
            <ProtectedRoute allowedRoles={["employer"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hr/jobs/*"
          element={
            <ProtectedRoute allowedRoles={["employer"]}>
              <Jobs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hr/faq"
          element={
            <ProtectedRoute allowedRoles={["employer"]}>
              <FAQ />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hr/notifications"
          element={
            <ProtectedRoute allowedRoles={["employer"]}>
              <Notifications />
            </ProtectedRoute>
          }
        />
      </Routes>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default App;
