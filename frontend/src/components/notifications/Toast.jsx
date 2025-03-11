import React from 'react';

const Toast = ({ show, type, message }) => {
  if (!show) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`rounded-lg shadow-lg p-4 ${
        type === 'success' 
          ? 'bg-green-100 border-l-4 border-green-500' 
          : 'bg-red-100 border-l-4 border-red-500'
      }`}>
        <div className="flex items-center">
          {type === 'success' ? (
            <svg className="h-6 w-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="h-6 w-6 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          <p className={`text-sm font-medium ${
            type === 'success' ? 'text-green-800' : 'text-red-800'
          }`}>
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Toast;