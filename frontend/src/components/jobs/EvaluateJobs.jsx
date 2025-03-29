import React, { useState, useEffect } from "react";
import axios from "axios";
import { jobsApi } from "../../services/api/jobsApi";
import { applicationsApi } from "../../services/api/applicationsApi";

const EvaluateJobs = () => {
  // Existing state
  const [jobPost, setJobPost] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // New state for job and application selection
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [applications, setApplications] = useState([]);
  const [selectedApplicationId, setSelectedApplicationId] = useState("");
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [loadingApplications, setLoadingApplications] = useState(false);
  const [loadingCandidate, setLoadingCandidate] = useState(false);

  // Fetch all available jobs on component mount
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoadingJobs(true);
        const fetchedJobs = await jobsApi.getAllJobPostings(true);
        setJobs(fetchedJobs);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError("Failed to load jobs. Please try again.");
      } finally {
        setLoadingJobs(false);
      }
    };

    fetchJobs();
  }, []);

  // Fetch applications when a job is selected
  useEffect(() => {
    const fetchApplications = async () => {
      if (!selectedJobId) {
        setApplications([]);
        return;
      }

      try {
        setLoadingApplications(true);
        const fetchedApplications = await applicationsApi.getApplicationsByJob(selectedJobId);
        setApplications(fetchedApplications);
      } catch (err) {
        console.error("Error fetching applications:", err);
        setError("Failed to load applications. Please try again.");
      } finally {
        setLoadingApplications(false);
      }
    };

    fetchApplications();
  }, [selectedJobId]);

  // Auto-populate job description when a job is selected
  useEffect(() => {
    const populateJobDetails = async () => {
      if (!selectedJobId) {
        setJobPost("");
        return;
      }

      try {
        const jobDetails = await jobsApi.getJobPostingDetails(selectedJobId);
        
        // Format the job posting as a complete description
        const responsibilities = jobDetails.job_responsibility?.map(r => r.responsibility) || [];
        const qualifications = jobDetails.job_qualification?.map(q => q.qualification) || [];
        const skills = jobDetails.job_skill?.map(s => s.skill) || [];
        
        const formattedJobPost = `
Job Title: ${jobDetails.job_title}
Company: ${jobDetails.company_name}
Location: ${jobDetails.location}
Employment Type: ${jobDetails.employment_type}
Salary Range: ${jobDetails.salary_range || 'Not specified'}

About the Company:
${jobDetails.about_company || jobDetails.company_description || 'No company description provided.'}

Job Description:
${jobDetails.company_description || 'No job description provided.'}

Responsibilities:
${responsibilities.length > 0 ? responsibilities.map(r => `- ${r}`).join('\n') : 'Not specified'}

Qualifications:
${qualifications.length > 0 ? qualifications.map(q => `- ${q}`).join('\n') : 'Not specified'}

Skills Required:
${skills.length > 0 ? skills.map(s => `- ${s}`).join('\n') : 'Not specified'}
        `.trim();
        
        setJobPost(formattedJobPost);
      } catch (err) {
        console.error("Error fetching job details:", err);
        setError("Failed to load job details. Please try again.");
      }
    };

    populateJobDetails();
  }, [selectedJobId]);

  // Handle resume population when an application is selected
  const handleApplicationSelect = async (applicationId) => {
    setSelectedApplicationId(applicationId);
    if (!applicationId) {
      setResumeFile(null);
      return;
    }

    try {
      setLoadingCandidate(true); // Use loadingCandidate instead of isLoading
      const application = await applicationsApi.getApplicationDetails(applicationId);
      
      if (application.resume_url) {
        try {
          // Download the resume file
          const blob = await applicationsApi.downloadResume(application.resume_url);
          
          // Create a File object from the blob
          const resumeFileName = application.resume_url.split('/').pop() || 'resume.pdf';
          const file = new File([blob], resumeFileName, { type: 'application/pdf' });
          
          setResumeFile(file);
        } catch (downloadErr) {
          console.error("Error downloading resume:", downloadErr);
          setError("Failed to download candidate's resume. Please try again or upload manually.");
          setResumeFile(null);
        }
      } else {
        setError("This candidate doesn't have a resume file. Please upload one manually.");
        setResumeFile(null);
      }
    } catch (err) {
      console.error("Error fetching application details:", err);
      setError("Failed to load candidate details. Please try again.");
    } finally {
      setLoadingCandidate(false);
    }
  };

  // Reset application selection when job changes
  useEffect(() => {
    setSelectedApplicationId("");
    setResumeFile(null);
  }, [selectedJobId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const formData = new FormData();
      formData.append("jobPost", jobPost);
      formData.append("resume", resumeFile);

      const response = await axios.post(
        "http://localhost:5000/api/evaluate",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 120000, // Increase timeout to 2 minutes
        }
      );

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
    e.preventDefault();
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
          Analyzing resume and job post...
        </p>
        <p className="text-sm text-gray-500 mt-2">
          This may take up to 2 minutes
        </p>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-gray-50 min-h-screen">
      {isLoading && <LoadingSpinner />}

      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800">
          Resume-Job Match Evaluator
        </h1>
        <p className="text-gray-600 mt-2">
          Compare your resume against job requirements for a detailed
          compatibility analysis
        </p>
      </div>

      {/* Job and Candidate Selection Section */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Select Job and Candidate
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Job Selection */}
            <div>
              <label htmlFor="job-select" className="block text-sm font-medium text-gray-700 mb-2">
                Select Job Posting
              </label>
              <div className="relative">
                {loadingJobs ? (
                  <div className="animate-pulse h-10 bg-gray-200 rounded"></div>
                ) : (
                  <select
                    id="job-select"
                    value={selectedJobId}
                    onChange={(e) => setSelectedJobId(e.target.value)}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="">-- Select a Job Posting --</option>
                    {jobs.map((job) => (
                      <option key={job.id} value={job.id}>
                        {job.job_title} - {job.company_name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            {/* Application Selection (only shows if job is selected) */}
            <div>
              <label htmlFor="application-select" className="block text-sm font-medium text-gray-700 mb-2">
                Select Candidate
              </label>
              <div className="relative">
                {!selectedJobId ? (
                  <select
                    disabled
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 bg-gray-100 text-gray-500 sm:text-sm rounded-md cursor-not-allowed"
                  >
                    <option>-- Select a job first --</option>
                  </select>
                ) : loadingApplications ? (
                  <div className="animate-pulse h-10 bg-gray-200 rounded"></div>
                ) : (
                  <select
                    id="application-select"
                    value={selectedApplicationId}
                    onChange={(e) => handleApplicationSelect(e.target.value)}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    disabled={loadingCandidate}
                  >
                    <option value="">
                      {loadingCandidate ? "Loading candidate resume..." : "-- Select a Candidate --"}
                    </option>
                    {applications.length === 0 ? (
                      <option disabled>No candidates found for this job</option>
                    ) : (
                      applications.map((app) => (
                        <option key={app.id} value={app.id}>
                          {app.personal_info?.given_name || ''} {app.personal_info?.family_name || ''} 
                          {!app.personal_info?.given_name && !app.personal_info?.family_name && 'Unnamed Candidate'}
                        </option>
                      ))
                    )}
                  </select>
                )}
              </div>
            </div>
          </div>

          {selectedJobId && selectedApplicationId && (
            <div className="mt-4 text-sm text-green-600">
              <p>✓ Job and candidate selected. Form fields have been populated automatically.</p>
            </div>
          )}
        </div>
      </div>

      {/* Existing Form Content */}
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
                placeholder="Paste job description here..."
                required
              />
              <p className="text-sm text-gray-500">
                Include complete job requirements for best results
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
                  required
                />
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
                  {resumeFile
                    ? resumeFile.name
                    : "Drag and drop your resume or click to browse"}
                </p>
                <label
                  htmlFor="resume-upload"
                  className="mt-4 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-medium cursor-pointer hover:bg-blue-100 transition duration-200"
                >
                  Choose File
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
              disabled={isLoading || !jobPost || !resumeFile}
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
                    {Math.round(results.comparison.overall_match.score)}%
                  </p>
                  <div className="ml-2 mb-1">
                    <div className="h-2 w-16 bg-blue-200 rounded-full">
                      <div
                        className="h-2 bg-blue-600 rounded-full"
                        style={{
                          width: `${Math.round(
                            results.comparison.overall_match.score
                          )}%`,
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
                    {Math.round(
                      results.comparison.skill_match.match_percentage
                    )}
                    %
                  </p>
                  <div className="ml-2 mb-1">
                    <div className="h-2 w-16 bg-green-200 rounded-full">
                      <div
                        className="h-2 bg-green-600 rounded-full"
                        style={{
                          width: `${Math.round(
                            results.comparison.skill_match.match_percentage
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-purple-800">
                    Experience Match
                  </h4>
                  <span className="bg-purple-200 text-purple-800 text-xs px-2 py-1 rounded-full">
                    Qualification
                  </span>
                </div>
                <div className="mt-4">
                  <div className="flex items-center">
                    {results.comparison.experience_match.sufficient ? (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8 text-purple-600"
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
                        <p className="text-2xl font-bold text-purple-600 ml-2">
                          Sufficient
                        </p>
                      </>
                    ) : (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8 text-red-500"
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
                        <p className="text-2xl font-bold text-red-500 ml-2">
                          Insufficient
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
                    AI Analysis Insights
                  </h3>
                </div>

                <div className="bg-gray-50 rounded-xl p-6 shadow-sm space-y-6">
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                      />
                    </svg>
                    Analysis performed using: {results.device_used}
                  </div>

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

                  {/* Analysis Metadata */}
                  <div className="grid grid-cols-2 gap-4 text-sm mt-6">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-blue-500 mr-2"
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
                        <p className="font-semibold text-blue-800">
                          Analysis Confidence
                        </p>
                      </div>
                      <p className="mt-2 text-blue-700 pl-7">
                        {results.ai_insights.confidence_score
                          ? "High"
                          : "Medium"}
                      </p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-green-500 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <p className="font-semibold text-green-800">
                          Processing Status
                        </p>
                      </div>
                      <p className="mt-2 text-green-700 pl-7">
                        {results.ai_insights.error
                          ? "Analysis Failed"
                          : "Success"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Technical Output Section */}
            <div className="mt-8">
              <div className="flex items-center mb-4">
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

              <div className="bg-gray-900 text-green-400 p-6 rounded-xl font-mono text-sm overflow-x-auto shadow-md">
                <div className="flex items-center mb-4 border-b border-gray-700 pb-2">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <p className="text-white ml-4 text-xs">analysis_output.log</p>
                </div>

                {/* Input Analysis */}
                <div className="mb-6 border-b border-gray-700 pb-4">
                  <p className="text-yellow-400 font-semibold">
                    Input Analysis:
                  </p>
                  <div className="mt-2">
                    <p className="text-blue-400 font-semibold">
                      JobPost Content:
                    </p>
                    <div className="ml-4 mt-1 text-gray-400 max-h-40 overflow-y-auto">
                      {jobPost.split("\n").map((line, i) => (
                        <p key={i}>{line || " "}</p>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-blue-400 font-semibold">
                      Resume Content:
                    </p>
                    <div className="ml-4 mt-1 text-gray-400 max-h-40 overflow-y-auto">
                      {results.resume_text.split("\n").map((line, i) => (
                        <p key={i}>{line || " "}</p>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Analysis Results */}
                <div className="space-y-4">
                  {/* Personal Info */}
                  <div className="mb-4">
                    <p className="text-yellow-400 font-semibold">
                      Personal Information:
                    </p>
                    {results.console_output.personal_info.name && (
                      <p className="ml-4">
                        Name:{" "}
                        <span className="text-white">
                          {results.console_output.personal_info.name}
                        </span>
                      </p>
                    )}
                    {results.console_output.personal_info.email && (
                      <p className="ml-4">
                        Email:{" "}
                        <span className="text-white">
                          {results.console_output.personal_info.email}
                        </span>
                      </p>
                    )}
                    {results.console_output.personal_info.phone && (
                      <p className="ml-4">
                        Phone:{" "}
                        <span className="text-white">
                          {results.console_output.personal_info.phone}
                        </span>
                      </p>
                    )}
                  </div>

                  {/* Skills */}
                  <div className="mb-4">
                    <p className="text-yellow-400 font-semibold"> Skills:</p>
                    <p className="ml-4 text-cyan-400"> Technical Skills:</p>
                    {Object.entries(
                      results.console_output.skills.hard_skills
                    ).map(([skill], index) => (
                      <p key={index} className="ml-6 text-white">
                        - {skill}
                      </p>
                    ))}

                    <p className="ml-4 mt-2 text-cyan-400"> Soft Skills:</p>
                    {Object.entries(
                      results.console_output.skills.soft_skills
                    ).map(([skill], index) => (
                      <p key={index} className="ml-6 text-white">
                        - {skill}
                      </p>
                    ))}
                  </div>

                  {/* Match Results Summary */}
                  <div className="border-t border-gray-700 pt-4 mt-4">
                    <p className="text-yellow-400 font-semibold">
                      Final Assessment:
                    </p>
                    <p className="ml-4 mt-2">
                      Overall Match:{" "}
                      <span className="text-white">
                        {Math.round(results.comparison.overall_match.score)}%
                      </span>
                    </p>
                    <p className="ml-4">
                      Skills Match:{" "}
                      <span className="text-white">
                        {Math.round(
                          results.comparison.skill_match.match_percentage
                        )}
                        %
                      </span>
                    </p>
                    <p className="ml-4">
                      Experience:{" "}
                      <span
                        className={
                          results.comparison.experience_match.sufficient
                            ? "text-green-400"
                            : "text-red-400"
                        }
                      >
                        {results.comparison.experience_match.sufficient
                          ? "Sufficient"
                          : "Insufficient"}
                      </span>
                    </p>

                    {!results.comparison.experience_match.sufficient && (
                      <p className="ml-4 text-red-400 mt-2">
                        Experience Gap:{" "}
                        {results.comparison.experience_match.gap_years} years
                        short of requirement
                      </p>
                    )}

                    {results.comparison.skill_match.missing.length > 0 && (
                      <>
                        <p className="ml-4 text-yellow-400 mt-2">
                          Missing Skills:
                        </p>
                        {results.comparison.skill_match.missing.map(
                          (skill, index) => (
                            <p key={index} className="ml-6 text-red-400">
                              - {skill}
                            </p>
                          )
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EvaluateJobs;
