import { 
  ArrowPathIcon,
  MapPinIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

const ArchivedJobs = ({
  archivedJobs = [],
  handleRestore,
  currentPage = 1,
  totalPages = 1,
  handlePageChange,
  loading = false
}) => {
  return (
    <div className="max-w-7xl mx-auto py-6">
      <h2 className="text-xl font-semibold mb-4">Archived Job Postings</h2>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : archivedJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {archivedJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow opacity-75"
            >
              <div className="p-6">
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
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Archived: {new Date(job.updated_at).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-6 py-3 flex justify-end">
                <button
                  onClick={() => handleRestore(job.id)}
                  className="text-gray-600 hover:text-green-600 transition-colors flex items-center gap-2"
                >
                  <ArrowPathIcon className="h-5 w-5" />
                  <span>Restore</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No archived jobs found.</p>
        </div>
      )}

      {totalPages > 1 && (
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
    </div>
  );
};

export default ArchivedJobs;