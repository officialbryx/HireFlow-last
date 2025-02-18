import React from "react";
import { Link } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-50 to-white">
      {/* Hero Section */}
      <div className="min-h-[80vh] flex items-center">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <img
              src="/hireflow-logo.ico"
              alt="HireFlow Logo"
              className="mx-auto w-24 h-24 mb-6"
            />
            <TypeAnimation
              sequence={[
                "HireFlow",
                1000,
                "Your Career Journey",
                1000,
                "Your Next Opportunity",
                1000,
              ]}
              wrapper="h1"
              speed={50}
              className="text-5xl font-bold text-blue-600 mb-4"
              repeat={Infinity}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Find Your Next Great Opportunity
              </h1>
              <p className="text-xl text-gray-600 mb-6">
                Connect with top employers and discover your perfect career
                match
              </p>
              <div className="space-x-4">
                <Link
                  to="/signup"
                  className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Get Started
                </Link>
                <button className="inline-block px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition">
                  Learn More
                </button>
              </div>
            </div>
            <div className="hidden md:block">{/* Add hero image here */}</div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-lg hover:-translate-y-1 transition duration-300"
            >
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Take the Next Step?
          </h2>
          <p className="text-xl mb-8">
            Join thousands of professionals who've found their dream jobs
          </p>
          <Link
            to="/signup"
            className="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Sign Up Now
          </Link>
        </div>
      </div>
    </div>
  );
};

const features = [
  {
    title: "Smart Job Matching",
    description:
      "AI-powered job recommendations tailored to your skills and experience",
  },
  {
    title: "Professional Network",
    description: "Build meaningful connections with industry professionals",
  },
  {
    title: "Career Growth",
    description: "Access resources and tools to advance your career",
  },
];

export default LandingPage;
