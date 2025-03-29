import { useState } from 'react';
import { applicationsApi } from '../../services/api/applicationsApi';
import { notificationsApi } from '../../services/api/notificationsApi';

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

  const getStatusNotificationMessage = (status) => {
    switch(status) {
      case 'pending':
        return `Your application for ${jobTitle} has been marked as pending review.`;
      case 'accepted':
        return `Congratulations! Your application for ${jobTitle} has been approved.`;
      case 'interview':
        return `Good news! We'd like to schedule an interview for your application to ${jobTitle}.`;
      case 'rejected':
        return `Thank you for your interest in ${jobTitle}. Unfortunately, we've decided not to move forward with your application at this time.`;
      default:
        return `Your application status for ${jobTitle} has been updated to ${status}.`;
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (currentStatus === newStatus || isUpdating) return;
    
    setIsUpdating(true);
    setActiveStatus(newStatus);
    
    try {
      await applicationsApi.updateApplicationStatus(applicantId, newStatus);
      
      // Create notification for the applicant
      if (applicantUserId) {
        await notificationsApi.createNotification({
          job_posting_id: jobId,
          application_id: applicantId,
          recipient_id: applicantUserId,
          message: getStatusNotificationMessage(newStatus),
          type: newStatus  // Now we can use the status directly as the type
        });
      }
      
      if (onStatusUpdated) {
        onStatusUpdated(applicantId, { status: newStatus });
      }
    } catch (error) {
      console.error('Error updating application status:', error);
    } finally {
      setIsUpdating(false);
      setActiveStatus(null);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {/* Only show the "Pending" button if the status is not already pending */}
      {currentStatus !== 'pending' && (
        <button
          disabled={isUpdating}
          onClick={() => handleStatusChange('pending')}
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
        disabled={isUpdating || currentStatus === 'approved'}
        onClick={() => handleStatusChange('approved')}
        className={`px-3 py-1 text-sm rounded-md flex items-center ${
          isUpdating && activeStatus === 'approved' 
            ? 'bg-gray-200 text-gray-500'
            : currentStatus === 'approved'
              ? 'bg-green-100 text-green-800 border border-green-300'
              : 'bg-white text-green-800 border border-green-300 hover:bg-green-50'
        }`}
      >
        {isUpdating && activeStatus === 'approved' ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Approving...
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
        onClick={() => handleStatusChange('interview')}
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
        onClick={() => handleStatusChange('rejected')}
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

      <button
        disabled={isUpdating || currentStatus === 'accepted'}
        onClick={() => handleStatusChange('accepted')}
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
    </div>
  );
};

export default StatusControls;