import React from "react";
import { Link } from "react-router-dom";

const Cookies = () => {
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
            Cookie Policy
          </h1>

          <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4">
                1. What Are Cookies
              </h2>
              <p className="text-gray-600">
                Cookies are small text files stored on your device that help us
                provide and improve our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                2. How We Use Cookies
              </h2>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Essential cookies for site functionality</li>
                <li>Analytics cookies to understand user behavior</li>
                <li>Preference cookies to remember your settings</li>
                <li>Authentication cookies for secure access</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                3. Managing Cookies
              </h2>
              <p className="text-gray-600">
                You can control and/or delete cookies as you wish. You can
                delete all cookies that are already on your computer and you can
                set most browsers to prevent them from being placed.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cookies;
