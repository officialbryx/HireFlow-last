import { useState, useEffect, useMemo } from "react";
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { jobsApi } from "../../../../services/api/jobsApi";
import { evaluationApi } from "../../../../services/api/evaluationApi";
import { applicationsApi } from "../../../../services/api/applicationsApi";
import { toast } from "react-hot-toast";
import { sortCandidatesByRankingCriteria } from '../utils/rankingUtils';

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
  const [candidates, setCandidates] = useState([]);

  // Use React Query for initial candidates fetch
  const { data: fetchedCandidates = [], isLoading } = useQuery({
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
          shortlisted: application.shortlisted || false,
          rank: 0 // Will be calculated after sorting
        };
      });

      // Return the raw data - sorting will be handled by applyFiltersAndSort
      return candidatesWithEvaluation;
    },
    enabled: !!selectedJob,
    refetchOnWindowFocus: true,
    staleTime: 30000,
    cacheTime: 300000
  });

  // Update local candidates state when fetched data changes
  useEffect(() => {
    if (fetchedCandidates.length > 0) {
      const filteredAndSortedCandidates = applyFiltersAndSort(fetchedCandidates);
      setCandidates(filteredAndSortedCandidates);
    }
  }, [fetchedCandidates, rankingCriteria, filters]);

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

  const applyFiltersAndSort = (candidatesList) => {
    // First apply filters
    let filteredCandidates = candidatesList.filter(candidate => {
      if (filters.minimumSkillMatch > 0 && candidate.skillMatch < filters.minimumSkillMatch) {
        return false;
      }
      if (filters.minimumOverallMatch > 0 && candidate.matchScore < filters.minimumOverallMatch) {
        return false;
      }
      if (filters.evaluatedOnly && !candidate.evaluated) {
        return false;
      }
      if (filters.shortlistedOnly && !candidate.shortlisted) {
        return false;
      }
      return true;
    });

    // Then sort by ranking criteria
    return sortCandidatesByRankingCriteria(filteredCandidates, rankingCriteria);
  };

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

  const handleBatchStatusUpdate = async (selectedIds, updates) => {
    try {
      // Show loading toast
      const loadingToast = toast.loading(`Updating ${selectedIds.length} candidates...`);

      // Optimistically update the UI
      queryClient.setQueryData(['candidates', selectedJob], (oldData) => {
        if (!oldData) return oldData;
        return oldData.map(candidate => 
          selectedIds.includes(candidate.id) 
            ? { ...candidate, ...updates }
            : candidate
        );
      });

      // Process each candidate in the batch
      const promises = selectedIds.map(async (id) => {
        if (updates.status) {
          await applicationsApi.updateApplicationStatus(id, updates.status);
        }
        if (typeof updates.shortlisted === 'boolean') {
          await applicationsApi.updateApplicantShortlist(id, updates.shortlisted);
        }
      });

      await Promise.all(promises);

      // Clear batch selection after successful update
      setSelectedForBatch([]);
      setBatchProcessing(false);

      // Refetch to ensure data consistency
      queryClient.invalidateQueries(['candidates', selectedJob]);

      // Dismiss loading toast and show success
      toast.dismiss(loadingToast);
      toast.success(`Successfully updated ${selectedIds.length} candidates`);
    } catch (error) {
      console.error('Error updating batch status:', error);
      toast.error('Failed to update candidates');
      // Revert optimistic update on error
      queryClient.invalidateQueries(['candidates', selectedJob]);
    }
  };

  return {
    loading: isLoading,
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
    toggleCandidate,
    moveUp,
    moveDown,
    areFiltersActive,
    handleBatchStatusUpdate,
  };
};