import { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { BriefcaseIcon, FunnelIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import Navbar from '../../components/Navbar';
import { useQuery } from '@tanstack/react-query';
import { applicationsApi } from '../../services/api/applicationsApi';

const ITEMS_PER_PAGE = 10;

const MyApplications = () => {
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [searchParams] = useSearchParams();
  const highlightedAppId = searchParams.get('highlight');
  const highlightedRowRef = useRef(null);

  const { 
    data: applicationsData, 
    isLoading, 
    error
  } = useQuery({
    queryKey: ['my-applications', page, filter],
    queryFn: () => applicationsApi.getMyApplications({ 
      page, 
      pageSize: ITEMS_PER_PAGE,
      status: filter !== 'all' ? filter : undefined
    }),
    staleTime: 1000 * 60 * 5,
  });

  const applications = useMemo(() => applicationsData?.data || [], [applicationsData]);
  const totalPages = Math.ceil((applicationsData?.total || 0) / ITEMS_PER_PAGE);

  useEffect(() => {
    if (highlightedAppId && highlightedRowRef.current) {
      // Scroll to the highlighted application with a slight delay to ensure rendering
      setTimeout(() => {
        highlightedRowRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }, [highlightedAppId, applications]);

  // Add this function to detect archived job postings
  const isJobArchived = (application) => {
    return application?.job_posting?.status === 'archived' 
  };
  console.log('Application data:', applications);
  // Add this near the console.log statement already in the file
console.log('Job archived check:', {
    is_archived: applications?.job_posting?.is_archived,
    archived: applications?.job_posting?.archived,
    status: applications?.job_posting?.status,
    active: applications?.job_posting?.active
  });

  // Add function to detect withdrawn applications
  const isWithdrawn = (application) => {
    return application.status === 'withdrawn';
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'accepted':
        return 'bg-green-100 text-green-800 border border-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 border border-red-300';
      case 'shortlisted':
        return 'bg-blue-100 text-blue-800 border border-blue-300';
      case 'interview':
        return 'bg-purple-100 text-purple-800 border border-purple-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white shadow-lg rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <BriefcaseIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h1 className="text-xl font-semibold text-gray-900">
                    My Applications
                  </h1>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <select
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      className="appearance-none bg-white pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="all">All applications</option>
                      <option value="pending">Pending review</option>
                      <option value="shortlisted">Shortlisted</option>
                      <option value="interview">Interview stage</option>
                      <option value="accepted">Accepted</option>
                      <option value="rejected">Rejected</option>
                      <option value="withdrawn">Withdrawn</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                      <FunnelIcon className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {isLoading ? (
              <div className="px-4 py-12 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="px-6 py-12 text-center text-red-600">
                Error loading your applications
              </div>
            ) : applications.length > 0 ? (
              <>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Job Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Company
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Applied Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Update
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {applications.map((application) => (
                      <tr 
                        key={application.id} 
                        ref={application.id === highlightedAppId ? highlightedRowRef : null}
                        className={`hover:bg-gray-50 ${
                          application.id === highlightedAppId ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                        } ${isJobArchived(application) || isWithdrawn(application) ? 'bg-gray-50' : ''}`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div 
                              className={`text-sm font-medium truncate max-w-[220px] ${isJobArchived(application) || isWithdrawn(application) ? 'text-gray-500' : 'text-gray-900'}`}
                              title={application.job_posting?.job_title} // Show full title on hover
                            >
                              {application.job_posting?.job_title}
                            </div>
                            {isJobArchived(application) && (
                              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                Archived
                              </span>
                            )}
                            {isWithdrawn(application) && (
                              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                                Withdrawn
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm ${isJobArchived(application) || isWithdrawn(application) ? 'text-gray-400' : 'text-gray-500'}`}>
                            {application.job_posting?.company_name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            isJobArchived(application) 
                              ? 'bg-gray-100 text-gray-600 border border-gray-200' 
                              : isWithdrawn(application)
                                ? 'bg-slate-100 text-slate-600 border border-slate-200'
                                : getStatusBadge(application.status)
                          }`}>
                            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                            {isJobArchived(application)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDistanceToNow(new Date(application.created_at), { addSuffix: true })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDistanceToNow(new Date(application.updated_at), { addSuffix: true })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link 
                            to={`/applications/${application.id}`} 
                            className={`${isJobArchived(application) || isWithdrawn(application) ? 'text-gray-400 hover:text-gray-600' : 'text-blue-600 hover:text-blue-900'}`}
                          >
                            View Details
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                <div className="px-6 py-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-700">
                      Showing {((page - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(page * ITEMS_PER_PAGE, applicationsData?.total || 0)} of {applicationsData?.total || 0} applications
                    </p>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm ${page === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'}`}
                      >
                        <ChevronLeftIcon className="h-5 w-5 mr-1" />
                        Previous
                      </button>
                      <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page >= totalPages}
                        className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm ${page >= totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'}`}
                      >
                        Next
                        <ChevronRightIcon className="h-5 w-5 ml-1" />
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="px-6 py-12 text-center">
                <div className="flex flex-col items-center">
                  <BriefcaseIcon className="h-12 w-12 text-gray-300 mb-4" />
                  <p className="text-gray-500 text-sm">
                    {filter === 'all' 
                      ? 'You haven\'t applied to any jobs yet' 
                      : `No applications with status: ${filter}`}
                  </p>
                  <Link
                    to="/jobposts"
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Find Jobs to Apply
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyApplications;