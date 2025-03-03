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

      {/* Stats Section */}
      <div className="py-12 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: "Active Users", value: "250K+" },
              { label: "Companies", value: "5,000+" },
              { label: "Job Placements", value: "100K+" },
              { label: "Success Rate", value: "92%" },
            ].map((stat, index) => (
              <div
                key={index}
                className="p-4 transform hover:scale-105 transition-transform duration-300"
              >
                <p className="text-3xl md:text-4xl font-bold text-blue-600">
                  {stat.value}
                </p>
                <p className="text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-20 container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Powerful Features
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to accelerate your career journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: (
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
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              ),
              title: "Smart Job Matching",
              description:
                "AI-powered job recommendations tailored to your skills and experience, ensuring you find the perfect fit for your career aspirations.",
            },
            {
              icon: (
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
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ),
              title: "Professional Network",
              description:
                "Build meaningful connections with industry professionals, mentors, and potential employers to expand your opportunities.",
            },
            {
              icon: (
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
              ),
              title: "Career Growth",
              description:
                "Access resources, courses, and personalized roadmaps to develop your skills and advance your career to the next level.",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-lg hover:-translate-y-2 transition duration-300 border border-gray-100 group"
            >
              <div className="mb-6 inline-block p-4 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors duration-300">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
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
                {["facebook", "twitter", "instagram", "linkedin"].map(
                  (social) => (
                    <a
                      key={social}
                      href={`#${social}`}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <span className="sr-only">{social}</span>
                      <svg
                        className="h-6 w-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>
                  )
                )}
              </div>
            </div>

            {[
              {
                title: "Company",
                links: ["About", "Careers", "Press", "News"],
              },
              {
                title: "Resources",
                links: ["Blog", "Guides", "Events", "Help Center"],
              },
              {
                title: "Legal",
                links: ["Terms", "Privacy", "Cookies", "Settings"],
              },
            ].map((column, index) => (
              <div key={index}>
                <h3 className="font-semibold text-lg mb-4">{column.title}</h3>
                <ul className="space-y-2">
                  {column.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href={`#${link.toLowerCase()}`}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        {link}
                      </a>
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
                <option value="es">Español</option>
                <option value="fr">Français</option>
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
