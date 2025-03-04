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
        const fileExt = jobPostData.companyLogo.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random()
          .toString(36)
          .substring(7)}.${fileExt}`;

        const { data: fileData, error: fileError } = await supabase.storage
          .from("company-logos")
          .upload(`logos/${fileName}`, jobPostData.companyLogo, {
            cacheControl: "3600",
            upsert: true,
          });

        if (fileError) {
          console.error("File upload error:", fileError);
          throw new Error("Failed to upload company logo");
        }

        const {
          data: { publicUrl },
        } = supabase.storage
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
      const responsibilities = jobPostData.responsibilities.map(
        (responsibility) => ({
          job_posting_id: jobPostId,
          responsibility,
        })
      );
      const { error: responsibilitiesError } = await supabase
        .from("job_responsibility")
        .insert(responsibilities);

      if (responsibilitiesError) throw responsibilitiesError;

      // Insert job qualifications
      const qualifications = jobPostData.qualifications.map(
        (qualification) => ({
          job_posting_id: jobPostId,
          qualification,
        })
      );
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

  async getJobPostingDetails(jobId) {
    try {
      const { data: jobPost, error } = await supabase
        .from('job_posting')
        .select(`
          *,
          job_responsibility (
            responsibility
          ),
          job_qualification (
            qualification
          ),
          job_skill (
            skill
          )
        `)
        .eq('id', jobId)
        .single();

      if (error) throw error;

      console.log('API Response:', jobPost); // For debugging
      return jobPost;
    } catch (error) {
      console.error('Error fetching job posting details:', error);
      throw error;
    }
  },

  async getAllJobPostings() {
    try {
      const { data: jobPostings, error: jobPostingsError } =
        await supabase.from("job_posting").select(`
          *,
          job_responsibility(responsibility),
          job_qualification(qualification),
          job_skill(skill)
        `);

      if (jobPostingsError) throw jobPostingsError;

      // Process each job posting
      const processedJobPostings = jobPostings.map((post) => {
        return {
          ...post,
          company_logo_url: post.company_logo_url, // Use the stored URL directly
          responsibilities: post.job_responsibility.map(
            (r) => r.responsibility
          ),
          qualifications: post.job_qualification.map((q) => q.qualification),
          skills: post.job_skill.map((s) => s.skill),
        };
      });

      return processedJobPostings;
    } catch (error) {
      console.error("Error fetching all job postings:", error);
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
  },

  async updateJobPost(jobId, jobData) {
    try {
      let logoUrl = jobData.company_logo_url;

      // Handle file upload if new logo is provided
      if (jobData.company_logo_url instanceof File) {
        const file = jobData.company_logo_url;
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('company-logos')
          .upload(`logos/${fileName}`, file, {
            cacheControl: '3600',
            upsert: true
          });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('company-logos')
          .getPublicUrl(`logos/${fileName}`);

        logoUrl = publicUrl;
      }

      // First, update the main job posting
      const { error: updateError } = await supabase
        .from('job_posting')
        .update({
          job_title: jobData.job_title,
          company_name: jobData.company_name,
          company_logo_url: logoUrl,
          location: jobData.location,
          employment_type: jobData.employment_type,
          salary_range: jobData.salary_range,
          applicants_needed: jobData.applicants_needed,
          company_description: jobData.company_description,
          about_company: jobData.about_company,
          updated_at: new Date().toISOString()
        })
        .eq('id', jobId);

      if (updateError) throw updateError;

      // Use a transaction-like approach for related data
      await Promise.all([
        // Delete all existing related data
        supabase.from('job_responsibility').delete().eq('job_posting_id', jobId),
        supabase.from('job_qualification').delete().eq('job_posting_id', jobId),
        supabase.from('job_skill').delete().eq('job_posting_id', jobId)
      ]);

      // Insert new related data
      await Promise.all([
        // Insert responsibilities
        jobData.responsibilities?.length > 0 && supabase
          .from('job_responsibility')
          .insert(jobData.responsibilities.map(r => ({
            job_posting_id: jobId,
            responsibility: r
          }))),

        // Insert qualifications
        jobData.qualifications?.length > 0 && supabase
          .from('job_qualification')
          .insert(jobData.qualifications.map(q => ({
            job_posting_id: jobId,
            qualification: q
          }))),

        // Insert skills
        jobData.skills?.length > 0 && supabase
          .from('job_skill')
          .insert(jobData.skills.map(s => ({
            job_posting_id: jobId,
            skill: s
          })))
      ]);

      // Fetch and return updated data
      const { data: updatedJob, error: fetchError } = await supabase
        .from('job_posting')
        .select(`
          *,
          job_responsibility (
            responsibility
          ),
          job_qualification (
            qualification
          ),
          job_skill (
            skill
          )
        `)
        .eq('id', jobId)
        .single();

      if (fetchError) throw fetchError;

      return {
        ...updatedJob,
        responsibilities: updatedJob.job_responsibility?.map(r => r.responsibility) || [],
        qualifications: updatedJob.job_qualification?.map(q => q.qualification) || [],
        skills: updatedJob.job_skill?.map(s => s.skill) || []
      };

    } catch (error) {
      console.error('Error updating job post:', error);
      throw error;
    }
  },

  // Add this method to your api object
  async deleteJobPost(jobId) {
    try {
      // First, delete related data
      await Promise.all([
        supabase.from('job_responsibility').delete().eq('job_posting_id', jobId),
        supabase.from('job_qualification').delete().eq('job_posting_id', jobId),
        supabase.from('job_skill').delete().eq('job_posting_id', jobId)
      ]);

      // Get the job details to find the logo URL
      const { data: job } = await supabase
        .from('job_posting')
        .select('company_logo_url')
        .eq('id', jobId)
        .single();

      // Delete the logo file if it exists
      if (job?.company_logo_url) {
        const fileName = job.company_logo_url.split('/').pop();
        await supabase.storage
          .from('company-logos')
          .remove([`logos/${fileName}`]);
      }

      // Finally, delete the job posting
      const { error } = await supabase
        .from('job_posting')
        .delete()
        .eq('id', jobId);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Error deleting job post:', error);
      throw new Error('Failed to delete job post');
    }
  },

  async archiveJobPost(jobId) {
    try {
      const { error } = await supabase
        .from('job_posting')
        .update({ status: 'archived', updated_at: new Date().toISOString() })
        .eq('id', jobId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error archiving job post:', error);
      throw new Error('Failed to archive job post');
    }
  },

  async restoreJobPost(jobId) {
    try {
      const { error } = await supabase
        .from('job_posting')
        .update({ status: 'active', updated_at: new Date().toISOString() })
        .eq('id', jobId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error restoring job post:', error);
      throw new Error('Failed to restore job post');
    }
  },

  async getJobStats() {
    const { data, error } = await supabase
      .from('job_posting')
      .select('status')
      .then(res => ({
        active: res.data.filter(job => job.status === 'active').length,
        archived: res.data.filter(job => job.status === 'archived').length
      }));

    if (error) throw error;
    return data;
  },

  async getRecentJobs(limit = 5) {
    try {
      const { data, error } = await supabase
        .from('job_posting')
        .select(`
          id,
          job_title,
          status,
          created_at,
          applications:job_applications(count)
        `)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data.map(job => ({
        id: job.id,
        title: job.job_title,
        status: job.status,
        applicants_count: job.applications?.[0]?.count || 0,
        created_at: job.created_at
      }));
    } catch (error) {
      console.error('Error fetching recent jobs:', error);
      return null;
    }
  },

  async getApplicantStats() {
    const { data, error } = await supabase
      .from('job_applications')
      .select('created_at')
      .then(res => {
        const total = res.data.length;
        const lastMonth = res.data.filter(app => 
          new Date(app.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        ).length;
        return {
          total,
          monthlyChange: ((lastMonth / total) * 100).toFixed(1)
        };
      });

    if (error) throw error;
    return data;
  },

  async getShortlistedStats() {
    const { data, error } = await supabase
      .from('job_applications')
      .select('count')
      .eq('status', 'shortlisted')
      .single();

    if (error) throw error;
    return { total: data.count };
  },

  async getPopularJobRoles() {
    const { data, error } = await supabase
      .from('job_posting')
      .select(`
        id,
        job_title,
        applications:job_applications(count)
      `)
      .order('applications.count', { ascending: false })
      .limit(5);

    if (error) throw error;
    return data;
  }
};
