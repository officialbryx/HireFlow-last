import { supabase } from './supabaseClient';

export const getDashboardMetrics = async () => {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();

    // Get active and archived job counts
    const { data: jobStats } = await supabase
      .from('job_posting')
      .select('status', { count: 'exact' })
      .eq('creator_id', user.id)
      .in('status', ['active', 'archived']);

    const activeJobs = jobStats?.filter(j => j.status === 'active').length || 0;
    const archivedJobs = jobStats?.filter(j => j.status === 'archived').length || 0;

    // Get recent jobs with applicant count
    const { data: recentJobs } = await supabase
      .from('job_posting')
      .select(`
        id,
        job_title,
        status,
        created_at,
        applicant_count
      `)
      .eq('creator_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5);

    // Get total applicants count and monthly change
    const { data: totalApplicants } = await supabase
      .from('applications')
      .select('created_at')
      .eq('status', 'pending');

    const { data: lastMonthApplicants } = await supabase
      .from('applications')
      .select('created_at')
      .gte('created_at', new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString());

    // Get shortlisted candidates count
    const { data: shortlisted } = await supabase
      .from('applications')
      .select('id')
      .eq('status', 'shortlisted');

    // Get popular job roles with applicant counts
    const { data: popularRoles } = await supabase
      .from('job_posting')
      .select(`
        id,
        job_title,
        applicant_count
      `)
      .eq('creator_id', user.id)
      .order('applicant_count', { ascending: false })
      .limit(5);

    return {
      jobStats: {
        active: activeJobs,
        archived: archivedJobs
      },
      recentJobs: recentJobs.map(job => ({
        id: job.id,
        title: job.job_title,
        status: job.status,
        applicants_count: job.applicant_count || 0,
        created_at: job.created_at
      })),
      applicantStats: {
        total: totalApplicants?.length || 0,
        monthlyChange: lastMonthApplicants?.length || 0
      },
      shortlistedStats: {
        total: shortlisted?.length || 0
      },
      popularRoles: popularRoles.map(role => ({
        id: role.id,
        title: role.job_title,
        applicants_count: role.applicant_count || 0
      }))
    };
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    throw error;
  }
};