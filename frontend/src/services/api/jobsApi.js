import { supabase } from "../supabaseClient";

export const jobsApi = {
  async createJobPost(jobPostData) {
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      // Get user profile to verify role
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;
      if (profile.user_type !== 'employer') {
        throw new Error('Only employers can create job posts');
      }

      let logoUrl = null;
      if (jobPostData.companyLogo instanceof File) {
        const file = jobPostData.companyLogo;
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { error: uploadError, data } = await supabase.storage
          .from('company-logos')
          .upload(`logos/${fileName}`, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('company-logos')
          .getPublicUrl(`logos/${fileName}`);

        logoUrl = publicUrl;
      }

      // Insert main job post with creator_id
      const { data: jobPost, error: jobError } = await supabase
        .from('job_posting')
        .insert({
          job_title: jobPostData.title,
          company_name: jobPostData.companyName,
          company_logo_url: logoUrl,
          location: jobPostData.location,
          employment_type: jobPostData.employmentType,
          salary_range: jobPostData.salaryRange,
          applicants_needed: jobPostData.applicantsNeeded,
          company_description: jobPostData.companyDescription,
          about_company: jobPostData.aboutCompany,
          status: 'active',
          creator_id: user.id  // Add creator_id
        })
        .select()
        .single();

      if (jobError) throw jobError;

      // Insert related data
      await Promise.all([
        supabase.from('job_responsibility').insert(
          jobPostData.responsibilities.map(r => ({
            job_posting_id: jobPost.id,
            responsibility: r
          }))
        ),
        supabase.from('job_qualification').insert(
          jobPostData.qualifications.map(q => ({
            job_posting_id: jobPost.id,
            qualification: q
          }))
        ),
        supabase.from('job_skill').insert(
          jobPostData.skills.map(s => ({
            job_posting_id: jobPost.id,
            skill: s
          }))
        )
      ]);

      return jobPost;
    } catch (error) {
      console.error("Error creating job post:", error);
      throw error;
    }
  },

  async updateJobPost(jobId, jobData) {
    try {
      // Get current user and verify ownership
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const { data: jobPost, error: checkError } = await supabase
        .from('job_posting')
        .select('creator_id')
        .eq('id', jobId)
        .single();

      if (checkError) throw checkError;
      if (jobPost.creator_id !== user.id) {
        throw new Error('You can only edit your own job posts');
      }

      let logoUrl = jobData.company_logo_url;

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

      // Update main job posting
      const { error: jobError } = await supabase
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

      if (jobError) throw jobError;

      // Delete existing related data
      await Promise.all([
        supabase.from('job_responsibility').delete().eq('job_posting_id', jobId),
        supabase.from('job_qualification').delete().eq('job_posting_id', jobId),
        supabase.from('job_skill').delete().eq('job_posting_id', jobId)
      ]);

      // Insert new related data
      await Promise.all([
        supabase.from('job_responsibility').insert(
          jobData.responsibilities.map(r => ({
            job_posting_id: jobId,
            responsibility: r
          }))
        ),
        supabase.from('job_qualification').insert(
          jobData.qualifications.map(q => ({
            job_posting_id: jobId,
            qualification: q
          }))
        ),
        supabase.from('job_skill').insert(
          jobData.skills.map(s => ({
            job_posting_id: jobId,
            skill: s
          }))
        )
      ]);

      return await this.getJobPostingDetails(jobId);
    } catch (error) {
      console.error('Error updating job post:', error);
      throw error;
    }
  },

  async getJobPostingDetails(jobId) {
    try {
      const { data, error } = await supabase
        .from('job_posting')
        .select(`
          *,
          job_responsibility (responsibility),
          job_qualification (qualification),
          job_skill (skill)
        `)
        .eq('id', jobId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching job details:', error);
      throw error;
    }
  },

  async getAllJobPostings(isEmployer = false) {
    try {
      // Get current user if employer view
      let userId = null;
      if (isEmployer) {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        userId = user.id;
      }

      let query = supabase
        .from('job_posting')
        .select(`
          *,
          job_responsibility (responsibility),
          job_qualification (qualification),
          job_skill (skill)
        `)
        .order('created_at', { ascending: false });

      // If employer view, only show their posts
      if (isEmployer && userId) {
        query = query.eq('creator_id', userId);
      } else {
        // For jobseeker view, only show active posts
        query = query.eq('status', 'active');
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching jobs:', error);
      throw error;
    }
  },

  async archiveJobPost(jobId) {
    try {
      const { error } = await supabase
        .from('job_posting')
        .update({ status: 'archived' })
        .eq('id', jobId);

      if (error) throw error;
    } catch (error) {
      console.error('Error archiving job:', error);
      throw error;
    }
  },

  async restoreJobPost(jobId) {
    try {
      const { error } = await supabase
        .from('job_posting')
        .update({ status: 'active' })
        .eq('id', jobId);

      if (error) throw error;
    } catch (error) {
      console.error('Error restoring job:', error);
      throw error;
    }
  },

  async getJobStats() {
    // ... existing job stats logic ...
  },

  async getRecentJobs(limit = 5) {
    // ... existing recent jobs logic ...
  },

  async getPopularJobRoles() {
    // ... existing popular roles logic ...
  }
};