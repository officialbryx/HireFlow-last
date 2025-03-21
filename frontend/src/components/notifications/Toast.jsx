import React from 'react';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  XMarkIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

const Toast = ({ show, type, message }) => {
  if (!show) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="h-5 w-5 text-green-400" />;
      case 'error':
        return <ExclamationCircleIcon className="h-5 w-5 text-red-400" />;
      case 'warning':
        return <ExclamationCircleIcon className="h-5 w-5 text-yellow-400" />;
      case 'info':
      default:
        return <InformationCircleIcon className="h-5 w-5 text-blue-400" />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50';
      case 'error':
        return 'bg-red-50';
      case 'warning':
        return 'bg-yellow-50';
      case 'info':
      default:
        return 'bg-blue-50';
    }
  };

  const getTextColor = () => {
    switch (type) {
      case 'success':
        return 'text-green-800';
      case 'error':
        return 'text-red-800';
      case 'warning':
        return 'text-yellow-800';
      case 'info':
      default:
        return 'text-blue-800';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className={`rounded-md p-4 flex items-center shadow-lg ${getBackgroundColor()}`}>
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        <div className={`ml-3 ${getTextColor()}`}>
          <p className="text-sm font-medium">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default Toast;