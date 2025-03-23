import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import {
  BriefcaseIcon,
  BellIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  BuildingOffice2Icon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";

const Navbar = () => {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setShowConfirm(false);
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <nav className="fixed top-0 w-full bg-white border-b border-gray-200 shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <img
                src="/hireflow-logo.ico"
                alt="HireFlow"
                className="h-8 w-8"
              />
            </div>
          </div>

          {/* Right side - Navigation Items */}
          <div className="flex items-center">
            <div className="hidden md:flex space-x-1">
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
                icon={<BellIcon className="h-5 w-5" />}
                text="Notifications"
                to="/notifications"
              />
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

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
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
      </div>
    </nav>
  );
};

const NavItem = ({ icon, text, to, notificationCount }) => (
  <Link
    to={to}
    className="relative flex flex-col items-center px-3 py-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200"
  >
    <div className="flex items-center justify-center">
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
