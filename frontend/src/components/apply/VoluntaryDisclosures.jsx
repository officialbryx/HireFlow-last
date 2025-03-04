import React from "react";
import { DocumentTextIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";

const VoluntaryDisclosures = ({ formData, setFormData }) => {
  const handleAcceptTerms = () => {
    setFormData((prev) => ({
      ...prev,
      termsAccepted: !prev.termsAccepted,
    }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center space-x-3 mb-4">
          <DocumentTextIcon className="h-8 w-8 text-blue-500" />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Terms and Conditions
            </h2>
            <p className="text-gray-500 mt-1">
              Please review our privacy notice carefully
            </p>
          </div>
        </div>
      </div>

      {/* Privacy Notice Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <ShieldCheckIcon className="h-6 w-6 text-blue-500 mr-2" />
          RECRUITMENT PRIVACY NOTICE
        </h3>

        {/* Notice Content */}
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-sm space-y-6 max-h-[32rem] overflow-y-auto custom-scrollbar">
          <p className="font-medium text-gray-900">
            I signify and understand that:
          </p>

          <ol className="list-decimal pl-6 space-y-4">
            <li className="text-gray-700">
              My information will be collected and processed for the following
              purposes:
              <ul className="list-disc pl-6 mt-3 space-y-3">
                {/* List items with improved styling */}
                <li className="text-gray-600">
                  <span className="font-medium text-gray-900">
                    Basic Identifiers and Contact Information
                  </span>
                  <p className="mt-1">
                    To verify my identity and determine my legal eligibility to
                    enter into and formalize an employment contract within the
                    requirements of the law.
                  </p>
                </li>
                <li className="text-gray-600">
                  <span className="font-medium text-gray-900">
                    Assessment of Requisite Skills
                  </span>
                  <p className="mt-1">
                    To determine whether I possess the requisite skills for the
                    position I am applying for.
                  </p>
                </li>
                <li className="text-gray-600">
                  <span className="font-medium text-gray-900">
                    Financial Records
                  </span>
                  <p className="mt-1">
                    To process and manage my compensation and benefits,
                    including loan and insurance coverage entitlements, should
                    my application be successful.
                  </p>
                </li>
                <li className="text-gray-600">
                  <span className="font-medium text-gray-900">
                    Administrative Records
                  </span>
                  <p className="mt-1">
                    Records on disciplinary matters, grievances, queries and
                    complaints, absences, and termination of employment or
                    engagement (including provision of references) during my
                    employment, should my application be successful.
                  </p>
                </li>
                <li className="text-gray-600">
                  <span className="font-medium text-gray-900">
                    Other Technical Information
                  </span>
                  <p className="mt-1">
                    To monitor my compliance with the company’s Acceptable Use
                    Policy among other policies and to optimize network and
                    system performance, should my application be successful.
                  </p>
                </li>
                <li className="text-gray-600">
                  <span className="font-medium text-gray-900">
                    Company-Generated Information
                  </span>
                  <p className="mt-1">
                    Identification information, access credentials, performance
                    metrics, learning and developmental progress, and
                    closed-circuit television footage at the workplace, and work
                    assignment records as part of workforce management and
                    development.
                  </p>
                </li>
              </ul>
            </li>
            <li className="text-gray-700">
              Should my application be successful, my Basic Identifiers and
              Contact Information as well as Company-Generated Information may
              be shared with the company for the purpose of enabling contact and
              collaboration subject to proper documentation.
            </li>
            <li className="text-gray-700">
              The processing of my data may be outsourced or contracted to
              external parties, even without my further consent, to fulfill any
              of the purposes described above including the verification of the
              existence, truthfulness, and/or accuracy of the information I will
              provide and in compliance with government requirements.
            </li>
            <li className="text-gray-700">
              My data may be analyzed for internal consumption and reporting.
            </li>
            <li className="text-gray-700">
              My information will be protected and retained in accordance with
              the Data Privacy Act of 2012 and the Privacy Policy of the company
              that I am applying to.
            </li>
          </ol>

          <div className="border-t border-gray-200 pt-4">
            <p className="font-medium text-gray-900 mb-3">
              I specifically provide my consent for the collection and
              processing of my information for the following purposes:
            </p>
            <ol className="list-decimal pl-6 space-y-3 text-gray-600">
              <li>
                {" "}
                Sensitive personal identifiable information to further verify my
                identity and to determine my legal eligibility to enter into and
                formalize an employment contract within the requirements of the
                law;{" "}
              </li>
              <li>
                {" "}
                Information regarding my educational and employment background
                included in my curriculum vitae and/or resume to determine
                whether I am qualified for the position I am applying for;{" "}
              </li>
              <li>
                {" "}
                Government-issued identification to comply with existing
                employment-related laws and regulations;{" "}
              </li>
              <li>
                {" "}
                Administrative, civil, and/or criminal cases and other
                government clearances to determine if my employment may
                compromise the company’s ethical standards;{" "}
              </li>
              <li>
                {" "}
                Information that I may have disclosed of relevant individuals
                and/or external parties, who I have notified and obtained the
                consent of, in relation to this application.{" "}
              </li>
            </ol>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mt-6">
            <p className="text-sm text-blue-700">
              I understand that I may withhold my consent or later on withdraw
              it at any time. Without such consent, however, the company will
              not be able to continue with my application or employment.
            </p>
          </div>
        </div>

        {/* Terms Acceptance */}
        <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <label className="flex items-start space-x-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={formData.termsAccepted}
              onChange={handleAcceptTerms}
              className="mt-1 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 transition-colors cursor-pointer"
              required
            />
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-900 group-hover:text-gray-700 transition-colors">
                I have read and understood the foregoing
                <span className="text-red-500 ml-1">*</span>
              </p>
              <p className="text-xs text-gray-500">
                By checking this box, you agree to our privacy notice and
                consent to the processing of your information.
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Additional Information */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-yellow-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              Please ensure you have read and understood all terms before
              accepting.
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e0;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a0aec0;
        }
      `}</style>
    </div>
  );
};

export default VoluntaryDisclosures;
