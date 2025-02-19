import React from "react";
import { Link } from "react-router-dom";
import {
  HomeIcon,
  UserGroupIcon,
  BriefcaseIcon,
  EnvelopeIcon,
  BellIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

const Navbar = () => {
  return (
    <nav className="fixed top-0 w-full bg-white border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo and Search */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <img
                src="/hireflow-logo.ico"
                alt="HireFlow"
                className="h-8 w-8"
              />
            </Link>
            <div className="ml-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-64 px-4 py-2 bg-gray-100 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Right side - Navigation Items */}
          <div className="flex items-center space-x-6">
            <NavItem
              icon={<HomeIcon className="h-5 w-5" />}
              text="Home"
              to="/"
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
            <div className="border-l border-gray-200 h-8"></div>
            <ProfileDropdown />
          </div>
        </div>
      </div>
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

const ProfileDropdown = () => (
  <div className="relative group">
    <button className="flex flex-col items-center text-gray-500 hover:text-black">
      <UserIcon className="h-5 w-5" />
      <span className="text-xs mt-1">Me ▼</span>
    </button>
    <div className="hidden group-hover:block absolute right-0 w-48 bg-white border border-gray-200 rounded-md shadow-lg mt-2">
      <Link
        to="/profile"
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      >
        View Profile
      </Link>
      <Link
        to="/settings"
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      >
        Settings
      </Link>
      <div className="border-t border-gray-100"></div>
      <Link
        to="/logout"
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      >
        Sign Out
      </Link>
    </div>
  </div>
);

export default Navbar;
