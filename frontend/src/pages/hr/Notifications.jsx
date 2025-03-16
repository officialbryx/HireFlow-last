import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { notificationsApi } from '../../services/api/notificationsApi';
import { formatDistanceToNow } from 'date-fns';
import { BellIcon, CheckCircleIcon, TrashIcon, CheckIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import HRNavbar from '../../components/HRNavbar';
import { useQuery } from '@tanstack/react-query';

const ITEMS_PER_PAGE = 10;

const Notifications = () => {
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);

  const { 
    data: notificationsData, 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['notifications', page],
    queryFn: () => notificationsApi.getNotifications({ 
      page, 
      pageSize: ITEMS_PER_PAGE 
    }),
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    cacheTime: 1000 * 60 * 30, // Cache for 30 minutes
  });

  useEffect(() => {
    // Use the API for subscription
    const channel = notificationsApi.subscribeToNotifications(() => {
      refetch();
    });

    return () => {
      notificationsApi.unsubscribeFromChannel(channel);
    };
  }, [refetch]);

  const notifications = notificationsData?.data || [];
  const totalPages = Math.ceil((notificationsData?.total || 0) / ITEMS_PER_PAGE);

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read;
    if (filter === 'read') return notification.read;
    return true;
  });

  // Add pagination controls component
  const PaginationControls = () => (
    <div className="px-6 py-4 border-t border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <p className="text-sm text-gray-700">
            Showing{' '}
            <span className="font-medium">{((page - 1) * ITEMS_PER_PAGE) + 1}</span>
            {' '}-{' '}
            <span className="font-medium">
              {Math.min(page * ITEMS_PER_PAGE, notificationsData?.total || 0)}
            </span>
            {' '}of{' '}
            <span className="font-medium">{notificationsData?.total || 0}</span>
            {' '}results
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className={`
              inline-flex items-center px-3 py-1.5 rounded-md text-sm
              ${page === 1 
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-gray-700 hover:bg-gray-50'}
            `}
          >
            <ChevronLeftIcon className="h-5 w-5 mr-1" />
            Previous
          </button>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className={`
              inline-flex items-center px-3 py-1.5 rounded-md text-sm
              ${page >= totalPages 
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-gray-700 hover:bg-gray-50'}
            `}
          >
            Next
            <ChevronRightIcon className="h-5 w-5 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );

  const formatDate = (date) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.read);
      await Promise.all(
        unreadNotifications.map(notification => 
          notificationsApi.markAsRead(notification.id)
        )
      );
      await refetch();
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const handleToggleRead = async (e, notificationId, currentReadStatus) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation(); // Prevent event bubbling
    
    try {
      await notificationsApi.toggleReadStatus(notificationId, currentReadStatus);
      // Refresh notifications list after toggle
      await refetch();
    } catch (error) {
      console.error('Error toggling notification status:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <HRNavbar />
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow-lg rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <BellIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h1 className="text-xl font-semibold text-gray-900">
                    Notifications
                  </h1>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <select
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      className="appearance-none bg-white pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="all">All notifications</option>
                      <option value="unread">Unread only</option>
                      <option value="read">Read only</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  <button
                    onClick={handleMarkAllAsRead}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors duration-150"
                  >
                    <CheckCircleIcon className="h-5 w-5 mr-1.5" />
                    Mark all as read
                  </button>
                </div>
              </div>
            </div>
            
            {isLoading ? (
              <div className="px-4 py-12 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="px-6 py-12 text-center text-red-600">
                Error loading notifications
              </div>
            ) : filteredNotifications.length > 0 ? (
              <>
                <div className="divide-y divide-gray-100">
                  {filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="block transition-colors duration-150 hover:bg-gray-50 relative group"
                    >
                      <Link
                        to={`/hr/jobs/${notification.job_posting_id}`}
                        className="block"
                      >
                        <div className="px-6 py-4">
                          <div className="flex items-start justify-between space-x-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2">
                                <p className="text-sm font-medium text-gray-900">
                                  {notification.job_posting?.company_name}
                                </p>
                                {!notification.read && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    New
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mt-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {formatDate(notification.created_at)}
                              </p>
                            </div>
                            <button
                              onClick={(e) => handleToggleRead(e, notification.id, notification.read)}
                              className={`
                                opacity-0 group-hover:opacity-100 transition-opacity
                                inline-flex items-center px-2 py-1 rounded-md text-xs
                                ${notification.read 
                                  ? 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                                  : 'text-blue-600 hover:text-blue-800 hover:bg-blue-50'}
                              `}
                            >
                              <CheckIcon className="h-4 w-4 mr-1" />
                              {notification.read ? 'Mark as unread' : 'Mark as read'}
                            </button>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
                <PaginationControls />
              </>
            ) : (
              <div className="px-6 py-12 text-center">
                <div className="flex flex-col items-center">
                  <BellIcon className="h-12 w-12 text-gray-300 mb-4" />
                  <p className="text-gray-500 text-sm">
                    {filter === 'all' 
                      ? 'No notifications found' 
                      : `No ${filter} notifications`}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;