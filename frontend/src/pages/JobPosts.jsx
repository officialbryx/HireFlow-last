import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useJobs } from "../hooks/useJobs"; // Update this import
import {
  MagnifyingGlassIcon,
  MapPinIcon,
  ShareIcon,
  UserGroupIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import { formatDistanceToNow, parseISO } from 'date-fns';

const JobPosts = () => {
  const { jobs: jobListings, isLoading, error } = useJobs(false); // Pass false for jobseeker view
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedJob, setSelectedJob] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("JobPosts component mounted"); // Debug log
  }, []);

  // Add data normalization helper
  const normalizeJobData = (job) => {
    return {
      ...job,
      job_skill: job.job_skill || [],
      responsibilities: (job.job_responsibility || []).map(r => r.responsibility),
      qualifications: (job.job_qualification || []).map(q => q.qualification),
      company_description: job.company_description || 'No description available',
      about_company: job.about_company || 'No company information available',
      applicants_needed: job.applicants_needed || 'Not specified',
      location: job.location || 'Location not specified'
    };
  };

  // Filter jobs based on search and filter
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
      return matchesSearch && job.employment_type?.toLowerCase().includes("remote");
    if (selectedFilter === "fulltime")
      return matchesSearch && job.employment_type?.toLowerCase().includes("full-time");
    if (selectedFilter === "parttime")
      return matchesSearch && job.employment_type?.toLowerCase().includes("part-time");

    return matchesSearch;
  });

  // Update the handleApply function to include jobId
  const handleApply = (company, jobId) => {
    if (!company || !jobId) {
      console.error('Missing company or jobId:', { company, jobId });
      return;
    }
    navigate(`/apply/${encodeURIComponent(company)}/${jobId}`);
  };

  const formatPostedDate = (date) => {
    try {
      // Simply parse the ISO string and format
      const parsedDate = parseISO(date);
      
      return `Posted ${formatDistanceToNow(parsedDate, { 
        addSuffix: true,
        includeSeconds: true
      })}`;
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Invalid date';
    }
  };

  // Update selectedJob state to use normalized data
  const handleJobSelect = (job) => {
    setSelectedJob(normalizeJobData(job));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
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
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex gap-8">
            {/* Left Column - Job List */}
            <div className="w-1/3">
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
                  {filteredJobs.length > 0 ? (
                    filteredJobs.map((job, index) => (
                      <div
                        key={job.id}
                        className={`relative cursor-pointer transition-all duration-200
                          ${
                            selectedJob?.id === job.id
                              ? "bg-gray-50 border-l-4 border-black"
                              : "border-l-4 border-transparent hover:border-l-4 hover:border-gray-300"
                          }
                          ${index !== 0 ? "border-t border-black" : ""}`}
                        onClick={() => handleJobSelect(job)}
                      >
                        <div className="p-4">
                          <div className="flex gap-4">
                            <img
                              src={job.company_logo_url || '/default-company-logo.png'}
                              alt={job.company_name}
                              className="w-12 h-12 rounded object-contain bg-gray-50"
                            />
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {job.job_title}
                              </h3>
                              <p className="text-gray-600 text-sm">
                                {job.company_name}
                              </p>
                              <div className="flex items-center text-gray-500 text-sm mt-1">
                                <MapPinIcon className="h-4 w-4 mr-1" />
                                {job.location}
                              </div>
                              <p className="text-gray-500 text-sm mt-2">
                                {formatPostedDate(job.created_at)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      No jobs match your search criteria
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Job Details */}
            <div className="w-2/3">
              {selectedJob ? (
                <div className="bg-white p-8 rounded-lg shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                      <img
                        src={selectedJob.company_logo_url || '/default-company-logo.png'}
                        alt={selectedJob.company_name}
                        className="w-16 h-16 rounded"
                      />
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                          {selectedJob.company_name}
                        </h2>
                        <h3 className="text-xl text-gray-700">
                          {selectedJob.job_title}
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
                      {selectedJob.applicants_needed} applicants needed
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {selectedJob.job_skill.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm"
                      >
                        {skill.skill}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 flex gap-4">
                    <button
                      className="bg-blue-600 text-white px-8 py-2 rounded-md hover:bg-blue-700"
                      onClick={() => handleApply(selectedJob.company_name, selectedJob.id)}
                    >
                      Apply Now
                    </button>
                    <button className="border border-gray-300 text-gray-700 px-8 py-2 rounded-md hover:bg-gray-50">
                      <HeartIcon className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="mt-8">
                    <h4 className="text-lg font-semibold mb-4">
                      About The Job
                    </h4>
                    <p className="text-gray-600 mb-6">
                      {selectedJob.company_description}
                    </p>

                    {selectedJob.responsibilities.length > 0 && (
                      <>
                        <h5 className="font-semibold mb-2">Key Responsibilities:</h5>
                        <ul className="list-disc pl-5 mb-6">
                          {selectedJob.responsibilities.map((item, index) => (
                            <li key={index} className="text-gray-600 mb-1">
                              {item}
                            </li>
                          ))}
                        </ul>
                      </>
                    )}

                    {selectedJob.qualifications.length > 0 && (
                      <>
                        <h5 className="font-semibold mb-2">Qualifications:</h5>
                        <ul className="list-disc pl-5 mb-6">
                          {selectedJob.qualifications.map((item, index) => (
                            <li key={index} className="text-gray-600 mb-1">
                              {item}
                            </li>
                          ))}
                        </ul>
                      </>
                    )}

                    <h4 className="text-lg font-semibold mb-4">
                      About the Company
                    </h4>
                    <p className="text-gray-600">{selectedJob.about_company}</p>
                  </div>
                </div>
              ) : (
                <div className="bg-white p-8 rounded-lg shadow flex items-center justify-center">
                  <p className="text-gray-500">Select a job to view details</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default JobPosts;
