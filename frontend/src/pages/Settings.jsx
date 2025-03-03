import { useState, useEffect } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { api } from "../services/api";
import { validatePassword } from "../utils/passwordValidation";

const Settings = () => {
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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { user, profile } = await api.getUserProfile();

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
        alert("Failed to load profile data");
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
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    }
  };

  const handleEmailUpdate = async (e) => {
    e.preventDefault();
    try {
      if (securityData.email !== profileData.email) {
        await api.updateUserEmail(securityData.email);
        alert("Email updated successfully! Please verify your new email.");
      }
    } catch (error) {
      console.error("Error updating email:", error);
      alert("Failed to update email");
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous errors

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
      alert("Password updated successfully!");
    } catch (error) {
      console.error("Error updating password:", error);
      setError(error.message || "Failed to update password");
    }
  };

  const renderProfileForm = () => (
    <form onSubmit={handleProfileUpdate} className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Profile Settings</h2>
        <button
          type="button"
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 focus:outline-none"
        >
          {isEditing ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      {!isEditing ? (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <DisplayField label="First Name" value={profileData.firstName} />
            <DisplayField label="Middle Name" value={profileData.middleName} />
            <DisplayField label="Last Name" value={profileData.lastName} />
          </div>
          <DisplayField label="Email" value={profileData.email} />
          <DisplayField label="Headline" value={profileData.headline} />
          <DisplayField label="About" value={profileData.about} isTextArea />
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              type="text"
              value={profileData.firstName}
              onChange={(e) =>
                setProfileData({ ...profileData, firstName: e.target.value })
              }
              disabled={!isEditing}
              className={`mt-1 block w-full rounded-md border px-3 py-2 ${
                isEditing
                  ? "border-gray-300 bg-white"
                  : "border-transparent bg-gray-50"
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Middle Name
            </label>
            <input
              type="text"
              value={profileData.middleName}
              onChange={(e) =>
                setProfileData({ ...profileData, middleName: e.target.value })
              }
              disabled={!isEditing}
              className={`mt-1 block w-full rounded-md border px-3 py-2 ${
                isEditing
                  ? "border-gray-300 bg-white"
                  : "border-transparent bg-gray-50"
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              value={profileData.lastName}
              onChange={(e) =>
                setProfileData({ ...profileData, lastName: e.target.value })
              }
              disabled={!isEditing}
              className={`mt-1 block w-full rounded-md border px-3 py-2 ${
                isEditing
                  ? "border-gray-300 bg-white"
                  : "border-transparent bg-gray-50"
              }`}
            />
          </div>
        </div>
      )}

      {isEditing && (
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Save Changes
        </button>
      )}
    </form>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>

        <div className="flex gap-6">
          <div className="w-64 bg-white rounded-lg shadow-sm p-4">
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab("profile")}
                className={`w-full text-left px-4 py-2 rounded-md ${
                  activeTab === "profile"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                Profile Settings
              </button>
              <button
                onClick={() => setActiveTab("email")}
                className={`w-full text-left px-4 py-2 rounded-md ${
                  activeTab === "email"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                Email
              </button>
              <button
                onClick={() => setActiveTab("password")}
                className={`w-full text-left px-4 py-2 rounded-md ${
                  activeTab === "password"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                Change Password
              </button>
            </nav>
          </div>

          <div className="flex-1 bg-white rounded-lg shadow-sm p-6">
            {activeTab === "profile" && renderProfileForm()}

            {activeTab === "email" && (
              <form onSubmit={handleEmailUpdate} className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">Email Settings</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    value={securityData.email}
                    onChange={(e) =>
                      setSecurityData({
                        ...securityData,
                        email: e.target.value,
                      })
                    }
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
                {securityData.email !== profileData.email && (
                  <div className="text-sm text-blue-600">
                    Click Update to confirm email change
                  </div>
                )}
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Update Email
                </button>
              </form>
            )}

            {activeTab === "password" && (
              <form onSubmit={handlePasswordUpdate} className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">Change Password</h2>

                {error && (
                  <div className="text-red-600 text-sm mb-4">{error}</div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <div className="mt-1 relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          newPassword: e.target.value,
                        })
                      }
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
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
                    <div className="mt-2 text-sm">
                      <p className="font-medium text-gray-700">
                        Password must have:
                      </p>
                      <ul className="list-disc pl-5 space-y-1">
                        {passwordValidation.requirements.map((req) => (
                          <li
                            key={req.id}
                            className={
                              req.isMet ? "text-green-600" : "text-red-600"
                            }
                          >
                            {req.message}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Confirm New Password
                  </label>
                  <div className="mt-1 relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
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
                </div>

                <button
                  type="submit"
                  disabled={!passwordValidation.isValid}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                >
                  Update Password
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const DisplayField = ({ label, value, isTextArea }) => (
  <div>
    <label className="block text-sm font-medium text-gray-500">{label}</label>
    {isTextArea ? (
      <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
        {value || "-"}
      </p>
    ) : (
      <p className="mt-1 text-sm text-gray-900">{value || "-"}</p>
    )}
  </div>
);

export default Settings;
