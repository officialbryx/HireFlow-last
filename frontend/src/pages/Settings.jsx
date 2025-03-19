import { useState, useEffect } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { api } from "../services/api";
import { validatePassword } from "../utils/passwordValidation";
import Navbar from "../components/Navbar";
import HRNavbar from "../components/HRNavbar";

const Settings = () => {
  const [userType, setUserType] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
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
        setUserType(profile.user_type);

        const userData = {
          firstName: profile.first_name || user.user_metadata?.first_name || "",
          middleName:
            profile.middle_name || user.user_metadata?.middle_name || "",
          lastName: profile.last_name || user.user_metadata?.last_name || "",
          email: profile.email || user.email,
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
        updated_at: new Date().toISOString(),
      });

      setIsEditing(false);
      setSuccess("Profile updated successfully!");

      // Refresh the profile data
      const { user, profile } = await api.getUserProfile();
      const userData = {
        firstName: profile.first_name || user.user_metadata?.first_name || "",
        middleName:
          profile.middle_name || user.user_metadata?.middle_name || "",
        lastName: profile.last_name || user.user_metadata?.last_name || "",
        email: profile.email || user.email,
      };
      setProfileData(userData);
    } catch (error) {
      console.error("Error updating profile:", error);
      setError(error.message || "Failed to update profile");
    }
  };

  const handleEmailUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      if (securityData.email !== profileData.email) {
        // Update email in Supabase auth and profiles table
        await api.updateUserEmail({
          email: securityData.email,
        });

        // Update local state
        setProfileData((prev) => ({
          ...prev,
          email: securityData.email,
        }));

        setSuccess(
          "Email update initiated. Please check your new email for verification."
        );
      }
    } catch (error) {
      console.error("Error updating email:", error);
      setError(error.message || "Failed to update email");
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      if (!passwordValidation.isValid) {
        setError("Please meet all password requirements");
        return;
      }

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      await api.updateUserPassword(passwordData.newPassword);
      setPasswordData({ newPassword: "", confirmPassword: "" });
      setSuccess("Password updated successfully!");
    } catch (error) {
      console.error("Error updating password:", error);
      setError(error.message || "Failed to update password");
    }
  };

  const renderProfileForm = () => (
    <form onSubmit={handleProfileUpdate} className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Profile Settings</h2>
        <button
          type="button"
          onClick={() => setIsEditing(!isEditing)}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 shadow-sm ${
            isEditing
              ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {isEditing ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      {!isEditing ? (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            <DisplayField label="First Name" value={profileData.firstName} />
            <DisplayField label="Middle Name" value={profileData.middleName} />
            <DisplayField label="Last Name" value={profileData.lastName} />
          </div>
          <div className="pt-4 border-t border-gray-100">
            <DisplayField label="Email" value={profileData.email} />
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
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

          <div className="mb-6 pt-4 border-t border-gray-100">
            <InputField
              label="Email"
              type="email"
              value={profileData.email}
              onChange={(e) =>
                setProfileData({ ...profileData, email: e.target.value })
              }
              disabled
            />
            <p className="text-xs text-gray-500 mt-1">
              Email cannot be changed here. Use the Email tab to update your
              email address.
            </p>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center shadow-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h1a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h1v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z" />
            </svg>
            Save Changes
          </button>
        </div>
      )}
    </form>
  );

  const tabs = [
    {
      id: "profile",
      label: "Profile Settings",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      id: "email",
      label: "Email",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
        </svg>
      ),
    },
    {
      id: "password",
      label: "Change Password",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {userType === "jobseeker" ? <Navbar /> : <HRNavbar />}
      <div className="pt-20 px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Account Settings
              </h1>
              <p className="text-gray-500">
                Manage your account information and security preferences
              </p>
            </div>
            <div className="mt-4 md:mt-0 px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200 text-sm text-gray-500 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
              Last updated: {new Date().toLocaleDateString()}
            </div>
          </div>

          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-start animate-fadeIn shadow-sm">
              <svg
                className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0"
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
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start animate-fadeIn shadow-sm">
              <svg
                className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0"
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

          <div className="flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-64 bg-white rounded-xl shadow-md border border-gray-200 p-2 h-fit">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center ${
                      activeTab === tab.id
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="flex-1">
              {activeTab === "profile" && renderProfileForm()}

              {activeTab === "email" && (
                <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 mr-2 text-blue-600"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    Email Settings
                  </h2>
                  <form onSubmit={handleEmailUpdate} className="space-y-6">
                    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <p className="text-sm text-gray-600 mb-2">
                        Current Email Address:
                      </p>
                      <p className="font-medium text-gray-800">
                        {profileData.email}
                      </p>
                    </div>

                    <InputField
                      label="New Email Address"
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
                      <div className="text-sm bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start">
                        <svg
                          className="h-5 w-5 mr-2 text-blue-600 flex-shrink-0 mt-0.5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <div>
                          <p className="text-blue-700 font-medium">
                            Verification required
                          </p>
                          <p className="text-blue-600">
                            Click Update to confirm your new email address. A
                            verification email will be sent.
                          </p>
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={securityData.email === profileData.email}
                      className={`bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center shadow-sm ${
                        securityData.email === profileData.email
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path
                          fillRule="evenodd"
                          d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Update Email
                    </button>
                  </form>
                </div>
              )}

              {activeTab === "password" && (
                <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 mr-2 text-blue-600"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                      />
                    </svg>
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
                          className="w-full rounded-lg border border-gray-300 pl-4 pr-10 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="Enter new password"
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
                                  className={`mt-0.5 mr-2 flex-shrink-0 ${
                                    req.isMet
                                      ? "text-green-500"
                                      : "text-red-500"
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
                                    req.isMet
                                      ? "text-gray-600"
                                      : "text-gray-600"
                                  }
                                >
                                  {req.message}
                                </span>
                              </li>
                            ))}
                          </ul>

                          {passwordValidation.isValid && (
                            <div className="mt-2 pt-2 border-t border-gray-200 flex items-center text-green-600">
                              <svg
                                className="h-5 w-5 mr-2"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <span className="font-medium">
                                Password meets all requirements
                              </span>
                            </div>
                          )}
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
                          className="w-full rounded-lg border border-gray-300 pl-4 pr-10 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="Confirm your new password"
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
                          <p className="mt-2 text-sm text-red-600 flex items-center">
                            <svg
                              className="h-4 w-4 mr-1"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Passwords do not match
                          </p>
                        )}

                      {passwordData.confirmPassword &&
                        passwordData.newPassword ===
                          passwordData.confirmPassword && (
                          <p className="mt-2 text-sm text-green-600 flex items-center">
                            <svg
                              className="h-4 w-4 mr-1"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Passwords match
                          </p>
                        )}
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={
                          !passwordValidation.isValid ||
                          passwordData.newPassword !==
                            passwordData.confirmPassword
                        }
                        className={`w-full sm:w-auto px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center shadow-sm ${
                          passwordValidation.isValid &&
                          passwordData.newPassword ===
                            passwordData.confirmPassword
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Update Password
                      </button>
                    </div>
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
      <p className="text-gray-900 whitespace-pre-wrap font-medium">
        {value || "-"}
      </p>
    ) : (
      <p className="text-gray-900 font-medium">{value || "-"}</p>
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
      className={`w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
        disabled ? "bg-gray-50 cursor-not-allowed" : "bg-white"
      }`}
    />
  </div>
);

export default Settings;
