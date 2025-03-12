import { XMarkIcon } from "@heroicons/react/24/outline";
import { Document, Page } from "react-pdf";

const PdfModal = ({ 
  url, 
  onClose, 
  pageNumber, 
  setPageNumber, 
  numPages, 
  setNumPages 
}) => {
  const onLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const onLoadError = (error) => {
    console.error("PDF loading error:", error);
  };

  const handleDirectDownload = () => {
    try {
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error opening PDF:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">Resume Preview</h3>
          <div className="flex items-center gap-4">
            <button
              onClick={handleDirectDownload}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Download PDF
            </button>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4">
          <Document
            file={url}
            onLoadSuccess={onLoadSuccess}
            onLoadError={onLoadError}
            loading={
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto mb-3"></div>
                <p>Loading PDF...</p>
              </div>
            }
            className="flex flex-col items-center"
          >
            <Page
              pageNumber={pageNumber}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              loading="Loading page..."
            />
          </Document>
        </div>

        {numPages > 1 && (
          <div className="p-4 border-t flex justify-center items-center gap-4">
            <button
              onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
              disabled={pageNumber <= 1}
              className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <span>
              Page {pageNumber} of {numPages}
            </span>
            <button
              onClick={() => setPageNumber(Math.min(numPages, pageNumber + 1))}
              disabled={pageNumber >= numPages}
              className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PdfModal;