import React, { useState } from "react";
import { TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";

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

const MyExperience = ({ formData, setFormData }) => {
  const [skillInput, setSkillInput] = useState("");

  const handleWorkExperienceChange = (index, field, value) => {
    const newWorkExperience = [...formData.workExperience];
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
      websites: [...(prev.websites || []), { url: "" }],
    }));
  };

  const handleWebsiteChange = (index, value) => {
    const newWebsites = [...(formData.websites || [])];
    newWebsites[index].url = value;
    setFormData((prev) => ({ ...prev, websites: newWebsites }));
  };

  const deleteWebsite = (index) => {
    setFormData((prev) => ({
      ...prev,
      websites: prev.websites.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-center">My Experience</h2>
        <p className="text-sm text-gray-500">
          <span className="text-red-500">*</span> Indicates a required field
        </p>

        {/* Work Experience Section */}
        <div className="space-y-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={formData.noWorkExperience}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  noWorkExperience: e.target.checked,
                }))
              }
              className="mr-2"
            />
            <span>I don't have any work experience</span>
          </div>

          {!formData.noWorkExperience &&
            formData.workExperience.map((exp, index) => (
              <div
                key={index}
                className="border p-6 rounded-lg space-y-4 relative"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-small">
                    Work Experience {index + 1}
                  </h3>
                  {formData.workExperience.length > 1 && (
                    <button
                      onClick={() => deleteWorkExperience(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
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
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
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
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
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
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
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
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
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
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      required
                    />
                  </div>
                </div>
              </div>
            ))}

          {!formData.noWorkExperience && (
            <button
              type="button"
              onClick={addWorkExperience}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              + Add Work Experience
            </button>
          )}
        </div>
      </div>

      <hr className="my-7 border-t border-gray-300 w-3/4 mx-auto" />

      {/* Education Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Education</h3>
        {formData.education.map((edu, index) => (
          <div key={index} className="border p-6 rounded-lg space-y-4 relative">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-small">Education {index + 1}</h3>
              {formData.education.length > 1 && (
                <button
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      education: prev.education.filter((_, i) => i !== index),
                    }));
                  }}
                  className="text-red-600 hover:text-red-800"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
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
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
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
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
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
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
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
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
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
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addEducation}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          + Add Education
        </button>
      </div>

      <hr className="my-7 border-t border-gray-300 w-3/4 mx-auto" />

      {/* Skills Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Skills</h3>
        <h3 className="text-sm text-gray-500 font-small">
          * Note this is a required field, kindly type in your skills and add it
          accordingly
        </h3>
        <h3 className="text-sm text-black-500 font-small">
          Type to add skills <span className="text-red-500">*</span>
        </h3>
        <div className="flex flex-wrap gap-2">
          {formData.skills.map((skill, index) => (
            <span
              key={index}
              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center"
            >
              {skill}
              <XMarkIcon
                className="h-4 w-4 ml-2 cursor-pointer"
                onClick={() => removeSkill(skill)}
              />
            </span>
          ))}
        </div>
        <input
          type="text"
          value={skillInput}
          placeholder="Type a skill and press Enter"
          onChange={(e) => setSkillInput(e.target.value)}
          onKeyDown={handleSkillsChange}
          className="border rounded-md p-2 w-full"
        />
      </div>

      <hr className="my-7 border-t border-gray-300 w-3/4 mx-auto" />

      {/* Resume Upload Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Resume/CV</h3>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              resume: e.target.files[0],
            }))
          }
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
        <p className="text-sm text-gray-500">
          Upload a file (5MB Max) <span className="text-red-500">*</span>
        </p>
      </div>

      <hr className="my-7 border-t border-gray-300 w-3/4 mx-auto" />

      {/* Websites Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Websites</h3>
        <p className="text-sm text-gray-500">Add any relevant websites.</p>

        {(formData.websites || []).map((website, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              type="url"
              placeholder="Enter URL"
              value={website.url}
              onChange={(e) => handleWebsiteChange(index, e.target.value)}
              className="flex-1 border rounded-md p-2"
            />
            <button
              onClick={() => deleteWebsite(index)}
              className="text-red-600 hover:text-red-800"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addWebsite}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          + Add Website
        </button>
        <h3 className="text-lg font-medium">Social Network URLs</h3>
        <h3 className="text-lg font-medium">
          Add your Linkedin url . Format should be https://
        </h3>
        <input
          type="url"
          name="linkedinUrl"
          value={formData.linkedinUrl || ""}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, linkedinUrl: e.target.value }))
          }
          placeholder="https://www.linkedin.com/in/yourprofile"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>
    </div>
  );
};

export default MyExperience;
