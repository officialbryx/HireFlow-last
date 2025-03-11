import React from 'react';

const StatCard = ({ title, value, icon: Icon, change, changeType, subtitle }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 transition-all duration-200 hover:shadow-md hover:translate-y-[-2px] border border-gray-100">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
              <Icon className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          </div>
          <div className="flex items-baseline space-x-3">
            <span className="text-2xl font-bold text-gray-900">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </span>
            {change !== undefined && (
              <span className={`
                inline-flex items-center text-sm font-medium px-2.5 py-0.5 rounded-full
                ${changeType === 'increase' 
                  ? 'bg-green-50 text-green-700' 
                  : 'bg-red-50 text-red-700'}
              `}>
                {changeType === 'increase' ? '↑' : '↓'} {Math.abs(change)}%
              </span>
            )}
          </div>
          {subtitle && (
            <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
          )}
        </div>
        {/* Optional decorative element */}
        <div className="hidden sm:block w-16 h-16 opacity-10">
          <Icon className="w-full h-full text-blue-600" />
        </div>
      </div>
      
      {/* Optional progress or sparkline chart can be added here */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Previous: {(value * 0.9).toFixed(0)}</span>
          <span className="text-blue-600 hover:text-blue-700 cursor-pointer">
            View Details →
          </span>
        </div>
      </div>
    </div>
  );
};

export default StatCard;