import { useState } from "react";
import {
  MapPinIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { api } from "../services/api"; // Import the api object

const CreateJobPost = () => {
  const [formData, setFormData] = useState({
    title: "",
    companyName: "",
    companyLogo: null, // Update to store the file
    location: "",
    employmentType: "Full-time",
    salaryRange: "",
    applicantsNeeded: "",
    companyDescription: "",
    responsibilities: [""],
    qualifications: [""],
    aboutCompany: "",
    skills: [""],
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files[0],
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
      const response = await api.createJobPost(formData);
      setModalMessage("Job post created successfully!");
      setModalVisible(true);
      console.log("Job post created successfully:", response);
      // Optionally, redirect or show a success message
    } catch (error) {
      setModalMessage("Error creating job post. Please try again.");
      setModalVisible(true);
      console.error("Error creating job post:", error);
      // Optionally, show an error message
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
                    name="title"
                    value={formData.title}
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
                    name="companyName"
                    value={formData.companyName}
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
                      name="employmentType"
                      value={formData.employmentType}
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
                      name="salaryRange"
                      value={formData.salaryRange}
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
                      name="applicantsNeeded"
                      value={formData.applicantsNeeded}
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
                <div className="mt-1 flex items-center space-x-2 border border-gray-300 rounded-md shadow-sm bg-gray-100">
                  {/* Hidden File Input */}
                  <input
                    type="file"
                    name="companyLogo"
                    onChange={handleFileChange}
                    className="file:mr-4  file:border-0 file:bg-violet-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-violet-100 dark:file:bg-blue-600 dark:file:text-violet-100 dark:hover:file:bg-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Company Description
                </label>
                <textarea
                  name="companyDescription"
                  value={formData.companyDescription}
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
                  name="aboutCompany"
                  value={formData.aboutCompany}
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

      {/* Modal */}
      {modalVisible && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow p-8">
            <p className="text-lg font-semibold text-gray-900">
              {modalMessage}
            </p>
            <button
              onClick={() => setModalVisible(false)}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateJobPost;
