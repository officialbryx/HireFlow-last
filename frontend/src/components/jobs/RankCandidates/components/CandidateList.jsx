import { CandidateCard } from './CandidateCard';

export const CandidateList = ({
  candidates,
  expandedCandidates,
  toggleCandidate,
  moveUp,
  moveDown,
  batchProcessing,
  selectedForBatch,
  setSelectedForBatch
}) => {
  return (
    <div className="space-y-4">
      {/* Header Row */}
      <div className="grid grid-cols-12 gap-3 bg-white p-4 rounded-lg text-sm font-medium text-gray-700 shadow-sm border border-gray-200">
        <div className="col-span-1">Rank</div>
        <div className="col-span-5">Candidate</div>
        <div className="col-span-2">Match Score</div>
        <div className="col-span-2">Skills</div>
        <div className="col-span-2 text-right">Actions</div>
      </div>

      {candidates.map((candidate, index) => (
        <CandidateCard
          key={candidate.id}
          candidate={candidate}
          index={index}
          isExpanded={expandedCandidates[candidate.id]}
          onToggle={toggleCandidate}
          onMoveUp={moveUp}
          onMoveDown={moveDown}
          batchProcessing={batchProcessing}
          onBatchSelect={(candidateId, isSelected) => {
            if (isSelected) {
              setSelectedForBatch([...selectedForBatch, candidateId]);
            } else {
              setSelectedForBatch(
                selectedForBatch.filter((id) => id !== candidateId)
              );
            }
          }}
          isSelectedForBatch={selectedForBatch.includes(candidate.id)}
          totalCandidates={candidates.length}
        />
      ))}
    </div>
  );
};