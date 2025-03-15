import { UserIcon } from "@heroicons/react/24/outline";
import { PersonalInfo } from "./sections/PersonalInfo";
import { WorkExperience } from "./sections/WorkExperience";
import { Education } from "./sections/Education";
import { SkillsAndPresence } from "./sections/SkillsAndPresence";
import { ResumeAnalysis } from "./sections/ResumeAnalysis";
import { ScreeningQuestions } from "./sections/ScreeningQuestions";
import { applicationsApi } from "../../services/api/applicationsApi";

const ApplicantDetails = ({
  selectedApplicant,
  activeTab,
  setActiveTab,
  analysis,
  getBadgeColor,
  formatDate,
  setShowPdfModal,
}) => {
  if (!selectedApplicant) {
    return (
      <div className="w-2/3 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <UserIcon className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="font-medium text-lg text-gray-700 mb-1">
            No Applicant Selected
          </h3>
          <p className="text-gray-500">
            Select an applicant from the list to view their details
          </p>
        </div>
      </div>
    );
  }

  const {
    personal_info = {},
    contact_info = {},
    address = {},
    work_experience = [],
    education = [],
    skills = [],
    websites = [],
    linkedin_url,
    previous_employment = {},
    company,
    status,
    created_at,
    resume_url,
    application_questions = {},
  } = selectedApplicant;

  const tabs = [
    { id: "details", label: "Applicant Details" },
    { id: "resume", label: "Resume Analysis" },
    { id: "questions", label: "Screening Questions" },
  ];

  const handleResumeClick = () => {
    if (selectedApplicant?.resume_url) {
      const resumeUrl = applicationsApi.getResumeUrl(
        selectedApplicant.resume_url
      );
      window.open(resumeUrl, "_blank");
    }
  };

  return (
    <div className="w-2/3 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-[calc(100vh-50px)] flex flex-col">
      <div className="p-6 flex-shrink-0">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {personal_info.given_name} {personal_info.family_name}
            </h2>
            <p className="text-gray-600">
              Applied to: <span className="font-medium">{company}</span>
            </p>
            <div className="flex items-center mt-1 text-sm text-gray-500">
              <span>Applied on {formatDate(created_at)}</span>
              <span className="mx-2">•</span>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${getBadgeColor(
                  status
                )}`}
              >
                {status?.charAt(0).toUpperCase() + status?.slice(1) ||
                  "Pending"}
              </span>
            </div>
          </div>
          {resume_url && (
            <button
              onClick={handleResumeClick}
              className="inline-flex items-center px-3 py-2 border border-blue-300 shadow-sm text-sm leading-4 font-medium rounded-md text-blue-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              View Resume
            </button>
          )}
        </div>

        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap px-1 py-4 text-sm font-medium ${
                  activeTab === tab.id
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6">
        {activeTab === "details" ? (
          <div className="space-y-6">
            <PersonalInfo
              personalInfo={personal_info}
              contactInfo={contact_info}
              address={address}
            />
            <WorkExperience
              workExperience={work_experience}
              previousEmployment={previous_employment}
              formatDate={formatDate}
              company={company}
            />
            <Education education={education} formatDate={formatDate} />
            <SkillsAndPresence
              skills={skills}
              linkedinUrl={linkedin_url}
              websites={websites}
            />
          </div>
        ) : activeTab === "resume" ? (
          <ResumeAnalysis
            analysis={analysis}
            handleViewResume={resume_url ? handleResumeClick : null}
          />
        ) : (
          <ScreeningQuestions questions={application_questions} />
        )}
      </div>
    </div>
  );
};

export default ApplicantDetails;
