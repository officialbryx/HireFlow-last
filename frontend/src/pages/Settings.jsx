import { useState, useEffect } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { api } from "../services/api";
import { validatePassword } from "../utils/passwordValidation";
import Navbar from "../components/Navbar";
import HRNavbar from "../components/HRNavbar";

const Settings = () => {
  // Add userType state
  const [userType, setUserType] = useState(null);
  
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    headline: "",
    about: "",
    location: "",
    email: "",
    phone: "",
  });

  const [securityData, setSecurityData] = useState({
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordValidation, setPasswordValidation] = useState({
    isValid: false,
    requirements: [],
    meetsComplexityRequirement: false,
    isCommonPassword: false,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { user, profile } = await api.getUserProfile();

        // Set user type
        setUserType(profile.user_type);

        const userData = {
          firstName: profile.first_name || user.user_metadata?.first_name || "",
          middleName:
            profile.middle_name || user.user_metadata?.middle_name || "",
          lastName: profile.last_name || user.user_metadata?.last_name || "",
          email: profile.email || user.email,
          phone: profile.phone || "",
          headline: profile.headline || "",
          about: profile.about || "",
          location: profile.location || "",
        };

        setProfileData(userData);

        setSecurityData((prev) => ({
          ...prev,
          email: user.email,
        }));
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError("Failed to load profile data");
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (passwordData.newPassword) {
      setPasswordValidation(validatePassword(passwordData.newPassword));
    }
  }, [passwordData.newPassword]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await api.updateUserProfile({
        first_name: profileData.firstName,
        middle_name: profileData.middleName,
        last_name: profileData.lastName,
        headline: profileData.headline,
        about: profileData.about,
        location: profileData.location,
        phone: profileData.phone,
        updated_at: new Date().toISOString(),
      });

      setIsEditing(false);
      setSuccess("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile");
    }
  };

  const handleEmailUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      if (securityData.email !== profileData.email) {
        await api.updateUserEmail(securityData.email);
        setSuccess("Email updated successfully! Please verify your new email.");
      }
    } catch (error) {
      console.error("Error updating email:", error);
      setError("Failed to update email");
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      // Validate password requirements
      if (!passwordValidation.isValid) {
        setError("Please meet all password requirements");
        return;
      }

      // Check if passwords match
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      // Call API to update password
      await api.updateUserPassword(passwordData.newPassword);

      // Reset form and show success
      setPasswordData({ newPassword: "", confirmPassword: "" });
      setSuccess("Password updated successfully!");
    } catch (error) {
      console.error("Error updating password:", error);
      setError(error.message || "Failed to update password");
    }
  };

  const renderProfileForm = () => (
    <form onSubmit={handleProfileUpdate} className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Profile Settings</h2>
        <button
          type="button"
          onClick={() => setIsEditing(!isEditing)}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
            isEditing
              ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
              : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
          }`}
        >
          {isEditing ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      {!isEditing ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            <DisplayField label="First Name" value={profileData.firstName} />
            <DisplayField label="Middle Name" value={profileData.middleName} />
            <DisplayField label="Last Name" value={profileData.lastName} />
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <DisplayField label="Email" value={profileData.email} />
            <DisplayField label="Phone" value={profileData.phone} />
          </div>
          <DisplayField label="Headline" value={profileData.headline} />
          <DisplayField label="Location" value={profileData.location} />
          <DisplayField label="About" value={profileData.about} isTextArea />
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <InputField
              label="First Name"
              value={profileData.firstName}
              onChange={(e) =>
                setProfileData({ ...profileData, firstName: e.target.value })
              }
            />
            <InputField
              label="Middle Name"
              value={profileData.middleName}
              onChange={(e) =>
                setProfileData({ ...profileData, middleName: e.target.value })
              }
            />
            <InputField
              label="Last Name"
              value={profileData.lastName}
              onChange={(e) =>
                setProfileData({ ...profileData, lastName: e.target.value })
              }
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <InputField
              label="Email"
              type="email"
              value={profileData.email}
              onChange={(e) =>
                setProfileData({ ...profileData, email: e.target.value })
              }
              disabled
            />
            <InputField
              label="Phone"
              value={profileData.phone}
              onChange={(e) =>
                setProfileData({ ...profileData, phone: e.target.value })
              }
            />
          </div>

          <div className="mb-6">
            <InputField
              label="Headline"
              value={profileData.headline}
              onChange={(e) =>
                setProfileData({ ...profileData, headline: e.target.value })
              }
              placeholder="Your professional headline"
            />
          </div>

          <div className="mb-6">
            <InputField
              label="Location"
              value={profileData.location}
              onChange={(e) =>
                setProfileData({ ...profileData, location: e.target.value })
              }
              placeholder="City, Country"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              About
            </label>
            <textarea
              rows="4"
              value={profileData.about}
              onChange={(e) =>
                setProfileData({ ...profileData, about: e.target.value })
              }
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              placeholder="Tell us about yourself"
            />
          </div>

          <button
            type="submit"
            className="w-full md:w-auto bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center"
          >
            Save Changes
          </button>
        </div>
      )}
    </form>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {userType === 'jobseeker' ? <Navbar /> : <HRNavbar />}
      <div className="pt-20 px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 md:mb-0">
              Account Settings
            </h1>
            <div className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleDateString()}
            </div>
          </div>

          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-start">
              <svg
                className="h-5 w-5 mr-2 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{success}</span>
            </div>
          )}

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
              <svg
                className="h-5 w-5 mr-2 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-64 bg-white rounded-xl shadow-sm border border-gray-100 p-2">
              <nav className="space-y-1">
                {[
                  { id: "profile", label: "Profile Settings" },
                  { id: "email", label: "Email" },
                  { id: "password", label: "Change Password" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                      activeTab === tab.id
                        ? "bg-indigo-50 text-indigo-700 font-medium"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="flex-1">
              {activeTab === "profile" && renderProfileForm()}

              {activeTab === "email" && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    Email Settings
                  </h2>
                  <form onSubmit={handleEmailUpdate} className="space-y-6">
                    <InputField
                      label="Email Address"
                      type="email"
                      value={securityData.email}
                      onChange={(e) =>
                        setSecurityData({
                          ...securityData,
                          email: e.target.value,
                        })
                      }
                    />

                    {securityData.email !== profileData.email && (
                      <div className="text-sm text-indigo-600 flex items-center">
                        <svg
                          className="h-4 w-4 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Click Update to confirm your new email address
                      </div>
                    )}

                    <button
                      type="submit"
                      className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center"
                    >
                      Update Email
                    </button>
                  </form>
                </div>
              )}

              {activeTab === "password" && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    Change Password
                  </h2>
                  <form onSubmit={handlePasswordUpdate} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={passwordData.newPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              newPassword: e.target.value,
                            })
                          }
                          className="w-full rounded-lg border border-gray-300 pl-4 pr-10 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                          ) : (
                            <EyeIcon className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      </div>

                      {/* Password requirements */}
                      {passwordData.newPassword && (
                        <div className="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <p className="font-medium text-gray-700 mb-2">
                            Password requirements:
                          </p>
                          <ul className="space-y-2">
                            {passwordValidation.requirements.map((req) => (
                              <li key={req.id} className="flex items-start">
                                <span
                                  className={`mt-0.5 mr-2 ${
                                    req.isMet ? "text-green-500" : "text-red-500"
                                  }`}
                                >
                                  {req.isMet ? (
                                    <svg
                                      className="h-4 w-4"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  ) : (
                                    <svg
                                      className="h-4 w-4"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  )}
                                </span>
                                <span
                                  className={
                                    req.isMet ? "text-gray-600" : "text-gray-600"
                                  }
                                >
                                  {req.message}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          value={passwordData.confirmPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              confirmPassword: e.target.value,
                            })
                          }
                          className="w-full rounded-lg border border-gray-300 pl-4 pr-10 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? (
                            <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                          ) : (
                            <EyeIcon className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      </div>

                      {passwordData.confirmPassword &&
                        passwordData.newPassword !==
                          passwordData.confirmPassword && (
                          <p className="mt-2 text-sm text-red-600">
                            Passwords do not match
                          </p>
                        )}
                    </div>

                    <button
                      type="submit"
                      disabled={!passwordValidation.isValid}
                      className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center ${
                        passwordValidation.isValid
                          ? "bg-indigo-600 text-white hover:bg-indigo-700"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      Update Password
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper components for cleaner code
const DisplayField = ({ label, value, isTextArea }) => (
  <div>
    <label className="block text-sm font-medium text-gray-500 mb-1">
      {label}
    </label>
    {isTextArea ? (
      <p className="text-gray-900 whitespace-pre-wrap">{value || "-"}</p>
    ) : (
      <p className="text-gray-900">{value || "-"}</p>
    )}
  </div>
);

const InputField = ({
  label,
  value,
  onChange,
  type = "text",
  disabled = false,
  placeholder = "",
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      disabled={disabled}
      placeholder={placeholder}
      className={`w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
        disabled ? "bg-gray-50 cursor-not-allowed" : "bg-white"
      }`}
    />
  </div>
);

export default Settings;
