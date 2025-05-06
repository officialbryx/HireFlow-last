import { useState, useEffect } from "react";
// import { applicationsApi, jobsApi, evaluationApi } from "../../../../services/api";
import { jobsApi } from "../../../../services/api/jobsApi";
import { evaluationApi } from "../../../../services/api/evaluationApi";
import { applicationsApi } from "../../../../services/api/applicationsApi";

export const useRankCandidates = () => {
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [originalCandidates, setOriginalCandidates] = useState([]);
  const [rankingCriteria, setRankingCriteria] = useState("overall");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    minimumSkillMatch: 0,
    minimumOverallMatch: 0,
    evaluatedOnly: false,
    shortlistedOnly: false
  });
  const [expandedCandidates, setExpandedCandidates] = useState({});
  const [batchProcessing, setBatchProcessing] = useState(false);
  const [selectedForBatch, setSelectedForBatch] = useState([]);
  const [batchProgress, setBatchProgress] = useState(0);

  const toggleCandidate = (candidateId) => {
    setExpandedCandidates((prev) => ({
      ...prev,
      [candidateId]: !prev[candidateId]
    }));
  };

  const moveUp = (index) => {
    if (index === 0) return;
    setCandidates(prev => {
      const newCandidates = [...prev];
      const temp = newCandidates[index];
      newCandidates[index] = newCandidates[index - 1];
      newCandidates[index - 1] = temp;
      // Update ranks after swapping
      return newCandidates.map((candidate, idx) => ({
        ...candidate,
        rank: idx + 1
      }));
    });
  };

  const moveDown = (index) => {
    setCandidates(prev => {
      if (index === prev.length - 1) return prev;
      const newCandidates = [...prev];
      const temp = newCandidates[index];
      newCandidates[index] = newCandidates[index + 1];
      newCandidates[index + 1] = temp;
      // Update ranks after swapping
      return newCandidates.map((candidate, idx) => ({
        ...candidate,
        rank: idx + 1
      }));
    });
  };

  // Add this helper function
  const areFiltersActive = () => {
    return filters.minimumSkillMatch > 0 ||
           filters.minimumOverallMatch > 0 ||
           filters.evaluatedOnly ||
           filters.shortlistedOnly;
  };

  // Fetch jobs
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

  // Fetch candidates
  useEffect(() => {
    if (!selectedJob) {
      setCandidates([]);
      return;
    }

    const fetchCandidates = async () => {
      setLoading(true);
      try {
        const response = await applicationsApi.getApplicationsByJob(selectedJob);
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
                evaluated: true,
                needsEvaluation: false,
                evaluationResult, // Include full evaluation results
                shortlisted: candidate.shortlisted 
              };
            } catch (error) {
              console.error(`Error processing candidate ${candidate.id}:`, error);
              return {
                ...candidate,
                matchScore: 0,
                skillMatch: 0,
                experienceScore: 0,
                educationScore: 0,
                qualified: false,
                evaluated: false,
                error: true
              };
            }
          })
        );

        setOriginalCandidates(candidatesWithEvaluation);
        // Initial filtering will happen through the useEffect
      } catch (error) {
        console.error("Error fetching candidates:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, [selectedJob]);

  // Update filtering useEffect
  useEffect(() => {
    if (!originalCandidates.length) return;

    let filteredResults = [...originalCandidates];

    // Apply skill match filter
    if (filters.minimumSkillMatch > 0) {
      filteredResults = filteredResults.filter(
        candidate => (candidate.skillMatch || 0) >= filters.minimumSkillMatch
      );
    }

    // Apply overall match filter
    if (filters.minimumOverallMatch > 0) {
      filteredResults = filteredResults.filter(
        candidate => (candidate.matchScore || 0) >= filters.minimumOverallMatch
      );
    }

    // Apply evaluated only filter - check for evaluation_results instead of evaluated flag
    if (filters.evaluatedOnly) {
      filteredResults = filteredResults.filter(
        candidate => !!candidate.evaluationResult // Changed from evaluation_results to evaluationResult
      );
    }

    // Apply shortlisted only filter
    if (filters.shortlistedOnly) {
      filteredResults = filteredResults.filter(
        candidate => candidate.shortlisted === true
      );
    }

    // Sort candidates based on ranking criteria
    const sortedCandidates = filteredResults.sort((a, b) => {
      if (rankingCriteria === 'skills') {
        return (b.skillMatch || 0) - (a.skillMatch || 0);
      }
      return (b.matchScore || 0) - (a.matchScore || 0);
    });

    // Update ranks after filtering and sorting
    const rankedCandidates = sortedCandidates.map((candidate, index) => ({
      ...candidate,
      rank: index + 1
    }));

    setCandidates(rankedCandidates);
  }, [filters, rankingCriteria, originalCandidates]);

  // Add cleanup effect when batch processing is toggled off
  useEffect(() => {
    if (!batchProcessing) {
      setSelectedForBatch([]);
      setBatchProgress(0);
    }
  }, [batchProcessing]);

  return {
    loading,
    jobs,
    selectedJob,
    setSelectedJob,
    candidates,
    setCandidates,
    rankingCriteria,
    setRankingCriteria,
    showFilters,
    setShowFilters,
    filters,
    setFilters,
    expandedCandidates,
    setExpandedCandidates,
    batchProcessing,
    setBatchProcessing,
    selectedForBatch,
    setSelectedForBatch,
    batchProgress,
    originalCandidates,
    toggleCandidate,
    moveUp,
    moveDown,
    areFiltersActive,
  };
};