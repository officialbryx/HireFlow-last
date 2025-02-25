import React, { useState } from "react";
import {
  MapPinIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { api } from "../services/api";

const CreateJobPost = () => {
  const [formData, setFormData] = useState({
    job_title: "", 
    company_name: "", 
    company_logo_url: "", 
    location: "", 
    employment_type: "Full-time",
    salary_range: "", 
    applicants_needed: "", 
    company_description: "", 
    about_company: "", 
    responsibilities: [""], 
    qualifications: [""], 
    skills: [""],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleArrayInputChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const addArrayField = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const removeArrayField = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      console.log("Submitting job post:", formData); // Debugging before sending
      
      const response = await api.createJobPosting(formData); // Call API
  
      console.log("Job post created successfully:", response); // Debugging success
      alert("Job post created successfully!");
  
      // Reset form after successful submission (optional)
      // setFormData({ title: "", description: "", responsibilities: [], qualifications: [], skills: [] });
  
    } catch (error) {
      console.error("Error creating job post:", error);
      alert("Failed to create job post! Please try again."); // User-friendly error message
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Create Job Post
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Basic Information
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Job Title
                  </label>
                  <input
                    type="text"
                    name="job_title"
                    value={formData.job_title}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Location
                  </label>
                  <div className="mt-1 relative">
                    <MapPinIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="block w-full pl-10 border border-gray-300 rounded-md shadow-sm p-2"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Employment Type
                  </label>
                  <div className="mt-1 relative">
                    <BriefcaseIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <select
                      name="employment_type"
                      value={formData.employment_type}
                      onChange={handleInputChange}
                      className="block w-full pl-10 border border-gray-300 rounded-md shadow-sm p-2"
                    >
                      <option>Full-time</option>
                      <option>Part-time</option>
                      <option>Contract</option>
                      <option>Remote</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Salary Range
                  </label>
                  <div className="mt-1 relative">
                    <CurrencyDollarIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="salary_range"
                      value={formData.salary_range}
                      onChange={handleInputChange}
                      className="block w-full pl-10 border border-gray-300 rounded-md shadow-sm p-2"
                      placeholder="e.g. $80,000 - $100,000"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Applicants Needed
                  </label>
                  <div className="mt-1 relative">
                    <UserGroupIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="number"
                      name="applicants_needed"
                      value={formData.applicants_needed}
                      onChange={handleInputChange}
                      className="block w-full pl-10 border border-gray-300 rounded-md shadow-sm p-2"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Company Details */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Company Details
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Company Logo URL
                </label>
                <input
                  type="text"
                  name="company_logo_url"
                  value={formData.company_logo_url}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  placeholder="/company-logos/your-company.png"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Company Description
                </label>
                <textarea
                  name="company_description"
                  value={formData.company_description}
                  onChange={handleInputChange}
                  rows={4}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  About the Company
                </label>
                <textarea
                  name="about_company"
                  value={formData.about_company}
                  onChange={handleInputChange}
                  rows={4}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                />
              </div>
            </div>

            {/* Responsibilities */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Key Responsibilities
              </h2>

              {formData.responsibilities.map((responsibility, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={responsibility}
                    onChange={(e) =>
                      handleArrayInputChange(
                        index,
                        "responsibilities",
                        e.target.value
                      )
                    }
                    className="flex-1 border border-gray-300 rounded-md shadow-sm p-2"
                    placeholder="Add a responsibility"
                    required
                  />
                  {formData.responsibilities.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        removeArrayField("responsibilities", index)
                      }
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={() => addArrayField("responsibilities")}
                className="text-blue-600 hover:text-blue-800"
              >
                + Add Responsibility
              </button>
            </div>

            {/* Qualifications */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Qualifications
              </h2>

              {formData.qualifications.map((qualification, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={qualification}
                    onChange={(e) =>
                      handleArrayInputChange(
                        index,
                        "qualifications",
                        e.target.value
                      )
                    }
                    className="flex-1 border border-gray-300 rounded-md shadow-sm p-2"
                    placeholder="Add a qualification"
                    required
                  />
                  {formData.qualifications.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayField("qualifications", index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={() => addArrayField("qualifications")}
                className="text-blue-600 hover:text-blue-800"
              >
                + Add Qualification
              </button>
            </div>

            {/* Skills */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Required Skills
              </h2>

              {formData.skills.map((skill, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={skill}
                    onChange={(e) =>
                      handleArrayInputChange(index, "skills", e.target.value)
                    }
                    className="flex-1 border border-gray-300 rounded-md shadow-sm p-2"
                    placeholder="Add a skill"
                    required
                  />
                  {formData.skills.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayField("skills", index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={() => addArrayField("skills")}
                className="text-blue-600 hover:text-blue-800"
              >
                + Add Skill
              </button>
            </div>

            {/* Submit Buttons */}
            <div className="pt-4 flex gap-4">
              <button
                type="submit"
                className="w-1/2 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
              >
                Create Job Post
              </button>
              <button
                type="button"
                onClick={() => window.history.back()}
                className="w-1/2 bg-red-500 text-white px-6 py-3 rounded-md hover:bg-red-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateJobPost;
