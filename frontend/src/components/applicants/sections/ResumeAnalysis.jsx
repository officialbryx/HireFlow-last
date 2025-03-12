import { 
  DocumentTextIcon, 
  CheckCircleIcon, 
  ExclamationCircleIcon,
  LightBulbIcon,
  ClipboardIcon
} from "@heroicons/react/24/outline";

const AnalysisSection = ({ title, children, icon: Icon }) => (
  <div className="mb-6 last:mb-0">
    <h4 className="font-medium text-gray-700 mb-3 flex items-center">
      {Icon && <Icon className="h-5 w-5 mr-2 text-gray-500" />}
      {title}
    </h4>
    {children}
  </div>
);

const MatchItem = ({ label, match, description }) => (
  <div className="flex items-start gap-2 mb-2 last:mb-0">
    {match ? (
      <CheckCircleIcon className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
    ) : (
      <ExclamationCircleIcon className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
    )}
    <div>
      <p className="font-medium text-gray-700">{label}</p>
      {description && <p className="text-sm text-gray-600">{description}</p>}
    </div>
  </div>
);

const renderMatchRate = (rate) => {
  const percentage = Math.round(rate * 100);
  return (
    <div className="flex items-center">
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full ${
            percentage >= 70 ? "bg-emerald-600" : "bg-amber-500"
          }`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <span className="ml-2 text-sm font-medium">{percentage}%</span>
    </div>
  );
};

export const ResumeAnalysis = ({ analysis = null, handleViewResume }) => {
  // Show empty state if no analysis data
  if (!analysis) {
    return (
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div className="text-center text-gray-500">
          <DocumentTextIcon className="h-8 w-8 mx-auto mb-2" />
          <p>No resume analysis available</p>
        </div>
      </div>
    );
  }

  // Destructure with default values to prevent mapping errors
  const {
    skillsMatch = 0,
    experienceMatch = 0,
    educationMatch = 0,
    extractedSkills = [],
    relevantSkills = [],
    keyInsights = [],
    recommendations = []
  } = analysis;

  // Ensure arrays are actually arrays
  const safeExtractedSkills = Array.isArray(extractedSkills) ? extractedSkills : [];
  const safeRelevantSkills = Array.isArray(relevantSkills) ? relevantSkills : [];
  const safeKeyInsights = Array.isArray(keyInsights) ? keyInsights : [];
  const safeRecommendations = Array.isArray(recommendations) ? recommendations : [];

  return (
    <div className="space-y-8">
      {/* Resume & Analysis */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex justify-between items-start mb-6">
          <h3 className="font-semibold text-lg text-gray-800 flex items-center">
            <ClipboardIcon className="h-5 w-5 mr-2 text-gray-500" />
            Resume Analysis
          </h3>

          {handleViewResume && (
            <button
              onClick={handleViewResume}
              className="flex items-center gap-2 px-4 py-2 border border-blue-600 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors text-sm"
            >
              <DocumentTextIcon className="h-4 w-4" />
              View Resume
            </button>
          )}
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="text-sm text-gray-600 block mb-2">Overall Match</label>
            {renderMatchRate((skillsMatch + experienceMatch + educationMatch) / 3)}
          </div>

          <div className="grid grid-cols-3 gap-6 pt-4 border-t">
            <div>
              <label className="text-sm text-gray-600 block mb-2">Skills Match</label>
              {renderMatchRate(skillsMatch)}
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-2">Experience Match</label>
              {renderMatchRate(experienceMatch)}
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-2">Education Match</label>
              {renderMatchRate(educationMatch)}
            </div>
          </div>

          {safeKeyInsights.length > 0 && (
            <div className="pt-4 border-t">
              <h4 className="font-medium text-gray-700 mb-2">Key Insights</h4>
              <ul className="list-disc pl-5 space-y-1 text-gray-600">
                {safeKeyInsights.map((insight, idx) => (
                  <li key={idx}>{insight}</li>
                ))}
              </ul>
            </div>
          )}

          {safeRecommendations.length > 0 && (
            <div className="pt-4 border-t">
              <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                <LightBulbIcon className="h-5 w-5 mr-2 text-gray-500" />
                Recommendations
              </h4>
              <div className="bg-blue-50 p-4 rounded-lg">
                <ul className="list-disc list-inside space-y-2 text-sm text-blue-700">
                  {safeRecommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Skills Detected Section */}
      {safeExtractedSkills.length > 0 && (
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="font-semibold text-lg mb-4 text-gray-800">Skills Detected in Resume</h3>
          <div className="flex flex-wrap gap-2">
            {safeExtractedSkills.map((skill, index) => (
              <span
                key={index}
                className={`px-3 py-1 rounded-full text-sm ${
                  safeRelevantSkills.includes(skill)
                    ? "bg-green-50 text-green-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};