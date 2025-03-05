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

const MyExperience = ({ formData, setFormData }) => {
  const [skillInput, setSkillInput] = useState("");

  const handleWorkExperienceChange = (index, field, value) => {
    const newWorkExperience = [...formData.workExperience];
    // Ensure dates are properly formatted
    if (field === "fromDate" || field === "toDate") {
      value = value ? value : null;
    }
    newWorkExperience[index] = { ...newWorkExperience[index], [field]: value };
    setFormData((prev) => ({ ...prev, workExperience: newWorkExperience }));
  };

  const handleEducationChange = (index, field, value) => {
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
      if (!formData.skills.includes(newSkill)) {
        setFormData((prev) => ({
          ...prev,
          skills: [...prev.skills, newSkill],
        }));
      }
      setSkillInput("");
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

  const inputStyles =
    "w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200";
  const selectStyles =
    "w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white appearance-none";

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
                      className={inputStyles}
                      required
                    />
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
                      className={inputStyles}
                      required
                    />
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
                      className={inputStyles}
                      required
                    />
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
                    <input
                      type="date"
                      value={exp.fromDate}
                      onChange={(e) =>
                        handleWorkExperienceChange(
                          index,
                          "fromDate",
                          e.target.value
                        )
                      }
                      className={inputStyles}
                      required
                    />
                  </div>

                  {!exp.currentWork && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        To Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={exp.toDate}
                        onChange={(e) =>
                          handleWorkExperienceChange(
                            index,
                            "toDate",
                            e.target.value
                          )
                        }
                        className={inputStyles}
                        required
                      />
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
                      className={inputStyles}
                      required
                    />
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
                  className={inputStyles}
                  required
                />
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
                  className={selectStyles}
                  required
                >
                  <option value="">Select Degree</option>
                  {degreeOptions.map((degree) => (
                    <option key={degree} value={degree}>
                      {degree}
                    </option>
                  ))}
                </select>
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
                  className={inputStyles}
                  required
                />
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
                  className={inputStyles}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  From Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="month"
                  value={edu.fromYear}
                  onChange={(e) =>
                    handleEducationChange(index, "fromYear", e.target.value)
                  }
                  className={inputStyles}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  To Date (Actual or Expected){" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="month"
                  value={edu.toYear}
                  onChange={(e) =>
                    handleEducationChange(index, "toYear", e.target.value)
                  }
                  className={inputStyles}
                  required
                />
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

export default MyExperience;
