import React, { useState, useEffect } from "react";
import axios from "axios";
import { jobsApi } from "../../services/api/jobsApi";
import { applicationsApi } from "../../services/api/applicationsApi";
import { evaluationApi } from "../../services/api/evaluationApi";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { EvaluationReport } from "../reports/EvaluationReport";

const BatchEvaluate = () => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [selectedApplications, setSelectedApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [evaluationResults, setEvaluationResults] = useState({});
  const [progress, setProgress] = useState(0);
  const [evaluationStatus, setEvaluationStatus] = useState({});
  const [existingResults, setExistingResults] = useState({});

  // Fetch jobs on component mount
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await jobsApi.getAllJobPostings(true); // true for employer view
        setJobs(response.filter((job) => job.status === "active")); // Only show active jobs
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };
    fetchJobs();
  }, []);

  // Fetch applications when job is selected
  useEffect(() => {
    const fetchApplications = async () => {
      if (!selectedJob) return;
      try {
        const applicants = await applicationsApi.getApplicationsByJob(
          selectedJob.id
        );
        setApplications(applicants.filter((app) => app.resume_url)); // Only show applicants with resumes
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    };
    fetchApplications();
  }, [selectedJob]);

  // Fetch existing evaluations when applications change
  useEffect(() => {
    const fetchExistingEvaluations = async () => {
      if (!applications.length) return;

      try {
        // Get all application IDs
        const appIds = applications.map((app) => app.id);

        // Fetch existing evaluations
        const results = await evaluationApi.getBatchEvaluationResults(appIds);

        // Transform into a map for easy lookup
        const resultsMap = results.reduce((acc, result) => {
          acc[result.application_id] = result;
          return acc;
        }, {});

        setExistingResults(resultsMap);
      } catch (error) {
        console.error("Error fetching existing evaluations:", error);
      }
    };

    fetchExistingEvaluations();
  }, [applications]);

  const handleJobSelect = (event) => {
    const jobId = event.target.value;
    const job = jobs.find((j) => j.id === jobId);
    setSelectedJob(job);
    setSelectedApplications([]);
    setEvaluationResults({});
  };

  const handleBatchEvaluate = async () => {
    setIsLoading(true);
    setProgress(0);
    const results = {};

    try {
      // Format job posting
      const jobDetails = await jobsApi.getJobPostingDetails(selectedJob.id);
      const formattedJobPost = formatJobPost(jobDetails);

      // Filter out already evaluated applications
      const applicationsToEvaluate = selectedApplications.filter(
        (id) => !existingResults[id]
      );

      // Process each selected application
      for (let i = 0; i < applicationsToEvaluate.length; i++) {
        const applicationId = applicationsToEvaluate[i];
        const application = applications.find((a) => a.id === applicationId);

        try {
          // Download resume
          const blob = await applicationsApi.downloadResume(
            application.resume_url
          );
          const resumeFile = new File([blob], "resume.pdf", {
            type: "application/pdf",
          });

          // Evaluate
          const formData = new FormData();
          formData.append("jobPost", formattedJobPost);
          formData.append("resume", resumeFile);

          const response = await axios.post(
            "http://localhost:5000/api/evaluate",
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
              timeout: 120000,
            }
          );

          // Save results
          results[applicationId] = response.data;

          // Update progress
          setProgress(((i + 1) / applicationsToEvaluate.length) * 100);
        } catch (error) {
          results[applicationId] = { error: error.message };
        }
      }

      // Add existing evaluations to results
      selectedApplications.forEach((id) => {
        if (existingResults[id]) {
          results[id] = existingResults[id];
        }
      });

      // Save all results to database
      await evaluationApi.saveBatchEvaluationResults(
        Object.entries(results).map(([applicationId, results]) => ({
          applicationId,
          results,
        }))
      );

      setEvaluationResults(results);
    } catch (error) {
      console.error("Batch evaluation error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatJobPost = (jobDetails) => {
    const responsibilities =
      jobDetails.job_responsibility?.map((r) => r.responsibility) || [];
    const qualifications =
      jobDetails.job_qualification?.map((q) => q.qualification) || [];
    const skills = jobDetails.job_skill?.map((s) => s.skill) || [];

    return `
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
  };

  const renderApplicationsList = () => (
    <div className="space-y-2 max-h-60 overflow-y-auto">
      {applications.map((app) => (
        <div
          key={app.id}
          className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg"
        >
          <div className="flex items-center">
            <input
              type="checkbox"
              id={`app-${app.id}`}
              checked={selectedApplications.includes(app.id)}
              onChange={() => {
                setSelectedApplications((prev) =>
                  prev.includes(app.id)
                    ? prev.filter((id) => id !== app.id)
                    : [...prev, app.id]
                );
              }}
              className="h-4 w-4 text-blue-600 rounded"
              disabled={existingResults[app.id]}
            />
            <label htmlFor={`app-${app.id}`} className="ml-2">
              {app.personal_info?.given_name} {app.personal_info?.family_name}
            </label>
          </div>

          {existingResults[app.id] && (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-green-600 font-medium">
                Already Evaluated - {existingResults[app.id].overall_match}%
                Match
              </span>
              <button
                onClick={() =>
                  setEvaluationResults({ [app.id]: existingResults[app.id] })
                }
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                View Results
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderEvaluationResults = (result) => {
    if (!result) return null;

    const aiInsights = result.ai_insights || {};
    const sections = aiInsights.sections || {};

    return (
      <div className="bg-white p-6 rounded-xl shadow-sm space-y-6">
        {/* Match Scores */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800">Overall Match</h4>
            <p className="text-3xl font-bold text-blue-600">
              {result.overall_match}%
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-800">Skills Match</h4>
            <p className="text-3xl font-bold text-green-600">
              {result.skills_match}%
            </p>
          </div>
          <div
            className={`${
              result.qualified ? "bg-green-50" : "bg-red-50"
            } p-4 rounded-lg`}
          >
            <h4
              className={`font-semibold ${
                result.qualified ? "text-green-800" : "text-red-800"
              }`}
            >
              Status
            </h4>
            <p
              className={`text-xl font-bold ${
                result.qualified ? "text-green-600" : "text-red-600"
              }`}
            >
              {result.qualified ? "Qualified" : "Not Qualified"}
            </p>
          </div>
        </div>

        {/* AI Insights */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-gray-800 border-b pb-2">
            AI Analysis
          </h3>
          {Object.entries(sections).map(([key, section]) => (
            <div key={key} className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">
                {section.title}
              </h4>
              <div className="text-gray-600 whitespace-pre-wrap">
                {section.content}
              </div>
            </div>
          ))}
        </div>

        {/* Technical Analysis Summary */}
        {result.technical_analysis && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-800 border-b pb-2">
              Technical Analysis
            </h3>
            {Object.entries(result.technical_analysis).map(
              ([category, data]) => (
                <div key={category} className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">
                    {category
                      .split("_")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" ")}
                  </h4>
                  {Array.isArray(data) ? (
                    <ul className="list-disc list-inside space-y-1">
                      {data.map((item, index) => (
                        <li key={index} className="text-gray-600">
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : typeof data === "object" ? (
                    <div className="space-y-2">
                      {Object.entries(data).map(([key, value]) => (
                        <div key={key} className="text-gray-600">
                          <span className="font-medium">{key}: </span>
                          {value}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">{data}</p>
                  )}
                </div>
              )
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">Batch Resume Evaluation</h2>

        {/* Job Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Job Posting
          </label>
          <select
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            onChange={handleJobSelect}
            value={selectedJob?.id || ""}
          >
            <option value="">Select a job...</option>
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.job_title} - {job.company_name}
              </option>
            ))}
          </select>
        </div>

        {/* Applications Selection */}
        {selectedJob && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">
              Select Applications to Evaluate
            </h3>
            {renderApplicationsList()}
          </div>
        )}

        {/* Progress Bar */}
        {isLoading && (
          <div className="mb-6">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Processing {Math.round(progress)}% complete...
            </p>
          </div>
        )}

        {/* Evaluate Button */}
        <button
          onClick={handleBatchEvaluate}
          disabled={isLoading || selectedApplications.length === 0}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading
            ? "Evaluating..."
            : `Evaluate ${selectedApplications.length} Selected Applications`}
        </button>

        {/* Results */}
        {Object.keys(evaluationResults).length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">Evaluation Results</h3>
            <div className="space-y-6">
              {Object.entries(evaluationResults).map(([appId, result]) => {
                const application = applications.find((a) => a.id === appId);
                return (
                  <div key={appId} className="border rounded-lg p-6">
                    {/* Applicant Header */}
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-lg font-semibold">
                        {application.personal_info?.given_name}{" "}
                        {application.personal_info?.family_name}
                      </h4>
                      <div className="flex space-x-4">
                        <PDFDownloadLink
                          document={
                            <EvaluationReport
                              results={result}
                              jobPost={selectedJob}
                              candidateName={`${application.personal_info?.given_name} ${application.personal_info?.family_name}`}
                            />
                          }
                          fileName={`evaluation-${application.id}.pdf`}
                          className="text-blue-600 hover:underline"
                        >
                          Download PDF
                        </PDFDownloadLink>
                      </div>
                    </div>

                    {/* Evaluation Content */}
                    {result.error ? (
                      <p className="text-red-600">{result.error}</p>
                    ) : (
                      renderEvaluationResults(result)
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BatchEvaluate;
