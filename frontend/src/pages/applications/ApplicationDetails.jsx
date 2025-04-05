import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { applicationsApi } from '../../services/api/applicationsApi';
import Navbar from '../../components/Navbar';
import ConfirmationWithdrawModal from '../../components/modals/ConfirmationWithdrawModal';
import { 
  BuildingOfficeIcon, 
  CalendarIcon, 
  ClockIcon,
  DocumentTextIcon,
  ArrowLeftIcon,
  DocumentArrowDownIcon,
  XMarkIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClipboardDocumentCheckIcon,
  UserGroupIcon,
  ClockIcon as ClockIconSolid,
  ExclamationTriangleIcon,
  ArrowPathIcon
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

  // Add function to detect withdrawn applications
  const isWithdrawn = () => {
    return application?.status === 'withdrawn';
  };

  // Update isInactive to check for either archived or withdrawn
  const isInactive = () => {
    return isJobArchived() || isWithdrawn();
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

  const getStatusIcon = (status) => {
    switch(status) {
      case 'accepted':
      case 'approved':
        return <CheckCircleIcon className="h-6 w-6 text-green-500" />;
      case 'rejected':
        return <XCircleIcon className="h-6 w-6 text-red-500" />;
      case 'shortlisted':
        return <ClipboardDocumentCheckIcon className="h-6 w-6 text-blue-500" />;
      case 'interview':
        return <UserGroupIcon className="h-6 w-6 text-purple-500" />;
      case 'pending':
        return <ClockIconSolid className="h-6 w-6 text-yellow-500" />;
      default:
        return <ExclamationTriangleIcon className="h-6 w-6 text-gray-500" />;
    }
  };

  // Update the status message function to handle archived jobs
  const getStatusMessage = (status) => {
    // Check for archived job first
    if (isJobArchived()) {
      return "This job posting has been archived by the employer. It is no longer accepting applications.";
    }
    
    switch(status) {
      case 'accepted':
      case 'approved':
        return "Congratulations! Your application has been accepted. The employer will contact you shortly with details regarding the next steps in the onboarding process. Please ensure your contact information is up to date.";
      case 'rejected':
        return "Thank you for your interest in this position. After careful review, the employer has decided to pursue other candidates whose qualifications better match their current requirements. We encourage you to apply for other positions that align with your skills and experience.";
      case 'shortlisted':
        return "Your application has been shortlisted. This means your qualifications have been recognized by the hiring team and your application is receiving further consideration. You may be contacted for additional information or assessments.";
      case 'interview':
        return "You have been selected for an interview, which is a significant step in the hiring process. The employer will reach out soon to coordinate a suitable time. We recommend preparing by researching the company and reviewing the job requirements.";
      case 'pending':
        return "Your application is currently under review by the hiring team. The typical review process may take 1-2 weeks. You can check this dashboard for status updates or modify your application if needed.";
      default:
        return "Application status: " + status + ". Please refer to your dashboard for the most current information regarding your application.";
    }
  };

  // Add function to get application status step
  const getApplicationStep = (status) => {
    switch(status) {
      case 'accepted': 
      case 'approved': return 5;
      case 'rejected': return -1; // Special case
      case 'interview': return 4;
      case 'shortlisted': return 3;
      case 'pending': return 2;
      default: return 1;
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
  // Add state for withdrawal confirmation modal
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  // Add state for loading state during withdrawal
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  
  // Get queryClient for cache invalidation
  const queryClient = useQueryClient();
  
  // Create mutation for withdrawing application
  const withdrawMutation = useMutation({
    mutationFn: () => applicationsApi.withdrawApplication(id),
    onMutate: () => {
      setIsWithdrawing(true);
    },
    onSuccess: () => {
      // Invalidate and refetch application data
      queryClient.invalidateQueries(['application', id]);
      // Invalidate my applications list
      queryClient.invalidateQueries(['my-applications']);
      // Show success message or toast notification here
      
      // Optionally navigate back to applications list
      navigate('/applications', { 
        state: { message: 'Application withdrawn successfully' }
      });
    },
    onError: (error) => {
      // Handle error, show error message
      console.error('Failed to withdraw application:', error);
      // Show error toast or message
    },
    onSettled: () => {
      setIsWithdrawing(false);
      setShowWithdrawModal(false);
    }
  });
  
  // Handle withdrawal confirmation
  const handleWithdraw = () => {
    withdrawMutation.mutate();
  };

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

  const applicationStep = getApplicationStep(application?.status);

  return (
    <>
      <Navbar />
      {/* Add modal */}
      <JobDetailsModal 
        isOpen={showJobModal}
        onClose={() => setShowJobModal(false)}
        jobPosting={application?.job_posting}
      />
      
      <div className="pt-20 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <button
              onClick={() => navigate('/applications')}
              className="flex items-center text-sm text-blue-600 hover:text-blue-800 bg-white rounded-full px-4 py-2 shadow-sm transition-all hover:shadow"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Back to My Applications
            </button>
          </div>
          
          <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-2xl">
            {/* Header with job title and status */}
            <div className={`px-8 py-6 border-b border-gray-200 ${isInactive() ? 'bg-gray-50' : 'bg-gradient-to-r from-white to-gray-50'}`}>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex items-center">
                    <h1 className={`text-2xl font-bold ${isInactive() ? 'text-gray-500' : 'text-gray-900'}`}>
                      {application?.job_posting?.job_title}
                    </h1>
                  </div>
                  <div className="flex items-center mt-2 text-gray-600">
                    <BuildingOfficeIcon className="h-5 w-5 mr-2" />
                    <span className="text-md font-medium">{application?.job_posting?.company_name}</span>
                  </div>
                </div>
                <div className="mt-4 md:mt-0">
                  {isJobArchived() ? (
                    <span className="px-4 py-2 inline-flex text-md leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 border border-gray-300">
                      <XMarkIcon className="h-5 w-5 mr-1.5" />
                      Archived
                    </span>
                  ) : isWithdrawn() ? (
                    <span className="px-4 py-2 inline-flex text-md leading-5 font-semibold rounded-full bg-slate-100 text-slate-800 border border-slate-300">
                      <XMarkIcon className="h-5 w-5 mr-1.5" />
                      Withdrawn
                    </span>
                  ) : (
                    <span className={`px-4 py-2 inline-flex text-md leading-5 font-semibold rounded-full ${getStatusBadge(application?.status)}`}>
                      {application?.status && application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Application Progress Timeline */}
            {!isInactive() && applicationStep !== -1 && (
              <div className="px-8 py-5 border-b border-gray-200 bg-white">
                <h2 className="text-md font-medium text-gray-700 mb-4">Application Progress</h2>
                <div className="relative">
                  <div className="absolute left-0 top-4 w-full h-1 bg-gray-200" aria-hidden="true"></div>
                  <ul className="relative flex justify-between items-center">
                    {['Applied', 'Under Review', 'Shortlisted', 'Interview', 'Accepted'].map((step, index) => {
                      const isActive = index + 1 <= applicationStep;
                      const isCurrent = index + 1 === applicationStep;
                      return (
                        <li key={step} className={`flex flex-col items-center ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            isCurrent ? 'bg-blue-600 text-white ring-4 ring-blue-100' : 
                            isActive ? 'bg-blue-100 text-blue-600' : 'bg-gray-100'
                          }`}>
                            {index + 1}
                          </div>
                          <span className={`mt-2 text-xs ${isCurrent ? 'font-bold' : 'font-medium'}`}>{step}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            )}

            {/* Application status message with better styling */}
            <div className={`px-8 py-6 border-b ${
              isJobArchived() ? 'bg-gray-50 border-gray-200' : 
              isWithdrawn() ? 'bg-slate-50 border-slate-200' :
              application?.status === 'rejected' ? 'bg-red-50 border-red-100' :
              application?.status === 'accepted' || application?.status === 'approved' ? 'bg-green-50 border-green-100' :
              'bg-blue-50 border-blue-100'
            }`}>
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-3">
                  {isJobArchived() ? (
                    <XMarkIcon className="h-6 w-6 text-gray-500" />
                  ) : isWithdrawn() ? (
                    <XMarkIcon className="h-6 w-6 text-slate-500" />
                  ) : (
                    getStatusIcon(application?.status)
                  )}
                </div>
                <div>
                  <h3 className={`text-md font-semibold ${
                    isJobArchived() ? 'text-gray-700' : 
                    isWithdrawn() ? 'text-slate-700' :
                    application?.status === 'rejected' ? 'text-red-700' :
                    application?.status === 'accepted' || application?.status === 'approved' ? 'text-green-700' :
                    'text-blue-700'
                  }`}>
                    {isJobArchived() ? 'Job Archived' : 
                     isWithdrawn() ? 'Application Withdrawn' :
                     application?.status === 'rejected' ? 'Application Not Selected' :
                     application?.status === 'accepted' || application?.status === 'approved' ? 'Application Accepted' :
                     application?.status === 'shortlisted' ? 'Application Shortlisted' :
                     application?.status === 'interview' ? 'Interview Stage' :
                     application?.status === 'pending' ? 'Application Under Review' :
                     'Application Status'}
                  </h3>
                  <p className={`text-sm mt-1 ${
                    isJobArchived() ? 'text-gray-600' : 
                    isWithdrawn() ? 'text-slate-600' :
                    application?.status === 'rejected' ? 'text-red-600' :
                    application?.status === 'accepted' || application?.status === 'approved' ? 'text-green-600' :
                    'text-blue-600'
                  }`}>
                    {isWithdrawn() ? 
                      "You have withdrawn this application. The employer has been notified, and this position is no longer being considered for you." : 
                      getStatusMessage(application?.status)
                    }
                  </p>
                  
                  {/* Add estimated time info for pending status */}
                  {application?.status === 'pending' && (
                    <div className={`mt-3 flex items-center ${
                      isInactive() ? 'text-gray-400' : 'text-yellow-600'
                    } text-xs`}>
                      {isInactive() ? (
                        <ClockIcon className="h-4 w-4 mr-1" />
                      ) : (
                        <ArrowPathIcon className="h-4 w-4 mr-1 animate-spin-slow" />
                      )}
                      {isInactive() ? 
                        "Response time information not available (inactive application)" : 
                        "Typical response time: 1-2 weeks"
                      }
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Application details with improved styling */}
            <div className="px-8 py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <ClipboardDocumentCheckIcon className="h-5 w-5 mr-2 text-blue-500" />
                    Application Information
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <CalendarIcon className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Applied On</p>
                        <p className="text-md text-gray-900 font-medium">
                          {application?.created_at && format(new Date(application.created_at), 'PPP')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <ClockIcon className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Last Updated</p>
                        <p className="text-md text-gray-900 font-medium">
                          {application?.updated_at && format(new Date(application.updated_at), 'PPP')}
                        </p>
                      </div>
                    </div>
                    
                    {application?.resume_url && (
                      <div className="flex items-start">
                        <DocumentTextIcon className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">Resume</p>
                          <button 
                            onClick={handleDownloadResume}
                            className="mt-1 text-sm text-blue-600 hover:text-blue-800 flex items-center bg-blue-50 px-3 py-1.5 rounded-md transition-colors hover:bg-blue-100"
                          >
                            <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                            Download Resume
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <BuildingOfficeIcon className="h-5 w-5 mr-2 text-blue-500" />
                    Job Information
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Job Location</p>
                      <p className="text-md text-gray-900 font-medium">
                        {application?.job_posting?.location || 'Not specified'}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-700">Salary Range</p>
                      <p className="text-md text-gray-900 font-medium">
                        {application?.job_posting?.salary_range || 'Not specified'}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-700">Employment Type</p>
                      <p className="text-md text-gray-900 font-medium">
                        {application?.job_posting?.employment_type || 'Not specified'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Additional details like cover letter if available */}
            {application?.cover_letter && (
              <div className="px-8 py-6 border-t border-gray-200 bg-gray-50">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <DocumentTextIcon className="h-5 w-5 mr-2 text-blue-500" />
                  Cover Letter
                </h2>
                <div className="prose prose-sm max-w-none bg-white p-5 rounded-lg border border-gray-100 shadow-sm">
                  <p className="text-sm text-gray-700 whitespace-pre-line">
                    {application.cover_letter}
                  </p>
                </div>
              </div>
            )}
            
            {/* Actions with improved styling */}
            <div className="px-8 py-6 border-t border-gray-200 bg-gray-50 flex justify-end">
              <button
                onClick={() => setShowJobModal(true)}
                className={`text-sm mr-4 px-4 py-2 rounded-md transition-all ${
                  isInactive() 
                    ? 'bg-gray-100 text-gray-600 hover:bg-gray-200 flex items-center' 
                    : 'bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center'
                }`}
              >
                {isInactive() && (
                  <span className="inline-block w-3 h-3 rounded-full bg-gray-300 mr-1.5"></span>
                )}
                View Job Details {isJobArchived() && '(Archived)'}
              </button>
              
              {/* Only show withdraw button if not already rejected/accepted/withdrawn and not archived */}
              {application?.status !== 'rejected' && 
               application?.status !== 'accepted' && 
               application?.status !== 'withdrawn' &&
               !isJobArchived() && (
                <button
                  className={`text-sm bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-md transition-all flex items-center ${isWithdrawing ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => setShowWithdrawModal(true)}
                  disabled={isWithdrawing}
                >
                  {isWithdrawing ? (
                    <>
                      <ArrowPathIcon className="h-4 w-4 mr-1.5 animate-spin" />
                      Withdrawing...
                    </>
                  ) : (
                    <>
                      <XMarkIcon className="h-4 w-4 mr-1.5" />
                      Withdraw Application
                    </>
                  )}
                </button>
              )}
              
              {/* Show disabled withdraw button if job is archived */}
              {application?.status !== 'rejected' && 
               application?.status !== 'accepted' && 
               application?.status !== 'withdrawn' &&
               isJobArchived() && (
                <button
                  disabled
                  className="text-sm text-gray-400 bg-gray-100 cursor-not-allowed px-4 py-2 rounded-md flex items-center"
                >
                  <XMarkIcon className="h-4 w-4 mr-1.5" />
                  Cannot Withdraw (Job Archived)
                </button>
              )}

              {/* Show message for already withdrawn applications */}
              {isWithdrawn() && (
                <div className="text-sm text-slate-500 px-4 py-2 rounded-md flex items-center">
                  <CheckCircleIcon className="h-4 w-4 mr-1.5" />
                  Application Withdrawn
                </div>
              )}
            </div>
          </div>

          {/* Add Next Steps section for non-rejected applications */}
          {application?.status !== 'rejected' && application?.status !== 'withdrawn' && !isJobArchived() && (
            <div className="mt-6 bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
              <div className="px-8 py-6 border-b border-gray-200 bg-indigo-50">
                <h2 className="text-lg font-semibold text-indigo-800">What&apos;s Next?</h2>
              </div>
              <div className="px-8 py-6">
                {application?.status === 'pending' && (
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-2 rounded-full mr-4">
                      <ClockIcon className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Your application is being reviewed</h3>
                      <p className="mt-1 text-sm text-gray-600">
                        We recommend you continue exploring other opportunities while you wait. Don&apos;t forget to set up job alerts to stay updated on similar positions.
                      </p>
                    </div>
                  </div>
                )}
                
                {application?.status === 'shortlisted' && (
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-2 rounded-full mr-4">
                      <DocumentTextIcon className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Prepare for potential assessments</h3>
                      <p className="mt-1 text-sm text-gray-600">
                        Shortlisted candidates may be asked to complete skills assessments. Review your qualifications and be ready to showcase your expertise.
                      </p>
                    </div>
                  </div>
                )}
                
                {application?.status === 'interview' && (
                  <div className="flex items-start">
                    <div className="bg-purple-100 p-2 rounded-full mr-4">
                      <UserGroupIcon className="h-6 w-6 text-purple-500" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Prepare for your interview</h3>
                      <p className="mt-1 text-sm text-gray-600">
                        Research the company thoroughly, prepare answers to common interview questions, and think of insightful questions to ask your interviewer. Dress professionally and arrive early.
                      </p>
                    </div>
                  </div>
                )}
                
                {(application?.status === 'accepted' || application?.status === 'approved') && (
                  <div className="flex items-start">
                    <div className="bg-green-100 p-2 rounded-full mr-4">
                      <CheckCircleIcon className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Prepare for onboarding</h3>
                      <p className="mt-1 text-sm text-gray-600">
                        Congratulations! Review any documents sent by the employer and prepare for your first day. Make sure your contact information is up to date so you don't miss any important communications.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Add the confirmation modal */}
      <ConfirmationWithdrawModal
        isOpen={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
        onConfirm={handleWithdraw}
        title="Withdraw Application"
        message="Are you sure you want to withdraw this application? This action cannot be undone and the employer will be notified that you are no longer interested in this position."
        confirmButtonText="Withdraw Application"
        cancelButtonText="Cancel"
        isDestructive={true}
      />
    </>
  );
};

export default ApplicationDetails;