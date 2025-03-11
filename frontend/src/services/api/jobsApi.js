import { supabase } from "../supabaseClient";

export const jobsApi = {
  async createJobPost(jobPostData) {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      // Handle logo upload if it's a File object
      let logoUrl = null;
      if (jobPostData.companyLogo instanceof File) {
        const file = jobPostData.companyLogo;
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        // Upload the file
        const { error: uploadError } = await supabase.storage
          .from('company-logos')
          .upload(`logos/${fileName}`, file, {
            cacheControl: '3600',
            upsert: false,
            contentType: file.type // Add content type
          });

        if (uploadError) throw uploadError;

        // Get the public URL
        const { data } = supabase.storage
          .from('company-logos')
          .getPublicUrl(`logos/${fileName}`);

        logoUrl = data.publicUrl;
      } else if (typeof jobPostData.companyLogo === 'string') {
        // If it's already a URL string, use it directly
        logoUrl = jobPostData.companyLogo;
      }

      // Create job post with correct logo URL
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
          creator_id: user.id
        })
        .select()
        .single();

      if (jobError) throw jobError;

      // Insert related data
      const promises = [
        // Insert responsibilities
        jobPostData.responsibilities?.length > 0 &&
          supabase.from('job_responsibility').insert(
            jobPostData.responsibilities.map(r => ({
              job_posting_id: jobPost.id,
              responsibility: r
            }))
          ),

        // Insert qualifications
        jobPostData.qualifications?.length > 0 &&
          supabase.from('job_qualification').insert(
            jobPostData.qualifications.map(q => ({
              job_posting_id: jobPost.id,
              qualification: q
            }))
          ),

        // Insert skills
        jobPostData.skills?.length > 0 &&
          supabase.from('job_skill').insert(
            jobPostData.skills.map(s => ({
              job_posting_id: jobPost.id,
              skill: s
            }))
          )
      ].filter(Boolean);

      // Wait for all related data to be inserted
      await Promise.all(promises);

      // Fetch the complete job post with related data
      const { data: completeJob, error: fetchError } = await supabase
        .from('job_posting')
        .select(`
          *,
          job_responsibility (responsibility),
          job_qualification (qualification),
          job_skill (skill)
        `)
        .eq('id', jobPost.id)
        .single();

      if (fetchError) throw fetchError;
      return completeJob;

    } catch (error) {
      console.error("Error creating job post:", error);
      throw error;
    }
  },

  async updateJobPost(jobId, jobData) {
    try {
      // Handle logo upload if it's a File object
      let logoUrl = jobData.company_logo_url;
      if (jobData.company_logo_url instanceof File) {
        const file = jobData.company_logo_url;
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('company-logos')
          .upload(`logos/${fileName}`, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('company-logos')
          .getPublicUrl(`logos/${fileName}`);

        logoUrl = publicUrl;
      }

      // Update job post with correct logo URL
      const { data: jobPost, error: jobError } = await supabase
        .from('job_posting')
        .update({
          job_title: jobData.job_title,
          company_name: jobData.company_name,
          company_logo_url: logoUrl, // Use the processed logo URL
          location: jobData.location,
          employment_type: jobData.employment_type,
          salary_range: jobData.salary_range,
          applicants_needed: jobData.applicants_needed,
          company_description: jobData.company_description,
          about_company: jobData.about_company,
        })
        .eq('id', jobId)
        .select()
        .single();

      if (jobError) throw jobError;

      // Delete existing related data first
      const deletePromises = [
        supabase.from('job_responsibility').delete().eq('job_posting_id', jobId),
        supabase.from('job_qualification').delete().eq('job_posting_id', jobId),
        supabase.from('job_skill').delete().eq('job_posting_id', jobId)
      ];

      await Promise.all(deletePromises);

      // Insert new related data
      const insertPromises = [];

      if (jobData.responsibilities?.length) {
        insertPromises.push(
          supabase.from('job_responsibility').insert(
            jobData.responsibilities.map(r => ({
              job_posting_id: jobId,
              responsibility: r
            }))
          )
        );
      }

      if (jobData.qualifications?.length) {
        insertPromises.push(
          supabase.from('job_qualification').insert(
            jobData.qualifications.map(q => ({
              job_posting_id: jobId,
              qualification: q
            }))
          )
        );
      }

      if (jobData.skills?.length) {
        insertPromises.push(
          supabase.from('job_skill').insert(
            jobData.skills.map(s => ({
              job_posting_id: jobId,
              skill: s
            }))
          )
        );
      }

      if (insertPromises.length) {
        const results = await Promise.all(insertPromises);
        const errors = results.filter(r => r.error);
        if (errors.length) {
          throw new Error('Failed to update related data');
        }
      }

      // Fetch complete updated job
      const { data: updatedJob, error: fetchError } = await supabase
        .from('job_posting')
        .select(`
          *,
          job_responsibility (responsibility),
          job_qualification (qualification),
          job_skill (skill)
        `)
        .eq('id', jobId)
        .single();

      if (fetchError) throw fetchError;
      return updatedJob;

    } catch (error) {
      console.error("Error updating job post:", error);
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
          job_skill (skill),
          applicant_count
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
      const { data, error } = await supabase
        .from('job_posting')
        .update({ status: 'active' })
        .eq('id', jobId)
        .select()
        .single();

      if (error) throw error;
      return data;
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
  },

  async getApplicantCount(jobId) {
    try {
      const { data, error } = await supabase
        .from('job_posting')
        .select('applicant_count')
        .eq('id', jobId)
        .single();

      if (error) throw error;
      return data.applicant_count;
    } catch (error) {
      console.error('Error fetching applicant count:', error);
      throw error;
    }
  }
};