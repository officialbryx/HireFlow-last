import { useState, useRef, useEffect } from 'react';
import { BellIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { mockNotifications } from '../../data/mockNotifications';

const NotificationsDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const displayedNotifications = mockNotifications.slice(0, 7); // Limit to 7 items

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex flex-col items-center text-gray-500 hover:text-black relative"
      >
        <div className="flex items-center justify-center">
          <BellIcon className="h-5 w-5" />
          {mockNotifications.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              {mockNotifications.length}
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
                <Link
                  key={notification.id}
                  to={`/hr/jobs/${notification.jobId}`}
                  className="block px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-0"
                >
                  <div className="flex items-start">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {notification.jobTitle}
                      </p>
                      <p className="text-sm text-gray-500">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                    {!notification.read && (
                      <span className="h-2 w-2 bg-blue-500 rounded-full"></span>
                    )}
                  </div>
                </Link>
              ))
            ) : (
              <div className="px-4 py-6 text-center">
                <p className="text-sm text-gray-500">No new notifications</p>
              </div>
            )}
          </div>

          <div className="px-4 py-2 border-t border-gray-200">
            <Link
              to="/hr/notifications"
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              View all notifications ({mockNotifications.length})
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsDropdown;