import {
  ChevronRightIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CalendarIcon,
  UserCircleIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  ChartBarIcon,
  ClockIcon,
  MapPinIcon,
  BuildingOfficeIcon,
} from "@heroicons/react/24/outline";
import Avatar from "../../../common/Avatar";
import { getQualityIndicator } from "../utils/rankingUtils";
import { useNavigate } from 'react-router-dom';

const formatEducationDate = (dateString) => {
  if (!dateString) return '';
  
  // Check if the date is in MM/YYYY format
  const parts = dateString.split('/');
  if (parts.length === 2) {
    const month = parts[0];
    const year = parts[1];
    return year; // Return just the year
  }
  
  // Fallback to full date parsing if not in MM/YYYY format
  const date = new Date(dateString);
  return !isNaN(date) ? date.getFullYear() : '';
};

export const CandidateCard = ({
  candidate,
  index,
  isExpanded,
  onToggle,
  onMoveUp,
  onMoveDown,
  batchProcessing,
  onBatchSelect,
  isSelectedForBatch,
  totalCandidates,
}) => {
  const navigate = useNavigate();

  const handleViewProfile = (e) => {
    e.stopPropagation();
    navigate(`/hr/jobs?tab=applicants&applicationId=${candidate.id}`);
  };

  return (
    <div className="border rounded-xl bg-white border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
      {/* Main Row (Always visible) */}
      <div
        className={`grid grid-cols-12 gap-3 items-center p-4 cursor-pointer ${
          isExpanded
            ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200"
            : "hover:bg-gray-50"
        }`}
        onClick={() => onToggle(candidate.id)}
      >
        {/* Batch Processing Checkbox */}
        {batchProcessing && (
          <div className="col-span-1 flex items-center justify-center">
            <input
              type="checkbox"
              checked={isSelectedForBatch}
              onChange={(e) => {
                e.stopPropagation();
                onBatchSelect(candidate.id, e.target.checked);
              }}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}

        {/* Rank Badge */}
        <div className="col-span-1 flex items-center">
          <div className="relative">
            <span className="inline-flex items-center justify-center h-9 w-9 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 text-gray-800 font-bold shadow-inner border border-gray-300">
              {candidate.rank}
            </span>
            {candidate.rank <= 3 && (
              <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-yellow-400 border-2 border-white flex items-center justify-center">
                <span className="text-white text-xs font-bold">★</span>
              </span>
            )}
          </div>
          <div className="ml-2 flex flex-col">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMoveUp(index);
              }}
              disabled={index === 0}
              className={`p-1 rounded-full ${
                index === 0
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-500 hover:text-blue-600 hover:bg-blue-50"
              }`}
            >
              <ArrowUpIcon className="h-3 w-3" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMoveDown(index);
              }}
              disabled={index === totalCandidates - 1}
              className={`p-1 rounded-full ${
                index === totalCandidates - 1
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-500 hover:text-blue-600 hover:bg-blue-50"
              }`}
            >
              <ArrowDownIcon className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Candidate Info */}
        <div className="col-span-5 flex items-center">
          <div className="flex-shrink-0 relative">
            <Avatar
              name={`${candidate.personal_info?.given_name || ""} ${
                candidate.personal_info?.family_name || ""
              }`}
              size={12}
              className="border-2 border-white shadow"
            />
            {candidate.matchScore >= 85 && (
              <span className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-green-500 border-2 border-white flex items-center justify-center">
                <span className="text-white text-xs font-bold">✓</span>
              </span>
            )}
          </div>
          <div className="ml-4 flex-grow">
            <h3 className="text-sm font-medium text-gray-900 flex items-center group">
              {candidate.personal_info?.given_name || ""}{" "}
              {candidate.personal_info?.family_name || ""}
              <ChevronRightIcon
                className={`h-5 w-5 ml-1 text-gray-400 transform transition-transform duration-300 ease-in-out group-hover:text-blue-500 ${
                  isExpanded ? "rotate-90" : ""
                }`}
              />
            </h3>
            <p className="text-xs text-gray-500">
              {candidate.email || candidate.personal_info?.email || ""}
            </p>
            <div className="mt-1 flex flex-wrap gap-1">
              {candidate.work_experience && candidate.work_experience[0] && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {candidate.work_experience[0].job_title || "Professional"}
                </span>
              )}
              {candidate.education && candidate.education[0] && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {candidate.education[0].degree || "Degree"}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Match Score */}
        <div className="col-span-2">
          <div className="flex items-center">
            {!candidate.evaluated ? (
              <div className="text-sm text-gray-500">Not evaluated yet</div>
            ) : (
              <>
                <div
                  className={`h-12 w-12 rounded-full flex items-center justify-center text-white font-bold ${getQualityIndicator(
                    candidate.matchScore
                  )}`}
                >
                  {candidate.matchScore}%
                </div>
                <div className="ml-2">
                  <div className="text-xs font-medium text-gray-500">MATCH</div>
                  <div className="text-xs text-gray-400">Score</div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Skills Match */}
        <div className="col-span-2">
          <div className="flex flex-col">
            <div className="flex items-center mb-1">
              <div className="text-sm font-medium text-gray-700">
                {candidate.skillMatch}% match
              </div>
              {candidate.skillMatch >= 80 && (
                <span className="ml-1 inline-block px-1.5 py-0.5 text-xs bg-green-100 text-green-800 rounded">
                  High
                </span>
              )}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
              <div
                className={`h-2.5 rounded-full transition-all duration-500 ease-in-out ${
                  candidate.skillMatch >= 80
                    ? "bg-gradient-to-r from-green-500 to-emerald-400"
                    : candidate.skillMatch >= 60
                    ? "bg-gradient-to-r from-blue-500 to-cyan-400"
                    : "bg-gradient-to-r from-amber-500 to-yellow-400"
                }`}
                style={{ width: `${candidate.skillMatch}%` }}
              ></div>
            </div>
            {candidate.skills && candidate.skills.length > 0 && (
              <div className="mt-1 flex flex-wrap gap-1">
                {candidate.skills.slice(0, 2).map((skill, idx) => (
                  <span key={idx} className="text-xs text-gray-500">
                    {skill}
                    {idx < Math.min(2, candidate.skills.length) - 1 ? ", " : ""}
                  </span>
                ))}
                {candidate.skills.length > 2 && (
                  <span className="text-xs text-blue-500">
                    +{candidate.skills.length - 2}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="col-span-2 text-right">
          <button
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
            onClick={handleViewProfile}
          >
            View Profile
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-5 bg-white border-t border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <EducationSection education={candidate.education} />
            <ExperienceSection workExperience={candidate.work_experience} />
            <SkillsAnalysisSection
              skills={candidate.skills}
              skillMatch={candidate.skillMatch}
              matchScore={candidate.matchScore}
            />
          </div>
          {/* Action Buttons */}
          <div className="mt-5 flex justify-end space-x-3 border-t border-gray-200 pt-3">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200">
              View Full Profile
            </button>
            <button className="inline-flex items-center px-4 py-2 shadow-sm text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200">
              <CalendarIcon className="h-4 w-4 mr-1.5" />
              Schedule Interview
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const EducationSection = ({ education = [] }) => {
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-gray-900 flex items-center">
        <AcademicCapIcon className="h-5 w-5 mr-2 text-blue-500" />
        Education
      </h4>
      <div className="space-y-3">
        {education && education.length > 0 ? (
          education.map((edu, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-3">
              <div className="text-sm font-medium text-gray-900">
                {edu.degree || "Degree"}
              </div>
              <div className="text-sm text-gray-600">
                {edu.school || "Institution"}
              </div>
              <div className="mt-1 flex items-center text-xs text-gray-500">
                <ClockIcon className="h-4 w-4 mr-1" />
                {edu.from_year && (
                  <span>
                    {formatEducationDate(edu.from_year)} -{" "}
                    {edu.to_year ? formatEducationDate(edu.to_year) : "Present"}
                  </span>
                )}
              </div>
              {edu.field_of_study && (
                <div className="mt-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                    {edu.field_of_study}
                  </span>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500 italic">
            No education details available
          </p>
        )}
      </div>
    </div>
  );
};

const ExperienceSection = ({ workExperience = [] }) => {
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-gray-900 flex items-center">
        <BriefcaseIcon className="h-5 w-5 mr-2 text-blue-500" />
        Work Experience
      </h4>
      <div className="space-y-3">
        {workExperience && workExperience.length > 0 ? (
          workExperience.map((exp, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-3">
              <div className="text-sm font-medium text-gray-900">
                {exp.job_title || "Position"}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <BuildingOfficeIcon className="h-4 w-4 mr-1" />
                {exp.company || "Company"}
              </div>
              <div className="mt-1 flex items-center space-x-3 text-xs text-gray-500">
                <span className="flex items-center">
                  <ClockIcon className="h-4 w-4 mr-1" />
                  {exp.start_date && (
                    <span>
                      {new Date(exp.start_date).getFullYear()} -{" "}
                      {exp.end_date
                        ? new Date(exp.end_date).getFullYear()
                        : "Present"}
                    </span>
                  )}
                </span>
                {exp.location && (
                  <span className="flex items-center">
                    <MapPinIcon className="h-4 w-4 mr-1" />
                    {exp.location}
                  </span>
                )}
              </div>
              {exp.responsibilities && (
                <p className="mt-2 text-xs text-gray-600 line-clamp-2">
                  {exp.responsibilities}
                </p>
              )}
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500 italic">
            No work experience available
          </p>
        )}
      </div>
    </div>
  );
};

const SkillsAnalysisSection = ({
  skills = [],
  skillMatch,
  matchScore
}) => {
    const scores = [
        { 
          label: "Overall Match", 
          value: matchScore, // Use matchScore prop instead of candidate.matchScore
          color: getQualityIndicator(matchScore).replace('bg-', '')
        },
        { 
          label: "Skills Match", 
          value: skillMatch, 
          color: skillMatch >= 80 ? 'green' : skillMatch >= 60 ? 'blue' : 'amber'
        }
      ];

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-gray-900 flex items-center">
        <ChartBarIcon className="h-5 w-5 mr-2 text-blue-500" />
        Match Analysis
      </h4>
      <div className="space-y-4">
        {/* Score Bars */}
        <div className="space-y-3">
          {scores.map((score, index) => (
            <div key={index} className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium text-gray-700">{score.label}</span>
                <div className="flex items-center">
                  <span className="text-gray-600">{score.value}%</span>
                  {score.value >= 80 && (
                    <span className="ml-1.5 px-1.5 py-0.5 text-xs bg-green-100 text-green-800 rounded">
                      High
                    </span>
                  )}
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full transition-all duration-500 ${
                    score.value >= 80
                      ? "bg-gradient-to-r from-green-500 to-emerald-400"
                      : score.value >= 60
                      ? "bg-gradient-to-r from-blue-500 to-cyan-400"
                      : "bg-gradient-to-r from-amber-500 to-yellow-400"
                  }`}
                  style={{ width: `${score.value}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Skills Tags */}
        <div className="pt-3 border-t border-gray-200">
          <div className="text-xs font-medium text-gray-700 mb-2">
            Identified Skills
          </div>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
              >
                {skill}
              </span>
            ))}
            {skills.length === 0 && (
              <p className="text-sm text-gray-500 italic">No skills identified</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
