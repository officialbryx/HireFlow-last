import { useState, useRef, useEffect } from "react";
import { BellIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { notificationsApi } from "../../services/api/notificationsApi";
import { formatDistanceToNow, parseISO } from "date-fns";

const JobseekerNotificationsDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchNotifications();

    // Subscribe to real-time updates
    const channel = notificationsApi.subscribeToNotifications(() => {
      fetchNotifications();
    });

    // Handle clicks outside dropdown to close it
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      notificationsApi.unsubscribeFromChannel(channel);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await notificationsApi.getNotifications({
        page: 1,
        pageSize: 5,
      });
      setNotifications(response?.data || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter((n) => !n.read);
      await Promise.all(
        unreadNotifications.map((notification) =>
          notificationsApi.markAsRead(notification.id)
        )
      );
      await fetchNotifications();
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const formatDate = (date) => {
    try {
      const parsedDate = parseISO(date);
      return formatDistanceToNow(parsedDate, { addSuffix: true });
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Invalid date";
    }
  };

  const getNotificationTypeColor = (type) => {
    switch (type) {
      case "accepted":
        return "bg-green-500";
      case "pending":
        return "bg-amber-500";
      case "rejected":
        return "bg-red-500";
      case "shortlisted":
        return "bg-blue-500";
      case "interview":
        return "bg-purple-500"; // New purple color for interviews
      case "status_change":
        return "bg-blue-400"; // Light blue for status changes
      default:
        return "bg-gray-500";
    }
  };

  const notificationsList = Array.isArray(notifications) ? notifications : [];
  const unreadCount = notificationsList.filter((n) => !n.read).length;
  const displayedNotifications = notificationsList;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Match this button to NavItem styling */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex flex-col items-center px-1 py-2 text-gray-500 hover:text-black"
      >
        <div className="relative flex items-center justify-center">
          <BellIcon className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-4 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </div>
        <span className="text-xs mt-1 font-medium">Notifications</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-50">
          <div className="px-4 py-2 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900">
              My Application Updates
            </h3>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {displayedNotifications.length > 0 ? (
              displayedNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`block px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-0 ${
                    notification.read ? "bg-gray-50" : ""
                  }`}
                >
                  <Link
                    to={`/applications/${notification.application_id}`}
                    className="block"
                    onClick={() => {
                      if (!notification.read) {
                        notificationsApi.markAsRead(notification.id);
                      }
                    }}
                  >
                    <div className="flex items-start">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">
                            {notification.job_posting?.job_title}
                          </p>
                          {notification.type && (
                            <span
                              className={`text-xs px-2 py-1 rounded-full text-white ${getNotificationTypeColor(
                                notification.type
                              )}`}
                            >
                              {notification.type}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {notification.message}
                        </p>
                        <div className="flex justify-between items-center mt-2">
                          <p className="text-xs text-gray-400">
                            {notification.job_posting?.company_name}
                          </p>
                          <p className="text-xs text-gray-400">
                            {formatDate(notification.created_at)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))
            ) : (
              <div className="px-4 py-6 text-center text-gray-500">
                <p className="text-sm">No application updates</p>
              </div>
            )}
          </div>

          <div className="px-4 py-2 border-t border-gray-200 flex items-center justify-between">
            <Link
              to="/applications/notifications" // Change from "/applications/history"
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

export default JobseekerNotificationsDropdown;
