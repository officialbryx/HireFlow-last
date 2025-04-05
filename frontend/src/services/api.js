import { supabase } from "./supabaseClient";
import { applicationsApi } from "./api/applicationsApi";

export const api = {
  async login({ email, password }) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      return {
        token: data.session.access_token,
        user: data.user,
      };
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  async signup({ email, password, firstName, middleName, lastName, userType }) {
    try {
      // First, sign up the user and wait for confirmation
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            middle_name: middleName, // Add this line
            last_name: lastName,
            user_type: userType,
          },
        },
      });

      if (authError) throw authError;

      // Wait for 2 seconds to ensure the user record is created in auth.users
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Create profile only if user was created successfully
      if (authData.user?.id) {
        const { error: insertError } = await supabase.from("profiles").insert([
          {
            id: authData.user.id,
            first_name: firstName,
            last_name: lastName,
            user_type: userType,
          },
        ]);

        if (insertError) {
          console.error("Profile creation error:", insertError);
          // Don't throw the error as the user is already created
        }
      }

      return authData;
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  },

  async submitApplication(applicationData) {
    try {
      const response = await applicationsApi.submitApplication(applicationData);
      return response;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  },

  getUserProfile: async () => {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError) throw userError;

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError && profileError.code !== "PGRST116") {
        throw profileError;
      }

      // If profile doesn't exist, create an empty one
      if (!profile) {
        const { data: newProfile, error: createError } = await supabase
          .from("profiles")
          .insert([
            {
              id: user.id,
              email: user.email,
              personal_summary: "",
              career_history: [],
              education: [],
              certifications: [],
              skills: [],
              languages: [],
            },
          ])
          .select()
          .single();

        if (createError) throw createError;
        return { user, profile: newProfile };
      }

      return { user, profile };
    } catch (error) {
      console.error("Error in getUserProfile:", error);
      throw error;
    }
  },

  updateUserProfile: async (profileData) => {
    try {
      // Get current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError) throw userError;

      // Update profile in profiles table
      const { error: profileError } = await supabase
        .from("profiles")
        .update(profileData)
        .eq("id", user.id);

      if (profileError) throw profileError;

      // Update user metadata
      const { error: metadataError } = await supabase.auth.updateUser({
        data: {
          first_name: profileData.first_name,
          middle_name: profileData.middle_name,
          last_name: profileData.last_name,
        },
      });

      if (metadataError) throw metadataError;

      return true;
    } catch (error) {
      console.error("Profile update error:", error);
      throw error;
    }
  },

  updateUserEmail: async (newEmail) => {
    const { data, error } = await supabase.auth.updateUser({ email: newEmail });
    if (error) throw error;
    return data || true;
  },

  updateUserPassword: async (newPassword) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Password update error:", error);
      throw new Error(error.message || "Failed to update password");
    }
  },

  async updateUserMetadata(metadata) {
    const { data, error } = await supabase.auth.updateUser({
      data: metadata,
    });
    if (error) throw error;
    return data;
  },

  // Add logout function
  async logout() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  },

  async checkEmailExists(email) {
    try {
      // Try to sign up with the email to see if it exists
      const { data, error } = await supabase.auth.signUp({
        email: email,
        // Use a random password since we're just checking email existence
        password: Math.random().toString(36) + Date.now().toString(36),
      });

      // If we get a user object with identities.length === 0, the email exists
      if (data?.user?.identities?.length === 0) {
        // Email exists, now get the user type from profiles if needed
        const { data: profileData } = await supabase
          .from("profiles")
          .select("user_type")
          .eq("email", email)
          .single();

        return {
          data: {
            email: email,
            user_type: profileData?.user_type,
            exists: true,
          },
        };
      }

      // If we get here, the email doesn't exist
      return { data: null };
    } catch (error) {
      if (error.message?.includes("email already")) {
        return {
          data: {
            email: email,
            exists: true,
          },
        };
      }
      throw error;
    }
  },
};
