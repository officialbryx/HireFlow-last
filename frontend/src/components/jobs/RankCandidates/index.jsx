import { useRankCandidates } from "./hooks/useRankCandidates";
import { ControlBar } from "./components/ControlBar";
import { FilterBar } from "./components/FilterBar";
import { CandidateList } from "./components/CandidateList";
import { LoadingState } from "./components/LoadingState";
import { EmptyState } from "./components/EmptyState";
import { BatchProcessing } from "./components/BatchProcessing";

const RankCandidates = () => {
  const rankCandidatesState = useRankCandidates();
  const { loading, selectedJob, candidates } = rankCandidatesState;

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

      {/* Controls */}
      <ControlBar {...rankCandidatesState} />
      
      {/* Filters */}
      <FilterBar {...rankCandidatesState} />

      {/* Batch Processing */}
      <BatchProcessing {...rankCandidatesState} />

      {/* Content */}
      <div className="p-6 bg-gray-50">
        {loading ? (
          <LoadingState />
        ) : !selectedJob ? (
          <EmptyState type="no-selection" />
        ) : candidates.length === 0 ? (
          <EmptyState type="no-candidates" />
        ) : (
          <CandidateList {...rankCandidatesState} />
        )}
      </div>
    </div>
  );
};

export default RankCandidates;