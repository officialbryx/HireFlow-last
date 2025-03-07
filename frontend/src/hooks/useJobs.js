import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';

export function useJobs() {
  const queryClient = useQueryClient();

  const { data: jobs = [], isLoading, error, isFetching } = useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      console.log('Fetching jobs from API...');
      const data = await api.getAllJobPostings();
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
    onSuccess: (data) => {
      console.log('Cache updated with new data', data);
    },
  });

  // Add this to check cache status
  const cachedData = queryClient.getQueryData(['jobs']);
  console.log('Current cached data:', cachedData);
  console.log('Is fetching:', isFetching);

  // Mutation for creating jobs
  const createJobMutation = useMutation({
    mutationFn: api.createJobPost,
    onSuccess: () => {
      queryClient.invalidateQueries(['jobs']);
    },
  });

  // Mutation for updating jobs
  const updateJobMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const result = await api.updateJobPost(id, data);
      return result;
    },
    onSuccess: () => {
      // Invalidate and refetch the jobs query
      queryClient.invalidateQueries(['jobs']);
    },
    onError: (error) => {
      console.error('Update job error:', error);
      throw error;
    }
  });

  // Mutation for archiving jobs
  const archiveJobMutation = useMutation({
    mutationFn: api.archiveJobPost,
    onSuccess: () => {
      queryClient.invalidateQueries(['jobs']);
    },
  });

  // Mutation for restoring jobs
  const restoreJobMutation = useMutation({
    mutationFn: api.restoreJobPost,
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