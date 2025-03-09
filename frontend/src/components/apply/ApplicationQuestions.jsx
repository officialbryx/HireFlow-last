import React from "react";
import {
  QuestionMarkCircleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";

const FormSection = ({ title, children }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
    <div className="space-y-4">
      {title && (
        <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-100 pb-2">
          {title}
        </h3>
      )}
      {children}
    </div>
  </div>
);

const ApplicationQuestionsValidator = {
  validate: (formData, setFieldErrors) => {
    const errors = {};

    // Check all questions are answered
    Object.entries(formData.applicationQuestions).forEach(([key, value]) => {
      if (value !== "yes" && value !== "no") {
        errors[`applicationQuestions.${key}`] = "Please select Yes or No";
      }
    });

    if (setFieldErrors) {
      setFieldErrors(errors);
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },
};

const QuestionItem = ({ question, value, onChange, required, error }) => (
  <div
    className={`p-4 bg-gray-50 rounded-lg border ${
      error ? "border-red-300" : "border-gray-200"
    } hover:border-gray-300 transition-colors duration-200`}
  >
    <div className="flex items-start space-x-3">
      <QuestionMarkCircleIcon
        className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
          error ? "text-red-500" : "text-blue-500"
        }`}
      />
      <div className="flex-1 space-y-2">
        <label
          className={`block text-sm font-medium ${
            error ? "text-red-700" : "text-gray-700"
          }`}
        >
          {question}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <select
          value={value || ""}
          onChange={onChange}
          className={`w-full px-3 py-2 rounded-lg border transition-colors duration-200 bg-white shadow-sm ${
            error
              ? "border-red-500 ring-1 ring-red-500 focus:ring-red-500 focus:border-red-500"
              : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          }`}
          required={required}
        >
          <option value="">Select your answer</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
        {error && (
          <p className="text-sm text-red-500 mt-1 flex items-center">
            <span className="mr-1">⚠</span>
            {error}
          </p>
        )}
      </div>
    </div>
  </div>
);

const ApplicationQuestions = ({
  formData,
  setFormData,
  fieldErrors,
  setFieldErrors,
}) => {
  // Initialize application questions if they don't exist
  React.useEffect(() => {
    if (!formData.applicationQuestions) {
      setFormData((prev) => ({
        ...prev,
        applicationQuestions: {
          previouslyProcessed: "",
          previouslyProcessedWithCompany: "",
          directlyEmployed: "",
          relativesInCompany: "",
          relativesInIndustry: "",
          currentEmployerBond: "",
          nonCompete: "",
          filipinoCitizen: "",
          internationalStudies: "",
          applyVisa: "",
        },
      }));
    }
  }, []);

  const handleChange = (field, value) => {
    // Clear error when field changes
    if (setFieldErrors) {
      setFieldErrors((prev) => ({
        ...prev,
        [`applicationQuestions.${field}`]: undefined,
      }));
    }

    setFormData((prev) => ({
      ...prev,
      applicationQuestions: {
        ...prev.applicationQuestions,
        [field]: value,
      },
    }));
  };

  const questions = [
    {
      id: "previouslyProcessed",
      text: "Have you been previously employed by {company} (If you are a current employee, please apply on the Workday site instead)*",
    },
    {
      id: "previouslyProcessedWithCompany",
      text: "Was your application previously processed with {company}?*",
    },
    {
      id: "directlyEmployed",
      text: "Have you been directly employed by Globe, any of the Globe subsidiaries or other Ayala companies?*",
    },
    {
      id: "relativesInCompany",
      text: "Do you have relatives working with {company}, any of the {company} subsidiaries, or other companies?*",
    },
    {
      id: "relativesInIndustry",
      text: "Do you have any relatives working with other related industry companies?*",
    },
    {
      id: "currentEmployerBond",
      text: "Do you have a bond with your current employer?*",
    },
    {
      id: "nonCompete",
      text: "Do you have a non-compete clause?*",
    },
    {
      id: "filipinoCitizen",
      text: "Are you a Filipino / dual Filipino citizen?*",
    },
    {
      id: "internationalStudies",
      text: "Are you / will you be undergoing international studies?*",
    },
    {
      id: "applyVisa",
      text: "Are you applying for a VISA?*",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Info Banner */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
        <div className="flex">
          <div className="flex-shrink-0">
            <InformationCircleIcon className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              Please answer all required questions marked with (
              <span className="text-red-500">*</span>)
            </p>
          </div>
        </div>
      </div>

      {/* Questions Form */}
      <FormSection title="Application Questions">
        <div className="space-y-4">
          {questions.map(({ id, text }) => (
            <QuestionItem
              key={id}
              question={text}
              value={formData.applicationQuestions[id]}
              onChange={(e) => handleChange(id, e.target.value)}
              required={text.includes("*")}
              error={fieldErrors && fieldErrors[`applicationQuestions.${id}`]}
            />
          ))}
        </div>
      </FormSection>

      {/* Additional Information */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
        <div className="flex">
          <div className="flex-shrink-0">
            <InformationCircleIcon className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              Your honest responses help us better understand your background
              and ensure compliance with our policies.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

ApplicationQuestions.validator = ApplicationQuestionsValidator;
export default ApplicationQuestions;
