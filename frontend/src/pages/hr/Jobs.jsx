import { useState, useEffect } from "react";
import HRNavbar from "../../components/HRNavbar";
import ViewJobs from "../../components/jobs/ViewJobs";
import CreateJob from "../../components/jobs/CreateJob";
import ArchivedJobs from "../../components/jobs/ArchivedJobs";
import { api } from "../../services/api";
import JobFormModal from '../../components/modals/JobFormModal';
import Toast from '../../components/notifications/Toast';
import ConfirmationModal from '../../components/modals/ConfirmationModal';
import { useJobs } from '../../hooks/useJobs';
import { usePagination } from '../../hooks/usePagination';
import { useToast } from '../../hooks/useToast';
import { useJobModals } from '../../hooks/useJobModals';

const Jobs = () => {
  const { jobs, loading, fetchJobs } = useJobs();
  const { getPaginatedData } = usePagination();
  const { showMessage, messageType, message, showToast } = useToast();
  const {
    showCreateModal,
    setShowCreateModal,
    showEditModal,
    setShowEditModal,
    showDeleteModal,
    setShowDeleteModal,
    selectedJob,
    setSelectedJob,
    jobToDelete,
    setJobToDelete
  } = useJobModals();
  
  const [activeTab, setActiveTab] = useState('view');

  const { currentItems: currentJobs, totalPages, currentPage, handlePageChange } = 
    getPaginatedData(jobs.filter(job => activeTab === 'archived' ? 
      job.status === 'archived' : 
      job.status !== 'archived'
    ));

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleJobCreated = async (jobData) => {
    try {
      await api.createJobPost(jobData);
      await fetchJobs(); // Refresh the job list
      setShowCreateModal(false); // Close the create modal
      showToast('success', 'Job post created successfully!');
    } catch (error) {
      showToast('error', error.message || 'Error creating job post');
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
      showToast('error', 'Error fetching job details');
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
      
      showToast('success', 'Job post updated successfully!');
    } catch (error) {
      console.error('Error updating job:', error);
      showToast('error', error.message || 'Error updating job post');
    }
  };

  // Rename handleDeleteJob to handleArchiveJob
  const handleArchiveJob = async (jobId, e) => {
    e?.stopPropagation();
    setJobToDelete(jobId); // We can keep this state name for now
    setShowDeleteModal(true);
  };

  // Rename handleConfirmDelete to handleConfirmArchive
  const handleConfirmArchive = async () => {
    try {
      await api.archiveJobPost(jobToDelete);
      await fetchJobs();
      
      showToast('success', 'Job post archived successfully!');
    } catch (error) {
      console.error('Error archiving job:', error);
      showToast('error', error.message || 'Error archiving job post');
    } finally {
      setShowDeleteModal(false);
      setJobToDelete(null);
    }
  };

  // Add restore functionality
  const handleRestore = async (jobId) => {
    try {
      await api.restoreJobPost(jobId);
      await fetchJobs();
      
      showToast('success', 'Job post restored successfully!');
    } catch (error) {
      console.error('Error restoring job:', error);
      showToast('error', error.message || 'Error restoring job post');
    }
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
              jobs={jobs.filter(job => job.status !== 'archived')}
              loading={loading}
              currentJobs={currentJobs.filter(job => job.status !== 'archived')}
              handleEditJob={handleEditJob}
              handleDeleteJob={handleArchiveJob} // Update the prop name in ViewJobs component
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
              handleRestore={handleRestore}
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

      {/* Update the confirmation modal text */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setJobToDelete(null);
        }}
        onConfirm={handleConfirmArchive}
        title="Archive Job Posting"
        message="Are you sure you want to archive this job posting? It will be moved to the archived jobs section."
      />
    </div>
  );
};

export default Jobs;