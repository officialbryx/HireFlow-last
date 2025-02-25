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

  async signup({ email, password, firstName, lastName, userType }) {
    try {
      // First, sign up the user and wait for confirmation
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
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
          address: applicationData.givenAddress,
          email: applicationData.givenEmail,
          phone: {
            type: applicationData.givenPhoneDeviceType,
            code: applicationData.givenCountryPhoneCode,
            number: applicationData.givenPhoneNumber,
            extension: applicationData.givenPhoneExtension,
          },
        },
        work_experience: applicationData.noWorkExperience
          ? []
          : applicationData.workExperience,
        education: applicationData.education,
        skills: applicationData.skills,
        resume_url: resumeUrl,
        websites: applicationData.websites
          .filter((w) => w.url)
          .map((w) => w.url),
        linkedin_url: applicationData.linkedinUrl,
        application_questions: applicationData.applicationQuestions,
        terms_accepted: applicationData.termsAccepted,
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
};
