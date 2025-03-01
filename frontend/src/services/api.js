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

  async createJobPost(jobPostData) {
    try {
      let logoUrl = null;

      if (jobPostData.companyLogo instanceof File) {
        const fileExt = jobPostData.companyLogo.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { data: fileData, error: fileError } = await supabase.storage
          .from("company-logos")
          .upload(`logos/${fileName}`, jobPostData.companyLogo, {
            cacheControl: '3600',
            upsert: true
          });

        if (fileError) {
          console.error('File upload error:', fileError);
          throw new Error('Failed to upload company logo');
        }

        const { data: { publicUrl } } = supabase.storage
          .from("company-logos")
          .getPublicUrl(`logos/${fileName}`);

        logoUrl = publicUrl;
      }

      // Format job post data
      const formattedData = {
        job_title: jobPostData.title,
        company_name: jobPostData.companyName,
        location: jobPostData.location,
        employment_type: jobPostData.employmentType,
        salary_range: jobPostData.salaryRange,
        applicants_needed: jobPostData.applicantsNeeded,
        company_description: jobPostData.companyDescription,
        about_company: jobPostData.aboutCompany,
        company_logo_url: logoUrl,
        created_at: new Date().toISOString(),
      };

      // Insert job post data
      const { data: jobPost, error: jobPostError } = await supabase
        .from("job_posting")
        .insert([formattedData])
        .select();

      if (jobPostError) throw jobPostError;

      const jobPostId = jobPost[0].id;

      // Insert job responsibilities
      const responsibilities = jobPostData.responsibilities.map((responsibility) => ({
        job_posting_id: jobPostId,
        responsibility,
      }));
      const { error: responsibilitiesError } = await supabase
        .from("job_responsibility")
        .insert(responsibilities);

      if (responsibilitiesError) throw responsibilitiesError;

      // Insert job qualifications
      const qualifications = jobPostData.qualifications.map((qualification) => ({
        job_posting_id: jobPostId,
        qualification,
      }));
      const { error: qualificationsError } = await supabase
        .from("job_qualification")
        .insert(qualifications);

      if (qualificationsError) throw qualificationsError;

      // Insert required skills
      const skills = jobPostData.skills.map((skill) => ({
        job_posting_id: jobPostId,
        skill,
      }));
      const { error: skillsError } = await supabase
        .from("job_skill")
        .insert(skills);

      if (skillsError) throw skillsError;

      return jobPost;
    } catch (error) {
      console.error("Error creating job post:", error);
      throw error;
    }
  },

  async getJobPostingDetails(jobPostId) {
    try {
      // Fetch the main job posting data
      const { data: jobPost, error: jobPostError } = await supabase
        .from('job_posting')
        .select('*')
        .eq('id', jobPostId)
        .single();

      if (jobPostError) throw jobPostError;

      // Fetch responsibilities
      const { data: responsibilities, error: responsibilitiesError } = await supabase
        .from('job_responsibility')
        .select('responsibility')
        .eq('job_posting_id', jobPostId);

      if (responsibilitiesError) throw responsibilitiesError;

      // Fetch qualifications
      const { data: qualifications, error: qualificationsError } = await supabase
        .from('job_qualification')
        .select('qualification')
        .eq('job_posting_id', jobPostId);

      if (qualificationsError) throw qualificationsError;

      // Fetch skills
      const { data: skills, error: skillsError } = await supabase
        .from('job_skill')
        .select('skill')
        .eq('job_posting_id', jobPostId);

      if (skillsError) throw skillsError;

      // Return data with the direct URL
      return {
        ...jobPost,
        company_logo_url: jobPost.company_logo_url, // Use the stored URL directly
        responsibilities: responsibilities.map(r => r.responsibility),
        qualifications: qualifications.map(q => q.qualification),
        skills: skills.map(s => s.skill)
      };
    } catch (error) {
      console.error('Error fetching job posting details:', error);
      throw error;
    }
  },

  async getAllJobPostings() {
    try {
      const { data: jobPostings, error: jobPostingsError } = await supabase
        .from('job_posting')
        .select(`
          *,
          job_responsibility(responsibility),
          job_qualification(qualification),
          job_skill(skill)
        `);

      if (jobPostingsError) throw jobPostingsError;

      // Process each job posting
      const processedJobPostings = jobPostings.map(post => {
        return {
          ...post,
          company_logo_url: post.company_logo_url, // Use the stored URL directly
          responsibilities: post.job_responsibility.map(r => r.responsibility),
          qualifications: post.job_qualification.map(q => q.qualification),
          skills: post.job_skill.map(s => s.skill)
        };
      });

      return processedJobPostings;
    } catch (error) {
      console.error('Error fetching all job postings:', error);
      throw error;
    }
  }
};
