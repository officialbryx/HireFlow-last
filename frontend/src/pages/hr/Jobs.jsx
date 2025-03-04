import { useState, useEffect } from "react";
import HRNavbar from "../../components/HRNavbar";
import CreateJobPost from "../hr/CreateJobPost";
import { api } from "../../services/api";
import {
  MapPinIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

const Jobs = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMessage, setShowMessage] = useState(false);
  const [messageType, setMessageType] = useState('');
  const [message, setMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(9); // Show 9 jobs per page (3x3 grid)
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const data = await api.getAllJobPostings();
      setJobs(data);
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
      setShowCreateModal(false); // Close the create modal
      setMessageType('success');
      setMessage('Job post created successfully!');
      setShowMessage(true);
      
      // Auto hide message after 3 seconds
      setTimeout(() => {
        setShowMessage(false);
      }, 3000);
    } catch (error) {
      setMessageType('error');
      setMessage(error.message || 'Error creating job post');
      setShowMessage(true);
    }
  };

  const handleEditJob = async (jobId) => {
    try {
      const jobDetails = await api.getJobPostingDetails(jobId);
      console.log('Raw Job Details:', jobDetails); // For debugging

      // Map API response to form data structure with proper array handling
      const mappedJobDetails = {
        title: jobDetails.job_title || '',
        companyName: jobDetails.company_name || '',
        companyLogo: jobDetails.company_logo_url || null,
        location: jobDetails.location || '',
        employmentType: jobDetails.employment_type || 'Full-time',
        salaryRange: jobDetails.salary_range || '',
        applicantsNeeded: jobDetails.applicants_needed || '',
        companyDescription: jobDetails.company_description || '',
        // Ensure we're accessing the nested arrays correctly
        responsibilities: Array.isArray(jobDetails.job_responsibility) 
          ? jobDetails.job_responsibility.map(r => r.responsibility)
          : [''],
        qualifications: Array.isArray(jobDetails.job_qualification)
          ? jobDetails.job_qualification.map(q => q.qualification)
          : [''],
        skills: Array.isArray(jobDetails.job_skill)
          ? jobDetails.job_skill.map(s => s.skill)
          : [''],
        aboutCompany: jobDetails.about_company || '',
        id: jobDetails.id
      };

      console.log('Mapped Job Details:', mappedJobDetails); // For debugging
      setSelectedJob(mappedJobDetails);
      setShowEditModal(true);
    } catch (error) {
      console.error('Error fetching job details:', error);
      setMessageType('error');
      setMessage('Error fetching job details');
      setShowMessage(true);
    }
  };

  const handleJobEdited = async (updatedJobData) => {
    try {
      if (!selectedJob?.id) {
        throw new Error('No job ID found for updating');
      }

      // Map form data to API format
      const mappedData = {
        id: selectedJob.id,
        job_title: updatedJobData.title,
        company_name: updatedJobData.companyName,
        company_logo_url: updatedJobData.companyLogo,
        oldLogoUrl: selectedJob.companyLogo,
        location: updatedJobData.location,
        employment_type: updatedJobData.employmentType,
        salary_range: updatedJobData.salaryRange,
        applicants_needed: updatedJobData.applicantsNeeded,
        company_description: updatedJobData.companyDescription,
        responsibilities: updatedJobData.responsibilities.filter(r => r.trim() !== ''),
        qualifications: updatedJobData.qualifications.filter(q => q.trim() !== ''),
        about_company: updatedJobData.aboutCompany,
        skills: updatedJobData.skills.filter(s => s.trim() !== '')
      };

      await api.updateJobPost(selectedJob.id, mappedData);
      setShowEditModal(false);
      setSelectedJob(null);
      
      // Fetch fresh data after update
      await fetchJobs();
      
      setMessageType('success');
      setMessage('Job post updated successfully!');
      setShowMessage(true);
      
      setTimeout(() => {
        setShowMessage(false);
      }, 3000);
    } catch (error) {
      console.error('Error updating job:', error);
      setMessageType('error');
      setMessage(error.message || 'Error updating job post');
      setShowMessage(true);
    }
  };

  // Add this new function after handleJobEdited
  const handleDeleteJob = async (jobId, e) => {
    try {
      // Stop event propagation to prevent edit modal from opening
      e?.stopPropagation();
      
      if (!window.confirm('Are you sure you want to delete this job posting?')) {
        return;
      }
  
      // Delete the job post
      await api.deleteJobPost(jobId);
      
      // Refresh the job list
      await fetchJobs();
      
      setMessageType('success');
      setMessage('Job post deleted successfully!');
      setShowMessage(true);
      
      setTimeout(() => {
        setShowMessage(false);
      }, 3000);
    } catch (error) {
      console.error('Error deleting job:', error);
      setMessageType('error');
      setMessage(error.message || 'Error deleting job post');
      setShowMessage(true);
    }
  };

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(jobs.length / jobsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {currentJobs.map((job) => (
                  <div
                    key={job.id}
                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => handleEditJob(job.id)}
                  >
                    <div className="flex items-start space-x-4 mb-4">
                      <div className="flex-shrink-0">
                        {job.company_logo_url ? (
                          <img
                            src={job.company_logo_url}
                            alt={`${job.company_name} logo`}
                            className="h-12 w-12 object-contain rounded"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500 text-lg font-semibold">
                              {job.company_name?.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h2 className="text-xl font-semibold text-gray-800 truncate">
                          {job.job_title}
                        </h2>
                        <p className="text-gray-600">{job.company_name}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPinIcon className="h-4 w-4 mr-2" />
                        {job.location}
                      </div>

                      <div className="flex items-center text-sm text-gray-500">
                        <BriefcaseIcon className="h-4 w-4 mr-2" />
                        {job.employment_type}
                      </div>

                      <div className="flex items-center text-sm text-gray-500">
                        <CurrencyDollarIcon className="h-4 w-4 mr-2" />
                        {job.salary_range}
                      </div>

                      <div className="flex items-center text-sm text-gray-500">
                        <UserGroupIcon className="h-4 w-4 mr-2" />
                        {job.applicants_needed} applicants needed
                      </div>

                      <div className="flex items-center text-sm text-gray-500">
                        <svg
                          className="h-4 w-4 mr-2"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Created: {new Date(job.created_at).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                      <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                        job.status === 'active' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {job.status}
                      </span>
                      <div className="flex space-x-2">
                        <button
                          className="text-gray-600 hover:text-blue-600 transition-colors"
                          onClick={() => handleEditJob(job.id)}
                        >
                          Edit
                        </button>
                        <button
                          className="text-gray-600 hover:text-red-600 transition-colors"
                          onClick={(e) => handleDeleteJob(job.id, e)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {jobs.length > 0 && (
                <div className="mt-8 flex justify-center space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                    }`}
                  >
                    Previous
                  </button>
                  
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => handlePageChange(index + 1)}
                      className={`px-3 py-1 rounded-md ${
                        currentPage === index + 1
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === totalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                    }`}
                  >
                    Next
                  </button>
                </div>
              )}

              {jobs.length === 0 && !loading && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">
                    No jobs found. Create your first job posting!
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {showMessage && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className={`rounded-lg shadow-lg p-4 ${
            messageType === 'success' 
              ? 'bg-green-100 border-l-4 border-green-500' 
              : 'bg-red-100 border-l-4 border-red-500'
          }`}>
            <div className="flex items-center">
              {messageType === 'success' ? (
                <svg className="h-6 w-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="h-6 w-6 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              <p className={`text-sm font-medium ${
                messageType === 'success' ? 'text-green-800' : 'text-red-800'
              }`}>
                {message}
              </p>
            </div>
          </div>
        </div>
      )}

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

      {showEditModal && selectedJob && (
        <div className="fixed inset-0 bg-gray-600/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CreateJobPost
              isEditing={true}
              initialData={selectedJob}
              onClose={() => {
                setShowEditModal(false);
                setSelectedJob(null);
              }}
              onJobCreated={handleJobEdited}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Jobs;