import { DocumentTextIcon } from "@heroicons/react/24/outline";
import { ConfirmationDialog } from "../../../common/ConfirmationDialog";
import { useState } from "react";

export const BatchProcessing = ({
  batchProcessing,
  setBatchProcessing,
  selectedForBatch,
  batchProgress,
  handleBatchEvaluation,
  setSelectedForBatch,
  onBatchStatusUpdate
}) => {
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    action: null,
    title: "",
    message: "",
    confirmText: "",
    confirmColor: "blue"
  });

  const handleBatchToggle = () => {
    if (batchProcessing) {
      setSelectedForBatch([]);
    }
    setBatchProcessing(!batchProcessing);
  };

  const getDialogConfig = (action) => {
    switch (action.status || (action.shortlisted ? 'shortlist' : '')) {
      case 'accepted':
        return {
          title: 'Accept Selected Candidates',
          action: 'accept',
          confirmText: 'Accept',
          color: 'green'
        };
      case 'rejected':
        return {
          title: 'Reject Selected Candidates',
          action: 'reject',
          confirmText: 'Reject',
          color: 'red'
        };
      case 'interview':
        return {
          title: 'Move to Interview',
          action: 'move to interview',
          confirmText: 'Move to Interview',
          color: 'blue'
        };
      case 'shortlist':
        return {
          title: 'Shortlist Candidates',
          action: 'shortlist',
          confirmText: 'Shortlist',
          color: 'purple'
        };
      default:
        return {
          title: 'Update Status',
          action: 'update',
          confirmText: 'Update',
          color: 'blue'
        };
    }
  };

  const handleStatusAction = (action) => {
    if (selectedForBatch.length === 0 || !onBatchStatusUpdate) return;

    const dialogConfig = {
      isOpen: true,
      action,
      confirmColor: getDialogConfig(action).color,
      title: getDialogConfig(action).title,
      message: `Are you sure you want to ${getDialogConfig(action).action} ${selectedForBatch.length} selected candidate(s)?`,
      confirmText: getDialogConfig(action).confirmText
    };

    setConfirmDialog(dialogConfig);
  };

  const handleConfirmAction = () => {
    onBatchStatusUpdate(selectedForBatch, confirmDialog.action);
    setConfirmDialog({ ...confirmDialog, isOpen: false });
  };

  return (
    <>
      <div className="flex items-center space-x-4">
        <button
          onClick={handleBatchToggle}
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

        {batchProcessing && selectedForBatch.length > 0 && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleStatusAction({ status: "accepted" })}
              className="inline-flex items-center px-3 py-2 border border-green-300 rounded-md shadow-sm text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100"
            >
              Accept Selected
            </button>
            <button
              onClick={() => handleStatusAction({ status: "rejected" })}
              className="inline-flex items-center px-3 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100"
            >
              Reject Selected
            </button>
            <button
              onClick={() => handleStatusAction({ status: "interview" })}
              className="inline-flex items-center px-3 py-2 border border-blue-300 rounded-md shadow-sm text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100"
            >
              Move to Interview
            </button>
            <button
              onClick={() => handleStatusAction({ shortlisted: true })}
              className="inline-flex items-center px-3 py-2 border border-purple-300 rounded-md shadow-sm text-sm font-medium text-purple-700 bg-purple-50 hover:bg-purple-100"
            >
              Shortlist Selected
            </button>
          </div>
        )}
      </div>

      <ConfirmationDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        onConfirm={handleConfirmAction}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText={confirmDialog.confirmText}
        confirmColor={confirmDialog.confirmColor}
      />
    </>
  );
};