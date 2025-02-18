import { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Search */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <img
                className="h-8 w-auto"
                src="/path-to-your-logo.png"
                alt="HireFlow"
              />
            </Link>
            <div className="ml-6">
              <input
                type="text"
                placeholder="Search..."
                className="w-64 px-4 py-1 rounded bg-gray-100 border border-gray-300 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-4">
            <NavLink icon="home" label="Home" />
            <NavLink icon="network" label="Network" />
            <NavLink icon="jobs" label="Jobs" />
            <NavLink icon="messaging" label="Messaging" />
            <NavLink icon="notifications" label="Notifications" />

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center space-x-1 hover:text-blue-600"
              >
                <img
                  className="h-8 w-8 rounded-full"
                  src="/default-avatar.png"
                  alt="Profile"
                />
                <span>Me</span>
              </button>

              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    View Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Settings
                  </Link>
                  <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ icon, label }: { icon: string; label: string }) => (
  <Link
    to={`/${label.toLowerCase()}`}
    className="flex flex-col items-center text-gray-500 hover:text-blue-600"
  >
    <span className="text-xl">
      {/* Replace with your actual icons */}
      {icon === "home" && "🏠"}
      {icon === "network" && "👥"}
      {icon === "jobs" && "💼"}
      {icon === "messaging" && "✉️"}
      {icon === "notifications" && "🔔"}
    </span>
    <span className="text-xs">{label}</span>
  </Link>
);

export default Navbar;
