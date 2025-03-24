import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { useQueryClient } from "@tanstack/react-query";
import {
  BriefcaseIcon,
  BellIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  BuildingOffice2Icon,
  QuestionMarkCircleIcon,
  InboxIcon,
} from "@heroicons/react/24/outline";

const Navbar = () => {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
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
              <div className="relative">
                <div onClick={() => setShowNotifications(!showNotifications)}>
                  <NavItem
                    icon={<BellIcon className="h-5 w-5" />}
                    text="Notifications"
                  />
                </div>
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-gray-700 flex items-center">
                        <BellIcon className="h-5 w-5 mr-2 text-gray-500" />
                        Notifications
                      </h3>
                      <span className="text-xs text-gray-500">0 new</span>
                    </div>
                    <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                      <InboxIcon className="h-16 w-16 text-gray-300 mb-4" />
                      <p className="text-gray-600 font-medium mb-2">
                        No notifications
                      </p>
                      <p className="text-sm text-gray-500">
                        You're all caught up! Check back later.
                      </p>
                    </div>
                  </div>
                )}
              </div>
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
