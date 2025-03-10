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
      refetchOnWindowFocus: false, // Prevent unnecessary refetches
    },
  },
});

const titleMap = {
  "/": "HireFlow",
  "/signup": "Sign Up | HireFlow",
  "/login": "Sign In | HireFlow",
  "/jobposts": "Job Posts | HireFlow",
  "/createjobpost": "Create Job Post | HireFlow",
  "/messages": "Messaging | HireFlow",
  "/viewapplicants": "View Applicants | HireFlow",
  "/settings": "Settings | HireFlow",
  "/forgot-password": "Forgot Password | HireFlow",
  "/profile": "My Profile | HireFlow",
  "/hr/dashboard": "Dashboard | HireFlow",
  "/hr/jobs": "Jobs | HireFlow",
  "/hr/faq": "FAQ | HireFlow",
  "/hr/notifications": "Notifications | HireFlow",
  "/about": "About Us | HireFlow",
  "/careers": "Careers | HireFlow",
  "/terms": "Terms of Service | HireFlow",
  "/privacy": "Privacy Policy | HireFlow",
  "/cookies": "Cookie Policy | HireFlow",
};

const App = () => {
  const location = useLocation();

  useEffect(() => {
    const updateTitle = () => {
      if (location.pathname.startsWith("/apply/")) {
        const company = decodeURIComponent(location.pathname.split("/")[2]);
        document.title = `Apply Job for ${company} | HireFlow`;
        return;
      }

      document.title = titleMap[location.pathname] || "HireFlow";
    };

    updateTitle();
  }, [location.pathname]);

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
          path="/hr/applicants"
          element={
            <ProtectedRoute allowedRoles={["employer"]}>
              <ViewApplicants />
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
          path="/hr/jobs"
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
