import { Link } from 'react-router-dom';
import HRNavbar from '../../components/HRNavbar';
import { mockNotifications } from '../../data/mockNotifications';

const Notifications = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <HRNavbar />
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h1 className="text-xl font-semibold text-gray-900">
                All Notifications
              </h1>
            </div>
            
            <div className="divide-y divide-gray-200">
              {mockNotifications.map((notification) => (
                <Link
                  key={notification.id}
                  to={`/hr/jobs/${notification.jobId}`}
                  className="block hover:bg-gray-50"
                >
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-start">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {notification.jobTitle}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                      </div>
                      {!notification.read && (
                        <span className="h-2 w-2 bg-blue-500 rounded-full mt-2"></span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;