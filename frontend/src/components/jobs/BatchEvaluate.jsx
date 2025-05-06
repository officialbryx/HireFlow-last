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

      // Process each selected application
      for (let i = 0; i < selectedApplications.length; i++) {
        const applicationId = selectedApplications[i];
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
          setProgress(((i + 1) / selectedApplications.length) * 100);
        } catch (error) {
          results[applicationId] = { error: error.message };
        }
      }

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
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="flex items-center p-2 hover:bg-gray-50"
                >
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
                  />
                  <label htmlFor={`app-${app.id}`} className="ml-2">
                    {app.personal_info?.given_name}{" "}
                    {app.personal_info?.family_name}
                  </label>
                </div>
              ))}
            </div>
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
            <div className="space-y-4">
              {Object.entries(evaluationResults).map(([appId, result]) => {
                const application = applications.find((a) => a.id === appId);
                return (
                  <div key={appId} className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2">
                      {application.personal_info?.given_name}{" "}
                      {application.personal_info?.family_name}
                    </h4>
                    {result.error ? (
                      <p className="text-red-600">{result.error}</p>
                    ) : (
                      <>
                        <p>
                          Overall Match:{" "}
                          {result.ai_insights.match_scores.overall_match}%
                        </p>
                        <p>
                          Skills Match:{" "}
                          {result.ai_insights.match_scores.skills_match}%
                        </p>
                        <PDFDownloadLink
                          document={
                            <EvaluationReport
                              results={result}
                              jobPost={selectedJob}
                              candidateName={`${application.personal_info?.given_name} ${application.personal_info?.family_name}`}
                            />
                          }
                          fileName={`evaluation-${application.id}.pdf`}
                          className="text-blue-600 hover:underline mt-2 inline-block"
                        >
                          Download Report
                        </PDFDownloadLink>
                      </>
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
