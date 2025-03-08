import { useQuery } from '@tanstack/react-query';
import { jobsApi } from '../services/api/jobsApi';
import { formatDistanceToNow } from 'date-fns';

export function useJobListings() {
  const { data: jobs = [], isLoading, error } = useQuery({
    queryKey: ['public-job-listings'],
    queryFn: async () => {
      const data = await jobsApi.getAllJobPostings();
      return data
        .filter(job => job.status !== 'archived')
        .map(job => ({
          id: job.id,
          title: job.job_title,
          company: job.company_name,
          companyLogo: job.company_logo_url,
          location: job.location,
          type: job.employment_type,
          salary: job.salary_range,
          applicantsNeeded: job.applicants_needed,
          companyDetails: job.company_description,
          responsibilities: job.job_responsibility?.map(r => r.responsibility) || [],
          qualifications: job.job_qualification?.map(q => q.qualification) || [],
          aboutCompany: job.about_company,
          skills: job.job_skill?.map(s => s.skill) || [],
          postedDate: `Posted ${formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}`
        }));
    },
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    cacheTime: 30 * 60 * 1000, // Keep data in cache for 30 minutes
  });

  return { jobs, isLoading, error };
}