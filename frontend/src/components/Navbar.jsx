import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  UserGroupIcon,
  BriefcaseIcon,
  EnvelopeIcon,
  BellIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

const Navbar = () => {
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-white border-b border-gray-200 shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo and Search */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img
                src="/hireflow-logo.ico"
                alt="HireFlow"
                className="h-8 w-8"
              />
              <span className="ml-2 text-lg font-semibold text-gray-800 hidden sm:block">
                HireFlow
              </span>
            </Link>
            <div className="relative ml-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  className={`w-64 pl-10 pr-4 py-2 bg-gray-50 border ${
                    searchFocused
                      ? "border-blue-500 ring-2 ring-blue-100"
                      : "border-gray-200"
                  } rounded-lg text-sm transition-all duration-200 focus:outline-none`}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                />
              </div>
            </div>
          </div>

          {/* Right side - Navigation Items */}
          <div className="flex items-center">
            <div className="hidden md:flex space-x-1">
              <NavItem
                icon={<UserCircleIcon className="h-5 w-5" />}
                text="Profile"
                to="/profile"
              />
              <NavItem
                icon={<UserGroupIcon className="h-5 w-5" />}
                text="Network"
                to="/network"
              />
              <NavItem
                icon={<BriefcaseIcon className="h-5 w-5" />}
                text="Jobs"
                to="/jobposts"
              />
              <NavItem
                icon={<EnvelopeIcon className="h-5 w-5" />}
                text="Messages"
                to="/messages"
              />
              <NavItem
                icon={<BellIcon className="h-5 w-5" />}
                text="Notifications"
                to="/notifications"
              />
              <div className="mx-2 border-l border-gray-200 h-8" />
              <NavItem
                icon={<Cog6ToothIcon className="h-5 w-5" />}
                text="Settings"
                to="/settings"
              />
              <NavItem
                icon={<ArrowRightOnRectangleIcon className="h-5 w-5" />}
                text="Sign Out"
                to="/login"
              />
            </div>

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
