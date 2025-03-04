import React from "react";
import HRNavbar from "../../components/HRNavbar";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <HRNavbar />
      <div className="pt-16 px-4">
        <div className="max-w-7xl mx-auto py-6">
          <h1 className="text-2xl font-semibold text-gray-900">HR Dashboard</h1>
          {/* Add dashboard content here */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;