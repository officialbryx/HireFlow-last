import React, { useState } from "react";
import ApplicationQuestions from "../components/apply/ApplicationQuestions";
import MyExperience from "../components/apply/MyExperience";
import MyInformation from "../components/apply/MyInformation";
import Review from "../components/apply/Review";
import VoluntaryDisclosures from "../components/apply/VoluntaryDisclosures";
import { CheckIcon } from "@heroicons/react/24/solid"; // Import CheckIcon

const stages = [
  { id: 1, name: "My Information" },
  { id: 2, name: "My Experience" },
  { id: 3, name: "Application Questions" },
  { id: 4, name: "Voluntary Disclosures" },
  { id: 5, name: "Review" },
];

const Apply = () => {
  const [currentStage, setCurrentStage] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Information
    previouslyEmployed: false,
    country: "",
    givenName: "",
    middleName: "",
    familyName: "",
    suffix: "",
    street: "",
    additionalAddress: "",
    postalCode: "",
    city: "",
    province: "",
    email: "",
    phoneType: "",
    phoneCode: "",
    phoneNumber: "",

    // Experience
    workExperience: [
      {
        jobTitle: "",
        company: "",
        location: "",
        currentWork: false,
        fromDate: "",
        toDate: "",
        description: "",
      },
    ],
    noWorkExperience: false,
    education: [
      {
        school: "",
        degree: "",
        fieldOfStudy: "",
        gpa: "",
        fromYear: "",
        toYear: "",
      },
    ],
    skills: [],
    resume: null,
    websites: [""],
    linkedin: "",

    // Application Questions
    applicationQuestions: {
      previouslyProcessed: false,
      directlyEmployed: false,
      relativesInCompany: false,
      relativesInIndustry: false,
      currentEmployerBond: false,
      nonCompete: false,
      filipinoCitizen: false,
      internationalStudies: false,
    },

    // Terms
    termsAccepted: false,
  });

  const renderStageIndicator = () => (
    <div className="mb-8">
      <div className="flex justify-between items-center relative">
        {/* Connecting line that sits behind the circles */}
        <div className="absolute top-4 left-0 right-0 h-1 bg-gray-300" />

        {/* Circles and labels */}
        <div className="relative flex justify-between w-full">
          {stages.map((stage) => (
            <div key={stage.id} className="flex flex-col items-center">
              <div
                className={`rounded-full h-8 w-8 flex items-center justify-center border-2
                ${
                  currentStage > stage.id
                    ? "border-green-600 bg-green-600" // Completed stage
                    : currentStage === stage.id
                    ? "border-green-600 bg-white" // Current stage
                    : "border-gray-400 bg-white" // Future stage
                }`}
              >
                {currentStage > stage.id ? (
                  <CheckIcon className="h-5 w-5 text-white" />
                ) : (
                  <span
                    className={
                      currentStage === stage.id
                        ? "text-green-600"
                        : "text-gray-400"
                    }
                  >
                    {stage.id}
                  </span>
                )}
              </div>
              <span
                className={`mt-2 text-sm text-center whitespace-nowrap
                ${
                  currentStage >= stage.id ? "text-green-600" : "text-gray-400"
                }`}
              >
                {stage.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const handleSaveAndContinue = () => {
    // Validate current stage
    // Save data
    setCurrentStage((prev) => Math.min(prev + 1, stages.length));
  };

  const renderCurrentStage = () => {
    switch (currentStage) {
      case 1:
        return <MyInformation formData={formData} setFormData={setFormData} />;
      case 2:
        return <MyExperience formData={formData} setFormData={setFormData} />;
      case 3:
        return (
          <ApplicationQuestions formData={formData} setFormData={setFormData} />
        );
      case 4:
        return (
          <VoluntaryDisclosures formData={formData} setFormData={setFormData} />
        );
      case 5:
        return <Review formData={formData} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow p-8 max-w-4xl mx-auto">
          {renderStageIndicator()}
          {renderCurrentStage()}

          <div className="mt-8 flex justify-between">
            {currentStage > 1 && (
              <button
                onClick={() => setCurrentStage((prev) => prev - 1)}
                className="px-6 py-2 border border-gray-300 rounded-md"
              >
                Back
              </button>
            )}
            <button
              onClick={handleSaveAndContinue}
              className="ml-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {currentStage === stages.length
                ? "Submit Application"
                : "Save & Continue"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Apply;
