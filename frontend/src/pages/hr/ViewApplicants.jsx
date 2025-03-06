import React, { useState, useEffect } from "react";
import { supabase } from "../../services/supabaseClient";
import { analyzeResume } from "../../services/resumeAnalysis";
import HRNavbar from "../../components/HRNavbar";
import {
  ClipboardIcon,
  CheckCircleIcon,
  XCircleIcon,
  UserIcon,
  PhoneIcon,
  AtSymbolIcon,
  MapPinIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  CodeBracketIcon,
  LinkIcon,
  EyeIcon,
  ChatBubbleLeftRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Document, Page, pdfjs } from "react-pdf";
// Set pdf.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function ViewApplicants() {
  const [applicants, setApplicants] = useState([]);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("details");
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    fetchApplicants();
  }, []);

  const fetchApplicants = async () => {
    try {
      const { data: applicationsData, error: applicationsError } =
        await supabase
          .from("applications")
          .select("*")
          .order("created_at", { ascending: false });

      if (applicationsError) {
        console.error("Error fetching applications:", applicationsError);
        throw applicationsError;
      }

      if (applicationsData && applicationsData.length > 0) {
        console.log("Applications data:", applicationsData);
        setApplicants(applicationsData);
      } else {
        console.log("No applications data received");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectApplicant = async (applicant) => {
    setSelectedApplicant(applicant);
    setActiveTab("details");
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
              percentage >= 70 ? "bg-emerald-600" : "bg-amber-500"
            }`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <span className="ml-2 text-sm font-medium">{percentage}%</span>
      </div>
    );
  };

  const getPublicUrl = (resumeUrl) => {
    if (!resumeUrl) return null;

    try {
      // Extract the filename from the full path
      const filename = resumeUrl.split("/").pop();

      // Create the correct path in the storage bucket
      const filePath = `applications/${filename}`;
      console.log("File path:", filePath);

      // Get the public URL with the correct path
      const { data } = supabase.storage.from("resumes").getPublicUrl(filePath);

      console.log("Generated URL:", data.publicUrl);
      return data.publicUrl;
    } catch (error) {
      console.error("Error generating URL:", error);
      return null;
    }
  };

  const handleDownloadResume = async (resumeUrl) => {
    try {
      const publicUrl = getPublicUrl(resumeUrl);
      console.log("Accessing resume at:", publicUrl);

      if (!publicUrl) {
        throw new Error("Could not generate resume URL");
      }

      // Try to download the file directly
      const { data, error } = await supabase.storage
        .from("resumes")
        .download(`applications/${resumeUrl.split("/").pop()}`);

      if (error) {
        throw error;
      }

      // Create a blob URL and trigger download
      const blob = new Blob([data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", resumeUrl.split("/").pop());
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Resume access error:", error);
      alert("Could not access resume file. Please try again.");
    }
  };

  const handleContact = (applicant) => {
    // Implement contact functionality
    console.log("Contact applicant:", applicant);
    // Here you could open a modal with a contact form or email template
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getFilteredApplicants = () => {
    return applicants.filter((applicant) => {
      const matchesSearch =
        searchTerm === "" ||
        applicant.personal_info?.given_name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        applicant.personal_info?.family_name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        applicant.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        applicant.company?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || applicant.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  };

  const getBadgeColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-800";
      case "approved":
        return "bg-emerald-100 text-emerald-800";
      case "rejected":
        return "bg-rose-100 text-rose-800";
      case "interview":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const InfoItem = ({ icon, label, value }) => (
    <div className="flex gap-3">
      {icon && <div className="text-gray-400 mt-0.5">{icon}</div>}
      <div>
        <label className="text-sm text-gray-500">{label}</label>
        <p className="text-gray-900 font-medium">{value || "Not provided"}</p>
      </div>
    </div>
  );

  const Tabs = () => (
    <div className="border-b border-gray-200 mb-6">
      <nav className="-mb-px flex space-x-8">
        <button
          onClick={() => setActiveTab("details")}
          className={`whitespace-nowrap px-1 py-4 text-sm font-medium ${
            activeTab === "details"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          Applicant Details
        </button>
        <button
          onClick={() => setActiveTab("resume")}
          className={`whitespace-nowrap px-1 py-4 text-sm font-medium ${
            activeTab === "resume"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          Resume Analysis
        </button>
        <button
          onClick={() => setActiveTab("questions")}
          className={`whitespace-nowrap px-1 py-4 text-sm font-medium ${
            activeTab === "questions"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          Screening Questions
        </button>
      </nav>
    </div>
  );

  const renderApplicantsList = () => (
    <div className="w-1/3 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="font-semibold text-lg text-gray-800">
          Applicants ({getFilteredApplicants().length})
        </h2>

        <div className="mt-3 mb-2">
          <input
            type="text"
            placeholder="Search applicants..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex mt-2 gap-2">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-3 py-1 text-xs rounded-full ${
              statusFilter === "all"
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setStatusFilter("pending")}
            className={`px-3 py-1 text-xs rounded-full ${
              statusFilter === "pending"
                ? "bg-amber-500 text-white"
                : "bg-amber-50 text-amber-700 hover:bg-amber-100"
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setStatusFilter("approved")}
            className={`px-3 py-1 text-xs rounded-full ${
              statusFilter === "approved"
                ? "bg-emerald-500 text-white"
                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
            }`}
          >
            Approved
          </button>
          <button
            onClick={() => setStatusFilter("rejected")}
            className={`px-3 py-1 text-xs rounded-full ${
              statusFilter === "rejected"
                ? "bg-rose-500 text-white"
                : "bg-rose-50 text-rose-700 hover:bg-rose-100"
            }`}
          >
            Rejected
          </button>
        </div>
      </div>

      <div className="overflow-y-auto max-h-[calc(100vh-280px)]">
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : getFilteredApplicants().length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
              <UserIcon className="h-6 w-6 text-gray-400" />
            </div>
            <p>No applicants found</p>
            <p className="text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          getFilteredApplicants().map((applicant) => (
            <div
              key={applicant.id}
              onClick={() => handleSelectApplicant(applicant)}
              className={`p-4 border-b cursor-pointer transition-all ${
                selectedApplicant?.id === applicant.id
                  ? "bg-blue-50 border-l-4 border-l-blue-500"
                  : "hover:bg-gray-50 border-l-4 border-l-transparent"
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">
                    {applicant.personal_info?.given_name || ""}{" "}
                    {applicant.personal_info?.family_name || ""}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {applicant.company || "N/A"}
                  </p>
                  <div className="flex items-center mt-1">
                    <p className="text-xs text-gray-400">
                      {applicant.created_at
                        ? new Date(applicant.created_at).toLocaleDateString()
                        : "N/A"}
                    </p>
                    {applicant.resume_url && (
                      <div className="ml-2 text-xs text-blue-500 flex items-center">
                        <ClipboardIcon className="h-3 w-3 mr-1" />
                        Resume
                      </div>
                    )}
                  </div>
                </div>
                <span
                  className={`px-2 py-1 text-xs rounded-full font-medium ${getBadgeColor(
                    applicant.status
                  )}`}
                >
                  {applicant.status
                    ? applicant.status.charAt(0).toUpperCase() +
                      applicant.status.slice(1)
                    : "Pending"}
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
        <div className="w-2/3 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center p-16 text-gray-500">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <UserIcon className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="font-medium text-lg text-gray-700 mb-1">
              No Applicant Selected
            </h3>
            <p>Select an applicant from the list to view their details</p>
          </div>
        </div>
      );
    }

    const personalInfo = selectedApplicant.personal_info || {};
    const contactInfo = selectedApplicant.contact_info || {};
    const address = selectedApplicant.address || {};
    const previousEmployment = selectedApplicant.previous_employment || {};
    const workExperience = selectedApplicant.work_experience || [];
    const education = selectedApplicant.education || [];
    const skills = selectedApplicant.skills || [];
    const applicationQuestions = selectedApplicant.application_questions || {};

    const renderDetailContent = () => {
      switch (activeTab) {
        case "details":
          return (
            <div className="space-y-8">
              {/* Personal & Contact Information */}
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="font-semibold text-lg mb-4 text-gray-800">
                  Personal Information
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <InfoItem
                    icon={<UserIcon className="h-5 w-5" />}
                    label="Full Name"
                    value={`${personalInfo.given_name || ""} ${
                      personalInfo.middle_name || ""
                    } ${personalInfo.family_name || ""} ${
                      personalInfo.suffix || ""
                    }`}
                  />
                  <InfoItem
                    icon={<AtSymbolIcon className="h-5 w-5" />}
                    label="Email"
                    value={
                      contactInfo.email ||
                      personalInfo.email ||
                      selectedApplicant.email
                    }
                  />
                  <InfoItem
                    icon={<PhoneIcon className="h-5 w-5" />}
                    label="Phone"
                    value={`${
                      contactInfo.phone_code || personalInfo.phone?.code || ""
                    } ${
                      contactInfo.phone_number ||
                      personalInfo.phone?.number ||
                      ""
                    }`}
                  />
                  <InfoItem
                    icon={<MapPinIcon className="h-5 w-5" />}
                    label="Location"
                    value={`${address.city || ""}, ${address.province || ""}, ${
                      address.country || ""
                    }`}
                  />
                </div>

                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-medium text-gray-700 mb-2">Address</h4>
                  <p className="text-gray-700">
                    {address.street}
                    {address.additional_address &&
                      `, ${address.additional_address}`}
                    <br />
                    {address.city}, {address.province} {address.postal_code}
                    <br />
                    {address.country}
                  </p>
                </div>
              </div>

              {/* Work Experience */}
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-lg text-gray-800">
                    <span className="flex items-center">
                      <BriefcaseIcon className="h-5 w-5 mr-2 text-gray-500" />
                      Work Experience
                    </span>
                  </h3>
                </div>

                {selectedApplicant.no_work_experience ? (
                  <p className="text-gray-500 italic">No work experience</p>
                ) : (
                  <div className="space-y-6">
                    {workExperience.map((exp, index) => (
                      <div
                        key={index}
                        className={
                          index < workExperience.length - 1
                            ? "pb-6 border-b"
                            : ""
                        }
                      >
                        <div className="flex justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {exp.jobTitle}
                            </h4>
                            <p className="text-gray-700">{exp.company}</p>
                            <p className="text-gray-500 text-sm">
                              {exp.location}
                            </p>
                          </div>
                          <div className="text-right text-sm text-gray-500">
                            {formatDate(exp.fromDate)} —{" "}
                            {exp.currentWork
                              ? "Present"
                              : formatDate(exp.toDate)}
                          </div>
                        </div>
                        {exp.description && (
                          <p className="mt-2 text-gray-600 text-sm">
                            {exp.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Previous Employment */}
                {(previousEmployment.previously_employed ||
                  personalInfo.previously_employed === "yes") && (
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="font-medium text-gray-700 mb-2">
                      Previous Employment at {selectedApplicant.company}
                    </h4>
                    {previousEmployment.employee_id && (
                      <p className="text-sm text-gray-600">
                        Employee ID: {previousEmployment.employee_id}
                      </p>
                    )}
                    {previousEmployment.manager && (
                      <p className="text-sm text-gray-600">
                        Previous Manager: {previousEmployment.manager}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Education */}
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="font-semibold text-lg mb-4 text-gray-800">
                  <span className="flex items-center">
                    <AcademicCapIcon className="h-5 w-5 mr-2 text-gray-500" />
                    Education
                  </span>
                </h3>

                {education.length === 0 ? (
                  <p className="text-gray-500 italic">
                    No education information provided
                  </p>
                ) : (
                  <div className="space-y-4">
                    {education.map((edu, index) => (
                      <div
                        key={index}
                        className={
                          index < education.length - 1 ? "pb-4 border-b" : ""
                        }
                      >
                        <div className="flex justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {edu.degree} in {edu.fieldOfStudy}
                            </h4>
                            <p className="text-gray-700">{edu.school}</p>
                          </div>
                          <div className="text-right text-sm text-gray-500">
                            {edu.fromYear} — {edu.toYear}
                          </div>
                        </div>
                        {edu.gpa && (
                          <p className="text-sm text-gray-600 mt-1">
                            GPA: {edu.gpa}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Skills & Online Presence */}
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="font-semibold text-lg mb-4 text-gray-800">
                  <span className="flex items-center">
                    <CodeBracketIcon className="h-5 w-5 mr-2 text-gray-500" />
                    Skills & Online Presence
                  </span>
                </h3>

                <div className="mb-6">
                  <h4 className="font-medium text-gray-700 mb-3">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {skills.length === 0 ? (
                      <p className="text-gray-500 italic">No skills listed</p>
                    ) : (
                      skills.map((skill, index) => (
                        <span
                          key={index}
                          className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium text-gray-700 mb-3">
                    Online Presence
                  </h4>

                  {selectedApplicant.linkedin_url && (
                    <div className="flex items-center mb-2">
                      <LinkIcon className="h-4 w-4 text-gray-500 mr-2" />
                      <a
                        href={selectedApplicant.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        LinkedIn Profile
                      </a>
                    </div>
                  )}

                  {selectedApplicant.websites &&
                    selectedApplicant.websites.length > 0 && (
                      <div>
                        {selectedApplicant.websites.map((url, index) => (
                          <div key={index} className="flex items-center mb-2">
                            <LinkIcon className="h-4 w-4 text-gray-500 mr-2" />
                            <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800"
                            >
                              {url.replace(/(^\w+:|^)\/\//, "").split("/")[0]}
                            </a>
                          </div>
                        ))}
                      </div>
                    )}

                  {!selectedApplicant.linkedin_url &&
                    (!selectedApplicant.websites ||
                      selectedApplicant.websites.length === 0) && (
                      <p className="text-gray-500 italic">
                        No online profiles provided
                      </p>
                    )}
                </div>
              </div>
            </div>
          );

        case "resume":
          return (
            <div className="space-y-8">
              {/* Resume & Analysis */}
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="font-semibold text-lg text-gray-800">
                    <span className="flex items-center">
                      <ClipboardIcon className="h-5 w-5 mr-2 text-gray-500" />
                      Resume Analysis
                    </span>
                  </h3>

                  {selectedApplicant.resume_url && (
                    <button
                      onClick={() =>
                        handleDownloadResume(selectedApplicant.resume_url)
                      }
                      className="flex items-center gap-2 px-4 py-2 border border-blue-600 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors text-sm"
                    >
                      <EyeIcon className="h-4 w-4" />
                      View Resume
                    </button>
                  )}
                </div>

                {!selectedApplicant.resume_url ? (
                  <div className="text-center py-8">
                    <ClipboardIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No resume uploaded</p>
                  </div>
                ) : !analysis ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto mb-3"></div>
                    <p className="text-gray-500">Analyzing resume...</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <label className="text-sm text-gray-600 block mb-2">
                        Overall Match
                      </label>
                      {renderMatchRate(
                        (analysis.skillsMatch +
                          analysis.experienceMatch +
                          analysis.educationMatch) /
                          3
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-6 pt-4 border-t">
                      <div>
                        <label className="text-sm text-gray-600 block mb-2">
                          Skills Match
                        </label>
                        {renderMatchRate(analysis.skillsMatch)}
                      </div>
                      <div>
                        <label className="text-sm text-gray-600 block mb-2">
                          Experience Match
                        </label>
                        {renderMatchRate(analysis.experienceMatch)}
                      </div>
                      <div>
                        <label className="text-sm text-gray-600 block mb-2">
                          Education Match
                        </label>
                        {renderMatchRate(analysis.educationMatch)}
                      </div>
                    </div>

                    {analysis.keyInsights && (
                      <div className="pt-4 border-t">
                        <h4 className="font-medium text-gray-700 mb-2">
                          Key Insights
                        </h4>
                        <ul className="list-disc pl-5 space-y-1 text-gray-600">
                          {analysis.keyInsights.map((insight, idx) => (
                            <li key={idx}>{insight}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Key Skills from Resume */}
              {analysis && analysis.extractedSkills && (
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                  <h3 className="font-semibold text-lg mb-4 text-gray-800">
                    Skills Detected in Resume
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {analysis.extractedSkills.map((skill, index) => (
                      <span
                        key={index}
                        className={`px-3 py-1 rounded-full text-sm ${
                          analysis.relevantSkills?.includes(skill)
                            ? "bg-green-50 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );

        case "questions":
          return (
            <div className="space-y-8">
              {/* Screening Questions */}
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="font-semibold text-lg mb-4 text-gray-800">
                  <span className="flex items-center">
                    <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2 text-gray-500" />
                    Screening Questions
                  </span>
                </h3>

                {Object.keys(applicationQuestions).length === 0 ? (
                  <p className="text-gray-500 italic">
                    No screening questions available
                  </p>
                ) : (
                  <div className="space-y-4">
                    {Object.entries(applicationQuestions).map(
                      ([key, value]) => (
                        <div
                          key={key}
                          className="flex items-start gap-3 pb-3 border-b last:border-b-0"
                        >
                          <div
                            className={
                              value === "yes"
                                ? "text-emerald-500"
                                : "text-rose-500"
                            }
                          >
                            {value === "yes" ? (
                              <CheckCircleIcon className="h-5 w-5" />
                            ) : (
                              <XCircleIcon className="h-5 w-5" />
                            )}
                          </div>
                          <div>
                            <p className="text-gray-900">
                              {key
                                .replace(/([A-Z])/g, " $1")
                                .trim()
                                .replace(/^./, (str) => str.toUpperCase())}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              {value === "yes" ? "Yes" : "No"}
                            </p>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>
          );

        default:
          return <div>Select a tab to view applicant information</div>;
      }
    };

    return (
      <div className="w-2/3 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {personalInfo.given_name} {personalInfo.family_name}
              </h2>
              <p className="text-gray-600">
                Applied to:{" "}
                <span className="font-medium">{selectedApplicant.company}</span>
              </p>
              <div className="flex items-center mt-1 text-sm text-gray-500">
                <span>
                  Applied on {formatDate(selectedApplicant.created_at)}
                </span>
                <span className="mx-2">•</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${getBadgeColor(
                    selectedApplicant.status
                  )}`}
                >
                  {selectedApplicant.status
                    ? selectedApplicant.status.charAt(0).toUpperCase() +
                      selectedApplicant.status.slice(1)
                    : "Pending"}
                </span>
              </div>
            </div>
          </div>
          <Tabs /> {/* Add the Tabs component here */}
          {/* Content based on active tab */}
          {renderDetailContent()}
        </div>
        {/* Add PDF Modal */}
        {showPdfModal && (
          <PdfModal
            url={getPublicUrl(selectedApplicant.resume_url)}
            onClose={() => {
              setShowPdfModal(false);
              setPageNumber(1);
            }}
          />
        )}
      </div>
    );
  };

  const PdfModal = ({ url, onClose }) => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const onLoadError = (error) => {
      console.error("PDF loading error:", error);
      setError("Failed to load PDF. Please try downloading the file directly.");
      setIsLoading(false);
    };

    const onLoadSuccess = ({ numPages }) => {
      console.log("PDF loaded successfully");
      setNumPages(numPages);
      setIsLoading(false);
    };

    // Add direct download option
    const handleDirectDownload = () => {
      try {
        window.open(url, "_blank");
      } catch (error) {
        console.error("Error opening PDF:", error);
        alert("Could not open PDF. Try downloading directly.");
      }
    };

    if (!showPdfModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg w-full max-w-4xl h-[90vh] flex flex-col">
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="text-lg font-semibold">Resume Preview</h3>
            <div className="flex items-center gap-4">
              <button
                onClick={handleDirectDownload}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Download PDF
              </button>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-auto p-4">
            {error ? (
              <div className="text-center text-red-600 p-4">
                <p>{error}</p>
                <button
                  onClick={handleDirectDownload}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Download PDF Instead
                </button>
              </div>
            ) : (
              <Document
                file={url}
                onLoadSuccess={onLoadSuccess}
                onLoadError={onLoadError}
                loading={
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto mb-3"></div>
                    <p>Loading PDF...</p>
                  </div>
                }
                className="flex flex-col items-center"
              >
                <Page
                  pageNumber={pageNumber}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  loading="Loading page..."
                />
              </Document>
            )}
          </div>
          {numPages > 1 && (
            <div className="p-4 border-t flex justify-center items-center gap-4">
              <button
                onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
                disabled={pageNumber <= 1}
                className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <span>
                Page {pageNumber} of {numPages}
              </span>
              <button
                onClick={() =>
                  setPageNumber(Math.min(numPages, pageNumber + 1))
                }
                disabled={pageNumber >= numPages}
                className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <HRNavbar />
      <div className="max-w-7xl mx-auto px-4 py-8 pt-20">
        {/* Changed from py-8 to pt-20 to account for fixed navbar */}
        <h1 className="text-2xl font-bold mb-6">Applicants Review</h1>
        <div className="flex gap-6">
          {renderApplicantsList()}
          {renderApplicantDetails()}
        </div>
      </div>
    </div>
  );
}
