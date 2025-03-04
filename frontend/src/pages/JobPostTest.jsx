import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import {
  MagnifyingGlassIcon,
  MapPinIcon,
  ShareIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon } from "@heroicons/react/24/outline";
import { api } from "../services/api";

const JobPostTest = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobListings, setJobListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await api.getAllJobPostings();
        // Filter out archived jobs and map the remaining jobs data
        const mappedJobs = data
          .filter(job => job.status !== 'archived')
          .map(job => ({
            id: job.id,
            job_title: job.job_title,
            company_name: job.company_name,
            company_logo_url: job.company_logo_url,
            location: job.location,
            employment_type: job.employment_type,
            created_at: job.created_at,
            status: job.status,
            skills: job.job_skill?.map(s => s.skill) || []
          }));
        setJobListings(mappedJobs);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError("Failed to fetch job postings");
        setIsLoading(false);
      }
    };

    fetchJobs();

    // Cleanup function to revoke object URLs when component unmounts
    return () => {
      jobListings.forEach(job => {
        if (job.company_logo_url && job.company_logo_url.startsWith('blob:')) {
          URL.revokeObjectURL(job.company_logo_url);
        }
      });
    };
  }, []);

  // When selecting a job, fetch its full details
  const handleJobSelect = async (job) => {
    try {
      const jobDetails = await api.getJobPostingDetails(job.id);
      // Only show job details if the job is not archived
      if (jobDetails.status !== 'archived') {
        const mappedJobDetails = {
          id: jobDetails.id,
          job_title: jobDetails.job_title,
          company_name: jobDetails.company_name,
          company_logo_url: jobDetails.company_logo_url,
          location: jobDetails.location,
          employment_type: jobDetails.employment_type,
          salary_range: jobDetails.salary_range,
          applicants_needed: jobDetails.applicants_needed,
          company_description: jobDetails.company_description,
          about_company: jobDetails.about_company,
          created_at: jobDetails.created_at,
          status: jobDetails.status,
          responsibilities: jobDetails.job_responsibility?.map(r => r.responsibility) || [],
          qualifications: jobDetails.job_qualification?.map(q => q.qualification) || [],
          skills: jobDetails.job_skill?.map(s => s.skill) || []
        };
        setSelectedJob(mappedJobDetails);
      }
    } catch (err) {
      console.error('Error fetching job details:', err);
      setError("Failed to load job details");
    }
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

  // Filter jobs based on search query and selected filter
  const filteredJobs = jobListings.filter(job => {
    const matchesSearch = job.job_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));

    if (selectedFilter === "all") return matchesSearch;
    if (selectedFilter === "recent") {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return matchesSearch && new Date(job.created_at) >= oneWeekAgo;
    }
    if (selectedFilter === "remote") return matchesSearch && job.employment_type === "Remote";
    if (selectedFilter === "fulltime") return matchesSearch && job.employment_type === "Full-time";
    if (selectedFilter === "parttime") return matchesSearch && job.employment_type === "Part-time";
    
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* NavBar */}
      <div className="z-50 bg-white shadow fixed top-0 left-0 w-full">
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
                {filteredJobs.map((job, index) => (
                  <div
                    key={job.id}
                    className={`relative cursor-pointer transition-all duration-200
                      ${
                        selectedJob?.id === job.id
                          ? "bg-gray-50 border-l-4 border-black"
                          : "border-l-4 border-transparent hover:border-l-4 hover:border-gray-300"
                      }
                      ${index !== 0 ? "border-t border-gray-200" : ""}`}
                    onClick={() => handleJobSelect(job)}
                  >
                    <div className="p-4">
                      <div className="flex gap-4">
                        {job.company_logo_url ? (
                          <img
                            src={job.company_logo_url}
                            alt={job.company_name}
                            className="w-12 h-12 rounded object-contain"
                          />
                        ) : (
                          <BuildingOfficeIcon className="w-12 h-12 text-gray-400" />
                        )}
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {job.job_title}
                          </h3>
                          <p className="text-gray-600 text-sm">{job.company_name}</p>
                          <div className="flex items-center text-gray-500 text-sm mt-1">
                            <MapPinIcon className="h-4 w-4 mr-1" />
                            {job.location}
                          </div>
                          <p className="text-gray-500 text-sm mt-2">
                            Posted {new Date(job.created_at).toLocaleDateString()}
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
                  {selectedJob.company_logo_url ? (
                    <img
                      src={selectedJob.company_logo_url}
                      alt={selectedJob.company_name}
                      className="w-16 h-16 rounded object-contain bg-gray-50"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = ''; // Set empty source to show BuildingOfficeIcon
                        e.target.className = 'hidden';
                        e.target.nextElementSibling.className = 'w-16 h-16 text-gray-400';
                      }}
                    />
                  ) : (
                    <BuildingOfficeIcon className="w-16 h-16 text-gray-400" />
                  )}
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
                <button
                  className="bg-blue-600 text-white px-8 py-2 rounded-md hover:bg-blue-700"
                  onClick={() => handleApply(selectedJob.company_name)}
                >
                  Apply Now
                </button>
                <button className="border border-gray-300 text-gray-700 px-8 py-2 rounded-md hover:bg-gray-50">
                  <HeartIcon className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-8">
                <h4 className="text-lg font-semibold mb-4">About The Job</h4>
                <p className="text-gray-600 mb-6">
                  {selectedJob.company_description}
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
                <p className="text-gray-600">{selectedJob.about_company}</p>
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

export default JobPostTest;