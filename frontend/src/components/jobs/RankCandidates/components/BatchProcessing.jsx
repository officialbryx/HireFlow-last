import { DocumentTextIcon } from "@heroicons/react/24/outline";

export const BatchProcessing = ({
  batchProcessing,
  setBatchProcessing,
  selectedForBatch,
  batchProgress,
  handleBatchEvaluation,
  setSelectedForBatch // Add this prop
}) => {
  // Add handler for toggling batch processing
  const handleBatchToggle = () => {
    if (batchProcessing) {
      // Clear selections when turning off batch processing
      setSelectedForBatch([]);
    }
    setBatchProcessing(!batchProcessing);
  };

  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={handleBatchToggle} // Change to new handler
        className={`inline-flex items-center px-3 py-2.5 border rounded-lg shadow-sm text-sm font-medium
                  transition-all duration-200 ${
                    batchProcessing
                      ? "bg-blue-50 border-blue-300 text-blue-700"
                      : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
      >
        <DocumentTextIcon
          className={`h-5 w-5 mr-1.5 ${
            batchProcessing ? "text-blue-500" : "text-gray-500"
          }`}
        />
        Batch Evaluate
        {selectedForBatch.length > 0 && (
          <span className="ml-1.5 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">
            {selectedForBatch.length}
          </span>
        )}
      </button>

      {batchProcessing && (
        <div className="flex items-center space-x-3">
          {batchProgress > 0 ? (
            <div className="flex items-center space-x-2">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${batchProgress}%` }}
                ></div>
              </div>
              <span className="text-sm text-gray-600">
                {batchProgress}%
              </span>
            </div>
          ) : selectedForBatch.length > 0 ? (
            <button
              onClick={handleBatchEvaluation}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Start Processing ({selectedForBatch.length})
            </button>
          ) : (
            <span className="text-sm text-gray-500">
              Select candidates to evaluate
            </span>
          )}
        </div>
      )}
    </div>
  );
};