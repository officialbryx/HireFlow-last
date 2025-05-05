export const FilterBar = ({ showFilters, filters, setFilters }) => {
  return (
    <div
      className={`transition-all duration-300 ease-in-out overflow-hidden border-b border-gray-200 
                  ${showFilters ? "max-h-96 opacity-100 py-4" : "max-h-0 opacity-0 py-0"}`}
    >
      <div className="px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* First Column */}
        <div className="space-y-4">
          {/* Existing Skill Match Filter */}
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
                  setFilters({
                    ...filters,
                    minimumSkillMatch: parseInt(e.target.value),
                  })
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <span className="ml-3 text-sm font-medium text-gray-700 min-w-[40px]">
                {filters.minimumSkillMatch}%
              </span>
            </div>
          </div>

          {/* New Overall Match Filter */}
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
                value={filters.minimumOverallMatch || 0}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    minimumOverallMatch: parseInt(e.target.value),
                  })
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <span className="ml-3 text-sm font-medium text-gray-700 min-w-[40px]">
                {filters.minimumOverallMatch || 0}%
              </span>
            </div>
          </div>
        </div>

        {/* Second Column */}
        <div className="space-y-4">
          {/* Updated Education Level Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Education Level
            </label>
            <select
              value={filters.educationLevel}
              onChange={(e) =>
                setFilters({ ...filters, educationLevel: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 
                        text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                        appearance-none bg-white"
            >
              <option value="any">Any Level</option>
              <option value="bachelor">Bachelor's Degree</option>
              <option value="master">Master's Degree</option>
            </select>
          </div>

          {/* Updated Field of Study Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Field of Study
            </label>
            <input
              type="text"
              value={filters.fieldOfStudy || ''}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  fieldOfStudy: e.target.value,
                })
              }
              placeholder="e.g. CS, IT, Computer Science"
              className="w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 
                      text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Third Column */}
        <div className="space-y-4">
          {/* Toggle Filters */}
          <div className="flex flex-col space-y-3 pt-6">
            {/* Existing Shortlisted Toggle */}
            <label className="flex items-center cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={filters.shortlisted}
                  onChange={(e) =>
                    setFilters({ ...filters, shortlisted: e.target.checked })
                  }
                />
                <div
                  className={`w-10 h-5 rounded-full shadow-inner transition-all duration-300 ease-in-out ${
                    filters.shortlisted
                      ? "bg-gradient-to-r from-blue-500 to-indigo-500"
                      : "bg-gray-200"
                  }`}
                ></div>
                <div
                  className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full shadow-md transition-all duration-300 ease-in-out ${
                    filters.shortlisted
                      ? "transform translate-x-5 bg-white ring-2 ring-blue-300"
                      : "bg-white"
                  }`}
                ></div>
              </div>
              <div
                className={`ml-3 font-medium transition-colors duration-300 ${
                  filters.shortlisted ? "text-blue-700" : "text-gray-700"
                }`}
              >
                Shortlisted Only
              </div>
            </label>

            {/* New Experience Toggle */}
            <label className="flex items-center cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={filters.hasWorkExperience || false}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      hasWorkExperience: e.target.checked,
                    })
                  }
                />
                <div
                  className={`w-10 h-5 rounded-full shadow-inner transition-all duration-300 ease-in-out ${
                    filters.hasWorkExperience
                      ? "bg-gradient-to-r from-blue-500 to-indigo-500"
                      : "bg-gray-200"
                  }`}
                ></div>
                <div
                  className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full shadow-md transition-all duration-300 ease-in-out ${
                    filters.hasWorkExperience
                      ? "transform translate-x-5 bg-white ring-2 ring-blue-300"
                      : "bg-white"
                  }`}
                ></div>
              </div>
              <div
                className={`ml-3 font-medium transition-colors duration-300 ${
                  filters.hasWorkExperience ? "text-blue-700" : "text-gray-700"
                }`}
              >
                Has Work Experience
              </div>
            </label>

            {/* Reset Button */}
            <button
              onClick={() =>
                setFilters({
                  shortlisted: false,
                  minimumSkillMatch: 0,
                  minimumOverallMatch: 0,
                  educationLevel: "any",
                  fieldOfStudy: "",
                  hasWorkExperience: false,
                })
              }
              className="ml-auto text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};