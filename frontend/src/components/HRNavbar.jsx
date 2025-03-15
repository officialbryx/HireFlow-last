import { Link, useNavigate } from "react-router-dom";
import {
  HomeIcon,
  BriefcaseIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import NotificationsDropdown from "./notifications/NotificationsDropdown";
import { supabase } from "../services/supabaseClient";

const HRNavbar = () => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/login", { replace: true }); // Changed to /login and added replace
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
            <NotificationsDropdown notifications={notifications} />
            <div className="border-l border-gray-200 h-8" />
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
            <div onClick={handleSignOut} className="cursor-pointer">
              <NavItem
                icon={<ArrowRightOnRectangleIcon className="h-5 w-5" />}
                text="Sign Out"
              />
            </div>
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
