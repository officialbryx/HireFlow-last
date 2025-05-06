export const FilterBar = ({ showFilters, filters, setFilters }) => {
  const handleResetFilters = () => {
    setFilters({
      minimumSkillMatch: 0,
      minimumOverallMatch: 0,
      evaluatedOnly: false,
      shortlistedOnly: false
    });
  };

  // Add console log to debug filter changes
  const handleFilterChange = (key, value) => {
    console.log('Updating filter:', key, value);
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div
      className={`transition-all duration-300 ease-in-out overflow-hidden border-b border-gray-200 
                  ${showFilters ? "max-h-96 opacity-100 py-4" : "max-h-0 opacity-0 py-0"}`}
    >
      <div className="px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* First Column */}
        <div className="space-y-4">
          {/* Skills Match Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Minimum Skill Match
            </label>
            <div className="flex items-center">
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={filters.minimumSkillMatch}
                onChange={(e) =>
                  handleFilterChange('minimumSkillMatch', parseInt(e.target.value))
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <span className="ml-3 text-sm font-medium text-gray-700 min-w-[40px]">
                {filters.minimumSkillMatch}%
              </span>
            </div>
          </div>

          {/* Shortlisted Toggle */}
          <div>
            <label className="relative inline-flex items-center cursor-pointer mt-4">
              <input
                type="checkbox"
                checked={filters.shortlistedOnly}
                onChange={(e) =>
                  handleFilterChange('shortlistedOnly', e.target.checked)
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 
                            peer-focus:ring-blue-300 rounded-full peer 
                            peer-checked:after:translate-x-full peer-checked:after:border-white 
                            after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                            after:bg-white after:border-gray-300 after:border after:rounded-full 
                            after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600">
              </div>
              <span className="ml-3 text-sm font-medium text-gray-700">
                Show shortlisted only
              </span>
            </label>
          </div>
        </div>

        {/* Second Column */}
        <div className="space-y-4">
          {/* Overall Match Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Minimum Overall Match
            </label>
            <div className="flex items-center">
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={filters.minimumOverallMatch}
                onChange={(e) =>
                  handleFilterChange('minimumOverallMatch', parseInt(e.target.value))
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <span className="ml-3 text-sm font-medium text-gray-700 min-w-[40px]">
                {filters.minimumOverallMatch}%
              </span>
            </div>
          </div>
        </div>

        {/* Third Column */}
        <div className="space-y-4">
          {/* Evaluated Toggle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Evaluation Status
            </label>
            <div className="flex items-center">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.evaluatedOnly}
                  onChange={(e) =>
                    handleFilterChange('evaluatedOnly', e.target.checked)
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 
                              peer-focus:ring-blue-300 rounded-full peer 
                              peer-checked:after:translate-x-full peer-checked:after:border-white 
                              after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                              after:bg-white after:border-gray-300 after:border after:rounded-full 
                              after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600">
                </div>
                <span className="ml-3 text-sm font-medium text-gray-700">
                  Show evaluated candidates only
                </span>
              </label>
            </div>
          </div>

          {/* Reset Filters Button */}
          <div className="flex justify-end mt-4">
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm 
                       text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Reset Filters
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};