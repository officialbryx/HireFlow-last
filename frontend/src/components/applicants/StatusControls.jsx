import { useState } from 'react';
import { applicationsApi } from '../../services/api/applicationsApi';
import { notificationsApi } from '../../services/api/notificationsApi';
import ConfirmationDialog from '../common/ConfirmationDialog';

const StatusControls = ({ 
  applicantId,
  jobId, 
  applicantUserId, 
  currentStatus,
  isShortlisted,
  onStatusUpdated,
  getBadgeColor,
  jobTitle = "this position",
  isEvaluated = true
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeStatus, setActiveStatus] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(null);
  const [isShortlisting, setIsShortlisting] = useState(false);
  const [justUpdated, setJustUpdated] = useState(false);

  const isFinalStatus = (status) => ['accepted', 'rejected'].includes(status);

  const getStatusNotificationMessage = (status) => {
    switch(status) {
      case 'pending':
        return `Your application for ${jobTitle} is currently under review by our hiring team. We appreciate your patience during this process.`;
      case 'accepted':
        return `We are pleased to inform you that your application for ${jobTitle} has been accepted. A representative will contact you shortly with further details regarding the next steps in the hiring process.`;
      case 'interview':
        return `We would like to invite you to interview for the ${jobTitle} position. Our hiring team will contact you soon to schedule a convenient time for the interview.`;
      case 'rejected':
        return `Thank you for your interest in the ${jobTitle} position. After careful consideration, we regret to inform you that we have decided to pursue other candidates whose qualifications better align with our current requirements. We appreciate your time and wish you success in your career.`;
      default:
        return `Your application status for ${jobTitle} has been updated to ${status}. Please check your dashboard for more details.`;
    }
  };

  const getConfirmationMessage = (status) => {
    switch(status) {
      case 'pending':
        return `Are you sure you want to set this application to pending review?`;
      case 'accepted':
        return `WARNING: This action cannot be undone. Are you sure you want to accept this candidate?`;
      case 'interview':
        return `Are you sure you want to move this candidate to the interview stage?`;
      case 'rejected':
        return `WARNING: This action cannot be undone. Are you sure you want to reject this candidate? This action will notify the candidate.`;
      default:
        return `Are you sure you want to update the status to ${status}?`;
    }
  };

  const initiateStatusChange = (newStatus) => {
    setPendingStatus(newStatus);
    setShowConfirmation(true);
  };

  const handleConfirmedStatusChange = async () => {
    if (!pendingStatus || isUpdating) return;
    
    setIsUpdating(true);
    setActiveStatus(pendingStatus);
    
    try {
      await applicationsApi.updateApplicationStatus(applicantId, pendingStatus);
      
      // Create notification for the applicant
      if (applicantUserId) {
        await notificationsApi.createNotification({
          job_posting_id: jobId,
          application_id: applicantId,
          recipient_id: applicantUserId,
          message: getStatusNotificationMessage(pendingStatus),
          type: pendingStatus
        });
      }
      
      if (onStatusUpdated) {
        onStatusUpdated(applicantId, { status: pendingStatus });
      }
    } catch (error) {
      console.error('Error updating application status:', error);
    } finally {
      setIsUpdating(false);
      setActiveStatus(null);
      setShowConfirmation(false);
      setPendingStatus(null);
    }
  };

  const handleShortlistToggle = async () => {
    if (!applicantId) return;

    try {
      setIsShortlisting(true);
      const newShortlistedStatus = !isShortlisted;

      await applicationsApi.updateApplicantShortlist(applicantId, newShortlistedStatus);

      if (onStatusUpdated) {
        onStatusUpdated(applicantId, {
          shortlisted: newShortlistedStatus,
        });
      }

      setJustUpdated(true);
      setTimeout(() => setJustUpdated(false), 1500);

    } catch (error) {
      console.error("Error updating shortlist status:", error);
    } finally {
      setIsShortlisting(false);
    }
  };

  return (
    <>
      <div className="flex flex-wrap gap-2 mt-4">
        {/* Shortlist button */}
        <button
          onClick={handleShortlistToggle}
          disabled={isShortlisting || isFinalStatus(currentStatus) || !isEvaluated}
          className={`px-3 py-1 text-sm rounded-md flex items-center ${
            isShortlisting || isFinalStatus(currentStatus) || !isEvaluated
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : isShortlisted
              ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border border-yellow-300'
              : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border border-yellow-200'
          }`}
        >
          {isShortlisting ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-3 w-3 text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Updating...
            </>
          ) : isShortlisted ? (
            "Remove from Shortlist"
          ) : (
            "Add to Shortlist"
          )}
        </button>

        {/* Show Set to Pending only for debugging final statuses */}
        {isFinalStatus(currentStatus) && (
          <button
            disabled={isUpdating}
            onClick={() => initiateStatusChange('pending')}
            className={`px-3 py-1 text-sm rounded-md flex items-center ${
              isUpdating && activeStatus === 'pending' 
                ? 'bg-gray-200 text-gray-500'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {isUpdating && activeStatus === 'pending' ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Setting to Pending...
              </>
            ) : (
              <>
                <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Debug: Set to Pending
              </>
            )}
          </button>
        )}

        {/* Status control buttons - now always visible but conditionally disabled */}
        <button
          disabled={isUpdating || isFinalStatus(currentStatus) || !isEvaluated}
          onClick={() => initiateStatusChange('accepted')}
          className={`px-3 py-1 text-sm rounded-md flex items-center ${
            isUpdating || !isEvaluated
              ? 'bg-gray-200 text-gray-500'
              : isFinalStatus(currentStatus)
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
              : 'bg-white text-green-800 border border-green-300 hover:bg-green-50'
          }`}
        >
          {isUpdating && activeStatus === 'accepted' ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Accepting...
            </>
          ) : (
            <>
              <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Accept
            </>
          )}
        </button>

        <button
          disabled={isUpdating || isFinalStatus(currentStatus) || !isEvaluated}
          onClick={() => initiateStatusChange('interview')}
          className={`px-3 py-1 text-sm rounded-md flex items-center ${
            isUpdating || !isEvaluated
              ? 'bg-gray-200 text-gray-500'
              : isFinalStatus(currentStatus)
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
              : 'bg-white text-blue-800 border border-blue-300 hover:bg-blue-50'
          }`}
        >
          {isUpdating && activeStatus === 'interview' ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Scheduling...
            </>
          ) : (
            <>
              <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              Interview
            </>
          )}
        </button>

        <button
          disabled={isUpdating || isFinalStatus(currentStatus) || !isEvaluated}
          onClick={() => initiateStatusChange('rejected')}
          className={`px-3 py-1 text-sm rounded-md flex items-center ${
            isUpdating || !isEvaluated
              ? 'bg-gray-200 text-gray-500'
              : isFinalStatus(currentStatus)
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
              : 'bg-white text-red-800 border border-red-300 hover:bg-red-50'
          }`}
        >
          {isUpdating && activeStatus === 'rejected' ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Rejecting...
            </>
          ) : (
            <>
              <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
              Reject
            </>
          )}
        </button>

        {/* Show status indicator if status is final */}
        {isFinalStatus(currentStatus) && (
          <div className={`px-3 py-1 text-sm rounded-md flex items-center ${
            currentStatus === 'accepted' 
              ? 'bg-green-100 text-green-800 border border-green-300'
              : 'bg-red-100 text-red-800 border border-red-300'
          }`}>
            <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                d={currentStatus === 'accepted' 
                  ? "M5 13l4 4L19 7"
                  : "M6 18L18 6M6 6l12 12"}></path>
            </svg>
            {currentStatus === 'accepted' ? 'Accepted' : 'Rejected'}
            {/* <span className="ml-2 text-xs">(Final)</span> */}
          </div>
        )}
      </div>

      {!isEvaluated && (
        <p className="text-sm text-gray-500 mt-2">
          Please evaluate the candidate first to enable status controls
        </p>
      )}

      <ConfirmationDialog
        isOpen={showConfirmation}
        onClose={() => {
          setShowConfirmation(false);
          setPendingStatus(null);
        }}
        onConfirm={handleConfirmedStatusChange}
        title={isFinalStatus(pendingStatus) ? "Confirm Final Status Change" : "Confirm Status Change"}
        message={getConfirmationMessage(pendingStatus)}
      />
    </>
  );
};

export default StatusControls;