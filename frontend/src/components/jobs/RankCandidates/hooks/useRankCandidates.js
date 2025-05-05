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
    shortlisted: false,
    minimumSkillMatch: 0,
    educationLevel: "any",
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

  // Add new useEffect for filtering
  useEffect(() => {
    if (!originalCandidates.length) return;

    const filteredCandidates = originalCandidates.filter(candidate => {
      // Filter by minimum skill match
      if (candidate.skillMatch < filters.minimumSkillMatch) {
        return false;
      }

      // Filter by education level
      if (filters.educationLevel !== 'any') {
        const educationLevels = {
          high_school: 0,
          associate: 1,
          bachelor: 2,
          master: 3,
          phd: 4
        };

        const candidateLevel = candidate.evaluationResult?.education?.highest_degree?.toLowerCase() || '';
        const requiredLevel = educationLevels[filters.educationLevel];

        // Check if candidate's education meets or exceeds required level
        const candidateLevelValue = educationLevels[candidateLevel] || -1;
        if (candidateLevelValue < requiredLevel) {
          return false;
        }
      }

      // Filter by shortlisted status
      if (filters.shortlisted && !candidate.shortlisted) {
        return false;
      }

      return true;
    });

    // Sort filtered candidates by ranking criteria
    const sortedCandidates = filteredCandidates.sort((a, b) => {
      switch (rankingCriteria) {
        case 'skills':
          return b.skillMatch - a.skillMatch;
        case 'experience':
          return b.experienceScore - a.experienceScore;
        case 'education':
          return b.educationScore - a.educationScore;
        default: // overall
          return b.matchScore - a.matchScore;
      }
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
  };
};