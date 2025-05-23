import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { useQueryClient } from "@tanstack/react-query";
import {
  BriefcaseIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  BuildingOffice2Icon,
  QuestionMarkCircleIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import JobseekerNotificationsDropdown from "./notifications/JobseekerNotificationsDropdown";

const Navbar = () => {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const queryClient = useQueryClient();

  const handleSignOut = async () => {
    try {
      queryClient.clear();
      await api.logout();
      setShowConfirm(false);
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <>
      {/* Fixed navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <div className="hidden md:flex items-center space-x-6">
              <NavItem
                icon={<BuildingOffice2Icon className="h-5 w-5" />}
                text="Companies"
                to="/companies"
              />
              <NavItem
                icon={<BriefcaseIcon className="h-5 w-5" />}
                text="Jobs"
                to="/jobposts"
              />
              <NavItem
                icon={<DocumentTextIcon className="h-5 w-5" />}
                text="My Applications"
                to="/applications"
              />
              <JobseekerNotificationsDropdown />
              <NavItem
                icon={<Cog6ToothIcon className="h-5 w-5" />}
                text="Settings"
                to="/settings"
              />
              <NavItem
                icon={<QuestionMarkCircleIcon className="h-5 w-5" />}
                text="FAQ'S"
                to="/faq"
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

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none">
                <span className="sr-only">Open menu</span>
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Placeholder div to prevent content from jumping up under the navbar */}
      <div className="h-16"></div>

      {/* Confirmation Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-50">
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
    </>
  );
};

const NavItem = ({ icon, text, to, notificationCount }) => (
  <Link
    to={to}
    className="flex flex-col items-center text-gray-500 hover:text-black"
  >
    <div className="flex items-center justify-center relative">
      {icon}
      {notificationCount && (
        <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">
          {notificationCount}
        </span>
      )}
    </div>
    <span className="text-xs mt-1 font-medium">{text}</span>
  </Link>
);

export default Navbar;
