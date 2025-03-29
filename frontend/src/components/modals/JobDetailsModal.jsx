import React from 'react';
import { XMarkIcon, BuildingOfficeIcon, CalendarIcon, UsersIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';

const JobDetailsModal = ({ isOpen, onClose, jobPosting }) => {
  if (!isOpen) return null;
  
  // Check if job is archived
  const isArchived = jobPosting?.status === 'archived';

  return (
    <div className="fixed inset-0 bg-gray-600/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {isArchived ? "Archived Job Posting" : "Job Posting Details"}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        
        <div className="px-6 py-4">
          <div className="flex items-start mb-4">
            {jobPosting?.company_logo_url ? (
              <div className="mr-4">
                <img 
                  src={jobPosting.company_logo_url} 
                  alt={`${jobPosting.company_name} logo`} 
                  className="w-16 h-16 object-contain rounded-md border border-gray-200"
                />
              </div>
            ) : (
              <div className="mr-4 w-16 h-16 bg-gray-100 flex items-center justify-center rounded-md border border-gray-200">
                <BuildingOfficeIcon className="h-8 w-8 text-gray-400" />
              </div>
            )}
            <div>
              <h3 className="text-xl font-medium text-gray-900 mb-1">{jobPosting?.job_title}</h3>
              <p className="text-gray-600 flex items-center">
                <BuildingOfficeIcon className="h-4 w-4 mr-1" />
                {jobPosting?.company_name}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {isArchived && (
                  <span className="px-2.5 py-0.5 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                    Archived
                  </span>
                )}
                {!isArchived && (
                  <span className="px-2.5 py-0.5 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    Active
                  </span>
                )}
                {jobPosting?.created_at && (
                  <span className="flex items-center text-xs text-gray-500">
                    <CalendarIcon className="h-3 w-3 mr-1" />
                    Posted: {format(new Date(jobPosting.created_at), 'MMM d, yyyy')}
                  </span>
                )}
                {jobPosting?.applicant_count !== undefined && (
                  <span className="flex items-center text-xs text-gray-500">
                    <UsersIcon className="h-3 w-3 mr-1" />
                    {jobPosting.applicant_count} applicant{jobPosting.applicant_count !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {isArchived && (
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                This job posting is no longer active and is not accepting new applications.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm font-medium text-gray-500">Location</p>
              <p className="text-sm text-gray-900">{jobPosting?.location || 'Not specified'}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">Salary Range</p>
              <p className="text-sm text-gray-900">{jobPosting?.salary_range || 'Not specified'}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">Employment Type</p>
              <p className="text-sm text-gray-900">{jobPosting?.employment_type || 'Not specified'}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">Positions Available</p>
              <p className="text-sm text-gray-900">{jobPosting?.applicants_needed || 'Not specified'}</p>
            </div>
          </div>

          {(jobPosting?.company_description || jobPosting?.about_company) && (
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-2">About the Company</h4>
              {jobPosting?.company_description && (
                <div className="text-sm text-gray-700 prose prose-sm mb-4">
                  <p className="whitespace-pre-line">{jobPosting.company_description}</p>
                </div>
              )}
              {jobPosting?.about_company && (
                <div className="text-sm text-gray-700 prose prose-sm">
                  <p className="whitespace-pre-line">{jobPosting.about_company}</p>
                </div>
              )}
            </div>
          )}
              
          {jobPosting?.description && (
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-2">Job Description</h4>
              <div className="text-sm text-gray-700 prose prose-sm">
                <p className="whitespace-pre-line">{jobPosting.description}</p>
              </div>
            </div>
          )}
              
          {jobPosting?.requirements && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Requirements</h4>
              <div className="text-sm text-gray-700 prose prose-sm">
                <p className="whitespace-pre-line">{jobPosting.requirements}</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="px-6 py-3 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md text-sm font-medium hover:bg-gray-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsModal;