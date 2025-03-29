import { useState, useRef, useEffect } from 'react';
import { BellIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { notificationsApi } from '../../services/api/notificationsApi';
import { formatDistanceToNow, parseISO } from 'date-fns';

const NotificationsDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchNotifications();

    // Use the API for subscription
    const channel = notificationsApi.subscribeToNotifications(() => {
      fetchNotifications();
    });

    return () => {
      notificationsApi.unsubscribeFromChannel(channel);
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await notificationsApi.getNotifications();
      // Make sure we're setting an array
      setNotifications(response?.data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      // Get all unread notification IDs
      const unreadNotifications = notifications.filter(n => !n.read);
      
      // Mark each notification as read
      await Promise.all(
        unreadNotifications.map(notification => 
          notificationsApi.markAsRead(notification.id)
        )
      );
      
      // Refresh notifications
      await fetchNotifications();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const formatDate = (date) => {
    try {
      const parsedDate = parseISO(date);
      return formatDistanceToNow(parsedDate, { addSuffix: true });
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Invalid date';
    }
  };

  // Ensure we're working with an array before filtering
  const notificationsList = Array.isArray(notifications) ? notifications : [];
  
  // Calculate unread count
  const unreadCount = notificationsList.filter(n => !n.read).length;

  // Get recent notifications, sorted by date
  const displayedNotifications = notificationsList
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex flex-col items-center text-gray-500 hover:text-black relative"
      >
        <div className="flex items-center justify-center">
          <BellIcon className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </div>
        <span className="text-xs mt-1">Notifications</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-50">
          <div className="px-4 py-2 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {displayedNotifications.length > 0 ? (
              displayedNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`block px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-0 ${
                    notification.read ? 'bg-gray-50' : ''
                  }`}
                >
                  <Link
                    to={`/hr/jobs?tab=applicants&jobId=${notification.job_posting_id}`}
                    onClick={() => {
                      if (!notification.read) {
                        notificationsApi.markAsRead(notification.id);
                      }
                    }}
                    className="block"
                  >
                    <div className="flex items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-medium text-gray-900">
                            {notification.job_posting?.company_name}
                          </p>
                          {!notification.read && (
                            <span className="h-2 w-2 bg-blue-500 rounded-full"></span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatDate(notification.created_at)}
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))
            ) : (
              <div className="px-4 py-6 text-center text-gray-500">
                <p className="text-sm">No notifications</p>
              </div>
            )}
          </div>

          <div className="px-4 py-2 border-t border-gray-200 flex items-center justify-between">
            <Link
              to="/hr/notifications"
              onClick={() => setIsOpen(false)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              View all ({unreadCount} unread)
            </Link>
            <button
              onClick={handleMarkAllAsRead}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Mark all read
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsDropdown;