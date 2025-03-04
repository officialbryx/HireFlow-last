import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BriefcaseIcon,
  ArchiveBoxIcon,
  UserGroupIcon,
  UserIcon,
  PlusIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';
import { getDashboardMetrics } from '../../services/dashboardMetrics';
import StatCard from '../../components/dashboard/StatCard';
import HRNavbar from '../../components/HRNavbar';

const Dashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await getDashboardMetrics();
        setMetrics(data);
      } catch (error) {
        console.error('Error loading dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <HRNavbar />
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <HRNavbar />
      {/* Add pt-20 to account for the fixed navbar height */}
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 gap-8">
            {/* Quick Actions */}
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
              <div className="space-x-4">
                <Link
                  to="/hr/jobs?tab=create"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Post New Job
                </Link>
                <Link
                  to="/hr/jobs?tab=view"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <ClipboardDocumentListIcon className="h-5 w-5 mr-2" />
                  Manage Jobs
                </Link>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Active Job Posts"
                value={metrics.jobStats.active}
                icon={BriefcaseIcon}
              />
              <StatCard
                title="Archived Jobs"
                value={metrics.jobStats.archived}
                icon={ArchiveBoxIcon}
              />
              <StatCard
                title="Total Applicants"
                value={metrics.applicantStats.total}
                icon={UserGroupIcon}
                change={metrics.applicantStats.monthlyChange}
                changeType="increase"
              />
              <StatCard
                title="Shortlisted Candidates"
                value={metrics.shortlistedStats.total}
                icon={UserIcon}
              />
            </div>

            {/* Recent Job Listings */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Job Listings</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Job Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applicants</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Posted Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {metrics.recentJobs.map((job) => (
                      <tr key={job.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Link to={`/hr/jobs/${job.id}`} className="text-blue-600 hover:text-blue-900">
                            {job.title}
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            job.status === 'active' 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {job.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{job.applicants_count}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                          {new Date(job.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Popular Job Roles */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Most Applied Job Roles</h2>
              <div className="space-y-4">
                {metrics.popularRoles.map((role) => (
                  <div key={role.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{role.title}</p>
                      <p className="text-sm text-gray-500">{role.applicants_count} applicants</p>
                    </div>
                    <div className="w-48 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(role.applicants_count / metrics.applicantStats.total) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;