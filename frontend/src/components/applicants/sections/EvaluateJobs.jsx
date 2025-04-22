import React, { useState, useEffect } from "react";
import axios from "axios";
import { jobsApi } from "../../../services/api/jobsApi";
import { applicationsApi } from "../../../services/api/applicationsApi";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { EvaluationReport } from "../../reports/EvaluationReport";

export const EvaluateJobs = ({ selectedApplicant, resume_url }) => {
  // State variables
  const [jobPost, setJobPost] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showTechnicalAnalysis, setShowTechnicalAnalysis] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  // Auto-populate data on component mount
  useEffect(() => {
    const populateData = async () => {
      if (!selectedApplicant || !selectedApplicant.job_posting_id) {
        return;
      }

      try {
        setLoadingData(true);

        // Load job posting details
        const jobId = selectedApplicant.job_posting_id;
        const jobDetails = await jobsApi.getJobPostingDetails(jobId);

        // Format the job posting as a complete description
        const responsibilities =
          jobDetails.job_responsibility?.map((r) => r.responsibility) || [];
        const qualifications =
          jobDetails.job_qualification?.map((q) => q.qualification) || [];
        const skills = jobDetails.job_skill?.map((s) => s.skill) || [];

        const formattedJobPost = `
Job Title: ${jobDetails.job_title}
Company: ${jobDetails.company_name}
Location: ${jobDetails.location}
Employment Type: ${jobDetails.employment_type}
Salary Range: ${jobDetails.salary_range || "Not specified"}

About the Company:
${
  jobDetails.about_company ||
  jobDetails.company_description ||
  "No company description provided."
}

Job Description:
${jobDetails.job_description || "No job description provided."}

Responsibilities:
${
  responsibilities.length > 0
    ? responsibilities.map((r) => `- ${r}`).join("\n")
    : "Not specified"
}

Qualifications:
${
  qualifications.length > 0
    ? qualifications.map((q) => `- ${q}`).join("\n")
    : "Not specified"
}

Skills Required:
${skills.length > 0 ? skills.map((s) => `- ${s}`).join("\n") : "Not specified"}
        `.trim();

        setJobPost(formattedJobPost);

        // Load resume if available
        if (resume_url) {
          try {
            const blob = await applicationsApi.downloadResume(resume_url);
            const resumeFileName = resume_url.split("/").pop() || "resume.pdf";
            const file = new File([blob], resumeFileName, {
              type: "application/pdf",
            });
            setResumeFile(file);
          } catch (err) {
            console.error("Error downloading resume:", err);
            setError(
              "Failed to download candidate's resume. Please try uploading it manually."
            );
          }
        }
      } catch (err) {
        console.error("Error loading applicant data:", err);
        setError(
          "Failed to load job details. Please try again or enter them manually."
        );
      } finally {
        setLoadingData(false);
      }
    };

    populateData();
  }, [selectedApplicant, resume_url]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const formData = new FormData();
      formData.append("jobPost", jobPost);
      formData.append("resume", resumeFile);

      const response = await axios({
        method: "post",
        url: "https://hireflow-backend-obv1.onrender.com/api/evaluate",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
        },
        withCredentials: false,
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
        timeout: 300000,
      });

      if (response.data.error) {
        throw new Error(response.data.error);
      }

      setResults(response.data);
    } catch (err) {
      console.error("Analysis error:", err);
      setError(
        err.response?.data?.error ||
          err.message ||
          "Error processing request. Please try again."
      );
      setResults(null);
    } finally {
      setIsLoading(false);
    }
  };

  // File handling functions
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventPreventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type === "application/pdf") {
        setResumeFile(file);
      } else {
        alert("Please upload a PDF file");
      }
    }
  };

  const LoadingSpinner = () => (
    <div className="fixed inset-0 bg-white/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-700 font-medium">
          {isLoading
            ? "Analyzing resume and job post..."
            : "Loading applicant data..."}
        </p>
        <p className="text-sm text-gray-500 mt-2">
          {isLoading ? "This may take up to 3-5 minutes" : "Please wait"}
        </p>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-white min-h-screen">
      {(isLoading || loadingData) && <LoadingSpinner />}

      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800">
          Resume-Job Match Evaluator
        </h1>
        <p className="text-gray-600 mt-2">
          Analyze how well this candidate's resume matches the job requirements
        </p>
      </div>

      {/* Applicant Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
        <div className="flex items-center">
          <div className="flex-shrink-0 bg-blue-100 rounded-full p-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Evaluating candidate:
            </h3>
            <p className="text-blue-700 font-semibold">
              {selectedApplicant?.personal_info?.given_name}{" "}
              {selectedApplicant?.personal_info?.family_name}
              <span className="font-normal ml-1">for position:</span>{" "}
              {selectedApplicant?.job_posting?.job_title ||
                selectedApplicant?.job_title}
            </p>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Job Post Section */}
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold ml-2 text-gray-800">
                  Job Description
                </h2>
              </div>
              <textarea
                className="w-full h-64 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                value={jobPost}
                onChange={(e) => setJobPost(e.target.value)}
                placeholder="Job description will be automatically loaded..."
                required
              />
              <p className="text-sm text-gray-500">
                You can edit this description if needed for better analysis
              </p>
            </div>

            {/* Resume Upload Section */}
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="bg-green-100 p-2 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold ml-2 text-gray-800">
                  Resume
                </h2>
              </div>
              <div
                className={`border-2 ${
                  isDragging
                    ? "border-blue-500 bg-blue-50"
                    : "border-dashed border-gray-300"
                } rounded-lg p-6 flex flex-col items-center justify-center h-64 relative`}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file && file.type === "application/pdf") {
                      setResumeFile(file);
                    } else if (file) {
                      alert("Please upload a PDF file");
                      e.target.value = "";
                    }
                  }}
                  accept=".pdf"
                  className="hidden"
                  id="resume-upload"
                  aria-label="Upload resume"
                  required={!resumeFile}
                />
                {resumeFile ? (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 text-green-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="mt-4 text-sm text-gray-700 font-medium">
                      Resume loaded: {resumeFile.name}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      You can replace it with another file if needed
                    </p>
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <p className="mt-4 text-sm text-gray-500">
                      {loadingData
                        ? "Loading resume..."
                        : "Drag and drop your resume or click to browse"}
                    </p>
                  </>
                )}
                <label
                  htmlFor="resume-upload"
                  className="mt-4 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-medium cursor-pointer hover:bg-blue-100 transition duration-200"
                >
                  {resumeFile ? "Replace File" : "Choose File"}
                </label>
                <p className="mt-2 text-xs text-gray-500">
                  Supported format: PDF
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-center">
            <button
              type="submit"
              disabled={isLoading || loadingData || !jobPost || !resumeFile}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200 shadow-md"
            >
              {isLoading ? "Analyzing..." : "Evaluate Match"}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center">
              <p className="font-medium">Analysis Error</p>
              <p className="text-sm">{error}</p>
            </div>
          )}
        </form>
      </div>

      {/* Results Section */}
      {results && (
        <div className="mt-12 bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
            <h3 className="text-2xl font-bold text-white">Analysis Results</h3>
          </div>

          <div className="p-6">
            {/* Match Score Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-blue-800">Overall Match</h4>
                  <span className="bg-blue-200 text-blue-800 text-xs px-2 py-1 rounded-full">
                    Primary
                  </span>
                </div>
                <div className="mt-4 flex items-end">
                  <p className="text-4xl font-bold text-blue-600">
                    {results.ai_insights.match_scores.overall_match}%
                  </p>
                  <div className="ml-2 mb-1">
                    <div className="h-2 w-16 bg-blue-200 rounded-full">
                      <div
                        className="h-2 bg-blue-600 rounded-full"
                        style={{
                          width: `${results.ai_insights.match_scores.overall_match}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-green-800">Skills Match</h4>
                  <span className="bg-green-200 text-green-800 text-xs px-2 py-1 rounded-full">
                    Technical
                  </span>
                </div>
                <div className="mt-4 flex items-end">
                  <p className="text-4xl font-bold text-green-600">
                    {results.ai_insights.match_scores.skills_match}%
                  </p>
                  <div className="ml-2 mb-1">
                    <div className="h-2 w-16 bg-green-200 rounded-full">
                      <div
                        className="h-2 bg-green-600 rounded-full"
                        style={{
                          width: `${results.ai_insights.match_scores.skills_match}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={`bg-gradient-to-br ${
                  !results.ai_insights.match_scores.qualified
                    ? "from-red-50 to-red-100"
                    : "from-green-50 to-green-100"
                } rounded-xl p-6 shadow-sm`}
              >
                <div className="flex items-center justify-between">
                  <h4
                    className={`font-semibold ${
                      !results.ai_insights.match_scores.qualified
                        ? "text-red-800"
                        : "text-green-800"
                    }`}
                  >
                    XGBoost Prediction
                  </h4>
                </div>
                <div className="mt-4">
                  <div className="flex items-center">
                    {!results.ai_insights.match_scores.qualified ? (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8 text-red-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                          />
                        </svg>
                        <p className="text-2xl font-bold text-red-600 ml-2">
                          Unqualified
                        </p>
                      </>
                    ) : (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8 text-green-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <p className="text-2xl font-bold text-green-600 ml-2">
                          Qualified
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* AI Analysis Insights Section */}
            {results.ai_insights && (
              <div className="mt-8 border-t border-gray-200 pt-6">
                <div className="flex items-center mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                  <h3 className="text-xl font-bold text-gray-800 ml-2">
                    JobBERT Insights
                  </h3>
                </div>

                <div className="bg-gray-50 rounded-xl p-6 shadow-sm space-y-6">
                  {/* Structured Analysis Sections */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(results.ai_insights.sections).map(
                      ([key, section]) => (
                        <div
                          key={key}
                          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
                        >
                          <h4 className="text-lg font-semibold text-blue-700 mb-4 border-b border-gray-100 pb-2">
                            {section.title}
                          </h4>
                          <div className="prose max-w-none">
                            {section.content.split("\n").map(
                              (line, index) =>
                                line.trim() && (
                                  <p key={index} className="mb-3 text-gray-700">
                                    {line.startsWith("-") ? (
                                      <span className="flex items-start">
                                        <span className="text-blue-500 mr-2 text-lg">
                                          •
                                        </span>
                                        <span>{line.substring(1).trim()}</span>
                                      </span>
                                    ) : (
                                      line
                                    )}
                                  </p>
                                )
                            )}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Technical Output Section */}
            <div className="mt-8">
              <button
                onClick={() => setShowTechnicalAnalysis(!showTechnicalAnalysis)}
                className="w-full flex items-center justify-between bg-gray-100 hover:bg-gray-200 px-6 py-4 rounded-xl transition-colors duration-200"
              >
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <h3 className="text-xl font-bold text-gray-800 ml-2">
                    Technical Analysis
                  </h3>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-6 w-6 text-gray-600 transform transition-transform duration-200 ${
                    showTechnicalAnalysis ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {showTechnicalAnalysis && (
                <div className="mt-4 space-y-6 bg-gray-50 p-6 rounded-xl">
                  {/* Personal Information */}
                  {results?.technical_analysis?.personal_info && (
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                      <h4 className="text-lg font-semibold text-gray-800 mb-4">
                        Personal Information
                      </h4>
                      <div className="space-y-3">
                        {Object.entries(
                          results.technical_analysis.personal_info
                        ).map(
                          ([key, value]) =>
                            value && (
                              <div key={key} className="flex">
                                <span className="font-medium text-gray-700 w-32">
                                  {key
                                    .split("_")
                                    .map(
                                      (word) =>
                                        word.charAt(0).toUpperCase() +
                                        word.slice(1)
                                    )
                                    .join(" ")}
                                  :
                                </span>
                                <span className="text-gray-600 ml-2">
                                  {value}
                                </span>
                              </div>
                            )
                        )}
                      </div>
                    </div>
                  )}

                  {/* Education */}
                  {results?.technical_analysis?.education && (
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                      <h4 className="text-lg font-semibold text-gray-800 mb-4">
                        Education
                      </h4>
                      <div className="space-y-3">
                        {Object.entries(
                          results.technical_analysis.education
                        ).map(([key, value]) => (
                          <div key={key}>
                            {Array.isArray(value) ? (
                              <div className="space-y-2">
                                <span className="font-medium text-gray-700">
                                  {key
                                    .split("_")
                                    .map(
                                      (word) =>
                                        word.charAt(0).toUpperCase() +
                                        word.slice(1)
                                    )
                                    .join(" ")}
                                  :
                                </span>
                                <ul className="ml-4 space-y-1">
                                  {value.map((item, index) => (
                                    <li key={index} className="text-gray-600">
                                      • {item}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ) : (
                              <div className="flex">
                                <span className="font-medium text-gray-700 w-32">
                                  {key
                                    .split("_")
                                    .map(
                                      (word) =>
                                        word.charAt(0).toUpperCase() +
                                        word.slice(1)
                                    )
                                    .join(" ")}
                                  :
                                </span>
                                <span className="text-gray-600 ml-2">
                                  {value}
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Experience */}
                  {results?.technical_analysis?.experience && (
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                      <h4 className="text-lg font-semibold text-gray-800 mb-4">
                        Professional Experience
                      </h4>
                      <div className="space-y-3">
                        {Object.entries(
                          results.technical_analysis.experience
                        ).map(([key, value]) => (
                          <div key={key}>
                            {Array.isArray(value) ? (
                              <div className="space-y-2">
                                <span className="font-medium text-gray-700">
                                  {key
                                    .split("_")
                                    .map(
                                      (word) =>
                                        word.charAt(0).toUpperCase() +
                                        word.slice(1)
                                    )
                                    .join(" ")}
                                  :
                                </span>
                                <ul className="ml-4 space-y-1">
                                  {value.map((item, index) => (
                                    <li key={index} className="text-gray-600">
                                      • {item}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ) : (
                              <div className="flex">
                                <span className="font-medium text-gray-700 w-32">
                                  {key
                                    .split("_")
                                    .map(
                                      (word) =>
                                        word.charAt(0).toUpperCase() +
                                        word.slice(1)
                                    )
                                    .join(" ")}
                                  :
                                </span>
                                <span className="text-gray-600 ml-2">
                                  {value}
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Skills */}
                  {results?.technical_analysis?.skills && (
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                      <h4 className="text-lg font-semibold text-gray-800 mb-4">
                        Skills
                      </h4>
                      <div className="space-y-4">
                        {Object.entries(results.technical_analysis.skills).map(
                          ([key, value]) => (
                            <div key={key}>
                              {Array.isArray(value) ? (
                                <div className="space-y-2">
                                  <span className="font-medium text-gray-700">
                                    {key
                                      .split("_")
                                      .map(
                                        (word) =>
                                          word.charAt(0).toUpperCase() +
                                          word.slice(1)
                                      )
                                      .join(" ")}
                                    :
                                  </span>
                                  <div className="flex flex-wrap gap-2">
                                    {value.map((skill, index) => (
                                      <span
                                        key={index}
                                        className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                                      >
                                        {skill}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              ) : (
                                <div className="flex">
                                  <span className="font-medium text-gray-700 w-32">
                                    {key
                                      .split("_")
                                      .map(
                                        (word) =>
                                          word.charAt(0).toUpperCase() +
                                          word.slice(1)
                                      )
                                      .join(" ")}
                                    :
                                  </span>
                                  <span className="text-gray-600 ml-2">
                                    {value}
                                  </span>
                                </div>
                              )}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {/* Job Match Analysis */}
                  {results?.technical_analysis?.job_match && (
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                      <h4 className="text-lg font-semibold text-gray-800 mb-4">
                        Job Match Analysis
                      </h4>
                      <div className="space-y-3">
                        {Object.entries(
                          results.technical_analysis.job_match
                        ).map(([key, value]) => (
                          <div key={key}>
                            {Array.isArray(value) ? (
                              <div className="space-y-2">
                                <span className="font-medium text-gray-700">
                                  {key
                                    .split("_")
                                    .map(
                                      (word) =>
                                        word.charAt(0).toUpperCase() +
                                        word.slice(1)
                                    )
                                    .join(" ")}
                                  :
                                </span>
                                <ul className="ml-4 space-y-1">
                                  {value.map((item, index) => (
                                    <li key={index} className="text-gray-600">
                                      • {item}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ) : (
                              <div className="flex">
                                <span className="font-medium text-gray-700 w-32">
                                  {key
                                    .split("_")
                                    .map(
                                      (word) =>
                                        word.charAt(0).toUpperCase() +
                                        word.slice(1)
                                    )
                                    .join(" ")}
                                  :
                                </span>
                                <span className="text-gray-600 ml-2">
                                  {value}
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {results && (
        <div className="mt-6 flex justify-center">
          <PDFDownloadLink
            document={
              <EvaluationReport
                results={results}
                jobPost={jobPost}
                candidateName={`${
                  selectedApplicant?.personal_info?.given_name || ""
                } ${selectedApplicant?.personal_info?.family_name || ""}`}
              />
            }
            fileName={`evaluation-report-${
              new Date().toISOString().split("T")[0]
            }.pdf`}
          >
            {({ blob, url, loading, error }) => (
              <button
                className={`flex items-center px-6 py-3 ${
                  loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
                } text-white rounded-lg shadow-md transition duration-200`}
                disabled={loading}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                {loading ? "Generating PDF..." : "Download Evaluation Report"}
              </button>
            )}
          </PDFDownloadLink>
        </div>
      )}
    </div>
  );
};
