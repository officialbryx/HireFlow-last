import { supabase } from "../supabaseClient";

export const jobPostsApi = {
  async createJobPost(jobPostData) {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

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
        creator_id: user.id
      };

      const { data: jobPost, error: jobPostError } = await supabase
        .from("job_posting")
        .insert([formattedData])
        .select();

      if (jobPostError) throw jobPostError;

      const jobPostId = jobPost[0].id;

      // Insert related data
      await this.insertJobRelatedData(jobPostId, jobPostData);

      return jobPost;
    } catch (error) {
      console.error("Error creating job post:", error);
      throw error;
    }
  },

  async insertJobRelatedData(jobPostId, jobPostData) {
    // Insert responsibilities
    const responsibilities = jobPostData.responsibilities.map(responsibility => ({
      job_posting_id: jobPostId,
      responsibility,
    }));
    const { error: respError } = await supabase
      .from("job_responsibility")
      .insert(responsibilities);
    if (respError) throw respError;

    // Insert qualifications
    const qualifications = jobPostData.qualifications.map(qualification => ({
      job_posting_id: jobPostId,
      qualification,
    }));
    const { error: qualError } = await supabase
      .from("job_qualification")
      .insert(qualifications);
    if (qualError) throw qualError;

    // Insert skills
    const skills = jobPostData.skills.map(skill => ({
      job_posting_id: jobPostId,
      skill,
    }));
    const { error: skillError } = await supabase
      .from("job_skill")
      .insert(skills);
    if (skillError) throw skillError;
  },

  async getJobPostingDetails(jobPostId) {
    try {
      const { data: jobPost, error: jobPostError } = await supabase
        .from('job_posting')
        .select('*')
        .eq('id', jobPostId)
        .single();

      if (jobPostError) throw jobPostError;

      const relatedData = await this.getJobRelatedData(jobPostId);

      return {
        ...jobPost,
        ...relatedData
      };
    } catch (error) {
      console.error('Error fetching job posting details:', error);
      throw error;
    }
  },

  async getJobRelatedData(jobPostId) {
    const [responsibilities, qualifications, skills] = await Promise.all([
      supabase
        .from('job_responsibility')
        .select('responsibility')
        .eq('job_posting_id', jobPostId),
      supabase
        .from('job_qualification')
        .select('qualification')
        .eq('job_posting_id', jobPostId),
      supabase
        .from('job_skill')
        .select('skill')
        .eq('job_posting_id', jobPostId)
    ]);

    return {
      responsibilities: responsibilities.data.map(r => r.responsibility),
      qualifications: qualifications.data.map(q => q.qualification),
      skills: skills.data.map(s => s.skill)
    };
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

      return jobPostings.map(post => ({
        ...post,
        responsibilities: post.job_responsibility.map(r => r.responsibility),
        qualifications: post.job_qualification.map(q => q.qualification),
        skills: post.job_skill.map(s => s.skill)
      }));
    } catch (error) {
      console.error('Error fetching all job postings:', error);
      throw error;
    }
  }
};