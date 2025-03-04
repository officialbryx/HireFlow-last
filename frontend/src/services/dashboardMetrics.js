import { api } from './api';

export const getDashboardMetrics = async () => {
  try {
    // Get real job data
    const recentJobs = await api.getRecentJobs(5);

    // Hardcoded metrics for testing
    return {
      jobStats: {
        active: 8,
        archived: 3
      },
      recentJobs: recentJobs || [
        {
          id: 1,
          title: 'Senior Frontend Developer',
          status: 'active',
          applicants_count: 12,
          created_at: '2024-03-01T00:00:00Z'
        },
        {
          id: 2,
          title: 'Backend Engineer',
          status: 'active',
          applicants_count: 8,
          created_at: '2024-02-28T00:00:00Z'
        }
      ],
      applicantStats: {
        total: 45,
        monthlyChange: 23.5
      },
      shortlistedStats: {
        total: 15
      },
      popularRoles: [
        {
          id: 1,
          title: 'Frontend Developer',
          applicants_count: 20
        },
        {
          id: 2,
          title: 'Backend Developer',
          applicants_count: 15
        },
        {
          id: 3,
          title: 'UI/UX Designer',
          applicants_count: 10
        }
      ]
    };
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    // Fallback to completely hardcoded data if API fails
    return {
      jobStats: {
        active: 8,
        archived: 3
      },
      recentJobs: [
        {
          id: 1,
          title: 'Senior Frontend Developer',
          status: 'active',
          applicants_count: 12,
          created_at: '2024-03-01T00:00:00Z'
        },
        {
          id: 2,
          title: 'Backend Engineer',
          status: 'active',
          applicants_count: 8,
          created_at: '2024-02-28T00:00:00Z'
        }
      ],
      applicantStats: {
        total: 45,
        monthlyChange: 23.5
      },
      shortlistedStats: {
        total: 15
      },
      popularRoles: [
        {
          id: 1,
          title: 'Frontend Developer',
          applicants_count: 20
        },
        {
          id: 2,
          title: 'Backend Developer',
          applicants_count: 15
        },
        {
          id: 3,
          title: 'UI/UX Designer',
          applicants_count: 10
        }
      ]
    };
  }
};