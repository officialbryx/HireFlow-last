import React, { useState, useEffect } from "react";
import {
  PlusIcon,
  PencilIcon,
  XMarkIcon,
  TrashIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  UserIcon,
  DocumentTextIcon,
  DocumentArrowUpIcon,
  GlobeAltIcon,
  LanguageIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";
import Navbar from "../components/Navbar";
import { api } from "../services/api";

const Profile = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState({
    personalSummary: "",
    careerHistory: [],
    education: [],
    skills: [],
    resumeUrl: "",
    websites: [],
    linkedinUrl: "",
    languages: [],
  });
  const [skillInput, setSkillInput] = useState("");
  const [isEditing, setIsEditing] = useState({
    summary: false,
    addingRole: false,
    addingEducation: false,
    addingCertification: false,
  });
  const [newRole, setNewRole] = useState({
    jobTitle: "",
    company: "",
    startDate: "",
    endDate: "",
    currentRole: false,
    description: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const { user, profile: userProfile } = await api.getUserProfile();

      // Initialize with empty arrays if data doesn't exist
      setProfile({
        personalSummary: userProfile?.personal_summary || "",
        careerHistory: userProfile?.career_history || [],
        education: userProfile?.education || [],
        certifications: userProfile?.certifications || [],
        skills: userProfile?.skills || [],
        languages: userProfile?.languages || [],
        resumeUrl: userProfile?.resume_url || "",
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      setError("Failed to load profile data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSummary = async () => {
    try {
      await api.updateUserProfile({
        ...profile,
        updated_at: new Date().toISOString(),
      });
      setIsEditing({ ...isEditing, summary: false });
    } catch (error) {
      console.error("Error updating summary:", error);
    }
  };

  const handleAddRole = async () => {
    try {
      const updatedHistory = [...profile.careerHistory, newRole];
      await api.updateUserProfile({
        ...profile,
        careerHistory: updatedHistory,
        updated_at: new Date().toISOString(),
      });
      setProfile({ ...profile, careerHistory: updatedHistory });
      setIsEditing({ ...isEditing, addingRole: false });
      setNewRole({
        jobTitle: "",
        company: "",
        startDate: "",
        endDate: "",
        currentRole: false,
        description: "",
      });
    } catch (error) {
      console.error("Error adding role:", error);
    }
  };

  const handleSkillsChange = (e) => {
    if (e.key === "Enter" && skillInput.trim()) {
      e.preventDefault();
      const newSkill = skillInput.trim();
      if (!profile.skills.includes(newSkill)) {
        setProfile((prev) => ({
          ...prev,
          skills: [...prev.skills, newSkill],
        }));
        handleSave({ ...profile, skills: [...profile.skills, newSkill] });
      }
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove) => {
    const updatedSkills = profile.skills.filter(
      (skill) => skill !== skillToRemove
    );
    setProfile((prev) => ({
      ...prev,
      skills: updatedSkills,
    }));
    handleSave({ ...profile, skills: updatedSkills });
  };

  const handleSave = async (updatedProfile) => {
    try {
      await api.updateUserProfile({
        ...updatedProfile,
        updated_at: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to save changes");
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const resumePath = await api.uploadResume(file);
        setProfile((prev) => ({
          ...prev,
          resumeUrl: resumePath,
        }));
        handleSave({ ...profile, resumeUrl: resumePath });
      } catch (error) {
        console.error("Error uploading resume:", error);
        alert("Failed to upload resume");
      }
    }
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pt-16 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pt-16 flex items-center justify-center">
          <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
            <div className="text-red-500 text-xl mb-4">Error</div>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={fetchProfile}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 shadow-md"
            >
              Retry
            </button>
          </div>
        </div>
      </>
    );
  }

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="max-w-5xl mx-auto pt-24 px-6 pb-16">
          {/* Profile Header */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
            <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6 pt-10">
              <div className="bg-white p-3 rounded-full shadow-md z-10">
                <div className="bg-gray-200 rounded-full w-20 h-20 flex items-center justify-center">
                  <UserIcon className="h-10 w-10 text-gray-500" />
                </div>
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-800">
                  Professional Profile
                </h1>
                <p className="text-gray-500">
                  Complete your profile to showcase your experience and skills
                </p>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <span>Last updated: {new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Personal Summary Section */}
          <section className="bg-white rounded-xl shadow-md p-6 mb-6 transform transition duration-300 hover:shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <UserIcon className="h-5 w-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Personal Summary
                </h2>
              </div>
              <button
                onClick={() =>
                  setIsEditing({ ...isEditing, summary: !isEditing.summary })
                }
                className="text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 p-2 rounded-lg transition duration-200"
              >
                <PencilIcon className="h-5 w-5" />
              </button>
            </div>
            {isEditing.summary ? (
              <div className="space-y-4">
                <textarea
                  value={profile.personalSummary}
                  onChange={(e) =>
                    setProfile({ ...profile, personalSummary: e.target.value })
                  }
                  className="w-full h-40 p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-200"
                  placeholder="Add a personal summary that highlights your expertise, experience, and career goals..."
                />
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() =>
                      setIsEditing({ ...isEditing, summary: false })
                    }
                    className="px-4 py-2 text-gray-600 hover:text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveSummary}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 shadow-sm"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <p className="text-gray-700 leading-relaxed">
                  {profile.personalSummary || (
                    <span className="text-gray-400 italic">
                      Add a personal summary to highlight your expertise,
                      experience, and career goals...
                    </span>
                  )}
                </p>
              </div>
            )}
          </section>

          {/* Career History Section */}
          <section className="bg-white rounded-xl shadow-md p-6 mb-6 transform transition duration-300 hover:shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-100 p-2 rounded-lg">
                  <BriefcaseIcon className="h-5 w-5 text-indigo-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Career History
                </h2>
              </div>
              <button
                onClick={() => setIsEditing({ ...isEditing, addingRole: true })}
                className="flex items-center gap-1 text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg transition duration-200"
              >
                <PlusIcon className="h-5 w-5" />
                <span>Add role</span>
              </button>
            </div>

            {isEditing.addingRole && (
              <div className="border border-blue-100 rounded-lg p-6 mb-6 bg-blue-50 space-y-4">
                <h3 className="font-medium text-blue-800 mb-2">
                  Add Work Experience
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Job Title"
                    value={newRole.jobTitle}
                    onChange={(e) =>
                      setNewRole({ ...newRole, jobTitle: e.target.value })
                    }
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Company"
                    value={newRole.company}
                    onChange={(e) =>
                      setNewRole({ ...newRole, company: e.target.value })
                    }
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={newRole.startDate}
                      onChange={(e) =>
                        setNewRole({ ...newRole, startDate: e.target.value })
                      }
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                  {!newRole.currentRole && (
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={newRole.endDate}
                        onChange={(e) =>
                          setNewRole({ ...newRole, endDate: e.target.value })
                        }
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </div>
                  )}
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="currentRole"
                    checked={newRole.currentRole}
                    onChange={(e) =>
                      setNewRole({ ...newRole, currentRole: e.target.checked })
                    }
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="currentRole" className="ml-2 text-gray-700">
                    I currently work here
                  </label>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Description
                  </label>
                  <textarea
                    placeholder="Describe your responsibilities, achievements, and skills used in this role"
                    value={newRole.description}
                    onChange={(e) =>
                      setNewRole({ ...newRole, description: e.target.value })
                    }
                    className="w-full h-32 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    onClick={() =>
                      setIsEditing({ ...isEditing, addingRole: false })
                    }
                    className="px-4 py-2 text-gray-600 hover:text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddRole}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 shadow-sm"
                  >
                    Save
                  </button>
                </div>
              </div>
            )}

            {profile.careerHistory.length > 0 ? (
              <div className="space-y-6">
                {profile.careerHistory.map((role, index) => (
                  <div
                    key={index}
                    className="p-4 border-l-4 border-indigo-400 bg-white rounded-r-lg shadow-sm hover:shadow-md transition duration-200"
                  >
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-800">
                          {role.jobTitle}
                        </h3>
                        <p className="text-indigo-600 font-medium">
                          {role.company}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {formatDate(role.startDate)} -{" "}
                          {role.currentRole
                            ? "Present"
                            : formatDate(role.endDate)}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button className="text-gray-400 hover:text-gray-600 p-1">
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button className="text-gray-400 hover:text-red-600 p-1">
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <p className="mt-3 text-gray-700 leading-relaxed">
                      {role.description}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-8 text-center border border-dashed border-gray-300">
                <BriefcaseIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No work experience added yet.</p>
                <button
                  onClick={() =>
                    setIsEditing({ ...isEditing, addingRole: true })
                  }
                  className="mt-4 text-blue-600 hover:text-blue-700"
                >
                  + Add your work experience
                </button>
              </div>
            )}
          </section>

          {/* Education Section */}
          <section className="bg-white rounded-xl shadow-md p-6 mb-6 transform transition duration-300 hover:shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <AcademicCapIcon className="h-5 w-5 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Education
                </h2>
              </div>
              <button
                onClick={() =>
                  setIsEditing((prev) => ({ ...prev, addingEducation: true }))
                }
                className="flex items-center gap-1 text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg transition duration-200"
              >
                <PlusIcon className="h-5 w-5" />
                <span>Add education</span>
              </button>
            </div>

            {/* Education placeholder - similar structure to career section */}
            <div className="bg-gray-50 rounded-lg p-8 text-center border border-dashed border-gray-300">
              <AcademicCapIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No education history added yet.</p>
              <button
                onClick={() =>
                  setIsEditing((prev) => ({ ...prev, addingEducation: true }))
                }
                className="mt-4 text-blue-600 hover:text-blue-700"
              >
                + Add your education
              </button>
            </div>
          </section>

          {/* Skills Section */}
          <section className="bg-white rounded-xl shadow-md p-6 mb-6 transform transition duration-300 hover:shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-yellow-100 p-2 rounded-lg">
                  <WrenchScrewdriverIcon className="h-5 w-5 text-yellow-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Skills</h2>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2 mb-4">
                {profile.skills.length > 0 ? (
                  profile.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-800 px-4 py-2 rounded-full flex items-center shadow-sm"
                    >
                      {skill}
                      <button
                        className="ml-2 hover:bg-blue-200 p-1 rounded-full transition-colors duration-200"
                        onClick={() => removeSkill(skill)}
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500 italic">
                    Add skills to showcase your expertise...
                  </p>
                )}
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleSkillsChange}
                  placeholder="Type a skill and press Enter"
                  className="w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
                <PlusIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
              </div>
              <p className="text-sm text-gray-500">
                Press Enter to add a new skill
              </p>
            </div>
          </section>

          {/* Languages Section */}
          <section className="bg-white rounded-xl shadow-md p-6 mb-6 transform transition duration-300 hover:shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <LanguageIcon className="h-5 w-5 text-purple-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Languages
                </h2>
              </div>
              <button className="flex items-center gap-1 text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg transition duration-200">
                <PlusIcon className="h-5 w-5" />
                <span>Add language</span>
              </button>
            </div>

            {/* Languages placeholder */}
            <div className="bg-gray-50 rounded-lg p-8 text-center border border-dashed border-gray-300">
              <LanguageIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No languages added yet.</p>
              <button className="mt-4 text-blue-600 hover:text-blue-700">
                + Add languages you speak
              </button>
            </div>
          </section>

          {/* Resume Section */}
          <section className="bg-white rounded-xl shadow-md p-6 mb-6 transform transition duration-300 hover:shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-red-100 p-2 rounded-lg">
                  <DocumentTextIcon className="h-5 w-5 text-red-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Resume/CV
                </h2>
              </div>
            </div>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50">
                <DocumentArrowUpIcon className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-4">
                  Drag and drop your resume here, or click to browse
                </p>
                <input
                  type="file"
                  id="resume-upload"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeUpload}
                  className="hidden"
                />
                <label
                  htmlFor="resume-upload"
                  className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 shadow-sm cursor-pointer"
                >
                  Upload Resume
                </label>
                <p className="text-xs text-gray-500 mt-4">
                  Supported formats: PDF, DOC, DOCX
                </p>
              </div>

              {profile.resumeUrl && (
                <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <div className="flex items-center">
                    <DocumentTextIcon className="h-8 w-8 text-blue-600 mr-3" />
                    <div>
                      <p className="font-medium text-gray-800">
                        Current Resume
                      </p>
                      <p className="text-sm text-gray-500">
                        Uploaded on {new Date().toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <a
                      href={profile.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-white text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition duration-200"
                    >
                      View
                    </a>
                    <button className="px-4 py-2 bg-white text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-200">
                      Replace
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Websites Section */}
          <section className="bg-white rounded-xl shadow-md p-6 transform transition duration-300 hover:shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-teal-100 p-2 rounded-lg">
                  <GlobeAltIcon className="h-5 w-5 text-teal-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Professional Links
                </h2>
              </div>
              <button className="flex items-center gap-1 text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg transition duration-200">
                <PlusIcon className="h-5 w-5" />
                <span>Add link</span>
              </button>
            </div>

            {/* Websites placeholder */}
            <div className="bg-gray-50 rounded-lg p-8 text-center border border-dashed border-gray-300">
              <GlobeAltIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No professional links added yet.</p>
              <p className="text-sm text-gray-400 mt-2">
                Add your LinkedIn, portfolio, or personal website
              </p>
              <button className="mt-4 text-blue-600 hover:text-blue-700">
                + Add your first link
              </button>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default Profile;
