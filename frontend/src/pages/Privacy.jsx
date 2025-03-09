import React from "react";
import { Link } from "react-router-dom";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-indigo-100">
      <div className="container mx-auto px-6 py-16">
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

        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Privacy Policy
          </h1>

          <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4">
                1. Data Collection
              </h2>
              <p className="text-gray-600">
                We collect information that you provide directly to us,
                including:
              </p>
              <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
                <li>Personal identification information</li>
                <li>Professional experience and qualifications</li>
                <li>Job preferences and career goals</li>
                <li>Usage data and interactions with our platform</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                2. Use of Information
              </h2>
              <p className="text-gray-600">We use collected information to:</p>
              <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
                <li>Provide and improve our services</li>
                <li>Match candidates with suitable job opportunities</li>
                <li>Analyze and enhance our AI algorithms</li>
                <li>Communicate important updates and recommendations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                3. Data Protection
              </h2>
              <p className="text-gray-600">
                We implement robust security measures to protect your personal
                information from unauthorized access or disclosure.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
