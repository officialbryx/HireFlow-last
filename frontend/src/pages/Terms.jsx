import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const Terms = () => {
  useEffect(() => {
    console.log("Terms component mounted");
  }, []);

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

        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Terms of Service
          </h1>

          <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4">
                1. Acceptance of Terms
              </h2>
              <p className="text-gray-600">
                By accessing and using HireFlow's services, you agree to be
                bound by these Terms of Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                2. User Responsibilities
              </h2>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Provide accurate and truthful information</li>
                <li>Maintain the confidentiality of your account</li>
                <li>Use the service in compliance with applicable laws</li>
                <li>Respect intellectual property rights</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                3. Service Description
              </h2>
              <p className="text-gray-600">
                HireFlow provides AI-powered recruitment services, including job
                matching, resume analysis, and candidate screening.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                4. Limitations of Liability
              </h2>
              <p className="text-gray-600">
                HireFlow is not liable for any indirect, incidental, special,
                consequential, or punitive damages.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
