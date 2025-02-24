import { useState, useEffect } from "react";
import { supabase } from "../services/supabaseClient";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    headline: "",
    about: "",
    location: "",
    email: "",
    phone: "",
  });

  const [securityData, setSecurityData] = useState({
    email: "john.doe@example.com",
    password: "********",
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const { data, error } = await supabase
            .from("profiles")
            .select("first_name, last_name, email")
            .eq("id", user.id)
            .single();

          if (error) throw error;

          setProfileData((prev) => ({
            ...prev,
            firstName: data.first_name || "",
            lastName: data.last_name || "",
            email: data.email || user.email,
            // Keep other fields unchanged
            headline: prev.headline,
            about: prev.about,
            location: prev.location,
            phone: prev.phone,
          }));
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("No user found");

      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: profileData.firstName,
          last_name: profileData.lastName,
        })
        .eq("id", user.id);

      if (error) throw error;
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    }
  };

  const handleSecurityUpdate = (e) => {
    e.preventDefault();
    // Implement API call to update security settings
    alert("Security settings updated successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>

        <div className="flex gap-6">
          {/* Sidebar */}
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
                onClick={() => setActiveTab("account")}
                className={`w-full text-left px-4 py-2 rounded-md ${
                  activeTab === "account"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                Account Preferences
              </button>
              <button
                onClick={() => setActiveTab("security")}
                className={`w-full text-left px-4 py-2 rounded-md ${
                  activeTab === "security"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                Sign in & Security
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-white rounded-lg shadow-sm p-6">
            {activeTab === "profile" && (
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={profileData.firstName}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          firstName: e.target.value,
                        })
                      }
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
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
                        setProfileData({
                          ...profileData,
                          lastName: e.target.value,
                        })
                      }
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Headline
                    </label>
                    <input
                      type="text"
                      value={profileData.headline}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          headline: e.target.value,
                        })
                      }
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      About
                    </label>
                    <textarea
                      value={profileData.about}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          about: e.target.value,
                        })
                      }
                      rows={4}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </form>
            )}

            {activeTab === "account" && (
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  Account Preferences
                </h2>
                <div className="space-y-4">
                  <div className="border-b pb-4">
                    <h3 className="font-medium mb-2">Language</h3>
                    <select className="block w-full rounded-md border border-gray-300 px-3 py-2">
                      <option>English</option>
                      <option>Spanish</option>
                      <option>French</option>
                    </select>
                  </div>
                  <div className="border-b pb-4">
                    <h3 className="font-medium mb-2">Time Zone</h3>
                    <select className="block w-full rounded-md border border-gray-300 px-3 py-2">
                      <option>Eastern Time (ET)</option>
                      <option>Pacific Time (PT)</option>
                      <option>UTC</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <form onSubmit={handleSecurityUpdate} className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">
                  Sign in & Security
                </h2>

                <div className="space-y-4">
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Current Password
                    </label>
                    <input
                      type="password"
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      New Password
                    </label>
                    <input
                      type="password"
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Update Security Settings
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
