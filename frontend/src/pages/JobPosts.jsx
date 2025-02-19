import React, { useState } from "react";
import Navbar from "../components/Navbar";
import {
  MagnifyingGlassIcon,
  MapPinIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  ShareIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon } from "@heroicons/react/24/outline";

const JobPosts = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedJob, setSelectedJob] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* NavBar */}
      <div className="relative z-50 bg-white shadow fixed top-0 left-0 w-full">
        <Navbar />
      </div>
      {/* Search Header */}
      <div className="relative z-40 bg-white shadow mt-16">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search jobs by title, skill, or company"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-4">
              <select
                className="border border-gray-300 rounded-md px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
              >
                <option value="all">All Jobs</option>
                <option value="recent">Most Recent</option>
                <option value="remote">Remote</option>
                <option value="fulltime">Full Time</option>
                <option value="parttime">Part Time</option>
              </select>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
                Search
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Two Column Layout */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Left Column - Job List with Scroll */}
          <div className="w-1/3">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
                {jobListings.map((job, index) => (
                  <div
                    key={job.id}
                    className={`relative cursor-pointer transition-all duration-200
                      ${
                        selectedJob?.id === job.id
                          ? "bg-gray-50 border-l-4 border-black"
                          : "border-l-4 border-transparent hover:border-l-4 hover:border-gray-300"
                      }
                      ${index !== 0 ? "border-t border-black" : ""}`}
                    onClick={() => setSelectedJob(job)}
                  >
                    <div className="p-4">
                      <div className="flex gap-4">
                        <img
                          src={job.companyLogo}
                          alt={job.company}
                          className="w-12 h-12 rounded"
                        />
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {job.title}
                          </h3>
                          <p className="text-gray-600 text-sm">{job.company}</p>
                          <div className="flex items-center text-gray-500 text-sm mt-1">
                            <MapPinIcon className="h-4 w-4 mr-1" />
                            {job.location}
                          </div>
                          <p className="text-gray-500 text-sm mt-2">
                            {job.postedDate}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Job Details */}
          {selectedJob ? (
            <div className="w-2/3 bg-white p-8 rounded-lg shadow">
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  <img
                    src={selectedJob.companyLogo}
                    alt={selectedJob.company}
                    className="w-16 h-16 rounded"
                  />
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedJob.company}
                    </h2>
                    <h3 className="text-xl text-gray-700">
                      {selectedJob.title}
                    </h3>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-gray-500 hover:text-gray-700">
                    <ShareIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="mt-6 flex gap-4">
                <div className="flex items-center text-gray-600">
                  <MapPinIcon className="h-5 w-5 mr-2" />
                  {selectedJob.location}
                </div>
                <div className="flex items-center text-gray-600">
                  <UserGroupIcon className="h-5 w-5 mr-2" />
                  {selectedJob.applicantsNeeded} applicants needed
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {selectedJob.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <div className="mt-6 flex gap-4">
                <button className="bg-blue-600 text-white px-8 py-2 rounded-md hover:bg-blue-700">
                  Apply Now
                </button>
                <button className="border border-gray-300 text-gray-700 px-8 py-2 rounded-md hover:bg-gray-50">
                  <HeartIcon className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-8">
                <h4 className="text-lg font-semibold mb-4">About The Job</h4>
                <p className="text-gray-600 mb-6">
                  {selectedJob.companyDetails}
                </p>

                <h5 className="font-semibold mb-2">Key Responsibilities:</h5>
                <ul className="list-disc pl-5 mb-6">
                  {selectedJob.responsibilities.map((item, index) => (
                    <li key={index} className="text-gray-600 mb-1">
                      {item}
                    </li>
                  ))}
                </ul>

                <h5 className="font-semibold mb-2">Qualifications:</h5>
                <ul className="list-disc pl-5 mb-6">
                  {selectedJob.qualifications.map((item, index) => (
                    <li key={index} className="text-gray-600 mb-1">
                      {item}
                    </li>
                  ))}
                </ul>

                <h4 className="text-lg font-semibold mb-4">
                  About the Company
                </h4>
                <p className="text-gray-600">{selectedJob.aboutCompany}</p>
              </div>
            </div>
          ) : (
            <div className="w-2/3 bg-white p-8 rounded-lg shadow flex items-center justify-center">
              <p className="text-gray-500">Select a job to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const jobListings = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "TechCorp",
    companyLogo: "/company-logos/techcorp.png",
    location: "San Francisco, CA (Remote)",
    type: "Full-time",
    salary: "$120,000 - $150,000",
    applicantsNeeded: 3,
    companyDetails:
      "TechCorp is revolutionizing the way people interact with technology through innovative web applications and digital experiences.",
    responsibilities: [
      "Lead frontend development initiatives and architect scalable solutions",
      "Mentor junior developers and promote best practices",
      "Implement responsive designs and ensure cross-browser compatibility",
      "Optimize application performance and user experience",
      "Collaborate with UI/UX designers and backend developers",
      "Participate in code reviews and technical planning",
    ],
    qualifications: [
      "5+ years of React experience",
      "Strong TypeScript skills",
      "Experience with modern CSS frameworks",
      "Excellent communication skills",
      "Experience with state management (Redux, Context API)",
      "Knowledge of testing frameworks (Jest, React Testing Library)",
    ],
    aboutCompany:
      "TechCorp is a global leader in software development, serving millions of users worldwide. We offer competitive benefits, flexible work arrangements, and a culture of innovation.",
    skills: ["React", "TypeScript", "Tailwind CSS", "Redux", "Jest"],
    postedDate: "Posted 2 days ago",
  },
  {
    id: 2,
    title: "Product Manager",
    company: "InnovateTech",
    companyLogo: "/company-logos/innovatetech.png",
    location: "New York, NY (Hybrid)",
    type: "Full-time",
    salary: "$130,000 - $160,000",
    applicantsNeeded: 2,
    companyDetails:
      "InnovateTech is a fast-growing startup focused on building AI-powered productivity tools for modern businesses.",
    responsibilities: [
      "Define product strategy and roadmap",
      "Conduct market research and user interviews",
      "Work closely with engineering and design teams",
      "Prioritize features and manage backlog",
      "Track and analyze key metrics",
      "Present product updates to stakeholders",
    ],
    qualifications: [
      "4+ years of product management experience",
      "Strong analytical and problem-solving skills",
      "Experience with agile methodologies",
      "Excellent stakeholder management",
      "Background in tech industry",
      "MBA is a plus",
    ],
    aboutCompany:
      "InnovateTech is backed by top-tier investors and is on a mission to transform workplace productivity. We offer competitive equity packages and professional development opportunities.",
    skills: ["Product Strategy", "Agile", "User Research", "Data Analytics"],
    postedDate: "Posted 3 days ago",
  },
  {
    id: 3,
    title: "DevOps Engineer",
    company: "CloudScale",
    companyLogo: "/company-logos/cloudscale.png",
    location: "Remote",
    type: "Full-time",
    salary: "$115,000 - $145,000",
    applicantsNeeded: 4,
    companyDetails:
      "CloudScale provides enterprise-grade cloud infrastructure solutions to Fortune 500 companies.",
    responsibilities: [
      "Design and implement CI/CD pipelines",
      "Manage cloud infrastructure on AWS",
      "Implement security best practices",
      "Automate deployment processes",
      "Monitor system performance",
      "Provide on-call support",
    ],
    qualifications: [
      "3+ years of DevOps experience",
      "Strong AWS certification",
      "Experience with Kubernetes",
      "Knowledge of Infrastructure as Code",
      "Scripting skills (Python, Bash)",
      "Security best practices knowledge",
    ],
    aboutCompany:
      "CloudScale is a leader in cloud infrastructure, known for its innovative solutions and technical excellence. We offer remote-first culture and comprehensive benefits.",
    skills: ["AWS", "Kubernetes", "Terraform", "Docker", "CI/CD"],
    postedDate: "Posted 1 week ago",
  },
  {
    id: 4,
    title: "UX/UI Designer",
    company: "DesignHub",
    companyLogo: "/company-logos/designhub.png",
    location: "Austin, TX (Flexible)",
    type: "Full-time",
    salary: "$90,000 - $120,000",
    applicantsNeeded: 2,
    companyDetails:
      "DesignHub creates beautiful, user-centered digital experiences for startups and enterprises.",
    responsibilities: [
      "Create user-centered designs",
      "Conduct user research and testing",
      "Develop wireframes and prototypes",
      "Collaborate with development team",
      "Create and maintain design systems",
      "Present designs to stakeholders",
    ],
    qualifications: [
      "3+ years of UX/UI design experience",
      "Strong portfolio of web/mobile projects",
      "Proficiency in Figma and Adobe Suite",
      "Understanding of accessibility standards",
      "Experience with design systems",
      "Knowledge of basic HTML/CSS",
    ],
    aboutCompany:
      "DesignHub is a creative agency that values innovation, user-centered design, and collaboration. We offer opportunities for growth and creative freedom.",
    skills: ["Figma", "UI Design", "User Research", "Prototyping"],
    postedDate: "Posted 5 days ago",
  },
  {
    id: 5,
    title: "Full Stack Developer",
    company: "WebStack Solutions",
    companyLogo: "/company-logos/webstack.png",
    location: "Boston, MA (Hybrid)",
    type: "Full-time",
    salary: "$110,000 - $140,000",
    applicantsNeeded: 3,
    companyDetails:
      "WebStack Solutions builds enterprise-grade web applications that power Fortune 500 companies' digital transformation initiatives.",
    responsibilities: [
      "Develop full-stack web applications using modern technologies",
      "Design and implement RESTful APIs",
      "Optimize database performance and queries",
      "Implement security best practices",
      "Write clean, maintainable, and well-tested code",
      "Collaborate with product managers and designers",
    ],
    qualifications: [
      "4+ years of full-stack development experience",
      "Strong knowledge of Node.js and React",
      "Experience with SQL and NoSQL databases",
      "Understanding of cloud services (AWS/GCP)",
      "Knowledge of software architecture patterns",
      "Experience with agile development",
    ],
    aboutCompany:
      "WebStack Solutions is known for its technical excellence and innovative approach to solving complex business problems. We offer comprehensive benefits and career growth opportunities.",
    skills: ["React", "Node.js", "PostgreSQL", "AWS", "TypeScript"],
    postedDate: "Posted 4 days ago",
  },
  {
    id: 6,
    title: "Data Scientist",
    company: "DataMinds AI",
    companyLogo: "/company-logos/dataminds.png",
    location: "Seattle, WA (Remote)",
    type: "Full-time",
    salary: "$130,000 - $170,000",
    applicantsNeeded: 2,
    companyDetails:
      "DataMinds AI is at the forefront of applying artificial intelligence to solve real-world business challenges.",
    responsibilities: [
      "Develop and implement machine learning models",
      "Analyze large datasets and extract meaningful insights",
      "Create data visualization and reporting solutions",
      "Collaborate with engineering teams on model deployment",
      "Research and implement new ML techniques",
      "Present findings to stakeholders",
    ],
    qualifications: [
      "Masters/PhD in Computer Science, Statistics, or related field",
      "3+ years experience in machine learning",
      "Proficiency in Python and data science libraries",
      "Experience with deep learning frameworks",
      "Strong statistical analysis skills",
      "Published research is a plus",
    ],
    aboutCompany:
      "DataMinds AI is a leader in enterprise AI solutions, backed by top venture capital firms. We offer competitive compensation and opportunities to work on cutting-edge AI projects.",
    skills: ["Python", "TensorFlow", "PyTorch", "SQL", "Machine Learning"],
    postedDate: "Posted 1 week ago",
  },
  {
    id: 7,
    title: "Marketing Manager",
    company: "GrowthBase",
    companyLogo: "/company-logos/growthbase.png",
    location: "Chicago, IL (Hybrid)",
    type: "Full-time",
    salary: "$90,000 - $120,000",
    applicantsNeeded: 1,
    companyDetails:
      "GrowthBase is a rapidly growing marketing technology company helping businesses scale their digital presence.",
    responsibilities: [
      "Develop and execute marketing strategies",
      "Manage digital marketing campaigns",
      "Lead content marketing initiatives",
      "Analyze marketing metrics and ROI",
      "Manage social media presence",
      "Coordinate with sales team",
    ],
    qualifications: [
      "5+ years of digital marketing experience",
      "Proven track record of successful campaigns",
      "Experience with marketing analytics tools",
      "Strong project management skills",
      "Content strategy expertise",
      "B2B marketing experience preferred",
    ],
    aboutCompany:
      "GrowthBase is transforming how companies approach digital marketing. We offer a dynamic work environment and opportunities for professional development.",
    skills: [
      "Digital Marketing",
      "Analytics",
      "Content Strategy",
      "SEO",
      "Social Media",
    ],
    postedDate: "Posted 2 days ago",
  },
  {
    id: 8,
    title: "Software Architect",
    company: "TechFoundry",
    companyLogo: "/company-logos/techfoundry.png",
    location: "Denver, CO (Hybrid)",
    type: "Full-time",
    salary: "$150,000 - $190,000",
    applicantsNeeded: 1,
    companyDetails:
      "TechFoundry specializes in building scalable, enterprise-grade software solutions for various industries.",
    responsibilities: [
      "Design system architecture for large-scale applications",
      "Lead technical decision-making processes",
      "Mentor senior developers and tech leads",
      "Establish technical standards and best practices",
      "Evaluate new technologies and tools",
      "Drive technical innovation initiatives",
    ],
    qualifications: [
      "10+ years of software development experience",
      "Strong experience in distributed systems",
      "Track record of leading large technical projects",
      "Deep knowledge of cloud architecture",
      "Experience with microservices architecture",
      "Strong system design skills",
    ],
    aboutCompany:
      "TechFoundry is where innovation meets enterprise excellence. We offer competitive compensation, including equity, and the opportunity to shape the future of technology.",
    skills: [
      "System Design",
      "Cloud Architecture",
      "Microservices",
      "Leadership",
      "AWS",
    ],
    postedDate: "Posted 6 days ago",
  },
  {
    id: 9,
    title: "Business Analyst",
    company: "ConsultTech",
    companyLogo: "/company-logos/consulttech.png",
    location: "Miami, FL (On-site)",
    type: "Full-time",
    salary: "$80,000 - $110,000",
    applicantsNeeded: 2,
    companyDetails:
      "ConsultTech provides strategic business and technology consulting services to Fortune 500 companies.",
    responsibilities: [
      "Gather and analyze business requirements",
      "Create detailed business analysis documents",
      "Facilitate meetings with stakeholders",
      "Map business processes and workflows",
      "Support user acceptance testing",
      "Create training documentation",
    ],
    qualifications: [
      "3+ years of business analysis experience",
      "Strong analytical and problem-solving skills",
      "Experience with requirements gathering",
      "Knowledge of Agile methodologies",
      "Excellent documentation skills",
      "CBAP certification is a plus",
    ],
    aboutCompany:
      "ConsultTech is known for its exceptional consulting services and commitment to client success. We offer comprehensive benefits and professional certification support.",
    skills: ["Business Analysis", "Agile", "JIRA", "SQL", "Process Mapping"],
    postedDate: "Posted 3 days ago",
  },
  {
    id: 10,
    title: "Technical Project Manager",
    company: "AgileForce",
    companyLogo: "/company-logos/agileforce.png",
    location: "Washington, DC (Hybrid)",
    type: "Full-time",
    salary: "$120,000 - $150,000",
    applicantsNeeded: 2,
    companyDetails:
      "AgileForce delivers high-impact technology projects through effective project management and agile methodologies.",
    responsibilities: [
      "Lead complex technical projects end-to-end",
      "Manage project scope, timeline, and resources",
      "Coordinate with cross-functional teams",
      "Track project risks and issues",
      "Report project status to stakeholders",
      "Drive process improvements",
    ],
    qualifications: [
      "5+ years of technical project management",
      "PMP certification required",
      "Strong understanding of software development",
      "Experience with Agile/Scrum",
      "Excellent communication skills",
      "Budget management experience",
    ],
    aboutCompany:
      "AgileForce is a leading project management consulting firm known for delivering results. We offer competitive benefits and a culture of continuous learning.",
    skills: ["Project Management", "Agile", "JIRA", "Risk Management", "Scrum"],
    postedDate: "Posted 1 day ago",
  },
];

export default JobPosts;
