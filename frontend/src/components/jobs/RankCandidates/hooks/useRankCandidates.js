import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { jobsApi } from "../../../../services/api/jobsApi";
import { evaluationApi } from "../../../../services/api/evaluationApi";
import { applicationsApi } from "../../../../services/api/applicationsApi";

export const useRankCandidates = () => {
  const queryClient = useQueryClient();
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobs, setJobs] = useState([]);
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

  // Use React Query for candidates with evaluations
  const { data: candidates = [], isLoading } = useQuery({
    queryKey: ['candidates', selectedJob],
    queryFn: async () => {
      if (!selectedJob) return [];
      
      // First get all applications for the job
      const applications = await applicationsApi.getApplicationsByJob(selectedJob);
      
      // Get evaluation results for all applications
      const applicationIds = applications.map(app => app.id);
      const evaluationResults = await evaluationApi.getBatchEvaluationResults(applicationIds);
      
      // Merge applications with their evaluation results
      const candidatesWithEvaluation = applications.map(application => {
        const evaluation = evaluationResults.find(result => result.application_id === application.id);
        
        return {
          ...application,
          matchScore: evaluation?.overall_match || 0,
          skillMatch: evaluation?.skills_match || 0,
          experienceScore: evaluation?.experience_score || 0,
          educationScore: evaluation?.education_score || 0,
          qualified: evaluation?.qualified || false,
          evaluated: !!evaluation,
          evaluationResult: evaluation,
          rank: 0 // Will be calculated after sorting
        };
      });

      // Sort candidates based on ranking criteria
      const sortedCandidates = candidatesWithEvaluation.sort((a, b) => {
        if (rankingCriteria === 'skills') {
          return b.skillMatch - a.skillMatch;
        }
        return b.matchScore - a.matchScore;
      });

      // Add rank numbers
      return sortedCandidates.map((candidate, index) => ({
        ...candidate,
        rank: index + 1
      }));
    },
    enabled: !!selectedJob,
    refetchOnWindowFocus: true,
    staleTime: 30000,
    cacheTime: 300000
  });

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
      }
    };
    fetchJobs();
  }, []);

  // Add cleanup effect when batch processing is toggled off
  useEffect(() => {
    if (!batchProcessing) {
      setSelectedForBatch([]);
      setBatchProgress(0);
    }
  }, [batchProcessing]);

  return {
    loading: isLoading,
    jobs,
    selectedJob,
    setSelectedJob,
    candidates,
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
    toggleCandidate,
    moveUp,
    moveDown,
    areFiltersActive,
  };
};