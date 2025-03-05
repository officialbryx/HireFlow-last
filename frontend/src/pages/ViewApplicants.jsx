import React, { useState, useEffect } from "react";
import { supabase } from "../services/supabaseClient";
import { analyzeResume } from "../services/resumeAnalysis";
import Navbar from "../components/Navbar";
import {
  ClipboardIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

const ViewApplicants = () => {
  const [applicants, setApplicants] = useState([]);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Application");

  useEffect(() => {
    fetchApplicants();
  }, []);

  const fetchApplicants = async () => {
    try {
      const { data: applicationsData, error: applicationsError } =
        await supabase
          .from("applications")
          .select(
            `
          *,
          profiles!applications_user_id_fkey (
            first_name,
            middle_name,
            last_name,
            user_type
          )
        `
          )
          .order("created_at", { ascending: false });

      if (applicationsError) {
        console.error("Error fetching applications:", applicationsError);
        throw applicationsError;
      }

      console.log("Fetched applications:", applicationsData);
      setApplicants(applicationsData);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectApplicant = async (applicant) => {
    setSelectedApplicant(applicant);
    if (applicant.resume_url) {
      try {
        const analysis = await analyzeResume(applicant.resume_url);
        setAnalysis(analysis);
      } catch (error) {
        console.error("Error analyzing resume:", error);
      }
    }
  };

  const renderMatchRate = (rate) => {
    const percentage = Math.round(rate * 100);
    return (
      <div className="flex items-center">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className={`h-2.5 rounded-full ${
              percentage >= 70 ? "bg-green-600" : "bg-yellow-400"
            }`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <span className="ml-2">{percentage}%</span>
      </div>
    );
  };

  const renderApplicantResponses = (applicant) => (
    <div className="space-y-6 mt-6 border-t pt-6">
      <h3 className="font-semibold text-lg">Application Responses</h3>

      {/* Personal Information */}
      <div>
        <h4 className="font-medium mb-2">Personal Information</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600">Full Name</label>
            <p>{`${applicant.personal_info.given_name} ${
              applicant.personal_info.middle_name || ""
            } ${applicant.personal_info.family_name}`}</p>
          </div>
          <div>
            <label className="text-sm text-gray-600">Email</label>
            <p>{applicant.personal_info.email}</p>
          </div>
          <div>
            <label className="text-sm text-gray-600">Phone</label>
            <p>{`${applicant.personal_info.phone.code} ${applicant.personal_info.phone.number}`}</p>
          </div>
          <div>
            <label className="text-sm text-gray-600">Location</label>
            <p>{`${applicant.personal_info.address}, ${applicant.personal_info.city}`}</p>
          </div>
        </div>
      </div>

      {/* Application Questions */}
      <div>
        <h4 className="font-medium mb-2">Screening Questions</h4>
        <div className="space-y-2">
          {Object.entries(applicant.application_questions).map(
            ([key, value]) => (
              <div key={key} className="flex items-start gap-2">
                <div
                  className={`mt-1 ${
                    value ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {value ? (
                    <CheckCircleIcon className="h-5 w-5" />
                  ) : (
                    <XCircleIcon className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-900">
                    {key.split(/(?=[A-Z])/).join(" ")}
                  </p>
                  <p className="text-sm text-gray-500">
                    {value ? "Yes" : "No"}
                  </p>
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* Resume Analysis */}
      {analysis && (
        <div>
          <h4 className="font-medium mb-2">Resume Analysis</h4>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600">Overall Match</label>
              {renderMatchRate(
                (analysis.skillsMatch +
                  analysis.experienceMatch +
                  analysis.educationMatch) /
                  3
              )}
            </div>
            <div>
              <label className="text-sm text-gray-600">Skills Match</label>
              {renderMatchRate(analysis.skillsMatch)}
            </div>
            <div>
              <label className="text-sm text-gray-600">Experience Match</label>
              {renderMatchRate(analysis.experienceMatch)}
            </div>
            <div>
              <label className="text-sm text-gray-600">Education Match</label>
              {renderMatchRate(analysis.educationMatch)}
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 mt-6">
        <button
          onClick={() => handleDownloadResume(applicant.resume_url)}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          <ClipboardIcon className="h-5 w-5" />
          Download Resume
        </button>
        <button
          onClick={() => handleContact(applicant)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Contact Applicant
        </button>
      </div>
    </div>
  );

  const handleDownloadResume = async (resumeUrl) => {
    try {
      window.open(resumeUrl, "_blank");
    } catch (error) {
      console.error("Error downloading resume:", error);
      alert("Failed to download resume");
    }
  };

  const handleContact = (applicant) => {
    // Implement contact functionality
    console.log("Contact applicant:", applicant);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderApplicantsList = () => (
    <div className="w-1/3 bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <h2 className="font-semibold">Applicants ({applicants.length})</h2>
      </div>
      <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
        {loading ? (
          <div className="p-4">Loading applicants...</div>
        ) : applicants.length === 0 ? (
          <div className="p-4 text-gray-500">No applicants found</div>
        ) : (
          applicants.map((applicant) => (
            <div
              key={applicant.id}
              onClick={() => handleSelectApplicant(applicant)}
              className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                selectedApplicant?.id === applicant.id ? "bg-blue-50" : ""
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">
                    {applicant.personal_info.given_name}{" "}
                    {applicant.personal_info.family_name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Applied to: {applicant.company}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(applicant.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    applicant.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : applicant.status === "approved"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {applicant.status.charAt(0).toUpperCase() +
                    applicant.status.slice(1)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderApplicantDetails = () => {
    if (!selectedApplicant) {
      return (
        <div className="w-2/3 bg-white rounded-lg shadow flex items-center justify-center p-8 text-gray-500">
          Select an applicant to view details
        </div>
      );
    }

    return (
      <div className="w-2/3 bg-white rounded-lg shadow">
        <div className="p-6 space-y-8">
          {/* Header Section */}
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold">
                {selectedApplicant.profile?.first_name}{" "}
                {selectedApplicant.profile?.middle_name}{" "}
                {selectedApplicant.profile?.last_name}
              </h2>
              <p className="text-gray-600">
                Applied for: {selectedApplicant.position}
              </p>
              <p className="text-sm text-gray-500">
                Applied on: {formatDate(selectedApplicant.created_at)}
              </p>
            </div>
            <div className="flex gap-4">
              {selectedApplicant.resume_url && (
                <a
                  href={selectedApplicant.resume_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                >
                  <ClipboardIcon className="h-5 w-5" />
                  View Resume
                </a>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-4">Contact Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <InfoItem label="Email" value={selectedApplicant.user?.email} />
              <InfoItem
                label="Phone"
                value={selectedApplicant.profile?.phone}
              />
              <InfoItem
                label="Address"
                value={`${selectedApplicant.profile?.street}${
                  selectedApplicant.profile?.additional_address
                    ? `, ${selectedApplicant.profile.additional_address}`
                    : ""
                }, ${selectedApplicant.profile?.city}, ${
                  selectedApplicant.profile?.province
                }`}
              />
              <InfoItem
                label="Country"
                value={selectedApplicant.profile?.country}
              />
            </div>
          </div>

          {/* Work Experience */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-4">Work Experience</h3>
            {selectedApplicant.experience?.map((exp, index) => (
              <div
                key={index}
                className="mb-4 border-b border-gray-200 pb-4 last:border-0 last:pb-0"
              >
                <h4 className="font-medium">{exp.position}</h4>
                <p className="text-gray-600">{exp.company}</p>
                <p className="text-sm text-gray-500">
                  {formatDate(exp.start_date)} -{" "}
                  {exp.current_work ? "Present" : formatDate(exp.end_date)}
                </p>
                <p className="mt-2 text-gray-600">{exp.description}</p>
              </div>
            ))}
          </div>

          {/* Education */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-4">Education</h3>
            {selectedApplicant.education?.map((edu, index) => (
              <div key={index} className="mb-4 last:mb-0">
                <h4 className="font-medium">{edu.school}</h4>
                <p className="text-gray-600">
                  {edu.degree} in {edu.field_of_study}
                </p>
                <p className="text-sm text-gray-500">
                  {edu.from_year} - {edu.to_year}
                </p>
                {edu.gpa && (
                  <p className="text-sm text-gray-500">GPA: {edu.gpa}</p>
                )}
              </div>
            ))}
          </div>

          {/* Skills */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-4">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {selectedApplicant.skills?.map((skill, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>

          {/* Application Questions */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-4">Screening Questions</h3>
            <div className="space-y-4">
              {Object.entries(
                selectedApplicant.application_questions || {}
              ).map(([key, value]) => (
                <div key={key} className="flex items-start gap-2">
                  {value === "yes" ? (
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircleIcon className="h-5 w-5 text-red-500" />
                  )}
                  <div>
                    <p className="text-sm text-gray-900">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </p>
                    <p className="text-sm text-gray-500">
                      {value === "yes" ? "Yes" : "No"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Add this helper component
  const InfoItem = ({ label, value }) => (
    <div>
      <label className="text-sm text-gray-600">{label}</label>
      <p className="text-gray-900">{value || "Not provided"}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Applicants Review</h1>
        <div className="flex gap-6">
          {renderApplicantsList()}
          {renderApplicantDetails()}
        </div>
      </div>
    </div>
  );
};

export default ViewApplicants;
