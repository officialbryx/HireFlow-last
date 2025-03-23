import { Link, useNavigate } from "react-router-dom";
import { api } from "../services/api"; // Change import
import { useQueryClient } from "@tanstack/react-query"; // Add this import
import {
  HomeIcon,
  BriefcaseIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import NotificationsDropdown from "./notifications/NotificationsDropdown";
import { useState } from "react";

const HRNavbar = () => {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const queryClient = useQueryClient(); // Get QueryClient instance

  const handleSignOut = async () => {
    try {
      // Clear all React Query caches to prevent data leakage between users
      queryClient.clear();
      
      // Use the API logout function
      await api.logout();
      
      setShowConfirm(false);
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // This would typically come from your notifications state/context
  const notifications = [
    {
      id: 1,
      jobId: "123",
      jobTitle: "Frontend Developer",
      message: "New candidate shortlisted for review",
      createdAt: new Date(),
      read: false,
    },
    // Add more notifications as needed
  ];

  return (
    <nav className="fixed top-0 w-full bg-white border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <img
                src="/hireflow-logo.ico"
                alt="HireFlow"
                className="h-8 w-8"
              />
            </div>
          </div>

          {/* Right side - Navigation Items */}
          <div className="flex items-center space-x-6">
            <NavItem
              icon={<HomeIcon className="h-5 w-5" />}
              text="Dashboard"
              to="/hr/dashboard"
            />
            <NavItem
              icon={<BriefcaseIcon className="h-5 w-5" />}
              text="Jobs"
              to="/hr/jobs"
            />
            <NotificationsDropdown notifications={notifications} />
            <NavItem
              icon={<Cog6ToothIcon className="h-5 w-5" />}
              text="Settings"
              to="/settings"
            />
            <NavItem
              icon={<QuestionMarkCircleIcon className="h-5 w-5" />}
              text="FAQ'S"
              to="/hr/faq"
            />
            <div
              onClick={() => setShowConfirm(true)}
              className="cursor-pointer"
            >
              <NavItem
                icon={<ArrowRightOnRectangleIcon className="h-5 w-5" />}
                text="Sign Out"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <h3 className="text-lg font-bold mb-4">Confirm Sign Out</h3>
            <p className="mb-4">Are you sure you want to sign out?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

const NavItem = ({ icon, text, to }) => (
  <Link
    to={to}
    className="flex flex-col items-center text-gray-500 hover:text-black"
  >
    <div className="flex items-center justify-center">{icon}</div>
    <span className="text-xs mt-1">{text}</span>
  </Link>
);

export default HRNavbar;
