import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ApplicationQuestions from "../components/apply/ApplicationQuestions";
import MyExperience from "../components/apply/MyExperience";
import MyInformation from "../components/apply/MyInformation";
import Review from "../components/apply/Review";
import VoluntaryDisclosures from "../components/apply/VoluntaryDisclosures";
import {
  CheckIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/solid";
import { api } from "../services/api";
import { supabase } from "../services/supabaseClient";

const stages = [
  { id: 1, name: "My Information" },
  { id: 2, name: "My Experience" },
  { id: 3, name: "Application Questions" },
  { id: 4, name: "Voluntary Disclosures" },
  { id: 5, name: "Review" },
];

const Apply = () => {
  const { company, jobId } = useParams(); // Add jobId parameter
  const navigate = useNavigate();
  const [currentStage, setCurrentStage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

    // Application Questions - Initialize all as empty strings to trigger validation
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
      applyVisa: "", // Changed from false to empty string
    },

    // Terms
    termsAccepted: false,
  });
  const [fieldErrors, setFieldErrors] = useState({});

  const renderStageIndicator = () => (
    <div className="mb-12">
      <div className="flex justify-between items-center relative">
        {/* Connecting line that sits behind the circles */}
        <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200" />

        {/* Circles and labels */}
        <div className="relative flex justify-between w-full">
          {stages.map((stage) => (
            <div key={stage.id} className="flex flex-col items-center">
              <div
                className={`rounded-full h-9 w-9 flex items-center justify-center border-2 shadow-sm transition-all duration-300
                ${
                  currentStage > stage.id
                    ? "border-emerald-600 bg-emerald-600" // Completed stage
                    : currentStage === stage.id
                    ? "border-emerald-600 bg-white ring-4 ring-emerald-100" // Current stage
                    : "border-gray-300 bg-white" // Future stage
                }`}
              >
                {currentStage > stage.id ? (
                  <CheckIcon className="h-5 w-5 text-white" />
                ) : (
                  <span
                    className={`font-medium
                    ${
                      currentStage === stage.id
                        ? "text-emerald-600"
                        : "text-gray-500"
                    }`}
                  >
                    {stage.id}
                  </span>
                )}
              </div>
              <span
                className={`mt-3 text-sm font-medium text-center whitespace-nowrap transition-colors
                ${
                  currentStage > stage.id
                    ? "text-emerald-600"
                    : currentStage === stage.id
                    ? "text-emerald-700"
                    : "text-gray-500"
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
    // Clear previous errors
    setFieldErrors({});

    let isValid = true;

    // Stage-specific validation
    if (currentStage === 4) {
      const validation = VoluntaryDisclosures.validator.validate(
        formData,
        setFieldErrors
      );
      isValid = validation.isValid;
    }

    // Final stage validation
    if (currentStage === stages.length) {
      isValid = validateApplication();
      if (!isValid) {
        setErrorMessage('Please fill in all required fields');
        setShowErrorModal(true);
        return;
      }
    }

    if (!isValid) {
      // Show an alert or notification
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Continue with stage progression if validation passes
    setCurrentStage((prev) => Math.min(prev + 1, stages.length));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmitApplication = async () => {
    try {
      setIsSubmitting(true);

      // Format the application data to match the table structure
      const applicationData = {
        job_posting_id: jobId,
        company: company,
        personal_info: {
          given_name: formData.givenName,
          middle_name: formData.middleName,
          family_name: formData.familyName,
          suffix: formData.suffix
        },
        contact_info: {
          email: formData.email,
          phone_type: formData.phoneType,
          phone_code: formData.phoneCode,
          phone_number: formData.phoneNumber
        },
        address: {
          street: formData.street,
          additional_address: formData.additionalAddress,
          postal_code: formData.postalCode,
          city: formData.city,
          province: formData.province,
          country: formData.country
        },
        previous_employment: {
          previously_employed: formData.previouslyEmployed
        },
        work_experience: formData.noWorkExperience ? [] : formData.workExperience.map(exp => ({
          job_title: exp.jobTitle,
          company: exp.company,
          location: exp.location,
          current_work: exp.currentWork,
          from_date: exp.fromDate,
          to_date: exp.toDate,
          description: exp.description
        })),
        no_work_experience: formData.noWorkExperience,
        education: formData.education.map(edu => ({
          school: edu.school,
          degree: edu.degree,
          field_of_study: edu.fieldOfStudy,
          gpa: edu.gpa,
          from_year: edu.fromYear,
          to_year: edu.toYear
        })),
        skills: formData.skills,
        resume_url: null, // Will be updated after file upload
        websites: formData.websites.filter(url => url), // Remove empty strings
        linkedin_url: formData.linkedin,
        application_questions: formData.applicationQuestions,
        terms_accepted: formData.termsAccepted
      };

      // Handle resume upload if exists
      if (formData.resume instanceof File) {
        const fileName = `${Date.now()}-${formData.resume.name}`;
        const { error: uploadError, data } = await supabase.storage
          .from('resumes')
          .upload(`applications/${fileName}`, formData.resume);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('resumes')
          .getPublicUrl(`applications/${fileName}`);

        applicationData.resume_url = publicUrl;
      }

      // Submit application
      await api.submitApplication(applicationData);

      setShowSuccessModal(true);
      setTimeout(() => {
        navigate("/jobposts");
      }, 3000);
    } catch (error) {
      console.error("Failed to submit application:", error);
      setErrorMessage(error.message || "Failed to submit application. Please try again.");
      setShowErrorModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add validation before submission
  const validateApplication = () => {
    const errors = {};

    // Required fields validation
    if (!formData.givenName) errors.givenName = 'First name is required';
    if (!formData.familyName) errors.familyName = 'Last name is required';
    if (!formData.email) errors.email = 'Email is required';
    if (!formData.phoneNumber) errors.phoneNumber = 'Phone number is required';
    if (!formData.country) errors.country = 'Country is required';
    
    // Work experience validation
    if (!formData.noWorkExperience && (!formData.workExperience || formData.workExperience.length === 0)) {
      errors.workExperience = 'Work experience is required unless marked as no experience';
    }

    // Education validation
    if (!formData.education || formData.education.length === 0) {
      errors.education = 'Education details are required';
    }

    // Terms acceptance
    if (!formData.termsAccepted) {
      errors.terms = 'You must accept the terms to continue';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Add modal states
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const renderCurrentStage = () => {
    switch (currentStage) {
      case 1:
        return (
          <MyInformation
            formData={formData}
            setFormData={setFormData}
            fieldErrors={fieldErrors}
            setFieldErrors={setFieldErrors}
          />
        );
      case 2:
        return (
          <MyExperience
            formData={formData}
            setFormData={setFormData}
            fieldErrors={fieldErrors}
            setFieldErrors={setFieldErrors}
          />
        );
      case 3:
        return (
          <ApplicationQuestions
            formData={formData}
            setFormData={setFormData}
            fieldErrors={fieldErrors}
            setFieldErrors={setFieldErrors}
          />
        );
      case 4:
        return (
          <VoluntaryDisclosures
            formData={formData}
            setFormData={setFormData}
            fieldErrors={fieldErrors}
            setFieldErrors={setFieldErrors}
          />
        );
      case 5:
        return <Review formData={formData} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg p-8 sm:p-10 max-w-4xl mx-auto border border-gray-100">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-4 border-b border-gray-100">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">
                Apply for Position
              </h1>
              <p className="text-emerald-600 font-medium">{company}</p>
            </div>
            <div className="mt-3 sm:mt-0 flex items-center text-sm text-gray-500">
              <DocumentTextIcon className="h-5 w-5 mr-2 text-emerald-500" />
              <span>Application Form</span>
            </div>
          </div>

          {renderStageIndicator()}

          <div className="bg-gray-50 rounded-lg p-6 mb-8 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <span className="bg-emerald-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm font-bold">
                {currentStage}
              </span>
              {stages.find((stage) => stage.id === currentStage)?.name}
            </h2>
            <div className="transition-all duration-300">
              {renderCurrentStage()}
            </div>
          </div>

          <div className="mt-10 flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center gap-4">
            {currentStage > 1 ? (
              <button
                onClick={() => {
                  setCurrentStage((prev) => prev - 1);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium flex items-center justify-center sm:justify-start hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Previous Step
              </button>
            ) : (
              <div></div> // Empty div to maintain layout
            )}
            <button
              onClick={
                currentStage === stages.length
                  ? handleSubmitApplication
                  : handleSaveAndContinue
              }
              disabled={isSubmitting}
              className={`px-6 py-3 rounded-lg font-medium flex items-center justify-center ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : currentStage === stages.length
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                  : "bg-emerald-600 hover:bg-emerald-700 text-white"
              } transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500`}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                  Submitting...
                </>
              ) : currentStage === stages.length ? (
                <>Submit Application</>
              ) : (
                <>
                  Next
                  <ArrowRightIcon className="h-4 w-4 ml-2" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Progress indicator at bottom */}
        <div className="mt-6 max-w-4xl mx-auto px-4">
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>
              Step {currentStage} of {stages.length}
            </span>
            <span>
              {Math.round((currentStage / stages.length) * 100)}% completed
            </span>
          </div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-emerald-600 h-2.5 rounded-full transition-all duration-500 ease-in-out"
              style={{ width: `${(currentStage / stages.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-xl">
            <div className="rounded-full h-16 w-16 bg-emerald-100 flex items-center justify-center mx-auto mb-4">
              <CheckIcon className="h-10 w-10 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-center mb-2">
              Application Submitted!
            </h3>
            <p className="text-gray-600 text-center mb-6">
              Your application has been successfully submitted to {company}.
            </p>
            <button
              onClick={() => navigate("/jobposts")}
              className="w-full py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
            >
              View Job Posts
            </button>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-xl">
            <div className="rounded-full h-16 w-16 bg-red-100 flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-center mb-2">
              Submission Error
            </h3>
            <p className="text-gray-600 text-center mb-6">{errorMessage}</p>
            <button
              onClick={() => setShowErrorModal(false)}
              className="w-full py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Apply;
