import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { jobsApi } from '../services/api/jobsApi';

export function useJobs(isEmployer = false) {
  const queryClient = useQueryClient();

  const { data: jobs = [], isLoading, error } = useQuery({
    queryKey: ['jobs', isEmployer],
    queryFn: () => jobsApi.getAllJobPostings(isEmployer),
    staleTime: 5 * 60 * 1000,
  });

  // Archive job mutation
  const archiveJobMutation = useMutation({
    mutationFn: (jobId) => jobsApi.archiveJobPost(jobId),
    onSuccess: (_, jobId) => {
      // Update cache to reflect archived status
      queryClient.setQueryData(['jobs', true], (oldData = []) => {
        return oldData.map(job => 
          job.id === jobId ? { ...job, status: 'archived' } : job
        );
      });
      // Invalidate queries to refetch
      queryClient.invalidateQueries(['jobs']);
    },
    onError: (error) => {
      console.error('Error archiving job:', error);
      throw error;
    }
  });

  // Restore job mutation
  const restoreJobMutation = useMutation({
    mutationFn: (jobId) => jobsApi.restoreJobPost(jobId),
    onSuccess: (_, jobId) => {
      // Update cache to reflect active status
      queryClient.setQueryData(['jobs', true], (oldData = []) => {
        return oldData.map(job => 
          job.id === jobId ? { ...job, status: 'active' } : job
        );
      });
      // Invalidate queries to refetch
      queryClient.invalidateQueries(['jobs']);
    }
  });

  // Update job mutation
  const updateJobMutation = useMutation({
    mutationFn: ({ id, data }) => jobsApi.updateJobPost(id, data),
    onSuccess: (updatedJob) => {
      // Update cache with modified job
      queryClient.setQueryData(['jobs', true], (oldData = []) => {
        return oldData.map(job => 
          job.id === updatedJob.id ? updatedJob : job
        );
      });
      // Invalidate queries to refetch
      queryClient.invalidateQueries(['jobs']);
    },
    onError: (error) => {
      console.error('Error updating job:', error);
      throw error;
    }
  });

  const createJobMutation = useMutation({
    mutationFn: async (jobData) => {
      const result = await jobsApi.createJobPost(jobData);
      return result;
    },
    onSuccess: (newJob) => {
      // Update cache with new job
      queryClient.setQueryData(['jobs', true], (oldData = []) => {
        return [newJob, ...oldData];
      });
      // Invalidate queries to refetch
      queryClient.invalidateQueries(['jobs']);
    }
  });

  return {
    jobs,
    isLoading,
    error,
    createJob: createJobMutation.mutate,
    isCreating: createJobMutation.isPending,
    createError: createJobMutation.error,
    updateJob: updateJobMutation.mutateAsync,
    isUpdating: updateJobMutation.isPending,
    updateError: updateJobMutation.error,
    archiveJob: archiveJobMutation.mutateAsync,
    isArchiving: archiveJobMutation.isPending,
    archiveError: archiveJobMutation.error,
    restoreJob: restoreJobMutation.mutateAsync,
    isRestoring: restoreJobMutation.isPending,
    restoreError: restoreJobMutation.error
  };
}