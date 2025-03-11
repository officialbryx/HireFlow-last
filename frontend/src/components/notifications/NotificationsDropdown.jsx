import { useState, useRef, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient'; // Adjust the path as necessary
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

    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications'
        },
        () => {
          fetchNotifications();
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await notificationsApi.getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (e, notificationId) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation(); // Prevent event bubbling
    try {
      await notificationsApi.markAsRead(notificationId);
      await fetchNotifications(); // Refresh notifications
    } catch (error) {
      console.error('Error marking notification as read:', error);
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

  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.read).length;

  // Get recent notifications, sorted by date
  const displayedNotifications = notifications
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 7);

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
          <div className="px-4 py-2 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                Mark all as read
              </button>
            )}
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
                    to={`/hr/jobs/${notification.job_posting_id}`}
                    className="block"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {notification.job_posting?.job_title}
                        </p>
                        <p className="text-sm text-gray-500">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatDate(notification.created_at)}
                        </p>
                      </div>
                      {!notification.read && (
                        <button
                          onClick={(e) => handleMarkAsRead(e, notification.id)}
                          className="text-xs text-blue-600 hover:text-blue-800 ml-2"
                        >
                          Mark as read
                        </button>
                      )}
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

          <div className="px-4 py-2 border-t border-gray-200">
            <Link
              to="/hr/notifications"
              onClick={() => setIsOpen(false)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              View all notifications ({unreadCount} unread)
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsDropdown;