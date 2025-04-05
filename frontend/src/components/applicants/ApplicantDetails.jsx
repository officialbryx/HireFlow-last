import { useState } from "react";
import { UserIcon } from "@heroicons/react/24/outline";
import { PersonalInfo } from "./sections/PersonalInfo";
import { WorkExperience } from "./sections/WorkExperience";
import { Education } from "./sections/Education";
import { SkillsAndPresence } from "./sections/SkillsAndPresence";
import { ScreeningQuestions } from "./sections/ScreeningQuestions";
import StatusControls from "./StatusControls";
import { applicationsApi } from "../../services/api/applicationsApi";
import { useToast } from "../../hooks/useToast";
import { EvaluateJobs } from "./sections/EvaluateJobs";

const ApplicantDetails = ({
  selectedApplicant,
  activeTab,
  setActiveTab,
  analysis,
  getBadgeColor,
  formatDate,
  onApplicantUpdated,
}) => {
  const { showToast } = useToast();
  const [isShortlisting, setIsShortlisting] = useState(false);
  const [justUpdated, setJustUpdated] = useState(false);

  if (!selectedApplicant) {
    return (
      <div className="w-2/3 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-[calc(100vh-50px)] flex items-center justify-center text-gray-400">
        <div className="text-center p-8">
          <UserIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>Select an applicant to view details</p>
        </div>
      </div>
    );
  }

  const {
    id,
    personal_info = {},
    contact_info = {},
    address = {},
    work_experience = [],
    previous_employment = {},
    education = [],
    skills = [],
    company,
    resume_url,
    websites = [],
    linkedin_url,
    application_questions = {},
    created_at,
    status,
  } = selectedApplicant;

  const tabs = [
    { id: "details", label: "Applicant Details" },
    { id: "evaluate", label: "Evaluate Resume" },
    { id: "screening", label: "Screening Questions" },
  ];

  const handleResumeClick = () => {
    if (resume_url) {
      window.open(resume_url, "_blank");
    }
  };

  const handleShortlistToggle = async () => {
    if (!id) return;

    try {
      setIsShortlisting(true);

      const newShortlistedStatus = !selectedApplicant.shortlisted;

      await applicationsApi.updateApplicantShortlist(id, newShortlistedStatus);

      if (onApplicantUpdated) {
        onApplicantUpdated(id, {
          shortlisted: newShortlistedStatus,
        });
      }

      setJustUpdated(true);
      setTimeout(() => setJustUpdated(false), 1500);

      showToast(
        "success",
        newShortlistedStatus
          ? "Candidate added to shortlist"
          : "Candidate removed from shortlist"
      );
    } catch (error) {
      console.error("Error updating shortlist status:", error);
      showToast("error", "Failed to update shortlist status");
    } finally {
      setIsShortlisting(false);
    }
  };

  return (
    <div className="w-2/3 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-[calc(100vh-50px)] flex flex-col">
      <div className="p-6 flex-shrink-0">
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">
              {personal_info.given_name} {personal_info.family_name}
            </h2>
            <p className="text-gray-600">
              Applied for:{" "}
              <span className="font-medium">
                {selectedApplicant.job_title || "Unknown position"}
              </span>{" "}
              at <span className="font-medium">{company}</span>
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
              {selectedApplicant?.shortlisted && (
                <span
                  className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 ${
                    justUpdated ? "animate-pulse" : ""
                  }`}
                >
                  Shortlisted
                </span>
              )}
              <button
                onClick={handleShortlistToggle}
                disabled={isShortlisting}
                className={`ml-2 px-2 py-1 text-xs rounded-md flex items-center ${
                  isShortlisting
                    ? "bg-gray-200 text-gray-500"
                    : selectedApplicant.shortlisted
                    ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border border-yellow-300"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-300"
                }`}
              >
                {isShortlisting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-3 w-3 text-gray-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Updating...
                  </>
                ) : selectedApplicant.shortlisted ? (
                  "Remove from Shortlist"
                ) : (
                  "Add to Shortlist"
                )}
              </button>
            </div>

            <StatusControls
              applicantId={id}
              jobId={selectedApplicant.job_posting_id}
              applicantUserId={selectedApplicant.user_id}
              currentStatus={status}
              jobTitle={company}
              onStatusUpdated={onApplicantUpdated}
              getBadgeColor={getBadgeColor}
            />
          </div>
          {resume_url && (
            <button
              onClick={handleResumeClick}
              className="ml-4 inline-flex items-center px-4 py-2 border border-blue-300 shadow-sm text-sm font-medium rounded-md text-blue-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 whitespace-nowrap"
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
        ) : activeTab === "evaluate" ? (
          <EvaluateJobs
            selectedApplicant={selectedApplicant}
            resume_url={resume_url}
          />
        ) : (
          <ScreeningQuestions questions={application_questions} />
        )}
      </div>
    </div>
  );
};

export default ApplicantDetails;
