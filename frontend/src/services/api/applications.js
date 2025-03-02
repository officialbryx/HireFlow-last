import { supabase } from "../supabaseClient";

export const applicationsApi = {
  async submitApplication(applicationData) {
    try {
      let resumeUrl = null;
      if (applicationData.resume instanceof File) {
        const fileName = `${Date.now()}-${applicationData.resume.name}`;
        const { data: fileData, error: fileError } = await supabase.storage
          .from("resumes")
          .upload(`applications/${fileName}`, applicationData.resume);

        if (fileError) throw fileError;

        const { data: { publicUrl } } = supabase.storage
          .from("resumes")
          .getPublicUrl(`applications/${fileName}`);

        resumeUrl = publicUrl;
      }

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

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
        work_experience: applicationData.noWorkExperience ? [] : applicationData.workExperience,
        education: applicationData.education,
        skills: applicationData.skills,
        resume_url: resumeUrl,
        websites: applicationData.websites.filter(w => w.url).map(w => w.url),
        linkedin_url: applicationData.linkedinUrl,
        application_questions: applicationData.applicationQuestions,
        terms_accepted: applicationData.termsAccepted,
        user_id: user.id,
      };

      const { data, error } = await supabase
        .from("applications")
        .insert([formattedData]);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error submitting application:", error);
      throw error;
    }
  }
};