import React from "react";
import { Link } from "react-router-dom";
import {
  UserGroupIcon,
  BriefcaseIcon,
  EnvelopeIcon,
  BellIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
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
              <input
                type="text"
                placeholder="Search..."
                className="w-64 px-4 py-2 bg-gray-100 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Right side - Navigation Items */}
          <div className="flex items-center space-x-6">
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
            <div className="border-l border-gray-200 h-8" />
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

export default Navbar;
