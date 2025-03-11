import React from "react";
import { Link } from "react-router-dom";

const Careers = () => {
  const openPositions = [
    {
      title: "Senior AI Engineer",
      department: "Engineering",
      location: "Manila, Philippines",
      type: "Full-time",
      description:
        "Lead the development of our AI/ML models for recruitment matching.",
      requirements: [
        "5+ years experience in Machine Learning",
        "Strong background in NLP",
        "Experience with BERT and XGBoost",
        "Python expertise",
      ],
    },
    {
      title: "Frontend Developer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      description:
        "Build beautiful, responsive user interfaces for our platform.",
      requirements: [
        "3+ years experience with React",
        "Expertise in TailwindCSS",
        "Strong TypeScript skills",
        "Experience with REST APIs",
      ],
    },
    {
      title: "HR Specialist",
      department: "Human Resources",
      location: "Quezon City, Philippines",
      type: "Full-time",
      description: "Help shape our HR products with your domain expertise.",
      requirements: [
        "5+ years HR experience",
        "Knowledge of recruitment processes",
        "Strong communication skills",
        "Experience with HR software",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-indigo-100">
      <div className="container mx-auto px-6 py-16">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-300 mb-12 group"
        >
          <span className="bg-white p-2 rounded-full shadow-sm mr-3 group-hover:shadow-md transition-all duration-300">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </span>
          <span className="font-medium">Back to Home</span>
        </Link>

        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Join Our Mission
          </h1>
          <p className="text-xl text-gray-700 leading-relaxed">
            Help us transform the future of recruitment with AI technology.
            We're looking for passionate individuals who want to make a
            difference.
          </p>
        </div>

        {/* Why Join Us Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="text-blue-600 mb-4">
              <svg
                className="w-10 h-10"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Innovation First</h3>
            <p className="text-gray-600">
              Work with cutting-edge AI technology and shape the future of
              recruitment.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="text-blue-600 mb-4">
              <svg
                className="w-10 h-10"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Great Team</h3>
            <p className="text-gray-600">
              Join a diverse team of talented individuals passionate about
              technology.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="text-blue-600 mb-4">
              <svg
                className="w-10 h-10"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Great Benefits</h3>
            <p className="text-gray-600">
              Competitive salary, healthcare, flexible work hours, and
              continuous learning.
            </p>
          </div>
        </div>

        {/* Coming Soon Section */}
        <div className="mb-16">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Open Positions</h2>
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <div className="mb-6">
                <svg
                  className="w-16 h-16 mx-auto text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Coming Soon!</h3>
              <p className="text-gray-600 mb-6">
                We're preparing exciting opportunities to join our team. Check
                back soon or leave your email to be notified when positions
                become available.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
                />
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto">
                  Notify Me
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Careers;
