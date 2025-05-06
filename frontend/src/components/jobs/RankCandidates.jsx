import { useRankCandidates } from "./RankCandidates/hooks/useRankCandidates";
import { ControlBar } from "./RankCandidates/components/ControlBar";
import { FilterBar } from "./RankCandidates/components/FilterBar";
import { CandidateList } from "./RankCandidates/components/CandidateList";
import { LoadingState } from "./RankCandidates/components/LoadingState";
import { EmptyState } from "./RankCandidates/components/EmptyState";
import { BatchProcessing } from "./RankCandidates/components/BatchProcessing";

const RankCandidates = () => {
  const {
    loading,
    jobs,
    selectedJob,
    setSelectedJob,
    candidates,
    setCandidates,
    rankingCriteria,
    setRankingCriteria,
    showFilters,
    setShowFilters,
    filters,
    setFilters,
    expandedCandidates,
    toggleCandidate,
    moveUp,
    moveDown,
    batchProcessing,
    setBatchProcessing,
    selectedForBatch,
    setSelectedForBatch,
    batchProgress,
    handleBatchEvaluation,
    areFiltersActive,
  } = useRankCandidates();

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <span className="bg-blue-600 w-1.5 h-6 rounded mr-3 inline-block"></span>
          Candidate Ranking
        </h2>
        <p className="mt-2 text-sm text-gray-600 ml-4">
          Compare and prioritize candidates based on job-specific requirements
          and qualifications
        </p>
      </div>

      {/* Control Bar */}
      <ControlBar
        jobs={jobs}
        selectedJob={selectedJob}
        setSelectedJob={setSelectedJob}
        rankingCriteria={rankingCriteria}
        setRankingCriteria={setRankingCriteria}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        filters={filters}
        batchProcessing={batchProcessing}
        setBatchProcessing={setBatchProcessing}
        selectedForBatch={selectedForBatch}
        batchProgress={batchProgress}
        handleBatchEvaluation={handleBatchEvaluation}
        setSelectedForBatch={setSelectedForBatch}
        areFiltersActive={areFiltersActive}
      />

      {/* Filters */}
      <FilterBar 
        showFilters={showFilters}
        filters={filters}
        setFilters={setFilters}
      />

      {/* Main Content */}
      <div className="p-6 bg-gray-50">
        {loading ? (
          <LoadingState />
        ) : !selectedJob ? (
          <EmptyState type="no-selection" />
        ) : candidates.length === 0 ? (
          <EmptyState type="no-candidates" />
        ) : (
          <CandidateList
            candidates={candidates}
            expandedCandidates={expandedCandidates}
            toggleCandidate={toggleCandidate}
            moveUp={moveUp}
            moveDown={moveDown}
            batchProcessing={batchProcessing}
            selectedForBatch={selectedForBatch}
            setSelectedForBatch={setSelectedForBatch}
            setBatchProcessing={setBatchProcessing}
          />
        )}
      </div>
    </div>
  );
};

export default RankCandidates;