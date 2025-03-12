import { UserIcon, ClipboardIcon } from "@heroicons/react/24/outline";

const ApplicantsList = ({
  applicants,
  loading,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  companyFilter,
  setCompanyFilter,
  companies,
  selectedApplicant,
  handleSelectApplicant,
  getBadgeColor
}) => {
  if (loading) {
    return (
      <div className="w-1/3 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-1/3 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-[calc(100vh-50px)] flex flex-col">
      <div className="p-4 border-b flex-shrink-0">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-lg text-gray-800">
            Applicants ({applicants.length})
          </h2>
          {companyFilter !== 'all' && (
            <span className="text-sm text-blue-600">
              Showing {companyFilter} applicants
            </span>
          )}
        </div>

        {/* Search input */}
        <div className="mt-3 mb-2">
          <input
            type="text"
            placeholder="Search applicants..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Status filters */}
        <div className="flex mt-2 gap-2">
          {["all", "pending", "approved", "rejected"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1 text-xs rounded-full ${
                statusFilter === status
                  ? status === "all"
                    ? "bg-gray-900 text-white"
                    : getBadgeColor(status)
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Company filter */}
        {companies.length > 1 && (
          <div className="mt-4">
            <select
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Companies</option>
              {companies.map((company, index) => (
                <option key={index} value={company}>
                  {company}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Applicants list */}
      <div className="flex-1 overflow-y-auto">
        {applicants.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
              <UserIcon className="h-6 w-6 text-gray-400" />
            </div>
            <p>No applicants found</p>
            <p className="text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          applicants.map((applicant) => (
            <div
              key={applicant.id}
              onClick={() => handleSelectApplicant(applicant)}
              className={`p-4 border-b cursor-pointer transition-all ${
                selectedApplicant?.id === applicant.id
                  ? "bg-blue-50 border-l-4 border-l-blue-500"
                  : "hover:bg-gray-50 border-l-4 border-l-transparent"
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">
                    {applicant.personal_info?.given_name || ""}{" "}
                    {applicant.personal_info?.family_name || ""}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {applicant.company || "N/A"}
                  </p>
                  <div className="flex items-center mt-1">
                    <p className="text-xs text-gray-400">
                      {new Date(applicant.created_at).toLocaleDateString()}
                    </p>
                    {applicant.resume_url && (
                      <div className="ml-2 text-xs text-blue-500 flex items-center">
                        <ClipboardIcon className="h-3 w-3 mr-1" />
                        Resume
                      </div>
                    )}
                  </div>
                </div>
                <span
                  className={`px-2 py-1 text-xs rounded-full font-medium ${getBadgeColor(
                    applicant.status
                  )}`}
                >
                  {applicant.status
                    ? applicant.status.charAt(0).toUpperCase() +
                      applicant.status.slice(1)
                    : "Pending"}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ApplicantsList;