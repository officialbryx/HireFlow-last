import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { applicationsApi } from '../../services/api/applicationsApi';
import Navbar from '../../components/Navbar';
import { 
  BuildingOfficeIcon, 
  CalendarIcon, 
  ClockIcon,
  DocumentTextIcon,
  ArrowLeftIcon,
  DocumentArrowDownIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import JobDetailsModal from '../../components/modals/JobDetailsModal';

const ApplicationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { data: application, isLoading, error } = useQuery({
    queryKey: ['application', id],
    queryFn: () => applicationsApi.getApplicationDetails(id),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  console.log('Application data:', application);

  // Add this function to detect archived job postings
  const isJobArchived = () => {
    return application?.job_posting?.status === 'archived' 
           
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'accepted':
      case 'approved':
        return 'bg-green-100 text-green-800 border border-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 border border-red-300';
      case 'shortlisted':
        return 'bg-blue-100 text-blue-800 border border-blue-300';
      case 'interview':
        return 'bg-purple-100 text-purple-800 border border-purple-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-300';
    }
  };

  // Update the status message function to handle archived jobs
  const getStatusMessage = (status) => {
    // Check for archived job first
    if (isJobArchived()) {
      return "This job posting has been archived by the employer. It is no longer accepting applications.";
    }
    
    // Original switch statement
    switch(status) {
      case 'accepted':
      case 'approved':
        return "Congratulations! Your application has been accepted. The employer should contact you soon with next steps.";
      case 'rejected':
        return "Thank you for your interest. Unfortunately, this application was not selected. We encourage you to apply for other positions.";
      case 'shortlisted':
        return "Your application has been shortlisted. The hiring team is reviewing your qualifications.";
      case 'interview':
        return "Great news! You've been selected for an interview. The employer will contact you to schedule a time.";
      case 'pending':
        return "Your application is being reviewed. Check back for updates on your status.";
      default:
        return "Application status: " + status;
    }
  };

  const handleDownloadResume = async () => {
    if (application?.resume_url) {
      try {
        await applicationsApi.downloadResume(application.resume_url);
      } catch (error) {
        console.error('Error downloading resume', error);
      }
    }
  };

  // Add state for modal
  const [showJobModal, setShowJobModal] = useState(false);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="pt-20 px-4 sm:px-6 lg:px-8 flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="pt-20 px-4 sm:px-6 lg:px-8 flex justify-center items-center min-h-screen">
          <div className="text-red-500">Error loading application: {error.message}</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      {/* Add modal */}
      <JobDetailsModal 
        isOpen={showJobModal}
        onClose={() => setShowJobModal(false)}
        jobPosting={application?.job_posting}
      />
      
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <button
              onClick={() => navigate('/applications')}
              className="flex items-center text-sm text-blue-600 hover:text-blue-800"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Back to My Applications
            </button>
          </div>
          
          <div className="bg-white shadow-lg rounded-xl overflow-hidden">
            {/* Header with job title and status */}
            <div className={`px-6 py-4 border-b border-gray-200 ${isJobArchived() ? 'bg-gray-50' : ''}`}>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex items-center">
                    <h1 className={`text-xl font-semibold ${isJobArchived() ? 'text-gray-500' : 'text-gray-900'}`}>
                      {application?.job_posting?.job_title}
                    </h1>
                  </div>
                  <div className="flex items-center mt-1 text-gray-600">
                    <BuildingOfficeIcon className="h-4 w-4 mr-1" />
                    <span className="text-sm">{application?.job_posting?.company_name}</span>
                  </div>
                </div>
                <div className="mt-4 md:mt-0">
                  {isJobArchived() ? (
                    <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 border border-gray-300">
                      Archived
                    </span>
                  ) : (
                    <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusBadge(application?.status)}`}>
                      {application?.status && application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Application status message */}
            <div className={`px-6 py-4 border-b ${isJobArchived() ? 'bg-gray-50 border-gray-200' : 'bg-blue-50 border-blue-100'}`}>
              <p className={`text-sm ${isJobArchived() ? 'text-gray-600' : 'text-blue-800'}`}>
                {getStatusMessage(application?.status)}
              </p>
            </div>
            
            {/* Application details */}
            <div className="px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Application Information</h2>
                  
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <CalendarIcon className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Applied On</p>
                        <p className="text-sm text-gray-900">
                          {application?.created_at && format(new Date(application.created_at), 'PPP')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <ClockIcon className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Last Updated</p>
                        <p className="text-sm text-gray-900">
                          {application?.updated_at && format(new Date(application.updated_at), 'PPP')}
                        </p>
                      </div>
                    </div>
                    
                    {application?.resume_url && (
                      <div className="flex items-start">
                        <DocumentTextIcon className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-500">Resume</p>
                          <button 
                            onClick={handleDownloadResume}
                            className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                          >
                            <DocumentArrowDownIcon className="h-4 w-4 mr-1" />
                            Download Resume
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Job Information</h2>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Job Location</p>
                      <p className="text-sm text-gray-900">
                        {application?.job_posting?.location || 'Not specified'}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-500">Salary Range</p>
                      <p className="text-sm text-gray-900">
                        {application?.job_posting?.salary_range || 'Not specified'}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-500">Employment Type</p>
                      <p className="text-sm text-gray-900">
                        {application?.job_posting?.employment_type || 'Not specified'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Additional details like cover letter if available */}
            {application?.cover_letter && (
              <div className="px-6 py-4 border-t border-gray-200">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Cover Letter</h2>
                <div className="prose prose-sm max-w-none">
                  <p className="text-sm text-gray-700 whitespace-pre-line">
                    {application.cover_letter}
                  </p>
                </div>
              </div>
            )}
            
            {/* Actions with modified View Job Posting link for archived jobs */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowJobModal(true)}
                className={`text-sm mr-4 ${
                  isJobArchived() 
                    ? 'text-gray-500 hover:text-gray-700 flex items-center' 
                    : 'text-blue-600 hover:text-blue-800 flex items-center'
                }`}
              >
                {isJobArchived() && (
                  <span className="inline-block w-3 h-3 rounded-full bg-gray-300 mr-1.5"></span>
                )}
                View Job Details {isJobArchived() && '(Archived)'}
              </button>
              
              {/* Only show withdraw button if not already rejected/accepted and not archived */}
              {application?.status !== 'rejected' && 
               application?.status !== 'accepted' && 
               !isJobArchived() && (
                <button
                  className="text-sm text-red-600 hover:text-red-800"
                  // onClick={handleWithdraw}
                >
                  Withdraw Application
                </button>
              )}
              
              {/* Show disabled withdraw button if job is archived */}
              {application?.status !== 'rejected' && 
               application?.status !== 'accepted' && 
               isJobArchived() && (
                <button
                  disabled
                  className="text-sm text-gray-400 cursor-not-allowed"
                >
                  Cannot Withdraw (Job Archived)
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ApplicationDetails;