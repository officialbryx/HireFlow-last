import { useState } from "react";
import {
  MapPinIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

// Update the initialFormState to match API field names exactly
const initialFormState = {
  job_title: "",
  company_name: "", // Changed from companyName
  company_logo_url: null, // Changed from companyLogo
  location: "",
  employment_type: "Full-time", // Changed from employmentType
  salary_range: "", // Changed from salaryRange
  applicants_needed: "",
  company_description: "", // Changed from companyDescription
  about_company: "",
  responsibilities: [""],
  qualifications: [""],
  skills: [""],
};

const CreateJobPost = ({
  onClose,
  onJobCreated,
  isEditing = false,
  initialData = null,
}) => {
  const [formData, setFormData] = useState(initialData || initialFormState);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        alert("File size must be less than 5MB");
        return;
      }
      setFormData((prev) => ({
        ...prev,
        company_logo_url: file, // Changed from companyLogo
      }));
    }
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

  // Update the handleSubmit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Ensure all field names match exactly with the API expectations
      const submitData = {
        job_title: formData.job_title,
        company_name: formData.company_name,
        company_logo_url: formData.company_logo_url,
        location: formData.location,
        employment_type: formData.employment_type,
        salary_range: formData.salary_range,
        applicants_needed: formData.applicants_needed,
        company_description: formData.company_description,
        about_company: formData.about_company,
        responsibilities: formData.responsibilities.filter((r) => r.trim()),
        qualifications: formData.qualifications.filter((q) => q.trim()),
        skills: formData.skills.filter((s) => s.trim()),
      };

      // Validate required fields
      if (!submitData.job_title || !submitData.job_title.trim()) {
        throw new Error("Job title is required");
      }

      if (
        submitData.responsibilities.length === 0 ||
        submitData.qualifications.length === 0 ||
        submitData.skills.length === 0
      ) {
        throw new Error("Please fill in all required fields");
      }

      await onJobCreated(submitData);

      if (!isEditing) {
        setFormData(initialFormState);
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) {
          fileInput.value = "";
        }
      }
    } catch (error) {
      console.error("Error submitting job:", error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            {isEditing ? "Edit Job Post" : "Create Job Post"}
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
                    name="job_title" // This should match the field name from API
                    value={formData.job_title || ""} // Add fallback for null/undefined
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
                    name="company_name" // Changed from companyName
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
                      name="employment_type" // Changed from employmentType
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
                      name="salary_range" // Changed from salaryRange
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
                  Company Logo
                </label>
                <div className="mt-2 space-y-2">
                  <input
                    type="file"
                    name="company_logo_url"
                    onChange={handleFileChange}
                    accept="image/jpeg,image/png"
                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500"
                  />
                  <div className="flex flex-col space-y-1">
                    <p className="text-xs text-gray-500">
                      Accepted file types: JPEG & PNG
                    </p>
                    <p className="text-xs text-gray-500">
                      Maximum file size: 5MB
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Job Description
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
                disabled={isSubmitting}
                className={`${
                  isEditing ? "w-1/2" : "w-full"
                } px-6 py-3 rounded-md text-white transition-colors ${
                  isSubmitting
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isSubmitting
                  ? "Saving..."
                  : isEditing
                  ? "Save Changes"
                  : "Create Job Post"}
              </button>

              {isEditing && (
                <button
                  type="button"
                  onClick={onClose}
                  className="w-1/2 bg-red-500 text-white px-6 py-3 rounded-md hover:bg-red-600 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateJobPost;
