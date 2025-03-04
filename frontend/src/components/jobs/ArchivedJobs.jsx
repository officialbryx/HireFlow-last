import React from 'react';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

const ArchivedJobs = ({ archivedJobs, handleRestore }) => {
  return (
    <div className="max-w-7xl mx-auto py-6">
      <h2 className="text-xl font-semibold mb-4">Archived Job Postings</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {archivedJobs.map((job) => (
          <div
            key={job.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow opacity-75"
          >
            {/* Same job card content as ViewJobs */}
            <div className="bg-gray-50 px-6 py-3 flex justify-end">
              <button
                onClick={() => handleRestore(job.id)}
                className="text-gray-600 hover:text-green-600 transition-colors flex items-center gap-2"
              >
                <ArrowPathIcon className="h-5 w-5" />
                <span>Restore</span>
              </button>
            </div>
          </div>
        ))}
        
        {archivedJobs.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 text-lg">No archived jobs found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArchivedJobs;