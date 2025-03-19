import React, { useState } from "react";
import {
  TrashIcon,
  XMarkIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  PlusCircleIcon,
  DocumentTextIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";
import DateMonthPicker from "../DateMonthPicker";

const degreeOptions = [
  "High School",
  "Associate of Arts",
  "Bachelor of Science",
  "Bachelor of Arts",
  "Master of Arts",
  "Master of Science",
  "Master of Business Administration",
  "Doctor of Philosophy",
  "Juris Doctor",
];

const FormSection = ({ icon, title, description, children }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
    <div className="flex items-center space-x-3 mb-4">
      {icon}
      <div>
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        {description && (
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        )}
      </div>
    </div>
    <div className="space-y-4">{children}</div>
  </div>
);

const isTextOnly = (text) => {
  return /^[A-Za-z\s-]+$/.test(text);
};

const isValidGPA = (gpa) => {
  // Allows numbers 0-4 with up to 2 decimal places
  return /^([0-3](\.\d{1,2})?|4(\.0{1,2})?)$/.test(gpa);
};

const MyExperienceValidator = {
  validate: (formData, setFieldErrors) => {
    const errors = {};

    // Skip validation if no work experience checkbox is checked
    if (!formData.noWorkExperience) {
      // Validate work experience
      formData.workExperience.forEach((exp, index) => {
        if (!exp.jobTitle?.trim()) {
          errors[`workExperience.${index}.jobTitle`] = "Job title is required";
        } else if (!isTextOnly(exp.jobTitle)) {
          errors[`workExperience.${index}.jobTitle`] =
            "Job title can only contain letters";
        }
        if (!exp.company?.trim()) {
          errors[`workExperience.${index}.company`] =
            "Company name is required";
        }
        if (!exp.location?.trim()) {
          errors[`workExperience.${index}.location`] = "Location is required";
        }
        if (!exp.fromDate) {
          errors[`workExperience.${index}.fromDate`] = "Start date is required";
        }
        if (!exp.currentWork && !exp.toDate) {
          errors[`workExperience.${index}.toDate`] = "End date is required";
        }
        if (!exp.description?.trim()) {
          errors[`workExperience.${index}.description`] =
            "Description is required";
        }
      });
    }

    // Validate education
    formData.education.forEach((edu, index) => {
      if (!edu.school?.trim()) {
        errors[`education.${index}.school`] = "School name is required";
      } else if (!isTextOnly(edu.school)) {
        errors[`education.${index}.school`] =
          "School name can only contain letters";
      }
      if (!edu.degree) {
        errors[`education.${index}.degree`] = "Degree is required";
      }
      if (!edu.fieldOfStudy?.trim()) {
        errors[`education.${index}.fieldOfStudy`] =
          "Field of study is required";
      } else if (!isTextOnly(edu.fieldOfStudy)) {
        errors[`education.${index}.fieldOfStudy`] =
          "Field of study can only contain letters";
      }
      if (edu.gpa && !isValidGPA(edu.gpa)) {
        errors[`education.${index}.gpa`] = "GPA must be between 0.00 and 4.00";
      }
      if (!edu.fromYear) {
        errors[`education.${index}.fromYear`] = "Start date is required";
      }
      if (!edu.toYear) {
        errors[`education.${index}.toYear`] = "End date is required";
      }
    });

    // Update the field errors state
    if (setFieldErrors) {
      setFieldErrors(errors);
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },
};

const MyExperience = ({
  formData,
  setFormData,
  fieldErrors,
  setFieldErrors,
}) => {
  const [skillInput, setSkillInput] = useState("");

  const handleWorkExperienceChange = (index, field, value) => {
    // Clear error when field changes
    if (setFieldErrors) {
      setFieldErrors((prev) => ({
        ...prev,
        [`workExperience.${index}.${field}`]: undefined,
      }));
    }

    // Filter non-letter characters for text-only fields
    if (field === "jobTitle") {
      value = value.replace(/[^A-Za-z\s-]/g, "");
    }

    const newWorkExperience = [...formData.workExperience];
    // Ensure dates are properly formatted
    if (field === "fromDate" || field === "toDate") {
      value = value ? value : null;
    }
    newWorkExperience[index] = { ...newWorkExperience[index], [field]: value };
    setFormData((prev) => ({ ...prev, workExperience: newWorkExperience }));
  };

  const handleEducationChange = (index, field, value) => {
    // Clear error when field changes
    if (setFieldErrors) {
      setFieldErrors((prev) => ({
        ...prev,
        [`education.${index}.${field}`]: undefined,
      }));
    }

    // Filter input based on field type
    if (["school", "fieldOfStudy"].includes(field)) {
      value = value.replace(/[^A-Za-z\s-]/g, "");
    } else if (field === "gpa") {
      // Only allow valid GPA input
      const gpaRegex = /^\d*\.?\d{0,2}$/;
      if (value && (!gpaRegex.test(value) || parseFloat(value) > 4)) {
        return;
      }
    }

    const newEducation = [...formData.education];
    newEducation[index] = { ...newEducation[index], [field]: value };
    setFormData((prev) => ({ ...prev, education: newEducation }));
  };

  const addWorkExperience = () => {
    setFormData((prev) => ({
      ...prev,
      workExperience: [
        ...prev.workExperience,
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
    }));
  };

  const deleteWorkExperience = (index) => {
    setFormData((prev) => ({
      ...prev,
      workExperience: prev.workExperience.filter((_, i) => i !== index),
    }));
  };

  const addEducation = () => {
    setFormData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          school: "",
          degree: "",
          fieldOfStudy: "",
          gpa: "",
          fromYear: "",
          toYear: "",
        },
      ],
    }));
  };

  const handleSkillsChange = (e) => {
    if (e.key === "Enter" && skillInput.trim()) {
      e.preventDefault();
      const newSkill = skillInput.trim();
      if (!formData.skills.includes(newSkill) && isTextOnly(newSkill)) {
        setFormData((prev) => ({
          ...prev,
          skills: [...prev.skills, newSkill],
        }));
        setSkillInput("");
      }
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const addWebsite = () => {
    setFormData((prev) => ({
      ...prev,
      websites: [...(prev.websites || []), ""], // Store as string array
    }));
  };

  const handleWebsiteChange = (index, value) => {
    const newWebsites = [...(formData.websites || [])];
    newWebsites[index] = value; // Store direct URL string
    setFormData((prev) => ({ ...prev, websites: newWebsites }));
  };

  const deleteWebsite = (index) => {
    setFormData((prev) => ({
      ...prev,
      websites: prev.websites.filter((_, i) => i !== index),
    }));
  };

  const inputStyles = (fieldName) =>
    `w-full px-4 py-2.5 rounded-lg border transition-colors duration-200 ${
      fieldErrors && fieldErrors[fieldName]
        ? "border-red-500 ring-1 ring-red-500 focus:ring-red-500 focus:border-red-500"
        : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
    }`;

  const selectStyles = (fieldName) =>
    `w-full px-4 py-2.5 rounded-lg border transition-colors duration-200 bg-white appearance-none ${
      fieldErrors && fieldErrors[fieldName]
        ? "border-red-500 ring-1 ring-red-500 focus:ring-red-500 focus:border-red-500"
        : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
    }`;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
        <div className="flex">
          <div className="flex-shrink-0">
            <BriefcaseIcon className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              Share your professional journey. Fields marked with (
              <span className="text-red-500">*</span>) are required.
            </p>
          </div>
        </div>
      </div>

      <FormSection
        icon={<BriefcaseIcon className="h-6 w-6 text-blue-500" />}
        title="Work Experience"
        description="Tell us about your work history"
      >
        <div className="flex items-center mb-4">
          <label className="flex items-center space-x-2 text-gray-700">
            <input
              type="checkbox"
              checked={formData.noWorkExperience}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  noWorkExperience: e.target.checked,
                }))
              }
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span>I don't have any work experience</span>
          </label>
        </div>

        {!formData.noWorkExperience && (
          <div className="space-y-6">
            {formData.workExperience.map((exp, index) => (
              <div
                key={index}
                className="bg-gray-50 p-6 rounded-lg border border-gray-200 relative group"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-800 flex items-center">
                    <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-2 text-sm font-semibold">
                      {index + 1}
                    </span>
                    Work Experience
                  </h3>
                  {formData.workExperience.length > 1 && (
                    <button
                      onClick={() => deleteWorkExperience(index)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Job Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={exp.jobTitle}
                      onChange={(e) =>
                        handleWorkExperienceChange(
                          index,
                          "jobTitle",
                          e.target.value
                        )
                      }
                      className={inputStyles(
                        `workExperience.${index}.jobTitle`
                      )}
                      required
                    />
                    {fieldErrors &&
                      fieldErrors[`workExperience.${index}.jobTitle`] && (
                        <p className="text-red-500 text-sm mt-1">
                          {fieldErrors[`workExperience.${index}.jobTitle`]}
                        </p>
                      )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Company <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) =>
                        handleWorkExperienceChange(
                          index,
                          "company",
                          e.target.value
                        )
                      }
                      className={inputStyles(`workExperience.${index}.company`)}
                      required
                    />
                    {fieldErrors &&
                      fieldErrors[`workExperience.${index}.company`] && (
                        <p className="text-red-500 text-sm mt-1">
                          {fieldErrors[`workExperience.${index}.company`]}
                        </p>
                      )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Location <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={exp.location}
                      onChange={(e) =>
                        handleWorkExperienceChange(
                          index,
                          "location",
                          e.target.value
                        )
                      }
                      className={inputStyles(
                        `workExperience.${index}.location`
                      )}
                      required
                    />
                    {fieldErrors &&
                      fieldErrors[`workExperience.${index}.location`] && (
                        <p className="text-red-500 text-sm mt-1">
                          {fieldErrors[`workExperience.${index}.location`]}
                        </p>
                      )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={exp.currentWork}
                        onChange={(e) =>
                          handleWorkExperienceChange(
                            index,
                            "currentWork",
                            e.target.checked
                          )
                        }
                        className="mr-2"
                      />
                      <span className="text-sm">I currently work here</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      From Date <span className="text-red-500">*</span>
                    </label>
                    <DateMonthPicker
                      value={exp.fromDate}
                      onChange={(value) =>
                        handleWorkExperienceChange(index, "fromDate", value)
                      }
                      placeholder="Select start date"
                      id={`work-from-${index}`}
                    />
                    {fieldErrors &&
                      fieldErrors[`workExperience.${index}.fromDate`] && (
                        <p className="text-red-500 text-sm mt-1">
                          {fieldErrors[`workExperience.${index}.fromDate`]}
                        </p>
                      )}
                  </div>

                  {!exp.currentWork && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        To Date <span className="text-red-500">*</span>
                      </label>
                      <DateMonthPicker
                        value={exp.toDate}
                        onChange={(value) =>
                          handleWorkExperienceChange(index, "toDate", value)
                        }
                        placeholder="Select end date"
                        id={`work-to-${index}`}
                      />
                      {fieldErrors &&
                        fieldErrors[`workExperience.${index}.toDate`] && (
                          <p className="text-red-500 text-sm mt-1">
                            {fieldErrors[`workExperience.${index}.toDate`]}
                          </p>
                        )}
                    </div>
                  )}

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Role Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={exp.description}
                      onChange={(e) =>
                        handleWorkExperienceChange(
                          index,
                          "description",
                          e.target.value
                        )
                      }
                      rows={4}
                      className={inputStyles(
                        `workExperience.${index}.description`
                      )}
                      required
                    />
                    {fieldErrors &&
                      fieldErrors[`workExperience.${index}.description`] && (
                        <p className="text-red-500 text-sm mt-1">
                          {fieldErrors[`workExperience.${index}.description`]}
                        </p>
                      )}
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addWorkExperience}
              className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              <PlusCircleIcon className="h-5 w-5 mr-2" />
              Add Work Experience
            </button>
          </div>
        )}
      </FormSection>

      <FormSection
        icon={<AcademicCapIcon className="h-6 w-6 text-blue-500" />}
        title="Education"
        description="Tell us about your educational background"
      >
        {formData.education.map((edu, index) => (
          <div
            key={index}
            className="bg-gray-50 p-6 rounded-lg border border-gray-200 relative group"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-800 flex items-center">
                <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-2 text-sm font-semibold">
                  {index + 1}
                </span>
                Education
              </h3>
              {formData.education.length > 1 && (
                <button
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      education: prev.education.filter((_, i) => i !== index),
                    }));
                  }}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  School or University <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={edu.school}
                  onChange={(e) =>
                    handleEducationChange(index, "school", e.target.value)
                  }
                  className={inputStyles(`education.${index}.school`)}
                  required
                />
                {fieldErrors && fieldErrors[`education.${index}.school`] && (
                  <p className="text-red-500 text-sm mt-1">
                    {fieldErrors[`education.${index}.school`]}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Degree <span className="text-red-500">*</span>
                </label>
                <select
                  value={edu.degree}
                  onChange={(e) =>
                    handleEducationChange(index, "degree", e.target.value)
                  }
                  className={selectStyles(`education.${index}.degree`)}
                  required
                >
                  <option value="">Select Degree</option>
                  {degreeOptions.map((degree) => (
                    <option key={degree} value={degree}>
                      {degree}
                    </option>
                  ))}
                </select>
                {fieldErrors && fieldErrors[`education.${index}.degree`] && (
                  <p className="text-red-500 text-sm mt-1">
                    {fieldErrors[`education.${index}.degree`]}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Field of Study <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={edu.fieldOfStudy}
                  onChange={(e) =>
                    handleEducationChange(index, "fieldOfStudy", e.target.value)
                  }
                  className={inputStyles(`education.${index}.fieldOfStudy`)}
                  required
                />
                {fieldErrors &&
                  fieldErrors[`education.${index}.fieldOfStudy`] && (
                    <p className="text-red-500 text-sm mt-1">
                      {fieldErrors[`education.${index}.fieldOfStudy`]}
                    </p>
                  )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Overall Result (GPA)
                </label>
                <input
                  type="text"
                  value={edu.gpa}
                  onChange={(e) =>
                    handleEducationChange(index, "gpa", e.target.value)
                  }
                  className={inputStyles(`education.${index}.gpa`)}
                />
                {fieldErrors && fieldErrors[`education.${index}.gpa`] && (
                  <p className="text-red-500 text-sm mt-1">
                    {fieldErrors[`education.${index}.gpa`]}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  From Date <span className="text-red-500">*</span>
                </label>
                <DateMonthPicker
                  value={edu.fromYear}
                  onChange={(value) =>
                    handleEducationChange(index, "fromYear", value)
                  }
                  placeholder="Select start date"
                  id={`edu-from-${index}`}
                />
                {fieldErrors && fieldErrors[`education.${index}.fromYear`] && (
                  <p className="text-red-500 text-sm mt-1">
                    {fieldErrors[`education.${index}.fromYear`]}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  To Date (Actual or Expected){" "}
                  <span className="text-red-500">*</span>
                </label>
                <DateMonthPicker
                  value={edu.toYear}
                  onChange={(value) =>
                    handleEducationChange(index, "toYear", value)
                  }
                  placeholder="Select end date"
                  id={`edu-to-${index}`}
                />
                {fieldErrors && fieldErrors[`education.${index}.toYear`] && (
                  <p className="text-red-500 text-sm mt-1">
                    {fieldErrors[`education.${index}.toYear`]}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addEducation}
          className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
        >
          <PlusCircleIcon className="h-5 w-5 mr-2" />
          Add Education
        </button>
      </FormSection>

      <FormSection
        icon={<DocumentTextIcon className="h-6 w-6 text-blue-500" />}
        title="Skills"
        description="Add your professional skills (press Enter after each skill)"
      >
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {formData.skills.map((skill, index) => (
              <span
                key={index}
                className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full flex items-center group hover:bg-blue-100 transition-colors"
              >
                {skill}
                <button
                  onClick={() => removeSkill(skill)}
                  className="ml-2 text-blue-400 hover:text-blue-600"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </span>
            ))}
          </div>
          <input
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={handleSkillsChange}
            placeholder="Type a skill and press Enter"
            className={inputStyles}
          />
        </div>
      </FormSection>

      <FormSection
        icon={<DocumentTextIcon className="h-6 w-6 text-blue-500" />}
        title="Resume/CV"
        description="Upload your resume (PDF, DOC, or DOCX format)"
      >
        <div className="space-y-4">
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, resume: e.target.files[0] }))
            }
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2.5 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-medium
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100
              transition-all"
          />
          <p className="text-sm text-gray-500">Maximum file size: 5MB</p>
        </div>
      </FormSection>

      <FormSection
        icon={<GlobeAltIcon className="h-6 w-6 text-blue-500" />}
        title="Online Presence"
        description="Add your professional websites and social media profiles"
      >
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium text-gray-700">Websites</h4>
              <button
                type="button"
                onClick={addWebsite}
                className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
              >
                <PlusCircleIcon className="h-5 w-5 mr-2" />
                Add Website
              </button>
            </div>
            {(formData.websites || []).map((website, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="url"
                  value={website}
                  onChange={(e) => handleWebsiteChange(index, e.target.value)}
                  placeholder="https://example.com"
                  className={inputStyles}
                />
                <button
                  onClick={() => deleteWebsite(index)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-gray-700">LinkedIn Profile</h4>
            <input
              type="url"
              name="linkedinUrl"
              value={formData.linkedinUrl || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  linkedinUrl: e.target.value,
                }))
              }
              placeholder="https://www.linkedin.com/in/yourprofile"
              className={inputStyles}
            />
          </div>
        </div>
      </FormSection>
    </div>
  );
};

MyExperience.validator = MyExperienceValidator;
export default MyExperience;
