import React from "react";
import {
  UserIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  GlobeAltIcon,
  QuestionMarkCircleIcon,
  ClipboardDocumentCheckIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

const ReviewSection = ({ icon, title, children }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
    <div className="flex items-center space-x-3 mb-4 pb-2 border-b border-gray-100">
      {icon}
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
    </div>
    <div className="space-y-4">{children}</div>
  </div>
);

const ReviewItem = ({ label, value }) => (
  <div className="flex flex-col sm:flex-row sm:items-center py-2">
    <span className="text-sm font-medium text-gray-500 sm:w-1/3">{label}:</span>
    <span className="text-sm text-gray-900 sm:w-2/3">
      {value || "Not provided"}
    </span>
  </div>
);

const Review = ({ formData }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-r-lg">
        <div className="flex">
          <div className="flex-shrink-0">
            <ClipboardDocumentCheckIcon className="h-5 w-5 text-emerald-400" />
          </div>
          <div className="ml-3">
            <h2 className="text-lg font-medium text-emerald-800">
              Application Review
            </h2>
            <p className="text-sm text-emerald-700 mt-1">
              Please review all information carefully before submitting your
              application.
            </p>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <ReviewSection
        icon={<UserIcon className="h-6 w-6 text-blue-500" />}
        title="Personal Information"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ReviewItem
            label="Full Name"
            value={`${formData.givenName} ${formData.middleName} ${formData.familyName} ${formData.suffix}`.trim()}
          />
          <ReviewItem label="Email" value={formData.email} />
          <ReviewItem
            label="Phone"
            value={`${formData.phoneCode} ${formData.phoneNumber}`}
          />
          <ReviewItem
            label="Address"
            value={`${formData.street}${
              formData.additionalAddress
                ? `, ${formData.additionalAddress}`
                : ""
            }, ${formData.city}, ${formData.province}, ${formData.postalCode}`}
          />
        </div>
      </ReviewSection>

      {/* Work Experience */}
      <ReviewSection
        icon={<BriefcaseIcon className="h-6 w-6 text-blue-500" />}
        title="Work Experience"
      >
        {formData.noWorkExperience ? (
          <div className="text-gray-500 italic">No work experience</div>
        ) : (
          <div className="space-y-6">
            {formData.workExperience.map((exp, index) => (
              <div
                key={index}
                className="bg-gray-50 p-4 rounded-lg border border-gray-200"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ReviewItem label="Job Title" value={exp.jobTitle} />
                  <ReviewItem label="Company" value={exp.company} />
                  <ReviewItem label="Location" value={exp.location} />
                  <ReviewItem
                    label="Duration"
                    value={`${exp.fromDate} - ${
                      exp.currentWork ? "Present" : exp.toDate
                    }`}
                  />
                </div>
                <div className="mt-4">
                  <span className="text-sm font-medium text-gray-500">
                    Description:
                  </span>
                  <p className="mt-1 text-sm text-gray-900 whitespace-pre-line">
                    {exp.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </ReviewSection>

      {/* Education */}
      <ReviewSection
        icon={<AcademicCapIcon className="h-6 w-6 text-blue-500" />}
        title="Education"
      >
        <div className="space-y-6">
          {formData.education.map((edu, index) => (
            <div
              key={index}
              className="bg-gray-50 p-4 rounded-lg border border-gray-200"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ReviewItem label="School" value={edu.school} />
                <ReviewItem label="Degree" value={edu.degree} />
                <ReviewItem label="Field of Study" value={edu.fieldOfStudy} />
                <ReviewItem label="GPA" value={edu.gpa} />
                <ReviewItem
                  label="Duration"
                  value={`${edu.fromYear} - ${edu.toYear}`}
                />
              </div>
            </div>
          ))}
        </div>
      </ReviewSection>

      {/* Skills */}
      <ReviewSection
        icon={<DocumentTextIcon className="h-6 w-6 text-blue-500" />}
        title="Skills"
      >
        <div className="flex flex-wrap gap-2">
          {formData.skills.map((skill, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700"
            >
              {skill}
            </span>
          ))}
        </div>
      </ReviewSection>

      {/* Resume */}
      <ReviewSection
        icon={<DocumentTextIcon className="h-6 w-6 text-blue-500" />}
        title="Resume/CV"
      >
        <div className="flex items-center space-x-2 text-sm">
          <DocumentTextIcon className="h-5 w-5 text-gray-400" />
          <span>
            {formData.resume ? formData.resume.name : "No file uploaded"}
          </span>
        </div>
      </ReviewSection>

      {/* Online Presence */}
      <ReviewSection
        icon={<GlobeAltIcon className="h-6 w-6 text-blue-500" />}
        title="Online Presence"
      >
        <div className="space-y-4">
          {formData.websites?.map((website, index) => (
            <ReviewItem
              key={index}
              label={`Website ${index + 1}`}
              value={website.url}
            />
          ))}
          <ReviewItem label="LinkedIn Profile" value={formData.linkedinUrl} />
        </div>
      </ReviewSection>

      {/* Application Questions */}
      <ReviewSection
        icon={<QuestionMarkCircleIcon className="h-6 w-6 text-blue-500" />}
        title="Application Questions"
      >
        <div className="space-y-4">
          {Object.entries(formData.applicationQuestions).map(([key, value]) => (
            <div key={key} className="flex items-start space-x-2">
              <CheckCircleIcon
                className={`h-5 w-5 ${
                  value === "yes" ? "text-emerald-500" : "text-gray-400"
                }`}
              />
              <div>
                <p className="text-sm font-medium text-gray-700">
                  {key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}
                </p>
                <p className="text-sm text-gray-500">
                  {value === "yes" ? "Yes" : "No"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ReviewSection>

      {/* Terms Acceptance */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <div className="flex items-center space-x-2">
          <CheckCircleIcon
            className={`h-5 w-5 ${
              formData.termsAccepted ? "text-emerald-500" : "text-gray-400"
            }`}
          />
          <span className="text-sm text-gray-700">
            Terms and Conditions accepted
          </span>
        </div>
      </div>

      {/* Footer Note */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
        <p className="text-sm text-yellow-700">
          By submitting this application, you confirm that all provided
          information is accurate and complete.
        </p>
      </div>
    </div>
  );
};

export default Review;
