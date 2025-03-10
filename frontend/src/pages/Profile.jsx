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
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import Navbar from "../components/Navbar";
import DateMonthPicker from "../components/DateMonthPicker";
import { api } from "../services/api";
import MonthYearPicker from "../components/DateMonthPicker";

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

const countries = [
  { code: "PH", name: "Philippines" },
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  // Add more as needed
];

const suffixOptions = [
  "I",
  "II",
  "III",
  "IV",
  "V",
  "VI",
  "VII",
  "VIII",
  "IX",
  "Jr",
  "Sr",
];

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
    email: "",
    phoneType: "",
    phoneCode: "",
    phoneNumber: "",
    country: "",
    street: "",
    additionalAddress: "",
    city: "",
    province: "",
    postalCode: "",
    givenName: "",
    middleName: "",
    familyName: "",
    suffix: "",
  });
  const [skillInput, setSkillInput] = useState("");
  const [isEditing, setIsEditing] = useState({
    summary: false,
    addingRole: false,
    addingEducation: false,
    addingCertification: false,
    contact: false,
    address: false,
    links: false,
    personalInfo: false,
  });
  const [newRole, setNewRole] = useState({
    jobTitle: "",
    company: "",
    startDate: "",
    endDate: "",
    currentRole: false,
    description: "",
  });
  const [newEducation, setNewEducation] = useState({
    school: "",
    degree: "",
    fieldOfStudy: "",
    fromYear: "",
    toYear: "",
    gpa: "",
    currentlyStudying: false,
  });

  const [editingRoleIndex, setEditingRoleIndex] = useState(null);

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
        email: userProfile?.email || "",
        phoneType: userProfile?.phone_type || "",
        phoneCode: userProfile?.phone_code || "",
        phoneNumber: userProfile?.phone_number || "",
        country: userProfile?.country || "",
        street: userProfile?.street || "",
        additionalAddress: userProfile?.additional_address || "",
        city: userProfile?.city || "",
        province: userProfile?.province || "",
        postalCode: userProfile?.postal_code || "",
        givenName: user?.first_name || "",
        middleName: user?.middle_name || "",
        familyName: user?.last_name || "",
        suffix: userProfile?.suffix || "",
        linkedinUrl: userProfile?.linkedin_url || "",
        websites: userProfile?.websites || [],
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
      let updatedHistory;

      if (editingRoleIndex !== null) {
        // Edit existing role
        updatedHistory = [...profile.careerHistory];
        updatedHistory[editingRoleIndex] = newRole;
      } else {
        // Add new role
        updatedHistory = [...profile.careerHistory, newRole];
      }

      setProfile({ ...profile, careerHistory: updatedHistory });
      await handleSave({ ...profile, careerHistory: updatedHistory });

      setIsEditing({ ...isEditing, addingRole: false, editingRole: false });
      setEditingRoleIndex(null);
      setNewRole({
        jobTitle: "",
        company: "",
        startDate: "",
        endDate: "",
        currentRole: false,
        description: "",
      });
    } catch (error) {
      console.error("Error saving role:", error);
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

  const handleSave = async (updatedProfile = profile) => {
    try {
      // Prepare data for saving to profiles table
      const profileData = {
        personal_summary: updatedProfile.personalSummary,
        career_history: updatedProfile.careerHistory,
        education: updatedProfile.education,
        certifications: updatedProfile.certifications,
        skills: updatedProfile.skills,
        languages: updatedProfile.languages,
        resume_url: updatedProfile.resumeUrl,
        email: updatedProfile.email,
        phone_type: updatedProfile.phoneType,
        phone_code: updatedProfile.phoneCode,
        phone_number: updatedProfile.phoneNumber,
        country: updatedProfile.country,
        street: updatedProfile.street,
        additional_address: updatedProfile.additionalAddress,
        city: updatedProfile.city,
        province: updatedProfile.province,
        postal_code: updatedProfile.postalCode,
        suffix: updatedProfile.suffix,
        linkedin_url: updatedProfile.linkedinUrl,
        websites: updatedProfile.websites,
        // User table fields are updated separately through user profile
        first_name: updatedProfile.givenName,
        middle_name: updatedProfile.middleName,
        last_name: updatedProfile.familyName,
        updated_at: new Date().toISOString(),
      };

      await api.updateUserProfile(profileData);

      // Show success message
      alert("Profile saved successfully!");
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

  const handleEducationChange = async () => {
    try {
      const updatedEducation = [...profile.education, newEducation];
      await api.updateUserProfile({
        ...profile,
        education: updatedEducation,
        updated_at: new Date().toISOString(),
      });
      setProfile({ ...profile, education: updatedEducation });
      setIsEditing({ ...isEditing, addingEducation: false });
      setNewEducation({
        school: "",
        degree: "",
        fieldOfStudy: "",
        fromYear: "",
        toYear: "",
        gpa: "",
        currentlyStudying: false,
      });
    } catch (error) {
      console.error("Error adding education:", error);
    }
  };

  const monthInputStyles = (fieldName) =>
    `w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none cursor-pointer`;

  const handleEditField = (field, isEditing) => {
    setIsEditing((prev) => ({
      ...prev,
      [field]: isEditing,
    }));
  };

  const handlePencilClick = (index) => {
    // Functionality to handle editing specific career history item
    const newCareerHistory = [...profile.careerHistory];
    setNewRole({ ...newCareerHistory[index] });
    setEditingRoleIndex(index);
    setIsEditing({ ...isEditing, editingRole: true });
  };

  const handleDeleteRole = async (index) => {
    try {
      const updatedHistory = profile.careerHistory.filter(
        (_, i) => i !== index
      );
      setProfile({ ...profile, careerHistory: updatedHistory });
      await handleSave({ ...profile, careerHistory: updatedHistory });
    } catch (error) {
      console.error("Error deleting role:", error);
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

          {/* Personal Information Section */}
          <section className="bg-white rounded-xl shadow-md p-6 mb-6 transform transition duration-300 hover:shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <UserIcon className="h-5 w-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Personal Information
                </h2>
              </div>
              <button
                onClick={() =>
                  setIsEditing({
                    ...isEditing,
                    personalInfo: !isEditing.personalInfo,
                  })
                }
                className="text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 p-2 rounded-lg transition duration-200"
              >
                <PencilIcon className="h-5 w-5" />
              </button>
            </div>
            {isEditing.personalInfo ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={profile.firstName}
                      onChange={(e) =>
                        setProfile({ ...profile, firstName: e.target.value })
                      }
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="Enter your first name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Middle Name
                    </label>
                    <input
                      type="text"
                      value={profile.middleName}
                      onChange={(e) =>
                        setProfile({ ...profile, middleName: e.target.value })
                      }
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="Enter your middle name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={profile.lastName}
                      onChange={(e) =>
                        setProfile({ ...profile, lastName: e.target.value })
                      }
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="Enter your last name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Suffix
                    </label>
                    <select
                      value={profile.suffix}
                      onChange={(e) =>
                        setProfile({ ...profile, suffix: e.target.value })
                      }
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                    >
                      <option value="">Select suffix</option>
                      {suffixOptions.map((suffix) => (
                        <option key={suffix} value={suffix}>
                          {suffix}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                {/* Save buttons */}
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() =>
                      setIsEditing({ ...isEditing, personalInfo: false })
                    }
                    className="px-4 py-2 text-gray-600 hover:text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 shadow-sm"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-gray-600">
                  {profile.firstName || profile.lastName ? (
                    <>
                      {profile.firstName} {profile.middleName}{" "}
                      {profile.lastName}
                      {profile.suffix && `, ${profile.suffix}`}
                    </>
                  ) : (
                    "No personal information provided"
                  )}
                </p>
              </div>
            )}
          </section>

          {/* Contact Information Section */}
          <section className="bg-white rounded-xl shadow-md p-6 mb-6 transform transition duration-300 hover:shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <PhoneIcon className="h-5 w-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Contact Information
                </h2>
              </div>
              <button
                onClick={() =>
                  setIsEditing({ ...isEditing, contact: !isEditing.contact })
                }
                className="text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 p-2 rounded-lg transition duration-200"
              >
                <PencilIcon className="h-5 w-5" />
              </button>
            </div>
            {isEditing.contact ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) =>
                        setProfile({ ...profile, email: e.target.value })
                      }
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Phone Type
                    </label>
                    <select
                      value={profile.phoneType}
                      onChange={(e) =>
                        setProfile({ ...profile, phoneType: e.target.value })
                      }
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                    >
                      <option value="">Select type</option>
                      <option value="mobile">Mobile</option>
                      <option value="home">Home</option>
                      <option value="work">Work</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Phone Code
                    </label>
                    <select
                      value={profile.phoneCode}
                      onChange={(e) =>
                        setProfile({ ...profile, phoneCode: e.target.value })
                      }
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                    >
                      <option value="">Select code</option>
                      <option value="+63">+63 (Philippines)</option>
                      <option value="+1">+1 (US/Canada)</option>
                      <option value="+44">+44 (UK)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={profile.phoneNumber}
                      onChange={(e) =>
                        setProfile({ ...profile, phoneNumber: e.target.value })
                      }
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>
                {/* Save buttons */}
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() =>
                      setIsEditing({ ...isEditing, contact: false })
                    }
                    className="px-4 py-2 text-gray-600 hover:text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 shadow-sm"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-gray-600">
                  <EnvelopeIcon className="h-5 w-5 inline-block mr-2" />
                  {profile.email || "No email provided"}
                </p>
                <p className="text-gray-600">
                  <PhoneIcon className="h-5 w-5 inline-block mr-2" />
                  {profile.phoneCode && profile.phoneNumber
                    ? `${profile.phoneCode} ${profile.phoneNumber} (${profile.phoneType})`
                    : "No phone number provided"}
                </p>
              </div>
            )}
          </section>

          {/* Address Section */}
          <section className="bg-white rounded-xl shadow-md p-6 mb-6 transform transition duration-300 hover:shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <MapPinIcon className="h-5 w-5 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Address</h2>
              </div>
              <button
                onClick={() =>
                  setIsEditing({ ...isEditing, address: !isEditing.address })
                }
                className="text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 p-2 rounded-lg transition duration-200"
              >
                <PencilIcon className="h-5 w-5" />
              </button>
            </div>
            {isEditing.address ? (
              <div className="space-y-4">
                {/* Address form fields */}
                <div className="grid grid-cols-1 gap-4">
                  <select
                    value={profile.country}
                    onChange={(e) =>
                      setProfile({ ...profile, country: e.target.value })
                    }
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                  >
                    <option value="">Select Country</option>
                    {countries.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Street Address"
                    value={profile.street}
                    onChange={(e) =>
                      setProfile({ ...profile, street: e.target.value })
                    }
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Additional Address (Optional)"
                    value={profile.additionalAddress}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        additionalAddress: e.target.value,
                      })
                    }
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="City"
                    value={profile.city}
                    onChange={(e) =>
                      setProfile({ ...profile, city: e.target.value })
                    }
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Province/State"
                    value={profile.province}
                    onChange={(e) =>
                      setProfile({ ...profile, province: e.target.value })
                    }
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Postal Code"
                    value={profile.postalCode}
                    onChange={(e) =>
                      setProfile({ ...profile, postalCode: e.target.value })
                    }
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
                {/* Save buttons */}
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() =>
                      setIsEditing({ ...isEditing, address: false })
                    }
                    className="px-4 py-2 text-gray-600 hover:text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 shadow-sm"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-gray-600">
                  {profile.street ? (
                    <>
                      {profile.street}
                      {profile.additionalAddress && (
                        <>, {profile.additionalAddress}</>
                      )}
                      <br />
                      {profile.city}, {profile.province} {profile.postalCode}
                      <br />
                      {countries.find((c) => c.code === profile.country)?.name}
                    </>
                  ) : (
                    "No address provided"
                  )}
                </p>
              </div>
            )}
          </section>

          {/* Professional Links Section */}
          <section className="bg-white rounded-xl shadow-md p-6 mb-6 transform transition duration-300 hover:shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-teal-100 p-2 rounded-lg">
                  <GlobeAltIcon className="h-5 w-5 text-teal-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Professional Links
                </h2>
              </div>
              <button
                onClick={() =>
                  setIsEditing({ ...isEditing, links: !isEditing.links })
                }
                className="text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 p-2 rounded-lg transition duration-200"
              >
                <PencilIcon className="h-5 w-5" />
              </button>
            </div>
            {isEditing.links ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    LinkedIn Profile
                  </label>
                  <input
                    type="url"
                    placeholder="https://www.linkedin.com/in/yourprofile"
                    value={profile.linkedinUrl}
                    onChange={(e) =>
                      setProfile({ ...profile, linkedinUrl: e.target.value })
                    }
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
                {/* Save buttons */}
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setIsEditing({ ...isEditing, links: false })}
                    className="px-4 py-2 text-gray-600 hover:text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 shadow-sm"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {profile.linkedinUrl ? (
                  <a
                    href={profile.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 flex items-center"
                  >
                    <GlobeAltIcon className="h-5 w-5 mr-2" />
                    LinkedIn Profile
                  </a>
                ) : (
                  <p className="text-gray-500">No LinkedIn profile provided</p>
                )}
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
                  <MonthYearPicker
                    label="Start Date"
                    id="role-start-date"
                    value={newRole.startDate}
                    onChange={(value) =>
                      setNewRole({ ...newRole, startDate: value })
                    }
                    placeholder="Select start date"
                  />

                  {!newRole.currentRole && (
                    <MonthYearPicker
                      label="End Date"
                      id="role-end-date"
                      value={newRole.endDate}
                      onChange={(value) =>
                        setNewRole({ ...newRole, endDate: value })
                      }
                      placeholder="Select end date"
                    />
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

            {profile.careerHistory.length > 0 && (
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
                          {new Date(role.startDate).toLocaleDateString(
                            "en-US",
                            { year: "numeric", month: "long" }
                          )}{" "}
                          -{" "}
                          {role.currentRole
                            ? "Present"
                            : new Date(role.endDate).toLocaleDateString(
                                "en-US",
                                { year: "numeric", month: "long" }
                              )}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          className="text-gray-400 hover:text-gray-600 p-1"
                          onClick={() => handlePencilClick(index)}
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          className="text-gray-400 hover:text-red-600 p-1"
                          onClick={() => handleDeleteRole(index)}
                        >
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
                  setIsEditing({ ...isEditing, addingEducation: true })
                }
                className="flex items-center gap-1 text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg transition duration-200"
              >
                <PlusIcon className="h-5 w-5" />
                <span>Add education</span>
              </button>
            </div>

            {isEditing.addingEducation && (
              <div className="border border-blue-100 rounded-lg p-6 mb-6 bg-blue-50 space-y-4">
                <h3 className="font-medium text-blue-800 mb-2">
                  Add Education
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="School or University"
                    value={newEducation.school}
                    onChange={(e) =>
                      setNewEducation({
                        ...newEducation,
                        school: e.target.value,
                      })
                    }
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  <select
                    value={newEducation.degree}
                    onChange={(e) =>
                      setNewEducation({
                        ...newEducation,
                        degree: e.target.value,
                      })
                    }
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                  >
                    <option value="">Select Degree</option>
                    {degreeOptions.map((degree) => (
                      <option key={degree} value={degree}>
                        {degree}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Field of Study"
                    value={newEducation.fieldOfStudy}
                    onChange={(e) =>
                      setNewEducation({
                        ...newEducation,
                        fieldOfStudy: e.target.value,
                      })
                    }
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  <input
                    type="text"
                    placeholder="GPA (optional)"
                    value={newEducation.gpa}
                    onChange={(e) =>
                      setNewEducation({ ...newEducation, gpa: e.target.value })
                    }
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <MonthYearPicker
                    label="Start Date"
                    id="education-start-date"
                    value={newEducation.fromYear}
                    onChange={(value) =>
                      setNewEducation({ ...newEducation, fromYear: value })
                    }
                    placeholder="Select start date"
                  />

                  {!newEducation.currentlyStudying && (
                    <MonthYearPicker
                      label="End Date"
                      id="education-end-date"
                      value={newEducation.toYear}
                      onChange={(value) =>
                        setNewEducation({ ...newEducation, toYear: value })
                      }
                      placeholder="Select end date"
                    />
                  )}
                </div>

                <div className="flex items-center mt-2">
                  <input
                    type="checkbox"
                    id="currentlyStudying"
                    checked={newEducation.currentlyStudying}
                    onChange={(e) =>
                      setNewEducation({
                        ...newEducation,
                        currentlyStudying: e.target.checked,
                        toYear: e.target.checked ? "" : newEducation.toYear,
                      })
                    }
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label
                    htmlFor="currentlyStudying"
                    className="ml-2 text-gray-700"
                  >
                    I am currently studying here
                  </label>
                </div>
                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    onClick={() =>
                      setIsEditing({ ...isEditing, addingEducation: false })
                    }
                    className="px-4 py-2 text-gray-600 hover:text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleEducationChange}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 shadow-sm"
                  >
                    Save
                  </button>
                </div>
              </div>
            )}

            {profile.education.length > 0 && (
              <div className="space-y-6">
                {profile.education.map((edu, index) => (
                  <div
                    key={index}
                    className="p-4 border-l-4 border-green-400 bg-white rounded-r-lg shadow-sm hover:shadow-md transition duration-200"
                  >
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-800">
                          {edu.degree}
                        </h3>
                        <p className="text-green-600 font-medium">
                          {edu.school}
                        </p>
                        <p className="text-gray-600">{edu.fieldOfStudy}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {new Date(edu.fromYear).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                          })}{" "}
                          -{" "}
                          {edu.currentlyStudying
                            ? "Present"
                            : new Date(edu.toYear).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                              })}
                        </p>
                        {edu.gpa && (
                          <p className="text-sm text-gray-500">
                            GPA: {edu.gpa}
                          </p>
                        )}
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
                  </div>
                ))}
              </div>
            )}
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
