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

    // Get all job IDs created by this user (for filtering applications)
    const { data: userJobs } = await supabase
      .from('job_posting')
      .select('id')
      .eq('creator_id', user.id);
    
    // Extract job IDs to an array
    const userJobIds = userJobs?.map(job => job.id) || [];
    
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

    // Get total applicants count ONLY for this user's jobs
    const { data: totalApplicants } = await supabase
      .from('applications')
      .select('created_at')
      .in('job_posting_id', userJobIds)
      .eq('status', 'pending');

    // Get last month's applicants ONLY for this user's jobs
    const { data: lastMonthApplicants } = await supabase
      .from('applications')
      .select('created_at')
      .in('job_posting_id', userJobIds)
      .gte('created_at', new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString());

    // Get applications from current month
    const currentMonthStart = new Date();
    currentMonthStart.setDate(1); // First day of current month
    currentMonthStart.setHours(0, 0, 0, 0);

    const { data: currentMonthApplicants } = await supabase
      .from('applications')
      .select('created_at')
      .in('job_posting_id', userJobIds)
      .gte('created_at', currentMonthStart.toISOString());

    // Get applications from previous month
    const lastMonthStart = new Date();
    lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);
    lastMonthStart.setDate(1); // First day of previous month
    lastMonthStart.setHours(0, 0, 0, 0);

    const lastMonthEnd = new Date();
    lastMonthEnd.setDate(0); // Last day of previous month
    lastMonthEnd.setHours(23, 59, 59, 999);

    const { data: previousMonthApplicants } = await supabase
      .from('applications')
      .select('created_at')
      .in('job_posting_id', userJobIds)
      .gte('created_at', lastMonthStart.toISOString())
      .lte('created_at', lastMonthEnd.toISOString());

    // Calculate percentage change
    const currentMonthCount = currentMonthApplicants?.length || 0;
    const previousMonthCount = previousMonthApplicants?.length || 0;

    let percentageChange = 0;
    let changeType = 'none'; // Change default to 'none' instead of 'increase'

    if (previousMonthCount > 0) {
      percentageChange = Math.round(((currentMonthCount - previousMonthCount) / previousMonthCount) * 100);
      if (percentageChange > 0) {
        changeType = 'increase';
      } else if (percentageChange < 0) {
        changeType = 'decrease';
        percentageChange = Math.abs(percentageChange); // Make it positive for display
      }
    } else if (currentMonthCount > 0) {
      percentageChange = 100; // If previous month was 0, and current month has applications
      changeType = 'increase';
    } else {
      percentageChange = 0; // No change if both months are 0
      changeType = 'none';
    }

    // Get shortlisted candidates count ONLY for this user's jobs
    const { data: shortlisted } = await supabase
      .from('applications')
      .select('id')
      .in('job_posting_id', userJobIds)
      .eq('shortlisted', true);

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

    // Get application status distribution ONLY for this user's jobs
    const { data: statusDistribution } = await supabase
      .from('applications')
      .select('status, id')
      .in('job_posting_id', userJobIds);
    
    // Count applications by status
    const statusCounts = {};
    const statusColors = {
      pending: 'blue',
      rejected: 'red',
      interview: 'yellow',
      accepted: 'green',
      withdrawn: 'gray'
    };
    
    statusDistribution?.forEach(app => {
      if (!statusCounts[app.status]) {
        statusCounts[app.status] = {
          count: 0,
          color: statusColors[app.status] || 'blue'
        };
      }
      statusCounts[app.status].count++;
    });
    
    // Convert to array format for easier rendering
    const applicationStatusData = Object.keys(statusCounts).map(status => ({
      status: status,
      count: statusCounts[status].count,
      color: statusCounts[status].color
    })).sort((a, b) => b.count - a.count); // Sort by count in descending order

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
        monthlyChange: percentageChange,
        changeType: changeType
      },
      shortlistedStats: {
        total: shortlisted?.length || 0
      },
      popularRoles: popularRoles.map(role => ({
        id: role.id,
        title: role.job_title,
        applicants_count: role.applicant_count || 0
      })),
      applicationStatusData,
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    throw error;
  }
};