import React, { useState } from "react";
import axios from "axios";
import {
  DocumentTextIcon,
  CloudArrowUpIcon,
  ExclamationCircleIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

export const ResumeAnalysis = () => {
  const [jobPost, setJobPost] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event) => {
    setResumeFile(event.target.files[0]);
  };

  const handleDragEnter = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    setResumeFile(event.dataTransfer.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("jobPost", jobPost);
    formData.append("resumeFile", resumeFile);

    try {
      const response = await axios.post("/api/evaluate", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setResults(response.data);
    } catch (error) {
      setError("An error occurred while evaluating the resume.");
    } finally {
      setIsLoading(false);
    }
  };

  const LoadingSpinner = () => (
    <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-700 font-medium">Analyzing resume...</p>
        <p className="text-sm text-gray-500 mt-2">This may take a moment</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <DocumentTextIcon className="h-8 w-8 mr-3" />
            Resume Analysis Tool
          </h2>
          <p className="text-blue-100 mt-2">
            Compare resumes against job requirements for detailed compatibility
            analysis
          </p>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Job Post Section */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <label className="block text-lg font-medium text-gray-900 mb-4">
                Job Description
              </label>
              <textarea
                value={jobPost}
                onChange={(e) => setJobPost(e.target.value)}
                rows="6"
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Paste the complete job description here..."
                required
              />
            </div>

            {/* Resume Upload Section */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <label className="block text-lg font-medium text-gray-900 mb-4">
                Resume Upload
              </label>
              <div
                className={`relative border-2 ${
                  isDragging
                    ? "border-blue-500 bg-blue-50"
                    : "border-dashed border-gray-300"
                } rounded-lg p-8 text-center`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
              >
                <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <span className="mt-2 block text-sm font-medium text-gray-900">
                      {resumeFile
                        ? resumeFile.name
                        : "Drop your resume here, or"}
                    </span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx"
                    />
                    {!resumeFile && (
                      <span className="text-blue-600 hover:text-blue-500">
                        browse to upload
                      </span>
                    )}
                  </label>
                  <p className="text-xs text-gray-500 mt-2">
                    PDF, DOC, DOCX up to 10MB
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isLoading || !jobPost || !resumeFile}
                className="px-8 py-3 rounded-lg text-white font-medium transition-all
                  disabled:bg-gray-300 disabled:cursor-not-allowed
                  bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Analyzing Resume...
                  </span>
                ) : (
                  "Analyze Resume"
                )}
              </button>
            </div>
          </form>

          {/* Error Message */}
          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <ExclamationCircleIcon className="h-5 w-5 text-red-400 mr-2" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          )}

          {/* Results Section */}
          {results && (
            <div className="mt-8 border-t border-gray-200 pt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
                <ChartBarIcon className="h-6 w-6 mr-2 text-blue-500" />
                Analysis Results
              </h3>
              {/* Add your results visualization components here */}
              <div className="bg-gray-50 rounded-lg p-6">
                <pre className="overflow-auto text-sm text-gray-700">
                  {JSON.stringify(results, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>

      {isLoading && <LoadingSpinner />}
    </div>
  );
};
