import { useState, useEffect } from "react";
import HRNavbar from "../../components/HRNavbar";
import ViewJobs from "../../components/jobs/ViewJobs";
import CreateJob from "../../components/jobs/CreateJob";
import ArchivedJobs from "../../components/jobs/ArchivedJobs";
import { api } from "../../services/api";
import {
  MapPinIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import JobFormModal from '../../components/modals/JobFormModal';
import Toast from '../../components/notifications/Toast';
import ConfirmationModal from '../../components/modals/ConfirmationModal';

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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [activeTab, setActiveTab] = useState('view'); // Add this state

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

  const handleDeleteJob = async (jobId, e) => {
    // Stop event propagation to prevent edit modal from opening
    e?.stopPropagation();
    
    // Set the job to delete and show the confirmation modal
    setJobToDelete(jobId);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await api.deleteJobPost(jobToDelete);
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
    } finally {
      setShowDeleteModal(false);
      setJobToDelete(null);
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
          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('view')}
                className={`${
                  activeTab === 'view'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                View Jobs
              </button>
              <button
                onClick={() => setActiveTab('create')}
                className={`${
                  activeTab === 'create'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Create Job
              </button>
              <button
                onClick={() => setActiveTab('archived')}
                className={`${
                  activeTab === 'archived'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Archived Jobs
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === 'view' && (
            <ViewJobs
              jobs={jobs}
              loading={loading}
              currentJobs={currentJobs}
              handleEditJob={handleEditJob}
              handleDeleteJob={handleDeleteJob}
              currentPage={currentPage}
              totalPages={totalPages}
              handlePageChange={handlePageChange}
            />
          )}

          {activeTab === 'create' && (
            <CreateJob onJobCreated={handleJobCreated} />
          )}

          {activeTab === 'archived' && (
            <ArchivedJobs
              archivedJobs={jobs.filter(job => job.status === 'archived')}
              handleRestore={(jobId) => {
                // Add restore functionality
              }}
            />
          )}
        </div>
      </div>

      {/* Keep the modals */}
      <Toast show={showMessage} type={messageType} message={message} />
      <JobFormModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleJobCreated}
        isEditing={false}
      />

      <JobFormModal 
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedJob(null);
        }}
        onSubmit={handleJobEdited}
        isEditing={true}
        initialData={selectedJob}
      />

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setJobToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Job Posting"
        message="Are you sure you want to delete this job posting? This action cannot be undone."
      />
    </div>
  );
};

export default Jobs;