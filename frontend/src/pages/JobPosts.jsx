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
    title: "Junior Python Software Engineering",
    company: "PDAX",
    companyLogo: "/pdaxph_logo.jpg",
    location: "Pasig, National Capital Region, Philippines",
    type: "Hybrid/Full-time",
    salary: "₱20,000-₱30,000",
    applicantsNeeded: 10,
    companyDetails: `
  At PDAX, we believe that the future of money is digital, and our mission is to empower all Filipinos to grow their wealth through blockchain technology.

  As one of the first crypto firms in the Philippine market, we feel a sense of duty to our users and to the ecosystem to set the standard for safety, ease of access, and reliability. We expect our team to share in this responsibility and cherish our vision of a more open and equitable financial system.

  We are looking for new team members that are passionate about cryptocurrency, want to work in a disruptive, fast-growing industry, and thrive in a start-up environment.

  If this sounds like you, then we’d love to talk!
`,

    responsibilities: [
      "Design and maintain scalable, secure, and high-performance APIs.",
      "Optimize and manage relational and non-relational databases.",
      "Build and maintain reliable ETL pipelines for data processing and ingestion.",
      "Deploy and manage backend systems and data pipelines on cloud platforms.",
      "Ensure backend and data processes are scalable, efficient, and secure.",
      "Work cross-functionally with teams and communicate technical concepts effectively.",
      "Implement CI/CD workflows and automate testing, deployment, and monitoring.",
    ],
    qualifications: [
      "Bachelor’s degree in Computer Science, Engineering, or related field (or equivalent experience).",
      "Strong understanding of backend architecture, algorithms, and data structures.",
      "Proficiency with Python, Redshift, DynamoDB, and ETL pipeline development.",
      "Experience in architecture design for scalable, high-performance systems.",
      "Knowledge of AWS services (e.g., S3, Lambda, EC2, RDS, Redshift).",
      "Familiarity with data modeling, warehousing, and visualization tools like Metabase.",
      "Experience deploying and managing systems on AWS and other cloud platforms.",
      "Strong problem-solving, communication, and collaboration abilities.",
      "Team player with the ability to work effectively in cross-functional teams.",
      "Nice to haves: Familiarity with CI/CD, data governance, and advanced data processing frameworks.",
    ],
    aboutCompany: `
Founded in 2018, Philippine Digital Asset Exchange (PDAX) is empowering Filipinos by simplifying access to investment opportunities in the digital economy. PDAX offers a user-friendly interface that allows everyone, from beginners to seasoned investors, to participate confidently in the financial markets.

At PDAX, we believe in democratizing finance and making investing accessible to all Filipinos. Our platform ensures simplicity, safety, and security, enabling users to trade a variety of digital assets effortlessly. Whether you're starting your investment journey or expanding your portfolio, PDAX equips you with the tools and resources to build wealth and achieve your financial goals.

Learn more about how PDAX is redefining the future of finance at www.pdax.ph.
`,
    skills: ["React", "TypeScript", "Tailwind CSS", "Redux", "Jest"],
    postedDate: "Posted 2 days ago",
  },
  {
    id: 2,
    title: "Technical Architect - Software Dev",
    company: "InnovateTech",
    companyLogo: "/concentrix_catalyst_logo.jpg",
    location: "Makati, National Capital Region, Philippines (Onsite/Full-time)",
    type: "Onsite/Full-time",
    salary: "₱30,000- ₱45,000",
    applicantsNeeded: 16,
    companyDetails: `
The Technical Architect is a subject matter expert in one of our key practice areas (e.g., Zendesk, Salesforce, Genesys, Software Development, or Data Analytics). In this role, you will be responsible for ensuring technical design integrity, approving configuration checklists prior to implementation, and managing escalations during project execution. Additionally, you will serve as an instructor in our internal Academy, providing training and sharing best practices. 
`,

    responsibilities: [
      "Own the architectural vision and technical strategy for your specific practice area.",
      "Approve configuration checklists and design documents to ensure all solutions meet best practices and business requirements.",
      "Conduct architecture reviews to confirm quality, scalability, and maintainability of the proposed solutions. ",
      "Provide technical oversight during project implementations, ensuring alignment with approved designs and configurations. ",
      "Serve as the final point of escalation for complex technical challenges, coordinating with cross-functional teams to resolve issues efficiently. ",
      "Perform root-cause analysis on major incidents or issues, implementing long-term fixes and improvements. ",
      "Act as an instructor and subject matter expert (SME) within the Academy, delivering specialized training sessions and workshops. ",
      "Develop and update training materials, best practice guides, and documentation. ",
      "Mentor and coach project teams, junior architects, and other stakeholders to continuously improve technical competencies within the organization. ",
      "Work closely with Pre-Sales, Project Managers, and CX Consultants to propose effective, scalable solutions for new and existing clients. ",
      "Engage with clients and senior leadership to gather technical requirements, clarify solution feasibility, and present architecture recommendations. ",
      "Stay current on industry trends, emerging technologies, and best practices to maintain a forward-thinking approach. ",
    ],
    qualifications: [
      "Bachelor’s or Master’s degree in Computer Science, Information Technology, Engineering, or a related field. ",
      "Proven experience (5+ years preferred) in solution architecture or a similar technical leadership role within the relevant domain (e.g., Zendesk, Salesforce, Genesys, Software Development, or Data Analytics). ",
      "Strong track record of successfully designing and implementing complex solutions in enterprise environments. ",
      "Exceptional problem-solving skills and the ability to handle high-stakes escalations under pressure. ",
      "Experience delivering technical training or workshops; a passion for mentoring others is a plus. ",
      "Excellent communication skills (verbal and written), with the ability to convey complex ideas to both technical and non-technical audiences. ",
      "Relevant certifications (e.g., Zendesk Certified Administrator, Salesforce Architect, Genesys Certification, or equivalent) are highly desirable. ",
    ],
    aboutCompany: `
We’re Concentrix Catalyst, the experience transformation and technology team at Concentrix -a global technology and services leader that powers the world’s best brands, today and into the future. We’re solution-focused, tech-powered, intelligence-fueled. Every day, we design, build, and run fully integrated, end-to-end solutions at speed and scale across the entire enterprise, helping more than 2,000 clients solve their toughest business challenges. With unique data and insights, deep industry expertise, and advanced technology solutions, we’re the intelligent transformation partner that powers a world that works, helping companies become refreshingly simple to work, interact, and transact with. 
`,
    skills: [
      "Technical Expertise",
      "Leadership & Influence",
      "Adaptability",
      "Collaboration",
      "Continuous Learning",
    ],
    postedDate: "Posted 3 weeks ago",
  },
  {
    id: 3,
    title:
      "Regulatory Affairs Software Development Specialist (Hybrid/Full-time)",
    company: "Medtronic",
    companyLogo: "/medtronic_logo.jpg",
    location: "Taguig, National Capital Region, Philippines",
    type: "Hybrid/Full-time",
    salary: "₱50,000 - ₱100,000",
    applicantsNeeded: 12,
    companyDetails: `
At Medtronic you can begin a life-long career of exploration and innovation, while helping champion healthcare access and equity for all. You’ll lead with purpose, breaking down barriers to innovation in a more connected, compassionate world. 
`,
    responsibilities: [
      "Design, develop, test and deploy software solutions that meet business and technical requirement and/or enhance business operations.",
      "Collaborate with stakeholders and/or cross-functional teams to gather and analyze user requirements and provide recommendations.",
      "Write clean, maintainable, and efficient code following industry standards and best practices.",
      "Ensure compliance with company and industry standards.",
      "Troubleshoot, debug, and resolve software defects and performance issues in a timely and efficient manner.",
      "Maintain and update existing software systems to improve functionality and performance.",
      "Provide technical support and training to users and stakeholders",
      "Document software specifications, development processes, and user guides",
      "Ensures integrity and accuracy.",
      "Raises issues to appropriate level of visibility in a timely manner.",
      "Effectively communicates progress and status.",
      "Stay up to date with emerging trends and technologies in software development.",
    ],
    qualifications: [
      "Bachelor’s degree in computer science, Software Engineering or a related field",
      "3-5 years related experience in software development or related areas",
      "Proven experience as a Software Development Specialist or similar role.",
      "Experience with software development methodologies such as Agile or Scrum",
      "Excellent problem-solving skills and attention to detail",
      "Strong communication and interpersonal skills",
      "Demonstrated ability to communicate professionally, both written and orally, to a wide variety of audiences",
      "Experience in requirement gathering and documentation of the requirement.",
      "Good presentation and training skills.",
      "Ability to work independently and as part of a team",
      "Proficiency in programming languages such as Python, JavaScript or C++",
      "Proficiency in application such as Power Platform, AWS/Cloud services equivalent (Azure or Google Cloud), Smartsheet",
      "Understanding of non-relational or relational databases",
      "Well organized, quick thinker, and creative",
      "Response to deadlines and priorities",
    ],
    aboutCompany: `
We’re Concentrix Catalyst, the experience transformation and technology team at Concentrix -a global technology and services leader that powers the world’s best brands, today and into the future. We’re solution-focused, tech-powered, intelligence-fueled. Every day, we design, build, and run fully integrated, end-to-end solutions at speed and scale across the entire enterprise, helping more than 2,000 clients solve their toughest business challenges. With unique data and insights, deep industry expertise, and advanced technology solutions, we’re the intelligent transformation partner that powers a world that works, helping companies become refreshingly simple to work, interact, and transact with. 
`,

    skills: ["AWS", "Kubernetes", "Terraform", "Docker", "CI/CD"],
    postedDate: "Posted 1 week ago",
  },
  {
    id: 4,
    title: "Android Developers (Open to all levels - 2025 Cohort)",
    company: "Dyson",
    companyLogo: "/dyson_logo.jpg",
    location: "Metro Manila",
    type: "Full-time",
    salary: "₱20,000 - ₱70,000",
    applicantsNeeded: 7,
    companyDetails: `
We own and develop the MyDyson smart home app, which is at the forefront of Dyson's IoT experience. We are proud of what we have built so far; we have an App Store and Google Play rating of 4.5 and 4.3 stars respectively, we have more than 1 million active users worldwide and our IoT platform has over 3 million connected Dyson machines. We have huge ambition to grow this platform and as we connect more machines from more categories the challenge is significant.
`,
    responsibilities: [
      "Working with your fellow developers to contribute to features and improvements to our MyDyson app, ensuring they are tested, robust and scalable",
      "Working with colleagues from other disciplines, including test engineers, product owners, Scrum Masters, UX/UI designers, and software engineers in our cloud and embedded teams",
      "Sharing knowledge within the app team to develop your skills and competencies and those of your teammates",
      "Identifying new technologies, tools and approaches to help continually improve standards and quality",
    ],
    qualifications: [
      "You’re interested in how technology can improve the environments people live in",
      "You’re a collaborative person that believes in the Agile principles and how they can help empowered teams deliver the best software",
      "You’ve contributed quality code to Android apps that have delighted their users",
      "You’re passionate about learning new things and sharing those things with others",
      "You get satisfaction from solving real-world problems with well-crafted software",
    ],
    aboutCompany: `
    At Dyson we are focused on solving the problems that others have ignored; solving them first using our technology and ingenuity. In order to achieve this we need to pioneer technologies that are different and authentic. This is the core of what we do and who we are. We must strive to create the future, every single day by developing new things, different things, things that go against the grain with a diverse and global team of ingenious minds.`,
    skills: ["Figma", "UI Design", "User Research", "Prototyping"],
    postedDate: "Posted 5 days ago",
  },
  {
    id: 5,
    title: "Machine Learning Researcher",
    company: "WebStack Solutions",
    companyLogo: "gcash_logo.jpg",
    location: "National Capital Region, Philippines",
    type: "Full-time",
    salary: "$110,000 - $140,000",
    applicantsNeeded: 3,
    companyDetails: `Do you want to take the first step in making Filipinos’ lives better everyday? Here in GCash we want to stay at the forefront of the FinTech industry by creating innovative, meaningful, and convenient financial solutions for the nation! G ka ba? Join the G Nation today!
`,
    responsibilities: [
      "Research and develop machine learning models tackling problem domains such as credit scoring, personalization, fraud detection, entity resolution, etc.",
      "Discover new applications of machine learning and AI to solve emerging business needs",
      "Collaborate with data strategists and machine learning engineers to deliver end-to-end AI solutions to business teams",
      "Publish and share research internally within the Advanced Analytics team and to the broader business teams",
    ],
    qualifications: [
      "2+ years experience in an equivalent or functionally similar data role.",
      "An undergraduate degree preferably in Statistics, Computer Science, Physical Science, Economics, or a related technical field. A graduate degree is a plus.",
      "A strong and demonstrable understanding of SQL and Python or R for advanced analysis.",
      "A strong and demonstrable understanding of machine learning with big data. Expertise in one or more areas among recommender systems, forecasting, NLP, network science, and reinforcement learning is a big plus.",
      "Familiarity with data cloud services surrounding analytical and automation functions.",
      "Familiarity with version control software such as git.",
      "A talent for research and the presentation of interpretable insight.",
    ],
    aboutCompany: `Mynt is the first and only duacorn in the Philippines. It's a leader in mobile financial services focused on accelerating financial inclusion through mobile money, financial services, and technology. Mynt operates two fintech companies: GXI, the mobile wallet operator of GCash — the #1 Finance App in the Philippines, and Fuse Lending, a tech-based lending company that gives Filipinos access to microloans and business loans.`,
    skills: ["Machine Learning", "TensorFlow", "Python", "SQL", "NLP"],
    postedDate: "Posted 4 days ago",
  },
  {
    id: 6,
    title: "Site Civil Engineer",
    company: "AboitizPower",
    companyLogo: "aboitizpower_logo.jpg",
    location: "Toledo, Central Visayas, Philippines",
    type: "Contract",
    salary: "₱80,000 - ₱100,000",
    applicantsNeeded: 5,
    companyDetails:
      "DataMinds AI is at the forefront of applying artificial intelligence to solve real-world business challenges.",
    responsibilities: [
      "Knowledge of design and visualizations software such as AutoCAD",
      "Knowledge of Structural and Geotechnical Principles",
      "Understanding construction sequencing, logistics planning, scheduling techniques",
      "Thorough understanding of Structural design basis and standards",
      "Ability to interpret technical drawings and manuals",
      "Oral and Written Communication and collaboration skills to work with diverse teams",
      "Interpersonal multi-cultural skills",
      "Ability to share knowledge and coach site staff",
      "Administrative and Coordinating Skills",
      "Computer Skills and Proficiency in MS Office or similar software",
    ],
    qualifications: [
      "Bachelor’s Degree in Civil/Structural Engineering or equivalent experience",
      "At least 10 years of proven working experience as a Structural Project Engineer",
      "At least 5 years as discipline leader in field",
      "At least 1 coal-fired construction project",
      "Professional Institution Membership / Evidence of Professional Competence essential",
    ],
    aboutCompany: `AboitizPower is a major Philippine energy provider focused on building a balanced fleet of generation capacities. We also manage the second and third largest electric power distribution networks across the country, providing Filipinos energy they need to prosper.`,
    skills: [
      "Site Civil Engineering",
      "AutoCAD",
      "Structural Design",
      "Geotechnical Principles",
    ],
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
    title: "Mobile Application Developer",
    company: "Outsourcey",
    companyLogo: "/outsourcey_logo.jpg",
    location: "Taguig, National Capital Region, Philippines",
    type: "Hybrid/Full-time",
    salary: "₱20,000 - ₱3-,000",
    applicantsNeeded: 42,
    companyDetails: `Looking to take your career to the next level? Then this role is for you! Join Outsourcey and be part of our mission to revolutionize global talent expansion! We connect businesses with dedicated full-time teams in the Philippines, offering cost-efficient solutions without compromising quality. Join us and help elevate businesses with complete control and comprehensive support, let's shape the future of work together!
    `,
    responsibilities: [
      "Design and develop SDKs and libraries for: Access control systems IoT devices Payment processing Mobile apps and API interfaces.",
      "Work on both iOS and Android platforms using: Swift, Objective-C, Kotlin, Java, TypeScript, and React Native Develop serverless systems with AWS, DynamoDB, Postgres, SQS, and SNS.",
      "Perform rigorous testing and create comprehensive technical documentation. ",
      "Maintain and optimize existing codebases, including bug fixes and enhancements. ",
      "Leverage tools and ingenuity to identify and resolve defects efficiently. ",
      "Collaborate with the development team to create applications and services. ",
      "Contribute to process and infrastructure improvements while adhering to industry best practices.",
    ],
    qualifications: [
      "5+ years of mobile application development experience for iOS and Android.",
      "2+ years of hands-on experience with React Native.",
      "Advanced proficiency in JavaScript and TypeScript.",
      "Experience creating and maintaining React Native modules and bridges. ",
      "Strong understanding of Objective-C, Swift, Java, and Kotlin. ",
      "Familiarity with backend systems, APIs, and GraphQL. ",
      "Strong understanding of design patterns and their applications. ",
      "Ability to create well-documented software development processes.",
      "Fluent English communication skills. ",
      "A proactive approach and ownership mindset.",
    ],
    aboutCompany: "To make the world better through outsourcing!",
    skills: [
      "React Native",
      "Mobile Application Development",
      "Android Development",
      "IOS Development",
    ],
    postedDate: "Posted 1 week ago",
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
