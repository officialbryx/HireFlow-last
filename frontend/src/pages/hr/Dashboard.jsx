import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  BriefcaseIcon,
  ArchiveBoxIcon,
  UserGroupIcon,
  UserIcon,
  PlusIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  ArrowPathIcon,
  ChartPieIcon,
  DocumentArrowDownIcon,
  DocumentTextIcon,
  TableCellsIcon
} from '@heroicons/react/24/outline';
import { getDashboardMetrics } from '../../services/dashboardMetrics';
import StatCard from '../../components/dashboard/StatCard';
import HRNavbar from '../../components/HRNavbar';

// Query configuration constants
const REFETCH_INTERVAL = 1000 * 60; // 1 minute
const STALE_TIME = 1000 * 60 * 4; // 4 minutes
const CACHE_TIME = 1000 * 60 * 60; // 1 hour

const Dashboard = () => {
  const navigate = useNavigate();
  const [showReportOptions, setShowReportOptions] = useState(false);
  const printRef = useRef();
  
  const { 
    data: metrics, 
    isLoading, 
    error, 
    refetch,
    isFetching 
  } = useQuery({
    queryKey: ['dashboardMetrics'],
    queryFn: getDashboardMetrics,
    refetchInterval: REFETCH_INTERVAL,
    refetchOnWindowFocus: true, // Refetch when window regains focus
    staleTime: STALE_TIME, // Consider data stale after 4 minutes
    cacheTime: CACHE_TIME, // Cache for 1 hour
  });

  const handleCardClick = (path) => {
    navigate(path);
  };

  // Export to CSV (Just for Recent Jobs)
  const exportJobsToCSV = () => {
    if (!metrics || !metrics.recentJobs) return;
    
    // Create CSV headers
    const headers = ['Job Title', 'Status', 'Applicants', 'Posted Date'];
    
    // Map jobs data to CSV rows
    const jobsData = metrics.recentJobs.map(job => [
      job.title,
      job.status,
      job.applicants_count,
      new Date(job.created_at).toLocaleDateString()
    ]);
    
    // Combine headers and data
    const csvContent = [
      headers.join(','),
      ...jobsData.map(row => row.join(','))
    ].join('\n');
    
    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'recent_jobs.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export app statistics to CSV
  const exportAppStatsToCSV = () => {
    if (!metrics || !metrics.applicationStatusData) return;
    
    // Create CSV headers and data
    const headers = ['Status', 'Count', 'Percentage'];
    const statsData = metrics.applicationStatusData.map(item => [
      item.status,
      item.count,
      metrics.applicantStats.total > 0 
        ? Math.round((item.count / metrics.applicantStats.total) * 100) + '%'
        : '0%'
    ]);
    
    // Combine headers and data
    const csvContent = [
      headers.join(','),
      ...statsData.map(row => row.join(','))
    ].join('\n');
    
    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'application_statistics.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <HRNavbar />
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <HRNavbar />
        <div className="flex flex-col items-center justify-center h-screen">
          <p className="text-red-600 mb-4">Error loading dashboard data</p>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <ArrowPathIcon className="h-5 w-5 mr-2" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <HRNavbar />
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 gap-8" ref={printRef}>
            {/* Quick Actions with Refresh Button */}
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
                {isFetching && (
                  <ArrowPathIcon className="h-5 w-5 animate-spin text-blue-600" />
                )}
              </div>
              <div className="space-x-4 flex">
                {/* Reports dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowReportOptions(!showReportOptions)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
                    Reports
                    <svg className="ml-2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 111.414 1.414l-4 4a1 1 01-1.414 0l-4-4a1 1 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {showReportOptions && (
                    <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                      <div className="py-1">
                        <button
                          onClick={exportJobsToCSV}
                          className="text-gray-700 block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center"
                        >
                          <TableCellsIcon className="h-5 w-5 mr-2" />
                          Export Job Listings (CSV)
                        </button>
                        <button
                          onClick={exportAppStatsToCSV}
                          className="text-gray-700 block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center"
                        >
                          <DocumentTextIcon className="h-5 w-5 mr-2" />
                          Export Application Stats (CSV)
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                
                <button
                  onClick={() => refetch()}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  disabled={isFetching}
                >
                  <ArrowPathIcon className={`h-5 w-5 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
                
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
                onClick={() => handleCardClick('/hr/jobs?tab=view')}
              />
              <StatCard
                title="Archived Jobs"
                value={metrics.jobStats.archived}
                icon={ArchiveBoxIcon}
                onClick={() => handleCardClick('/hr/jobs?tab=archived')}
              />
              <StatCard
                title="Total Applicants"
                value={metrics.applicantStats.total}
                icon={UserGroupIcon}
                change={metrics.applicantStats.monthlyChange}
                changeType={metrics.applicantStats.changeType}  // Dynamic instead of hardcoded
                onClick={() => handleCardClick('/hr/jobs?tab=applicants')}
              />
              <StatCard
                title="Shortlisted Candidates"
                value={metrics.shortlistedStats.total}
                icon={UserIcon}
                onClick={() => handleCardClick('/hr/jobs?tab=applicants&filter=shortlisted')}
              />
            </div>

            {/* Recent Job Listings */}
            <div className="bg-white rounded-xl shadow-sm p-6 transition-all duration-200 hover:shadow-md border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
                    <BriefcaseIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">Recent Job Listings</h2>
                </div>
                <Link
                  to="/hr/jobs?tab=view"
                  className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
                >
                  View All
                  <span className="ml-1">→</span>
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicants</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posted Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {metrics.recentJobs.map((job) => (
                      <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <Link to={`/hr/jobs/${job.id}`} className="text-blue-600 hover:text-blue-900 font-medium">
                            {job.title}
                          </Link>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                            ${job.status === 'active' 
                              ? 'bg-green-50 text-green-700'
                              : 'bg-gray-50 text-gray-700'
                            }`}>
                            {job.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-1">
                            <UserGroupIcon className="h-4 w-4 text-gray-400" />
                            <span>{job.applicants_count}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                          {new Date(job.created_at).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Popular Job Roles */}
            <div className="bg-white rounded-xl shadow-sm p-6 transition-all duration-200 hover:shadow-md border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
                    <ChartBarIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">Most Applied Job Roles</h2>
                </div>
              </div>
              <div className="space-y-6">
                {metrics.popularRoles.map((role) => (
                  <div key={role.id} className="group">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                          {role.title}
                        </p>
                        <p className="text-sm text-gray-500">
                          {role.applicants_count} applicants
                        </p>
                      </div>
                      <Link
                        to={`/hr/jobs/${role.id}`}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-600 hover:text-blue-700"
                      >
                        View →
                      </Link>
                    </div>
                    <div className="relative w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500 ease-out"
                        style={{ 
                          width: `${Math.min((role.applicants_count / metrics.applicantStats.total) * 100, 100)}%` 
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Application Status Distribution - New Section */}
            <div className="bg-white rounded-xl shadow-sm p-6 transition-all duration-200 hover:shadow-md border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
                    <ChartPieIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">Application Status Distribution</h2>
                </div>
              </div>
              
              {metrics.applicationStatusData && metrics.applicationStatusData.length > 0 ? (
                <div className="space-y-4">
                  {metrics.applicationStatusData.map((item) => (
                    <div key={item.status} className="group">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center">
                          <div 
                            className={`w-3 h-3 rounded-full mr-2 bg-${item.color}-500`}
                            aria-hidden="true"
                          ></div>
                          <p className="font-medium text-gray-900 capitalize">
                            {item.status} 
                          </p>
                        </div>
                        <span className="text-sm text-gray-500">
                          {item.count} ({metrics.applicantStats.total > 0 
                            ? Math.round((item.count / metrics.applicantStats.total) * 100) 
                            : 0}%)
                        </span>
                      </div>
                      <div className="relative w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div
                          className={`absolute left-0 top-0 h-full rounded-full transition-all duration-500 ease-out bg-${item.color}-500`}
                          style={{ 
                            width: `${metrics.applicantStats.total > 0 
                              ? (item.count / metrics.applicantStats.total) * 100 
                              : 0}%`
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  No application data available
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;