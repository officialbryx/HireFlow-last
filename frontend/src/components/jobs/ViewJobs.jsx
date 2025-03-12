import {
  MapPinIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

const JobCard = ({ job, onEdit, onArchive }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 relative">
      <div className="flex items-start justify-between mb-4">
        {/* Left side with logo and title */}
        <div className="flex items-start space-x-4 flex-1 min-w-0">
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
          <div className="flex-1 min-w-0 pr-12"> {/* Added right padding for badge */}
            <h2 className="text-xl font-semibold text-gray-800 truncate">
              {job.job_title}
            </h2>
            <p className="text-gray-600 truncate">{job.company_name}</p>
          </div>
        </div>
      </div>

      {/* Update applicant count badge to always show, with different styles based on count */}
      <div className="absolute top-4 right-4">
        <div className={`px-2.5 py-0.5 rounded-full flex items-center ${
          job.applicant_count > 0 
            ? 'bg-blue-100 text-blue-800' 
            : 'bg-gray-100 text-gray-600'
        }`}>
          <UserGroupIcon className="h-4 w-4 mr-1" />
          <span className="text-sm font-medium">{job.applicant_count || 0}</span>
        </div>
      </div>

      {/* Rest of the job card content */}
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
        <span
          className={`text-sm font-medium px-2 py-1 rounded-full ${
            job.status === "active"
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {job.status}
        </span>
        <div className="flex space-x-2">
          <button
            className="text-gray-600 hover:text-blue-600 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(job.id);
            }}
          >
            Edit
          </button>
          <button
            onClick={(e) => onArchive(job.id, e)}
            className="text-gray-600 hover:text-orange-600 transition-colors"
          >
            Archive
          </button>
        </div>
      </div>
    </div>
  );
};

const ViewJobs = ({
  jobs = [], // Add default empty array
  loading = false,
  currentJobs = [],
  handleEditJob,
  handleDeleteJob,
  currentPage = 1,
  totalPages = 1,
  handlePageChange,
}) => {
  return (
    <div>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : currentJobs?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onEdit={handleEditJob}
              onArchive={handleDeleteJob}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No jobs found.</p>
        </div>
      )}

      {jobs?.length > 0 && (
        <div className="mt-8 flex justify-center space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded-md ${
              currentPage === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
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
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
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
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
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
    </div>
  );
};

export default ViewJobs;
