import { ChevronDownIcon, AdjustmentsHorizontalIcon, DocumentTextIcon } from "@heroicons/react/24/outline";
import { BatchProcessing } from "./BatchProcessing"; // Change to named import

export const ControlBar = ({
  jobs,
  selectedJob,
  setSelectedJob,
  rankingCriteria,
  setRankingCriteria,
  showFilters,
  setShowFilters,
  filters,
  batchProcessing,
  setBatchProcessing,
  selectedForBatch,
  setSelectedForBatch,
  batchProgress,
  handleBatchEvaluation
}) => {
  return (
    <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-slate-50 to-slate-100">
      <div className="flex flex-wrap items-end gap-6">
        {/* Job Selection */}
        <div className="w-full md:w-auto flex-grow">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Select Position
          </label>
          <div className="relative">
            <select
              className="w-full border border-gray-300 rounded-lg shadow-sm py-2.5 pl-4 pr-10 
                         text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                         appearance-none bg-white transition-all duration-200 hover:border-blue-400"
              value={selectedJob || ""}
              onChange={(e) => setSelectedJob(e.target.value)}
            >
              <option value="">Select a job posting</option>
              {jobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.job_title} - {job.company_name}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <ChevronDownIcon className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Ranking Criteria */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Ranking Method
          </label>
          <div className="relative">
            <select
              className="w-full md:w-48 border border-gray-300 rounded-lg shadow-sm py-2.5 pl-4 pr-10
                         text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                         appearance-none bg-white transition-all duration-200 hover:border-blue-400"
              value={rankingCriteria}
              onChange={(e) => setRankingCriteria(e.target.value)}
            >
              <option value="overall">Overall Match</option>
              <option value="skills">Skills Match</option>
              <option value="experience">Experience</option>
              <option value="education">Education</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <ChevronDownIcon className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Filter Toggle Button */}
        <div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center px-3 py-2.5 border rounded-lg shadow-sm text-sm font-medium
                      transition-all duration-200 ${
                        showFilters
                          ? "bg-blue-50 border-blue-300 text-blue-700"
                          : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
          >
            <AdjustmentsHorizontalIcon
              className={`h-5 w-5 mr-1.5 ${
                showFilters ? "text-blue-500" : "text-gray-500"
              }`}
            />
            Filters{" "}
            {filters.shortlisted ||
            filters.minimumSkillMatch > 0 ||
            filters.educationLevel !== "any"
              ? "(Active)"
              : ""}
          </button>
        </div>

        {/* Batch Processing Controls */}
        <BatchProcessing
          batchProcessing={batchProcessing}
          setBatchProcessing={setBatchProcessing}
          selectedForBatch={selectedForBatch}
          setSelectedForBatch={setSelectedForBatch}
          batchProgress={batchProgress}
          handleBatchEvaluation={handleBatchEvaluation}
        />

        {/* Export Button */}
        <div className="ml-auto">
          <button
            className="inline-flex items-center px-4 py-2.5 bg-white border border-gray-300 
                       rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                       transition-all duration-200"
          >
            <DocumentTextIcon className="h-5 w-5 mr-2 text-gray-500" />
            Export Rankings
          </button>
        </div>
      </div>
    </div>
  );
};