import React, { useState } from "react";
import axios from "axios";

const EvaluateJobs = () => {
  const [jobPost, setJobPost] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

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

  // Add loading indicator
  const LoadingSpinner = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-5 rounded-lg shadow-lg text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4">Analyzing resume and job post...</p>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {isLoading && <LoadingSpinner />}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Job Post Section */}
          <div>
            <h2 className="text-xl font-semibold mb-3">Job Post</h2>
            <textarea
              className="w-full h-64 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={jobPost}
              onChange={(e) => setJobPost(e.target.value)}
              placeholder="Paste job description here..."
              required
            />
          </div>

          {/* Resume Upload Section */}
          <div>
            <h2 className="text-xl font-semibold mb-3">Resume</h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <input
                type="file"
                onChange={(e) => setResumeFile(e.target.files[0])}
                accept=".pdf,.doc,.docx,.txt"
                className="hidden"
                id="resume-upload"
                required
              />
              <label
                htmlFor="resume-upload"
                className="cursor-pointer flex flex-col items-center justify-center"
              >
                <span className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg">
                  Choose File
                </span>
                <span className="mt-2 text-sm text-gray-500">
                  {resumeFile ? resumeFile.name : "No file chosen"}
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isLoading || !jobPost || !resumeFile}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isLoading ? "Analyzing..." : "Evaluate Match"}
          </button>
        </div>

        {/* Error Message */}
        {error && <div className="text-red-600 text-center mt-4">{error}</div>}

        {/* Results Section */}
        {results && (
          <div className="mt-8 bg-white p-6 rounded-lg shadow">
            <h3 className="text-2xl font-bold mb-4">Analysis Results</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold">Overall Match</h4>
                <p className="text-3xl font-bold text-blue-600">
                  {Math.round(results.comparison.overall_match.score)}%
                </p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold">Skills Match</h4>
                <p className="text-3xl font-bold text-green-600">
                  {Math.round(results.comparison.skill_match.match_percentage)}%
                </p>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold">Experience Match</h4>
                <p className="text-xl font-bold text-purple-600">
                  {results.comparison.experience_match.sufficient
                    ? "✓ Sufficient"
                    : "✗ Insufficient"}
                </p>
              </div>
            </div>

            {/* AI Analysis Insights Section */}
            {results.ai_insights && (
              <div className="mt-6 border-t border-gray-200 pt-6">
                <h3 className="text-xl font-bold mb-4">AI Analysis Insights</h3>
                <div className="bg-gray-50 p-6 rounded-lg space-y-6">
                  <div className="text-sm text-gray-500 mb-4">
                    Analysis performed using: {results.device_used}
                  </div>

                  {/* Structured Analysis Sections */}
                  {Object.entries(results.ai_insights.sections).map(
                    ([key, section]) => (
                      <div
                        key={key}
                        className="bg-white p-4 rounded-lg shadow-sm"
                      >
                        <h4 className="text-lg font-semibold text-blue-600 mb-3">
                          {section.title}
                        </h4>
                        <div className="prose max-w-none">
                          {section.content.split("\n").map(
                            (line, index) =>
                              line.trim() && (
                                <p key={index} className="mb-2">
                                  {line.startsWith("-") ? (
                                    <span className="flex">
                                      <span className="text-blue-500 mr-2">
                                        •
                                      </span>
                                      {line.substring(1).trim()}
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

                  {/* Analysis Metadata */}
                  <div className="grid grid-cols-2 gap-4 text-sm mt-4">
                    <div className="bg-blue-50 p-4 rounded">
                      <p className="font-semibold">Analysis Confidence</p>
                      <p>
                        {results.ai_insights.confidence_score
                          ? "High"
                          : "Medium"}
                      </p>
                    </div>
                    <div className="bg-green-50 p-4 rounded">
                      <p className="font-semibold">Processing Status</p>
                      <p>
                        {results.ai_insights.error
                          ? "Analysis Failed"
                          : "Success"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Terminal Output Section */}
            <div className="mt-8">
              <div className="bg-black text-green-400 p-6 rounded-lg font-mono text-sm overflow-x-auto">
                <h3 className="text-white mb-4">Analysis Output:</h3>

                {/* Input Analysis */}
                <div className="mb-6 border-b border-gray-700 pb-4">
                  <p className="text-yellow-400">Input Analysis:</p>
                  <div className="mt-2">
                    <p className="text-blue-400">Job Post Content:</p>
                    <div className="ml-4 mt-1 text-gray-400 max-h-40 overflow-y-auto">
                      {jobPost.split("\n").map((line, i) => (
                        <p key={i}>{line || " "}</p>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-blue-400">Resume Content:</p>
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
                    <p className="text-yellow-400">Personal Information:</p>
                    {results.console_output.personal_info.name && (
                      <p>Name: {results.console_output.personal_info.name}</p>
                    )}
                    {results.console_output.personal_info.email && (
                      <p>Email: {results.console_output.personal_info.email}</p>
                    )}
                    {results.console_output.personal_info.phone && (
                      <p>Phone: {results.console_output.personal_info.phone}</p>
                    )}
                  </div>

                  {/* Skills */}
                  <div className="mb-4">
                    <p className="text-yellow-400">Skills:</p>
                    <p>Technical Skills:</p>
                    {Object.entries(
                      results.console_output.skills.hard_skills
                    ).map(([skill]) => (
                      <p key={skill}>• {skill}</p>
                    ))}

                    <p className="mt-2">Soft Skills:</p>
                    {Object.entries(
                      results.console_output.skills.soft_skills
                    ).map(([skill]) => (
                      <p key={skill}>• {skill}</p>
                    ))}
                  </div>

                  {/* Education and Experience */}
                  <div className="mb-4">
                    <p className="text-yellow-400">Education:</p>
                    {results.console_output.education.details.map(
                      (edu, index) => (
                        <div key={index}>
                          {edu.degree && <p>• {edu.degree}</p>}
                          {edu.school && <p> {edu.school}</p>}
                          {edu.year && <p> {edu.year}</p>}
                        </div>
                      )
                    )}
                  </div>

                  {/* Match Results Summary */}
                  <div className="border-t border-gray-700 pt-4 mt-4">
                    <p className="text-yellow-400">Final Assessment:</p>
                    <p>
                      Overall Match:{" "}
                      {Math.round(results.comparison.overall_match.score)}%
                    </p>
                    <p>
                      Skills Match:{" "}
                      {Math.round(
                        results.comparison.skill_match.match_percentage
                      )}
                      %
                    </p>
                    <p>
                      Experience:{" "}
                      {results.comparison.experience_match.sufficient
                        ? "Sufficient"
                        : "Insufficient"}
                    </p>

                    {!results.comparison.experience_match.sufficient && (
                      <p className="text-red-400 mt-2">
                        Experience Gap:{" "}
                        {results.comparison.experience_match.gap_years} years
                        short of requirement
                      </p>
                    )}

                    {results.comparison.skill_match.missing.length > 0 && (
                      <>
                        <p className="text-yellow-400 mt-2">Missing Skills:</p>
                        {results.comparison.skill_match.missing.map(
                          (skill, index) => (
                            <p key={index} className="text-red-400">
                              • {skill}
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
        )}
      </form>
    </div>
  );
};

export default EvaluateJobs;
