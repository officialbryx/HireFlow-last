import React, { useState, useEffect } from "react";
import HRNavbar from "../../components/HRNavbar";
import CreateJobPost from "../hr/CreateJobPost";
import { api } from "../../services/api";

const Jobs = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const jobPosts = await api.getAllJobPostings();
      setJobs(jobPosts);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleJobCreated = async (jobData) => {
    try {
      await api.createJobPost(jobData);
      await fetchJobs(); // Refresh the job list
      setShowCreateModal(false); // Close the modal after successful creation
    } catch (error) {
      console.error("Error creating job:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <HRNavbar />
      <div className="pt-16 px-4">
        <div className="max-w-7xl mx-auto py-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Job Management</h1>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Create New Job
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {jobs.map((job) => (
                <div
                  key={job._id}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    {job.title}
                  </h2>
                  <p className="text-gray-600 mb-4">{job.company}</p>
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <svg
                      className="h-4 w-4 mr-1"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {job.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <svg
                      className="h-4 w-4 mr-1"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {job.employmentType}
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-sm font-medium text-blue-600">
                      {job.status}
                    </span>
                    <div className="flex space-x-2">
                      <button
                        className="text-gray-600 hover:text-blue-600"
                        onClick={() => handleEditJob(job._id)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-gray-600 hover:text-red-600"
                        onClick={() => handleDeleteJob(job._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CreateJobPost
              onClose={() => setShowCreateModal(false)}
              onJobCreated={handleJobCreated}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Jobs;