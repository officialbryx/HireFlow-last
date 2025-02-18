import React from "react";

const ApplicationQuestions = ({ formData, setFormData }) => {
  const handleChange = (field, value) => {
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
      text: "Do you have relatives working with {company}, any of the {company} subsidiaries, or other companies?",
    },
    {
      id: "relativesInIndustry",
      text: "Do you have any relatives working with other related industry companies?",
    },
    {
      id: "currentEmployerBond",
      text: "Do you have a bond with your current employer?",
    },
    {
      id: "nonCompete",
      text: "Do you have a non-compete clause?",
    },
    {
      id: "filipinoCitizen",
      text: "Are you a Filipino / dual Filipino citizen?",
    },
    {
      id: "internationalStudies",
      text: "Are you / will you be undergoing international studies?",
    },
    {
      id: "applyVisa",
      text: "Are you applying for a VISA?",
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-center">
        Application Questions
      </h2>
      <p className="text-sm text-gray-500">
        <span className="text-red-500">*</span> Indicates a required field
      </p>
      <div className="space-y-6">
        {questions.map(({ id, text }) => (
          <div key={id} className="space-y-2">
            <label className="block text-sm text-gray-700">{text}</label>
            <select
              value={formData.applicationQuestions[id] || ""}
              onChange={(e) => handleChange(id, e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            >
              <option value="" disabled>
                Select one
              </option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApplicationQuestions;
