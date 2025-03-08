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
import ViewApplicants from "./pages/hr/ViewApplicants";
import JobPostTest from "./pages/JobPostTest";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/hr/Dashboard";
import Jobs from "./pages/hr/Jobs";
import Profile from "./pages/Profile";
import "./index.css";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // Data considered fresh for 5 minutes
      cacheTime: 30 * 60 * 1000, // Cache kept for 30 minutes
      retry: 2, // Number of retries on failure
      refetchOnWindowFocus: false, // Prevent unnecessary refetches
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
    }
  }, [location]);

  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Sign Up Page */}
        <Route path="/signup" element={<Signup />} />

        {/* Sign In Page */}
        <Route path="/login" element={<Login />} />

        {/* Job Posts Page */}
        <Route path="/jobposts" element={<JobPosts />} />

        {/* Create Job Post Page */}
        <Route path="/createjobpost" element={<CreateJobPost />} />

        {/* Application Page */}
        <Route path="/apply/:company" element={<Apply />} />

        {/* Messages Page */}
        <Route path="/messages" element={<Messages />} />

        {/* View Applicants */}
        <Route path="/hr/applicants" element={<ViewApplicants />} />

        {/* Settings Page */}
        <Route path="/settings" element={<Settings />} />

        {/* Test Page */}
        <Route path="/jobs-test" element={<JobPostTest />} />

        {/* Forgot Password Page */}
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* HR Routes */}
        <Route path="/hr/dashboard" element={<Dashboard />} />
        <Route path="/hr/jobs" element={<Jobs />} />

        {/* Profile Page */}
        <Route path="/profile" element={<Profile />} />
      </Routes>
      {/* Remove the debugging tool later for checking if the caching works */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default App;
