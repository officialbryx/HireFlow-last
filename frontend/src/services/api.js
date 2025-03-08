import { supabase } from "./supabaseClient";

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
      // First upload resume if exists
      let resumeUrl = null;
      if (applicationData.resume instanceof File) {
        const fileName = `${Date.now()}-${applicationData.resume.name}`;
        const { data: fileData, error: fileError } = await supabase.storage
          .from("resumes")
          .upload(`applications/${fileName}`, applicationData.resume);

        if (fileError) throw fileError;

        // Get public URL for the uploaded file
        const {
          data: { publicUrl },
        } = supabase.storage
          .from("resumes")
          .getPublicUrl(`applications/${fileName}`);

        resumeUrl = publicUrl;
      }

      // Get current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError) throw userError;

      // Format application data
      const formattedData = {
        company: applicationData.company,
        personal_info: {
          previously_employed: applicationData.previouslyEmployed,
          employee_id: applicationData.employeeID,
          manager: applicationData.givenManager,
          country: applicationData.country,
          given_name: applicationData.givenName,
          middle_name: applicationData.middleName,
          family_name: applicationData.familyName,
          suffix: applicationData.suffix,
          phone: {
            type: applicationData.phoneType,
            code: applicationData.phoneCode,
            number: applicationData.phoneNumber,
          },
        },
        contact_info: {
          email: applicationData.email,
          phone_type: applicationData.phoneType,
          phone_code: applicationData.phoneCode,
          phone_number: applicationData.phoneNumber,
        },
        address: {
          street: applicationData.street,
          additional_address: applicationData.additionalAddress,
          city: applicationData.city,
          province: applicationData.province,
          postal_code: applicationData.postalCode,
          country: applicationData.country,
        },
        previous_employment: {
          previously_employed: applicationData.previouslyEmployed === "yes",
          employee_id: applicationData.employeeID,
          manager: applicationData.givenManager,
        },
        work_experience: applicationData.noWorkExperience
          ? []
          : applicationData.workExperience.map((exp) => ({
              ...exp,
              fromDate: exp.fromDate || null,
              toDate: exp.currentWork ? null : exp.toDate || null,
            })),
        education: applicationData.education,
        skills: applicationData.skills,
        resume_url: resumeUrl,
        websites: (applicationData.websites || []).filter(
          (url) => url && url.trim()
        ),
        linkedin_url: applicationData.linkedinUrl,
        application_questions: applicationData.applicationQuestions,
        terms_accepted: applicationData.termsAccepted,
        email: applicationData.email,
        phone_type: applicationData.phoneType,
        phone_code: applicationData.phoneCode,
        phone_number: applicationData.phoneNumber,
        user_id: user.id,
      };

      // Submit application
      const { data, error } = await supabase
        .from("applications")
        .insert([formattedData]);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error submitting application:", error);
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
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError) throw userError;

    const [profileError, metadataError] = await Promise.all([
      supabase.from("profiles").update(profileData).eq("id", user.id),
      supabase.auth.updateUser({ data: profileData }),
    ]);

    if (profileError) throw profileError;
    if (metadataError) throw metadataError;

    return true;
  },

  updateUserEmail: async (newEmail) => {
    const { error } = await supabase.auth.updateUser({ email: newEmail });
    if (error) throw error;
    return true;
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
  }
};
