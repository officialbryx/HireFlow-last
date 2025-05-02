import { useState } from 'react';
import { applicationsApi } from '../../services/api/applicationsApi';
import { notificationsApi } from '../../services/api/notificationsApi';
import ConfirmationDialog from '../common/ConfirmationDialog';

const StatusControls = ({ 
  applicantId,
  jobId, 
  applicantUserId, 
  currentStatus, 
  onStatusUpdated,
  getBadgeColor,
  jobTitle = "this position" // Default value if not provided
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeStatus, setActiveStatus] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(null);

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
        return `Are you sure you want to accept this candidate?`;
      case 'interview':
        return `Are you sure you want to move this candidate to the interview stage?`;
      case 'rejected':
        return `Are you sure you want to reject this candidate? This action will notify the candidate.`;
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

  return (
    <>
      <div className="flex flex-wrap gap-2 mt-4">
        {currentStatus !== 'pending' && (
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
                Set to Pending
              </>
            )}
          </button>
        )}

        <button
          disabled={isUpdating || currentStatus === 'accepted'}
          onClick={() => initiateStatusChange('accepted')}
          className={`px-3 py-1 text-sm rounded-md flex items-center ${
            isUpdating && activeStatus === 'accepted' 
              ? 'bg-gray-200 text-gray-500'
              : currentStatus === 'accepted'
                ? 'bg-green-100 text-green-800 border border-green-300'
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
          disabled={isUpdating || currentStatus === 'interview'}
          onClick={() => initiateStatusChange('interview')}
          className={`px-3 py-1 text-sm rounded-md flex items-center ${
            isUpdating && activeStatus === 'interview' 
              ? 'bg-gray-200 text-gray-500'
              : currentStatus === 'interview'
                ? 'bg-blue-100 text-blue-800 border border-blue-300'
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
          disabled={isUpdating || currentStatus === 'rejected'}
          onClick={() => initiateStatusChange('rejected')}
          className={`px-3 py-1 text-sm rounded-md flex items-center ${
            isUpdating && activeStatus === 'rejected' 
              ? 'bg-gray-200 text-gray-500'
              : currentStatus === 'rejected'
                ? 'bg-red-100 text-red-800 border border-red-300'
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
      </div>

      <ConfirmationDialog
        isOpen={showConfirmation}
        onClose={() => {
          setShowConfirmation(false);
          setPendingStatus(null);
        }}
        onConfirm={handleConfirmedStatusChange}
        title="Confirm Status Change"
        message={getConfirmationMessage(pendingStatus)}
      />
    </>
  );
};

export default StatusControls;