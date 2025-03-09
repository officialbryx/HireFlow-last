import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 text-gray-800">
      {/* Navigation */}
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/90 backdrop-blur-sm shadow-sm py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <img
                src="/hireflow-logo.ico"
                alt="HireFlow Logo"
                className="w-8 h-8"
              />
              <span className="font-bold text-xl text-blue-600">HireFlow</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-700 transition-colors"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Sign up
              </Link>
            </div>
            <button
              className="md:hidden focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4">
              <div className="flex flex-col space-y-4">
                <a
                  href="#features"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Features
                </a>
                <a
                  href="#testimonials"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Testimonials
                </a>
                <a
                  href="#pricing"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Pricing
                </a>
                <Link
                  to="/login"
                  className="text-blue-600 hover:text-blue-700 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-block w-fit"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign up
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-24 pb-16 md:min-h-[90vh] flex items-center" id="hero">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-12 md:mb-0 md:pr-12">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight opacity-0 animate-fade-in">
                Discover <span className="text-blue-600">Your Path</span> to
                Career Excellence
              </h1>
              <div className="h-12 mb-6">
                <TypeAnimation
                  sequence={[
                    "Connect with top employers",
                    1500,
                    "Find your dream job",
                    1500,
                    "Advance your career",
                    1500,
                  ]}
                  wrapper="p"
                  speed={50}
                  className="text-xl text-gray-600"
                  repeat={Infinity}
                />
              </div>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 opacity-0 animate-fade-in-delay">
                <Link
                  to="/signup"
                  className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl flex items-center justify-center group"
                >
                  Get Started
                  <svg
                    className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </Link>
              </div>
            </div>

            <div className="md:w-1/2 md:pl-12 relative opacity-0 animate-fade-in-delay">
              <div className="relative">
                <div className="absolute -top-6 -left-6 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
                <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
                <div className="absolute -bottom-8 left-20 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
                <img
                  src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
                  alt="Team working together"
                  className="relative rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Replace existing Features Section with this new AI Features Section */}
      <div id="features" className="py-20 container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            AI-Powered Recruitment
          </h2>
          <p className="text-xl text-gray-600">
            Leveraging advanced machine learning models for precise candidate
            matching
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* JobBERT Feature */}
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:-translate-y-2 transition duration-300 border border-gray-100 group">
            <div className="mb-6 inline-block p-4 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors duration-300">
              <svg
                className="h-10 w-10 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold mb-4">JobBERT Analysis</h3>
            <div className="space-y-4">
              <p className="text-gray-600 leading-relaxed">
                Advanced natural language processing model specifically trained
                for job matching and resume analysis.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-600">
                  <svg
                    className="h-5 w-5 mr-2 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  98% accuracy in skill extraction
                </li>
                <li className="flex items-center text-gray-600">
                  <svg
                    className="h-5 w-5 mr-2 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Contextual understanding of job requirements
                </li>
                <li className="flex items-center text-gray-600">
                  <svg
                    className="h-5 w-5 mr-2 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Semantic matching of qualifications
                </li>
              </ul>
            </div>
          </div>

          {/* XGBoost Feature */}
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:-translate-y-2 transition duration-300 border border-gray-100 group">
            <div className="mb-6 inline-block p-4 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors duration-300">
              <svg
                className="h-10 w-10 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold mb-4">XGBoost Screening</h3>
            <div className="space-y-4">
              <p className="text-gray-600 leading-relaxed">
                Machine learning-based candidate screening using gradient
                boosting for accurate candidate ranking.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-600">
                  <svg
                    className="h-5 w-5 mr-2 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  95% candidate-job match accuracy
                </li>
                <li className="flex items-center text-gray-600">
                  <svg
                    className="h-5 w-5 mr-2 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Automated resume scoring and ranking
                </li>
                <li className="flex items-center text-gray-600">
                  <svg
                    className="h-5 w-5 mr-2 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Real-time processing of applications
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Additional AI Benefits Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="text-blue-600 text-4xl font-bold mb-2">85%</div>
            <p className="text-gray-600">Reduction in screening time</p>
          </div>
          <div className="text-center p-6">
            <div className="text-blue-600 text-4xl font-bold mb-2">93%</div>
            <p className="text-gray-600">Matching accuracy</p>
          </div>
          <div className="text-center p-6">
            <div className="text-blue-600 text-4xl font-bold mb-2">2.5s</div>
            <p className="text-gray-600">Average processing time per resume</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <img
                  src="/hireflow-logo.ico"
                  alt="HireFlow Logo"
                  className="w-8 h-8"
                />
                <span className="font-bold text-xl">HireFlow</span>
              </div>
              <p className="text-gray-400 mb-6">
                Connecting talent with opportunity in the modern workforce.
              </p>
              <div className="flex space-x-4">
                {[
                  {
                    name: "facebook",
                    url: "https://facebook.com/hireflow",
                    icon: (
                      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                    ),
                  },
                  {
                    name: "twitter",
                    url: "https://twitter.com/hireflow",
                    icon: (
                      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                    ),
                  },
                  {
                    name: "instagram",
                    url: "https://instagram.com/hireflow",
                    icon: (
                      <path d="M16 4H8C5.79086 4 4 5.79086 4 8V16C4 18.2091 5.79086 20 8 20H16C18.2091 20 20 18.2091 20 16V8C20 5.79086 18.2091 4 16 4Z M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z M16.5 7.5C16.5 8.05228 16.0523 8.5 15.5 8.5C14.9477 8.5 14.5 8.05228 14.5 7.5C14.5 6.94772 14.9477 6.5 15.5 6.5C16.0523 6.5 16.5 6.94772 16.5 7.5Z" />
                    ),
                  },
                  {
                    name: "linkedin",
                    url: "https://linkedin.com/company/hireflow",
                    icon: (
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    ),
                  },
                ].map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <span className="sr-only">{social.name}</span>
                    <svg
                      className="h-6 w-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      {social.icon}
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            {[
              {
                title: "Company",
                links: ["About", "Careers"],
              },
              {
                title: "Legal",
                links: ["Terms", "Privacy", "Cookies"],
              },
            ].map((column, index) => (
              <div key={index}>
                <h3 className="font-semibold text-lg mb-4">{column.title}</h3>
                <ul className="space-y-2">
                  {column.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link
                        to={`/${link.toLowerCase()}`}
                        className="text-gray-400 hover:text-white transition-colors"
                        onClick={() => window.scrollTo(0, 0)} // Add this to scroll to top on navigation
                      >
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} HireFlow. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0">
              <select className="bg-gray-800 text-gray-400 py-2 px-4 rounded-lg text-sm">
                <option value="en">English</option>
              </select>
            </div>
          </div>
        </div>
      </footer>

      {/* Custom Animation Styles - using only CSS, no external libraries */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.7s ease-out forwards;
        }

        .animate-fade-in-delay {
          animation: fadeIn 0.7s ease-out 0.3s forwards;
        }

        .animate-fade-in-delay-long {
          animation: fadeIn 0.7s ease-out 0.6s forwards;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
