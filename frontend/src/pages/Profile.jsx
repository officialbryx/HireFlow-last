import React, { useState, useEffect } from "react";
import {
  PlusIcon,
  PencilIcon,
  XMarkIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import Navbar from "../components/Navbar";
import { api } from "../services/api";

const Profile = () => {
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state
  const [profile, setProfile] = useState({
    personalSummary: "",
    careerHistory: [],
    education: [],
    skills: [],
    resumeUrl: "",
    websites: [],
    linkedinUrl: "",
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
        <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
          <div className="text-red-500 text-center">
            <p>{error}</p>
            <button
              onClick={fetchProfile}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto pt-20 px-4 pb-12">
          {/* Personal Summary Section */}
          <section className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Personal Summary</h2>
              <button
                onClick={() =>
                  setIsEditing({ ...isEditing, summary: !isEditing.summary })
                }
                className="text-blue-600 hover:text-blue-700"
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
                  className="w-full h-32 p-2 border rounded-md"
                  placeholder="Add a personal summary..."
                />
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() =>
                      setIsEditing({ ...isEditing, summary: false })
                    }
                    className="px-4 py-2 text-gray-600 hover:text-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveSummary}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-600">
                {profile.personalSummary ||
                  "Add a personal summary to your profile..."}
              </p>
            )}
          </section>

          {/* Career History Section */}
          <section className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Career History</h2>
              <button
                onClick={() => setIsEditing({ ...isEditing, addingRole: true })}
                className="flex items-center text-blue-600 hover:text-blue-700"
              >
                <PlusIcon className="h-5 w-5 mr-1" />
                Add role
              </button>
            </div>

            {isEditing.addingRole && (
              <div className="border rounded-md p-4 mb-4 space-y-4">
                <input
                  type="text"
                  placeholder="Job Title"
                  value={newRole.jobTitle}
                  onChange={(e) =>
                    setNewRole({ ...newRole, jobTitle: e.target.value })
                  }
                  className="w-full p-2 border rounded-md"
                />
                <input
                  type="text"
                  placeholder="Company"
                  value={newRole.company}
                  onChange={(e) =>
                    setNewRole({ ...newRole, company: e.target.value })
                  }
                  className="w-full p-2 border rounded-md"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="date"
                    value={newRole.startDate}
                    onChange={(e) =>
                      setNewRole({ ...newRole, startDate: e.target.value })
                    }
                    className="w-full p-2 border rounded-md"
                  />
                  {!newRole.currentRole && (
                    <input
                      type="date"
                      value={newRole.endDate}
                      onChange={(e) =>
                        setNewRole({ ...newRole, endDate: e.target.value })
                      }
                      className="w-full p-2 border rounded-md"
                    />
                  )}
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newRole.currentRole}
                    onChange={(e) =>
                      setNewRole({ ...newRole, currentRole: e.target.checked })
                    }
                    className="mr-2"
                  />
                  <label>I currently work here</label>
                </div>
                <textarea
                  placeholder="Description"
                  value={newRole.description}
                  onChange={(e) =>
                    setNewRole({ ...newRole, description: e.target.value })
                  }
                  className="w-full h-32 p-2 border rounded-md"
                />
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() =>
                      setIsEditing({ ...isEditing, addingRole: false })
                    }
                    className="px-4 py-2 text-gray-600 hover:text-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddRole}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Save
                  </button>
                </div>
              </div>
            )}

            {profile.careerHistory.map((role, index) => (
              <div key={index} className="border-b last:border-0 py-4">
                <h3 className="font-semibold">{role.jobTitle}</h3>
                <p className="text-gray-600">{role.company}</p>
                <p className="text-sm text-gray-500">
                  {role.startDate} -{" "}
                  {role.currentRole ? "Present" : role.endDate}
                </p>
                <p className="mt-2">{role.description}</p>
              </div>
            ))}
          </section>

          {/* Education Section */}
          <section className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Education</h2>
              <button
                onClick={() =>
                  setIsEditing((prev) => ({ ...prev, addingEducation: true }))
                }
                className="flex items-center text-blue-600 hover:text-blue-700"
              >
                <PlusIcon className="h-5 w-5 mr-1" />
                Add education
              </button>
            </div>

            {/* Reuse the education form from MyExperience.jsx */}
            {/* ...copy the education form code here... */}
          </section>

          {/* Skills Section */}
          <section className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Skills</h2>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2 mb-4">
                {profile.skills.map((skill, index) => (
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
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleSkillsChange}
                placeholder="Type a skill and press Enter"
                className="w-full p-2 border rounded-md"
              />
            </div>
          </section>

          {/* Languages Section */}
          <section className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Languages</h2>
              {/* Add language button */}
            </div>
            {/* Languages list */}
          </section>

          {/* Resume Section */}
          <section className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Resume/CV</h2>
            <div className="space-y-4">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeUpload}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
              {profile.resumeUrl && (
                <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span className="text-sm text-gray-600">Current Resume</span>
                  <a
                    href={profile.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    View
                  </a>
                </div>
              )}
            </div>
          </section>

          {/* Websites Section */}
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Professional Links</h2>
            {/* Reuse the websites section from MyExperience.jsx */}
            {/* ...copy the websites form code here... */}
          </section>
        </div>
      </div>
    </>
  );
};

export default Profile;
