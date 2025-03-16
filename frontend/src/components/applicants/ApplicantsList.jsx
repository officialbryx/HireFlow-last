import { 
  XCircleIcon, 
  FunnelIcon, 
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from "@heroicons/react/24/outline";

const ApplicantsList = ({
  applicants,
  isLoading,
  isFetching,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  companyFilter,
  setCompanyFilter,
  jobFilter,
  setJobFilter,
  companies,
  selectedApplicant,
  handleSelectApplicant,
  getBadgeColor,
  formatDate,
  currentPage,
  setCurrentPage,
  totalPages,
  totalCount,
  clearAllFilters,
  onClearFilters
}) => {
  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Search and filters header */}
      <div className="p-4 border-b border-gray-100">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search applicants..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Active Filters */}
        {(statusFilter !== "all" || companyFilter !== "all" || jobFilter || searchTerm) && (
          <div className="mt-3 flex flex-wrap gap-2">
            {jobFilter && (
              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700">
                Job: {jobFilter}
                <button 
                  onClick={() => { 
                    setJobFilter(null);
                    if (onClearFilters) onClearFilters();
                  }}
                  className="ml-1 text-blue-500 hover:text-blue-700"
                >
                  <XCircleIcon className="h-4 w-4" />
                </button>
              </span>
            )}
            
            {statusFilter !== "all" && (
              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700">
                Status: {statusFilter}
                <button 
                  onClick={() => setStatusFilter("all")}
                  className="ml-1 text-blue-500 hover:text-blue-700"
                >
                  <XCircleIcon className="h-4 w-4" />
                </button>
              </span>
            )}
            
            {companyFilter !== "all" && (
              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700">
                Company: {companyFilter}
                <button 
                  onClick={() => setCompanyFilter("all")}
                  className="ml-1 text-blue-500 hover:text-blue-700"
                >
                  <XCircleIcon className="h-4 w-4" />
                </button>
              </span>
            )}

            {searchTerm && (
              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700">
                Search: {searchTerm}
                <button 
                  onClick={() => setSearchTerm("")}
                  className="ml-1 text-blue-500 hover:text-blue-700"
                >
                  <XCircleIcon className="h-4 w-4" />
                </button>
              </span>
            )}

            <button
              onClick={clearAllFilters}
              className="ml-auto text-xs text-blue-600 hover:text-blue-800"
            >
              Clear all
            </button>
          </div>
        )}
      </div>
      
      {/* Filter controls - collapsible */}
      <div className="border-b border-gray-100">
        <details className="group">
          <summary className="flex items-center justify-between p-4 cursor-pointer">
            <div className="flex items-center gap-2">
              <AdjustmentsHorizontalIcon className="h-5 w-5 text-gray-500" />
              <span className="font-medium text-gray-700">Filter Applicants</span>
            </div>
            <span className="text-gray-400 group-open:rotate-180 transition-transform">
              ▼
            </span>
          </summary>
          
          <div className="p-4 pt-0 bg-gray-50 grid gap-4">
            {/* Status filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Application Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="interview">Interview</option>
              </select>
            </div>
            
            {/* Company filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company
              </label>
              <select
                value={companyFilter}
                onChange={(e) => setCompanyFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Companies</option>
                {companies.map((company) => (
                  <option key={company} value={company}>{company}</option>
                ))}
              </select>
            </div>
          </div>
        </details>
      </div>

      {/* List of applicants with loading states */}
      <div className="overflow-y-auto max-h-[calc(100vh-350px)]">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-500">Loading applicants...</p>
          </div>
        ) : applicants.length > 0 ? (
          <ul className={`divide-y divide-gray-100 ${isFetching ? 'opacity-70' : ''}`}>
            {applicants.map((applicant) => (
              <li 
                key={applicant.id}
                className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${
                  selectedApplicant?.id === applicant.id ? "bg-blue-50" : ""
                }`}
                onClick={() => handleSelectApplicant(applicant)}
              >
                <div className="flex items-start justify-between">
                  {/* Left side - Name and company */}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {applicant.personal_info?.given_name} {applicant.personal_info?.family_name}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {applicant.company || "No company"}
                    </p>
                    <span className="text-xs text-gray-400 block mt-1">
                      {formatDate(applicant.created_at)}
                    </span>
                  </div>
                  
                  {/* Right side - Status badge */}
                  <div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getBadgeColor(applicant.status)}`}>
                      {applicant.status?.charAt(0).toUpperCase() + applicant.status?.slice(1) || "Pending"}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-8 text-center">
            <FunnelIcon className="h-8 w-8 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500">No applicants found with these filters</p>
          </div>
        )}
      </div>
      
      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="p-3 border-t border-gray-100 flex justify-center items-center space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1 || isLoading}
            className="p-1 rounded-md border border-gray-300 disabled:opacity-50"
          >
            <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
          </button>
          
          <span className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage >= totalPages || isLoading}
            className="p-1 rounded-md border border-gray-300 disabled:opacity-50"
          >
            <ChevronRightIcon className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      )}
      
      {/* Results count */}
      <div className="p-3 border-t border-gray-100 bg-gray-50 text-xs text-gray-500">
        {totalCount} {totalCount === 1 ? "applicant" : "applicants"} 
        {(statusFilter !== "all" || companyFilter !== "all" || jobFilter || searchTerm) ? " (filtered)" : ""}
        {isFetching && !isLoading && <span className="ml-2">(Refreshing...)</span>}
      </div>
    </div>
  );
};

export default ApplicantsList;