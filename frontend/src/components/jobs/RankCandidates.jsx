import { useState, useEffect } from "react";
import {
  ChevronDownIcon,
  AdjustmentsHorizontalIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ChevronRightIcon,
  UserCircleIcon,
  DocumentTextIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import { applicationsApi } from "../../services/api/applicationsApi";
import { jobsApi } from "../../services/api/jobsApi";
import { evaluationApi } from "../../services/api/evaluationApi";
import Avatar from "../common/Avatar";

const RankCandidates = () => {
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [rankingCriteria, setRankingCriteria] = useState("overall");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    shortlisted: false,
    minimumSkillMatch: 0,
    educationLevel: "any",
  });

  // Add state to track expanded candidates
  const [expandedCandidates, setExpandedCandidates] = useState({});

  // Add a new state for original candidates data
  const [originalCandidates, setOriginalCandidates] = useState([]);

  // Toggle function for expanding/collapsing a candidate
  const toggleCandidate = (candidateId) => {
    setExpandedCandidates((prev) => ({
      ...prev,
      [candidateId]: !prev[candidateId],
    }));
  };

  // Keep existing useEffect and functions
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobsData = await jobsApi.getAllJobPostings(true);
        setJobs(jobsData.filter((job) => job.status !== "archived"));
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // Fetch candidates with evaluation results
  useEffect(() => {
    if (!selectedJob) {
      setCandidates([]);
      return;
    }

    const fetchCandidates = async () => {
      setLoading(true);
      try {
        const response = await applicationsApi.getApplicationsByJob(selectedJob);
        
        // Fetch evaluation results for each candidate
        const candidatesWithEvaluation = await Promise.all(
          response.map(async (candidate) => {
            try {
              const evaluationResult = await evaluationApi.getEvaluationResult(candidate.id);
              return {
                ...candidate,
                matchScore: evaluationResult?.overall_match || 0,
                skillMatch: evaluationResult?.skills_match || 0,
                experienceScore: evaluationResult?.experience_score || 0,
                educationScore: evaluationResult?.education_score || 0,
                qualified: evaluationResult?.qualified || false,
                ai_insights: evaluationResult?.ai_insights || null,
                technical_analysis: evaluationResult?.technical_analysis || null,
                evaluated: !!evaluationResult
              };
            } catch (error) {
              console.error(`Error fetching evaluation for candidate ${candidate.id}:`, error);
              return {
                ...candidate,
                matchScore: 0,
                skillMatch: 0,
                experienceScore: 0,
                educationScore: 0,
                qualified: false,
                evaluated: false
              };
            }
          })
        );

        // Sort candidates by evaluation scores
        const sortedCandidates = candidatesWithEvaluation.sort((a, b) => b.matchScore - a.matchScore);
        
        setOriginalCandidates(sortedCandidates);
        setCandidates(sortedCandidates);
      } catch (error) {
        console.error("Error fetching candidates:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCandidates();
  }, [selectedJob]);

  // Simple function to move a candidate up in rank
  const moveUp = (index) => {
    if (index <= 0) return;

    const items = Array.from(candidates);
    const item = items[index];
    items[index] = items[index - 1];
    items[index - 1] = item;

    // Update ranks
    const rerankedCandidates = items.map((candidate, idx) => ({
      ...candidate,
      rank: idx + 1,
    }));

    setCandidates(rerankedCandidates);
  };

  // Simple function to move a candidate down in rank
  const moveDown = (index) => {
    if (index >= candidates.length - 1) return;

    const items = Array.from(candidates);
    const item = items[index];
    items[index] = items[index + 1];
    items[index + 1] = item;

    // Update ranks
    const rerankedCandidates = items.map((candidate, idx) => ({
      ...candidate,
      rank: idx + 1,
    }));

    setCandidates(rerankedCandidates);
  };

  const sortCandidatesByRankingCriteria = (candidatesList, criteria) => {
    return [...candidatesList]
      .sort((a, b) => {
        switch (criteria) {
          case "overall":
            return b.matchScore - a.matchScore;
          case "skills":
            return b.skillMatch - a.skillMatch;
          case "experience":
            return b.experienceScore - a.experienceScore;
          case "education":
            return b.educationScore - a.educationScore;
          default:
            return b.matchScore - a.matchScore;
        }
      })
      .map((candidate, index) => ({
        ...candidate,
        rank: index + 1,
      }));
  };

  // Get quality indicator class based on score
  const getQualityIndicator = (score) => {
    if (score >= 80) return "bg-gradient-to-r from-emerald-500 to-green-500";
    if (score >= 70) return "bg-gradient-to-r from-green-500 to-teal-500";
    if (score >= 60) return "bg-gradient-to-r from-yellow-400 to-amber-500";
    return "bg-gradient-to-r from-orange-400 to-red-500";
  };

  // Apply sorting and filtering
  useEffect(() => {
    if (!selectedJob || originalCandidates.length === 0) return;

    // First sort by ranking criteria
    let sortedCandidates = sortCandidatesByRankingCriteria(
      [...originalCandidates],
      rankingCriteria
    );

    // Then apply filters
    const filteredCandidates = sortedCandidates.filter((candidate) => {
      // Filter by skill match
      if (candidate.skillMatch < filters.minimumSkillMatch) {
        return false;
      }

      // Filter by education level
      if (filters.educationLevel !== "any") {
        const educationLevels = {
          high_school: 1,
          associate: 2,
          bachelor: 3,
          master: 4,
          phd: 5,
        };

        // Check if candidate has the required education level
        const hasRequiredEducation = candidate.education?.some((edu) => {
          const degree = edu.degree?.toLowerCase() || "";
          if (
            filters.educationLevel === "phd" &&
            (degree.includes("phd") || degree.includes("doctorate"))
          ) {
            return true;
          }
          if (
            filters.educationLevel === "master" &&
            (degree.includes("master") || degree.includes("mba"))
          ) {
            return true;
          }
          if (
            filters.educationLevel === "bachelor" &&
            (degree.includes("bachelor") ||
              degree.includes("bs") ||
              degree.includes("ba"))
          ) {
            return true;
          }
          if (
            filters.educationLevel === "associate" &&
            degree.includes("associate")
          ) {
            return true;
          }
          if (
            filters.educationLevel === "high_school" &&
            degree.includes("high school")
          ) {
            return true;
          }
          return false;
        });

        if (!hasRequiredEducation) {
          return false;
        }
      }

      // Filter by shortlisted status
      if (filters.shortlisted && !candidate.shortlisted) {
        return false;
      }

      return true;
    });

    // Update ranks
    const rerankedCandidates = filteredCandidates.map((candidate, idx) => ({
      ...candidate,
      rank: idx + 1,
    }));

    setCandidates(rerankedCandidates);
  }, [rankingCriteria, filters, originalCandidates]);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
      {/* Header with gradient background */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <span className="bg-blue-600 w-1.5 h-6 rounded mr-3 inline-block"></span>
          Candidate Ranking
        </h2>
        <p className="mt-2 text-sm text-gray-600 ml-4">
          Compare and prioritize candidates based on job-specific requirements
          and qualifications
        </p>
      </div>

      {/* Controls Bar with glass morphism effect */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-slate-50 to-slate-100">
        <div className="flex flex-wrap items-end gap-6">
          {/* Job Selection */}
          <div className="w-full md:w-auto flex-grow">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Select Position
            </label>
            <div className="relative">
              <select
                className="w-full border border-gray-300 rounded-lg shadow-sm py-2.5 pl-4 pr-10 
                           text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                           appearance-none bg-white transition-all duration-200 hover:border-blue-400"
                value={selectedJob || ""}
                onChange={(e) => setSelectedJob(e.target.value)}
              >
                <option value="">Select a job posting</option>
                {jobs.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.job_title} - {job.company_name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <ChevronDownIcon className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Ranking Criteria */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Ranking Method
            </label>
            <div className="relative">
              <select
                className="w-full md:w-48 border border-gray-300 rounded-lg shadow-sm py-2.5 pl-4 pr-10
                           text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                           appearance-none bg-white transition-all duration-200 hover:border-blue-400"
                value={rankingCriteria}
                onChange={(e) => setRankingCriteria(e.target.value)}
              >
                <option value="overall">Overall Match</option>
                <option value="skills">Skills Match</option>
                <option value="experience">Experience</option>
                <option value="education">Education</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <ChevronDownIcon className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Filter Toggle Button */}
          <div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center px-3 py-2.5 border rounded-lg shadow-sm text-sm font-medium
                        transition-all duration-200 ${
                          showFilters
                            ? "bg-blue-50 border-blue-300 text-blue-700"
                            : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
            >
              <AdjustmentsHorizontalIcon
                className={`h-5 w-5 mr-1.5 ${
                  showFilters ? "text-blue-500" : "text-gray-500"
                }`}
              />
              Filters{" "}
              {filters.shortlisted ||
              filters.minimumSkillMatch > 0 ||
              filters.educationLevel !== "any"
                ? "(Active)"
                : ""}
            </button>
          </div>

          {/* Export Button */}
          <div className="ml-auto">
            <button
              className="inline-flex items-center px-4 py-2.5 bg-white border border-gray-300 
                         rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 
                         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                         transition-all duration-200"
            >
              <DocumentTextIcon className="h-5 w-5 mr-2 text-gray-500" />
              Export Rankings
            </button>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden border-b border-gray-200 
                    ${
                      showFilters
                        ? "max-h-96 opacity-100 py-4"
                        : "max-h-0 opacity-0 py-0"
                    }`}
      >
        <div className="px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Minimum Skill Match
            </label>
            <div className="flex items-center">
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={filters.minimumSkillMatch}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    minimumSkillMatch: parseInt(e.target.value),
                  })
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <span className="ml-3 text-sm font-medium text-gray-700 min-w-[40px]">
                {filters.minimumSkillMatch}%
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Education Level
            </label>
            <select
              value={filters.educationLevel}
              onChange={(e) =>
                setFilters({ ...filters, educationLevel: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 
                        text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                        appearance-none bg-white"
            >
              <option value="any">Any Level</option>
              <option value="high_school">High School</option>
              <option value="associate">Associate's Degree</option>
              <option value="bachelor">Bachelor's Degree</option>
              <option value="master">Master's Degree</option>
              <option value="phd">PhD or Doctorate</option>
            </select>
          </div>

          <div>
            <div className="flex items-center h-full pt-6">
              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={filters.shortlisted}
                    onChange={(e) =>
                      setFilters({ ...filters, shortlisted: e.target.checked })
                    }
                  />
                  {/* Track (background) */}
                  <div
                    className={`w-10 h-5 rounded-full shadow-inner transition-all duration-300 ease-in-out ${
                      filters.shortlisted
                        ? "bg-gradient-to-r from-blue-500 to-indigo-500"
                        : "bg-gray-200"
                    }`}
                  ></div>
                  {/* Dot (circle) */}
                  <div
                    className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full shadow-md transition-all duration-300 ease-in-out ${
                      filters.shortlisted
                        ? "transform translate-x-5 bg-white ring-2 ring-blue-300"
                        : "bg-white"
                    }`}
                  ></div>
                </div>
                <div
                  className={`ml-3 font-medium transition-colors duration-300 ${
                    filters.shortlisted ? "text-blue-700" : "text-gray-700"
                  }`}
                >
                  Shortlisted Only
                </div>
              </label>
              <button
                onClick={() =>
                  setFilters({
                    shortlisted: false,
                    minimumSkillMatch: 0,
                    educationLevel: "any",
                  })
                }
                className="ml-auto text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Candidates Ranking List */}
      <div className="p-6 bg-gray-50">
        {loading ? (
          <div className="text-center py-16 flex flex-col items-center justify-center">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-b-2 border-gray-200"></div>
              <div className="absolute top-0 w-16 h-16 rounded-full border-b-2 border-blue-600 animate-spin"></div>
            </div>
            <p className="mt-4 text-gray-500 font-medium">
              Loading candidates...
            </p>
            <p className="text-sm text-gray-400">This may take a moment</p>
          </div>
        ) : !selectedJob ? (
          <div className="text-center py-16 flex flex-col items-center justify-center">
            <div className="rounded-full bg-blue-100 p-4 mb-4">
              <UserCircleIcon className="h-10 w-10 text-blue-600" />
            </div>
            <p className="text-gray-600 font-medium mb-2">
              No candidates selected
            </p>
            <p className="text-sm text-gray-500 max-w-md">
              Please select a job posting from the dropdown above to view and
              rank eligible candidates
            </p>
          </div>
        ) : candidates.length === 0 ? (
          <div className="text-center py-16 flex flex-col items-center justify-center">
            <div className="rounded-full bg-amber-100 p-4 mb-4">
              <CalendarIcon className="h-10 w-10 text-amber-600" />
            </div>
            <p className="text-gray-600 font-medium mb-2">
              No candidates found
            </p>
            <p className="text-sm text-gray-500 max-w-md">
              There are no applications for this job posting yet
            </p>
          </div>
        ) : (
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
              <div
                key={candidate.id}
                className="border rounded-xl bg-white border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
              >
                {/* Main Row (Always visible) */}
                <div
                  className={`grid grid-cols-12 gap-3 items-center p-4 cursor-pointer ${
                    expandedCandidates[candidate.id]
                      ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => toggleCandidate(candidate.id)}
                >
                  {/* Rank with badge */}
                  <div className="col-span-1 flex items-center">
                    <div className="relative">
                      <span className="inline-flex items-center justify-center h-9 w-9 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 text-gray-800 font-bold shadow-inner border border-gray-300">
                        {candidate.rank}
                      </span>
                      {candidate.rank <= 3 && (
                        <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-yellow-400 border-2 border-white flex items-center justify-center">
                          <span className="text-white text-xs font-bold">
                            ★
                          </span>
                        </span>
                      )}
                    </div>
                    <div className="ml-2 flex flex-col">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          moveUp(index);
                        }}
                        disabled={index === 0}
                        className={`p-1 rounded-full ${
                          index === 0
                            ? "text-gray-300 cursor-not-allowed"
                            : "text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                        }`}
                      >
                        <ArrowUpIcon className="h-3 w-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          moveDown(index);
                        }}
                        disabled={index === candidates.length - 1}
                        className={`p-1 rounded-full ${
                          index === candidates.length - 1
                            ? "text-gray-300 cursor-not-allowed"
                            : "text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                        }`}
                      >
                        <ArrowDownIcon className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  {/* Candidate Info with improved layout */}
                  <div className="col-span-5 flex items-center">
                    <div className="flex-shrink-0 relative">
                      <Avatar
                        name={`${candidate.personal_info?.given_name || ""} ${
                          candidate.personal_info?.family_name || ""
                        }`}
                        size={12}
                        className="border-2 border-white shadow"
                      />
                      {candidate.matchScore >= 85 && (
                        <span className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-green-500 border-2 border-white flex items-center justify-center">
                          <span className="text-white text-xs font-bold">
                            ✓
                          </span>
                        </span>
                      )}
                    </div>
                    <div className="ml-4 flex-grow">
                      <h3 className="text-sm font-medium text-gray-900 flex items-center group">
                        {candidate.personal_info?.given_name || ""}{" "}
                        {candidate.personal_info?.family_name || ""}
                        <ChevronRightIcon
                          className={`h-5 w-5 ml-1 text-gray-400 transform transition-transform duration-300 ease-in-out group-hover:text-blue-500 ${
                            expandedCandidates[candidate.id] ? "rotate-90" : ""
                          }`}
                        />
                      </h3>
                      <p className="text-xs text-gray-500">
                        {candidate.email ||
                          candidate.personal_info?.email ||
                          ""}
                      </p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {candidate.work_experience &&
                          candidate.work_experience[0] && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {candidate.work_experience[0].job_title ||
                                "Professional"}
                            </span>
                          )}
                        {candidate.education && candidate.education[0] && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {candidate.education[0].degree || "Degree"}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Match Score with improved visualization */}
                  <div className="col-span-2">
                    <div className="flex items-center">
                      {!candidate.evaluated ? (
                        <div className="text-sm text-gray-500">
                          Not evaluated yet
                        </div>
                      ) : (
                        <>
                          <div
                            className={`h-12 w-12 rounded-full flex items-center justify-center text-white font-bold ${getQualityIndicator(
                              candidate.matchScore
                            )}`}
                          >
                            {candidate.matchScore}%
                          </div>
                          <div className="ml-2">
                            <div className="text-xs font-medium text-gray-500">
                              MATCH
                            </div>
                            <div className="text-xs text-gray-400">Score</div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Skills with mini tags */}
                  <div className="col-span-2">
                    <div className="flex flex-col">
                      <div className="flex items-center mb-1">
                        <div className="text-sm font-medium text-gray-700">
                          {candidate.skillMatch}% match
                        </div>
                        {candidate.skillMatch >= 80 && (
                          <span className="ml-1 inline-block px-1.5 py-0.5 text-xs bg-green-100 text-green-800 rounded">
                            High
                          </span>
                        )}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                        <div
                          className={`h-2.5 rounded-full transition-all duration-500 ease-in-out ${
                            candidate.skillMatch >= 80
                              ? "bg-gradient-to-r from-green-500 to-emerald-400"
                              : candidate.skillMatch >= 60
                              ? "bg-gradient-to-r from-blue-500 to-cyan-400"
                              : "bg-gradient-to-r from-amber-500 to-yellow-400"
                          }`}
                          style={{ width: `${candidate.skillMatch}%` }}
                        ></div>
                      </div>
                      {candidate.skills && candidate.skills.length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {candidate.skills.slice(0, 2).map((skill, idx) => (
                            <span key={idx} className="text-xs text-gray-500">
                              {skill}
                              {idx < Math.min(2, candidate.skills.length) - 1
                                ? ", "
                                : ""}
                            </span>
                          ))}
                          {candidate.skills.length > 2 && (
                            <span className="text-xs text-blue-500">
                              +{candidate.skills.length - 2}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="col-span-2 text-right">
                    <button
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      View Profile
                    </button>
                  </div>
                </div>

                {/* Animated Expanded Content - improved accordion */}
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    expandedCandidates[candidate.id]
                      ? "max-h-[500px] opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="p-5 bg-white border-t border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Education Section */}
                      <div className="space-y-3 transform transition-all duration-300 ease-in-out translate-y-0 opacity-100 bg-gradient-to-br from-gray-50 to-white p-4 rounded-lg border border-gray-200 shadow-sm">
                        <h4 className="font-medium text-sm text-gray-800 flex items-center">
                          <span className="w-1 h-5 bg-blue-500 rounded mr-2"></span>
                          Education
                        </h4>
                        {candidate.education &&
                        candidate.education.length > 0 ? (
                          <div className="space-y-3">
                            {candidate.education.map((edu, idx) => (
                              <div
                                key={idx}
                                className="text-sm border-l-2 border-blue-500 pl-3 transform transition-all duration-300 ease-in-out bg-white p-2 rounded-r-lg shadow-sm"
                                style={{
                                  transitionDelay: `${idx * 50}ms`,
                                }}
                              >
                                <div className="font-medium text-gray-800">
                                  {edu.degree || "Degree"}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {edu.institution || "Institution"}
                                </div>
                                <div className="text-xs text-gray-400 mt-1">
                                  {edu.start_date?.substring(0, 4) || "?"} -{" "}
                                  {edu.end_date?.substring(0, 4) || "Present"}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-gray-500 italic bg-gray-50 p-3 rounded-lg">
                            No education information available
                          </p>
                        )}
                      </div>

                      {/* Work Experience - with staggered animations */}
                      <div
                        className="space-y-3 transform transition-all duration-300 ease-in-out translate-y-0 opacity-100 bg-gradient-to-br from-gray-50 to-white p-4 rounded-lg border border-gray-200 shadow-sm"
                        style={{ transitionDelay: "100ms" }}
                      >
                        <h4 className="font-medium text-sm text-gray-800 flex items-center">
                          <span className="w-1 h-5 bg-green-500 rounded mr-2"></span>
                          Experience
                        </h4>
                        {candidate.work_experience &&
                        candidate.work_experience.length > 0 ? (
                          <div className="space-y-3">
                            {candidate.work_experience
                              .slice(0, 2)
                              .map((exp, idx) => (
                                <div
                                  key={idx}
                                  className="text-sm border-l-2 border-green-500 pl-3 transform transition-all duration-300 ease-in-out bg-white p-2 rounded-r-lg shadow-sm"
                                  style={{
                                    transitionDelay: `${150 + idx * 50}ms`,
                                  }}
                                >
                                  <div className="font-medium text-gray-800">
                                    {exp.job_title || "Position"}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {exp.company || "Company"}
                                  </div>
                                  <div className="text-xs text-gray-400 mt-1">
                                    {exp.start_date?.substring(0, 7) || "?"} -{" "}
                                    {exp.end_date?.substring(0, 7) || "Present"}
                                  </div>
                                </div>
                              ))}
                            {candidate.work_experience.length > 2 && (
                              <div className="text-xs text-blue-600 font-medium text-center pt-1">
                                +{candidate.work_experience.length - 2} more
                                positions
                              </div>
                            )}
                          </div>
                        ) : (
                          <p className="text-xs text-gray-500 italic bg-gray-50 p-3 rounded-lg">
                            No work experience available
                          </p>
                        )}
                      </div>

                      {/* Skills Section - with animation delay */}
                      <div
                        className="space-y-3 transform transition-all duration-300 ease-in-out translate-y-0 opacity-100 bg-gradient-to-br from-gray-50 to-white p-4 rounded-lg border border-gray-200 shadow-sm"
                        style={{ transitionDelay: "200ms" }}
                      >
                        <h4 className="font-medium text-sm text-gray-800 flex items-center">
                          <span className="w-1 h-5 bg-purple-500 rounded mr-2"></span>
                          Skills & Match Analysis
                        </h4>
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {candidate.skills && candidate.skills.length > 0 ? (
                            candidate.skills.slice(0, 8).map((skill, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 shadow-sm transform transition-all duration-300 ease-in-out"
                                style={{
                                  transitionDelay: `${250 + idx * 30}ms`,
                                }}
                              >
                                {skill}
                              </span>
                            ))
                          ) : (
                            <p className="text-xs text-gray-500 italic">
                              No skills listed
                            </p>
                          )}
                          {candidate.skills && candidate.skills.length > 8 && (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                              +{candidate.skills.length - 8} more
                            </span>
                          )}
                        </div>

                        {/* Match Scores - with animated progress bars */}
                        <div>
                          <h5 className="font-medium text-xs text-gray-700 mb-3">
                            Match Analysis
                          </h5>
                          <div className="space-y-3">
                            <div
                              className="transform transition-all duration-500 ease-in-out"
                              style={{ transitionDelay: "300ms" }}
                            >
                              <div className="flex justify-between text-xs mb-1">
                                <span className="text-gray-600 font-medium">
                                  Experience
                                </span>
                                <span
                                  className={`font-medium ${
                                    candidate.experienceScore >= 80
                                      ? "text-green-600"
                                      : candidate.experienceScore >= 60
                                      ? "text-blue-600"
                                      : "text-amber-600"
                                  }`}
                                >
                                  {candidate.experienceScore}%
                                </span>
                              </div>
                              <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden shadow-inner">
                                <div
                                  className={`h-1.5 rounded-full transition-all duration-1000 ease-out ${
                                    candidate.experienceScore >= 80
                                      ? "bg-gradient-to-r from-green-500 to-emerald-400"
                                      : candidate.experienceScore >= 60
                                      ? "bg-gradient-to-r from-blue-500 to-cyan-400"
                                      : "bg-gradient-to-r from-amber-500 to-yellow-400"
                                  }`}
                                  style={{
                                    width: expandedCandidates[candidate.id]
                                      ? `${candidate.experienceScore}%`
                                      : "0%",
                                  }}
                                ></div>
                              </div>
                            </div>
                            <div
                              className="transform transition-all duration-500 ease-in-out"
                              style={{ transitionDelay: "400ms" }}
                            >
                              <div className="flex justify-between text-xs mb-1">
                                <span className="text-gray-600 font-medium">
                                  Education
                                </span>
                                <span
                                  className={`font-medium ${
                                    candidate.educationScore >= 80
                                      ? "text-green-600"
                                      : candidate.educationScore >= 60
                                      ? "text-blue-600"
                                      : "text-amber-600"
                                  }`}
                                >
                                  {candidate.educationScore}%
                                </span>
                              </div>
                              <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden shadow-inner">
                                <div
                                  className={`h-1.5 rounded-full transition-all duration-1000 ease-out ${
                                    candidate.educationScore >= 80
                                      ? "bg-gradient-to-r from-green-500 to-emerald-400"
                                      : candidate.educationScore >= 60
                                      ? "bg-gradient-to-r from-blue-500 to-cyan-400"
                                      : "bg-gradient-to-r from-amber-500 to-yellow-400"
                                  }`}
                                  style={{
                                    width: expandedCandidates[candidate.id]
                                      ? `${candidate.educationScore}%`
                                      : "0%",
                                  }}
                                ></div>
                              </div>
                            </div>
                            <div
                              className="transform transition-all duration-500 ease-in-out"
                              style={{ transitionDelay: "500ms" }}
                            >
                              <div className="flex justify-between text-xs mb-1">
                                <span className="text-gray-600 font-medium">
                                  Skills
                                </span>
                                <span
                                  className={`font-medium ${
                                    candidate.skillMatch >= 80
                                      ? "text-green-600"
                                      : candidate.skillMatch >= 60
                                      ? "text-blue-600"
                                      : "text-amber-600"
                                  }`}
                                >
                                  {candidate.skillMatch}%
                                </span>
                              </div>
                              <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden shadow-inner">
                                <div
                                  className={`h-1.5 rounded-full transition-all duration-1000 ease-out ${
                                    candidate.skillMatch >= 80
                                      ? "bg-gradient-to-r from-green-500 to-emerald-400"
                                      : candidate.skillMatch >= 60
                                      ? "bg-gradient-to-r from-blue-500 to-cyan-400"
                                      : "bg-gradient-to-r from-amber-500 to-yellow-400"
                                  }`}
                                  style={{
                                    width: expandedCandidates[candidate.id]
                                      ? `${candidate.skillMatch}%`
                                      : "0%",
                                  }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons - enhanced styling */}
                    <div
                      className="mt-5 flex justify-end space-x-3 border-t border-gray-200 pt-3 transform transition-all duration-300 ease-in-out opacity-100"
                      style={{ transitionDelay: "600ms" }}
                    >
                      <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200">
                        View Full Profile
                      </button>
                      <button className="inline-flex items-center px-4 py-2 shadow-sm text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200">
                        <CalendarIcon className="h-4 w-4 mr-1.5" />
                        Schedule Interview
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RankCandidates;
