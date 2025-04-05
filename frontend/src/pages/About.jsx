import React from "react";
import { Link } from "react-router-dom";

const About = () => {
  const developers = [
    {
      name: "Bryan Tiamzon",
      role: "Full Stack Developer",
      image: "/bryan.jpg",
      description:
        "Passionate about creating scalable AI solutions and transforming complex problems into elegant code. Specializes in ML model integration and cloud architecture.",
      linkedin: "https://www.linkedin.com/in/bryantiamzonph/",
      github: "https://github.com/officialbryx",
      email: "bryxph@gmail.com",
    },
    {
      name: "Robie Naz",
      role: "Frontend & Backend Developer",
      image: "/naz.jpg",
      description:
        "Crafting pixel-perfect user experiences with a touch of magic. Turns coffee into code and dreams into functional interfaces.",
      linkedin: "https://www.linkedin.com/in/bien-robie-naz-318817344/",
      github: "https://github.com/Nebiuse",
      email: "qbrbnaz@tip.edu.ph",
    },
    {
      name: "Ymnwl Faurillo",
      role: "?",
      image: "/defaultprofile.jpg",
      description: "?",
      linkedin: "https://www.merriam-webster.com/dictionary/useless",
      github: "https://www.merriam-webster.com/dictionary/useless",
      email: "ididntcontribute@gmail.com",
    },
  ];

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

        <div className="text-center max-w-4xl mx-auto mb-24">
          <div className="mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              About HireFlow
            </h1>
            <p className="text-xl text-gray-700 leading-relaxed">
              HireFlow is an innovative AI-powered recruitment platform that
              revolutionizes the hiring process. Using advanced machine learning
              algorithms including JobBERT and XGBoost, we create perfect
              matches between talented individuals and their dream careers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <h3 className="text-2xl font-semibold mb-4 text-blue-600">
                Our Mission
              </h3>
              <p className="text-gray-700 leading-relaxed">
                To transform the recruitment landscape by creating seamless
                connections between employers and job seekers through innovative
                AI technology.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <h3 className="text-2xl font-semibold mb-4 text-indigo-600">
                Our Vision
              </h3>
              <p className="text-gray-700 leading-relaxed">
                To become the leading AI-driven recruitment platform, setting
                new standards in hiring efficiency and job matching accuracy.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent inline-block">
              Meet Our Team
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {developers.map((dev) => (
              <div
                key={dev.name}
                className="bg-white rounded-2xl shadow-lg p-8 text-center transform hover:-translate-y-2 transition-all duration-300 border border-gray-100"
              >
                <div className="w-32 h-32 rounded-full mx-auto mb-6 overflow-hidden bg-gradient-to-r from-blue-100 to-indigo-100 ring-4 ring-white shadow-lg">
                  <img
                    src={dev.image}
                    alt={dev.name}
                    className="w-full h-full object-cover"
                    onError={(e) =>
                      (e.target.src = "https://via.placeholder.com/150")
                    }
                  />
                </div>
                <h3 className="text-2xl font-semibold mb-2">{dev.name}</h3>
                <p className="text-blue-600 font-medium mb-4">{dev.role}</p>
                <p className="text-gray-600 mb-6">{dev.description}</p>
                <div className="flex justify-center space-x-5">
                  <a
                    href={`mailto:${dev.email}`}
                    className="text-gray-500 hover:text-blue-600 transition-colors duration-300"
                    aria-label={`Email ${dev.name}`}
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                    </svg>
                  </a>
                  <a
                    href={dev.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-blue-600 transition-colors duration-300"
                    aria-label={`${dev.name}'s LinkedIn`}
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>
                  <a
                    href={dev.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-gray-900 transition-colors duration-300"
                    aria-label={`${dev.name}'s GitHub`}
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-3xl mx-auto text-center">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent inline-block">
              Contact Us
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="bg-white p-10 rounded-2xl shadow-lg border border-gray-100">
            <p className="text-xl text-gray-700 mb-8">
              Have questions or feedback? We'd love to hear from you!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="p-6 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors duration-300">
                <svg
                  className="w-8 h-8 text-blue-600 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <h4 className="text-lg font-semibold mb-2">Email</h4>
                <a
                  href="mailto:contact@hireflow.com"
                  className="text-blue-600 hover:text-blue-800 transition-colors duration-300"
                >
                  contact@hireflow.com
                </a>
              </div>

              <div className="p-6 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors duration-300">
                <svg
                  className="w-8 h-8 text-blue-600 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <h4 className="text-lg font-semibold mb-2">Address</h4>
                <p className="text-gray-700">
                  938 Aurora Blvd, Cubao, Quezon City, 1109 Metro Manila
                </p>
              </div>

              <div className="p-6 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors duration-300">
                <svg
                  className="w-8 h-8 text-blue-600 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <h4 className="text-lg font-semibold mb-2">Phone</h4>
                <p className="text-gray-700">+63 9456123481</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
