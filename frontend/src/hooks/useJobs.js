import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { jobsApi } from '../services/api/jobsApi';

export function useJobs() {
  const queryClient = useQueryClient();

  const { data: jobs = [], isLoading, error } = useQuery({
    queryKey: ['jobs'],
    queryFn: jobsApi.getAllJobPostings,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const createJobMutation = useMutation({
    mutationFn: jobsApi.createJobPost,
    onSuccess: () => {
      queryClient.invalidateQueries(['jobs']);
    },
  });

  const updateJobMutation = useMutation({
    mutationFn: ({ id, data }) => jobsApi.updateJobPost(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['jobs']);
    },
  });

  const archiveJobMutation = useMutation({
    mutationFn: jobsApi.archiveJobPost,
    onSuccess: () => {
      queryClient.invalidateQueries(['jobs']);
    },
  });

  const restoreJobMutation = useMutation({
    mutationFn: jobsApi.restoreJobPost,
    onSuccess: () => {
      queryClient.invalidateQueries(['jobs']);
    },
  });

  return {
    jobs,
    isLoading,
    error,
    createJob: createJobMutation.mutate,
    updateJob: updateJobMutation.mutate,
    archiveJob: archiveJobMutation.mutate,
    restoreJob: restoreJobMutation.mutate,
  };
}