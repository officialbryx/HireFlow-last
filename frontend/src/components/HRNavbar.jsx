import { Link } from "react-router-dom";
import {
  HomeIcon,
  BriefcaseIcon,
  BellIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

const HRNavbar = () => {
  return (
    <nav className="fixed top-0 w-full bg-white border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo */}
          <div className="flex items-center">
            <Link to="/hr/dashboard" className="flex-shrink-0">
              <img
                src="/hireflow-logo.ico"
                alt="HireFlow"
                className="h-8 w-8"
              />
            </Link>
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
            <NavItem
              icon={<BellIcon className="h-5 w-5" />}
              text="Notifications"
              to="/hr/notifications"
            />
            <div className="border-l border-gray-200 h-8" />
            <NavItem
              icon={<Cog6ToothIcon className="h-5 w-5" />}
              text="Settings"
              to="/hr/settings"
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

export default HRNavbar;