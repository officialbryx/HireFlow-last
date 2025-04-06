import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import ErrorBoundary from "../components/ErrorBoundary";
import { useJobs } from "../hooks/useJobs";
import {
  MagnifyingGlassIcon,
  MapPinIcon,
  UserGroupIcon,
  BriefcaseIcon,
  ClockIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";
import { formatDistanceToNow, parseISO } from "date-fns";

const JobPostsWithErrorBoundary = () => {
  return (
    <ErrorBoundary>
      <JobPosts />
    </ErrorBoundary>
  );
};

const JobPosts = () => {
  const { jobs: jobListings, isLoading, error } = useJobs(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedJob, setSelectedJob] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("JobPosts component mounted");
  }, []);

  const normalizeJobData = (job) => {
    return {
      ...job,
      job_skill: job.job_skill || [],
      responsibilities: (job.job_responsibility || []).map(
        (r) => r.responsibility
      ),
      qualifications: (job.job_qualification || []).map((q) => q.qualification),
      company_description:
        job.company_description || "No description available",
      about_company: job.about_company || "No company information available",
      applicants_needed: job.applicants_needed || "Not specified",
      location: job.location || "Location not specified",
      salary_range: job.salary_range || "Not specified",
      employment_type: job.employment_type || "Not specified",
    };
  };

  const filteredJobs = jobListings.filter((job) => {
    const matchesSearch =
      job.job_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.job_skill?.some((skill) =>
        skill.skill.toLowerCase().includes(searchQuery.toLowerCase())
      );

    if (selectedFilter === "all") return matchesSearch;
    if (selectedFilter === "recent") {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return matchesSearch && new Date(job.created_at) >= oneWeekAgo;
    }
    if (selectedFilter === "remote")
      return (
        matchesSearch && job.employment_type?.toLowerCase().includes("remote")
      );
    if (selectedFilter === "fulltime")
      return (
        matchesSearch &&
        job.employment_type?.toLowerCase().includes("full-time")
      );
    if (selectedFilter === "parttime")
      return (
        matchesSearch &&
        job.employment_type?.toLowerCase().includes("part-time")
      );

    return matchesSearch;
  });

  const handleApply = (company, jobId) => {
    if (!company || !jobId) {
      console.error("Missing company or jobId:", { company, jobId });
      return;
    }
    navigate(`/apply/${encodeURIComponent(company)}/${jobId}`);
  };

  const formatPostedDate = (date) => {
    try {
      const parsedDate = parseISO(date);
      return `Posted ${formatDistanceToNow(parsedDate, {
        addSuffix: true,
        includeSeconds: true,
      })}`;
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Invalid date";
    }
  };

  const handleJobSelect = (job) => {
    setSelectedJob(normalizeJobData(job));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-red-500 text-lg font-medium p-4 bg-white rounded-lg shadow">
          {error}
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50">
        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 pt-24 pb-12 px-4 shadow-lg">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold text-white mb-4">
              Find Your Dream Job
            </h1>
            <p className="text-blue-100 text-lg mb-8">
              Discover opportunities that match your skills and career goals
            </p>

            {/* Search Section */}
            <div className="bg-white rounded-xl shadow-xl p-4 md:p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search jobs by title, skill, or company"
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex-shrink-0">
                  <select
                    className="border border-gray-200 rounded-lg px-4 py-3 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 w-full md:w-auto"
                    value={selectedFilter}
                    onChange={(e) => setSelectedFilter(e.target.value)}
                  >
                    <option value="all">All Jobs</option>
                    <option value="recent">Most Recent</option>
                    <option value="remote">Remote</option>
                    <option value="fulltime">Full Time</option>
                    <option value="parttime">Part Time</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column - Job List */}
            <div className="w-full lg:w-2/5">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {filteredJobs.length} Jobs Available
              </h2>
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="overflow-y-auto max-h-[calc(100vh-280px)]">
                  {filteredJobs.length > 0 ? (
                    filteredJobs.map((job, index) => (
                      <div
                        key={job.id}
                        className={`relative cursor-pointer transition-all duration-200
                          ${
                            selectedJob?.id === job.id
                              ? "bg-blue-50 border-l-4 border-blue-600"
                              : "border-l-4 border-transparent hover:border-l-4 hover:border-blue-300 hover:bg-slate-50"
                          }
                          ${index !== 0 ? "border-t border-gray-100" : ""}`}
                        onClick={() => handleJobSelect(job)}
                      >
                        <div className="p-4">
                          <div className="flex gap-4">
                            <div className="flex-shrink-0 w-[60px] h-[60px] bg-white p-2 rounded-lg border border-gray-100 shadow-sm flex items-center justify-center">
                              <img
                                src={
                                  job.company_logo_url ||
                                  "/default-company-logo.png"
                                }
                                alt={job.company_name}
                                className="w-10 h-10 object-contain"
                              />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {job.job_title}
                              </h3>
                              <p className="text-gray-600 text-sm font-medium">
                                {job.company_name}
                              </p>
                              <div className="flex items-center text-gray-500 text-sm mt-1">
                                <MapPinIcon className="h-4 w-4 mr-1" />
                                {job.location}
                              </div>
                              <div className="flex flex-wrap gap-2 mt-2">
                                <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full text-xs font-medium">
                                  {job.employment_type || "Not specified"}
                                </span>
                                <span className="bg-slate-50 text-slate-600 px-2 py-0.5 rounded-full text-xs font-medium">
                                  {formatPostedDate(job.created_at)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-gray-500">
                      <div className="mx-auto w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-slate-100">
                        <BriefcaseIcon className="h-8 w-8 text-slate-400" />
                      </div>
                      <p className="font-medium">
                        No jobs match your search criteria
                      </p>
                      <p className="text-sm mt-2">
                        Try adjusting your search parameters
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Job Details */}
            <div className="w-full lg:w-3/5">
              {selectedJob && (
                <div className="bg-white p-6 md:p-8 rounded-xl shadow-md">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                    <div className="flex gap-6">
                      <div className="flex-shrink-0 w-[80px] h-[80px] bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex items-center justify-center">
                        <img
                          src={
                            selectedJob.company_logo_url ||
                            "/default-company-logo.png"
                          }
                          alt={selectedJob.company_name}
                          className="w-12 h-12 object-contain"
                        />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                          {selectedJob.job_title}
                        </h2>
                        <p className="text-lg text-gray-700 font-medium">
                          {selectedJob.company_name}
                        </p>
                        <div className="mt-2 flex items-center text-gray-600">
                          <MapPinIcon className="h-5 w-5 mr-2" />
                          {selectedJob.location}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 md:items-end w-full md:w-auto">
                      <button
                        className="bg-blue-600 text-white font-medium px-8 py-3 rounded-lg hover:bg-blue-700 transition duration-200 shadow-sm flex items-center justify-center w-full md:w-[140px] whitespace-nowrap"
                        onClick={() =>
                          handleApply(selectedJob.company_name, selectedJob.id)
                        }
                      >
                        Apply Now
                      </button>
                    </div>
                  </div>

                  {/* Job Highlights */}
                  <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <BriefcaseIcon className="h-6 w-6 mr-3 text-blue-600" />
                      <div>
                        <p className="text-gray-500 text-sm">Job Type</p>
                        <p className="font-medium">
                          {selectedJob.employment_type}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <CurrencyDollarIcon className="h-6 w-6 mr-3 text-blue-600" />
                      <div>
                        <p className="text-gray-500 text-sm">Salary Range</p>
                        <p className="font-medium">
                          {selectedJob.salary_range || "Not specified"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <UserGroupIcon className="h-6 w-6 mr-3 text-blue-600" />
                      <div>
                        <p className="text-gray-500 text-sm">
                          Applicants Needed
                        </p>
                        <p className="font-medium">
                          {selectedJob.applicants_needed}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="mt-6">
                    <h4 className="text-lg font-semibold mb-3">
                      Required Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedJob.job_skill.map((skill, index) => (
                        <span
                          key={index}
                          className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium"
                        >
                          {skill.skill}
                        </span>
                      ))}
                      {selectedJob.job_skill.length === 0 && (
                        <p className="text-gray-500">
                          No specific skills listed
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Job Description */}
                  <div className="mt-8">
                    <h4 className="text-xl font-semibold mb-4 text-gray-800">
                      About The Job
                    </h4>
                    <div className="prose prose-slate max-w-none">
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        {selectedJob.company_description}
                      </p>
                    </div>

                    {selectedJob.responsibilities.length > 0 && (
                      <div className="bg-blue-50 rounded-lg p-5 mt-6">
                        <h5 className="font-semibold mb-3 text-blue-900 flex items-center">
                          <ClockIcon className="h-5 w-5 mr-2" />
                          Key Responsibilities:
                        </h5>
                        <ul className="space-y-2">
                          {selectedJob.responsibilities.map((item, index) => (
                            <li
                              key={index}
                              className="text-gray-700 flex items-start"
                            >
                              <span className="inline-block h-2 w-2 rounded-full bg-blue-600 mt-2 mr-2"></span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {selectedJob.qualifications.length > 0 && (
                      <div className="bg-slate-50 rounded-lg p-5 mt-6">
                        <h5 className="font-semibold mb-3 text-gray-800 flex items-center">
                          <BriefcaseIcon className="h-5 w-5 mr-2" />
                          Qualifications:
                        </h5>
                        <ul className="space-y-2">
                          {selectedJob.qualifications.map((item, index) => (
                            <li
                              key={index}
                              className="text-gray-700 flex items-start"
                            >
                              <span className="inline-block h-2 w-2 rounded-full bg-slate-500 mt-2 mr-2"></span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Company Info */}
                    <div className="mt-8 border-t border-gray-100 pt-6">
                      <h4 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                        <UserGroupIcon className="h-6 w-6 mr-2 text-gray-600" />
                        About the Company
                      </h4>
                      <div className="prose prose-slate max-w-none">
                        <p className="text-gray-600 leading-relaxed">
                          {selectedJob.about_company}
                        </p>
                      </div>
                    </div>

                    {/* Application Instructions */}
                    <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
                      <h4 className="text-lg font-semibold mb-3 text-blue-800">
                        Ready to Apply?
                      </h4>
                      <p className="text-gray-700 mb-4">
                        Click the apply button and submit your application. Make
                        sure your profile is up to date.
                      </p>
                      <button
                        className="bg-blue-600 text-white font-medium px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200 shadow-sm"
                        onClick={() =>
                          handleApply(selectedJob.company_name, selectedJob.id)
                        }
                      >
                        Apply for this Position
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {!selectedJob && (
                <div className="bg-white p-12 rounded-xl shadow-md flex flex-col items-center justify-center text-center">
                  <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mb-4">
                    <BriefcaseIcon className="h-10 w-10 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Select a Job
                  </h3>
                  <p className="text-gray-500 max-w-md">
                    Choose a job posting from the list to view detailed
                    information and apply
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default JobPostsWithErrorBoundary;
