import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { jobsApi } from '../services/api/jobsApi';

export function useJobs(isEmployer = false) {
  const queryClient = useQueryClient();

  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ['jobs', isEmployer],
    queryFn: () => jobsApi.getAllJobPostings(isEmployer),
  });

  const createJob = async (jobData) => {
    try {
      await jobsApi.createJobPost(jobData);
      await queryClient.invalidateQueries(['jobs', isEmployer]);
    } catch (error) {
      console.error('Error creating job:', error);
      throw error;
    }
  };

  const updateJob = async ({ id, data }) => {
    try {
      await jobsApi.updateJobPost(id, data);
      await queryClient.invalidateQueries(['jobs', isEmployer]);
    } catch (error) {
      console.error('Error updating job:', error);
      throw error;
    }
  };

  const archiveJob = async (jobId) => {
    try {
      await jobsApi.archiveJobPost(jobId);
      // Invalidate and refetch jobs
      await queryClient.invalidateQueries(['jobs', isEmployer]);
    } catch (error) {
      console.error('Error archiving job:', error);
      throw error;
    }
  };

  const restoreJob = async (jobId) => {
    try {
      await jobsApi.restoreJobPost(jobId);
      await queryClient.invalidateQueries(['jobs', isEmployer]);
    } catch (error) {
      console.error('Error restoring job:', error);
      throw error;
    }
  };

  // Add real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('job_updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'job_posting'
        },
        async (payload) => {
          // Immediately update the cache with the new data
          queryClient.setQueryData(['jobs', isEmployer], (oldData) => {
            if (!oldData) return oldData;
            return oldData.map(job => 
              job.id === payload.new.id ? { ...job, ...payload.new } : job
            );
          });
          
          // Then refetch to ensure complete sync
          await queryClient.invalidateQueries(['jobs', isEmployer]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, isEmployer]);

  return {
    jobs,
    isLoading,
    createJob,
    updateJob,
    archiveJob,
    restoreJob
  };
}