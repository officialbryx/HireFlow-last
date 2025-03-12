import { supabase } from '../supabaseClient';
import { analyzeResume } from '../resumeAnalysis';

export const applicationsApi = {
  async submitApplication(applicationData) {
    try {
      // Insert application and get job posting details
      const { data: application, error } = await supabase
        .from('applications')
        .insert([applicationData])
        .select(`
          *,
          job_posting!inner (
            id,
            job_title,
            creator_id,
            company_name
          )
        `)
        .single();

      if (error) throw error;

      // Create notification
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert({
          job_posting_id: application.job_posting_id,
          application_id: application.id,
          recipient_id: application.job_posting.creator_id,
          message: `New application received for ${application.job_posting.job_title}`,
          type: 'application'
        });

      if (notificationError) throw notificationError;

      return application;
    } catch (error) {
      console.error('Error submitting application:', error);
      throw error;
    }
  },

  async fetchApplications(page = 1, limit = 20, filters = {}) {
    try {
      let query = supabase
        .from("applications")
        .select(`
          *,
          job_posting:job_posting_id (
            job_title,
            company_name
          )
        `, { count: 'exact' });
      
      // Apply filters if provided
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      
      if (filters.company) {
        query = query.eq('company', filters.company);
      }
      
      if (filters.job_id) {
        query = query.eq('job_posting_id', filters.job_id);
      }
      
      // Fix search functionality
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        
        // We need to get all items to perform client-side searching
        // because Supabase has limitations with searching JSON fields
        const { data: allData, error: allError } = await query;
        
        if (allError) throw allError;
        
        // Filter the data on client side by search term
        const filteredData = allData.filter(item => {
          const givenName = item.personal_info?.given_name?.toLowerCase() || '';
          const familyName = item.personal_info?.family_name?.toLowerCase() || '';
          const email = item.email?.toLowerCase() || '';
          const company = item.company?.toLowerCase() || '';
          const jobTitle = item.job_posting?.job_title?.toLowerCase() || '';
          
          return givenName.includes(searchTerm) || 
                 familyName.includes(searchTerm) || 
                 email.includes(searchTerm) || 
                 company.includes(searchTerm) ||
                 jobTitle.includes(searchTerm) ||
                 `${givenName} ${familyName}`.includes(searchTerm);
        });
        
        // Calculate pagination
        const total = filteredData.length;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const paginatedData = filteredData.slice(startIndex, endIndex);
        
        // Transform data
        const transformedData = paginatedData.map(app => ({
          ...app,
          personal_info: {
            ...app.personal_info,
            phone: typeof app.personal_info?.phone === 'object'
              ? `${app.personal_info.phone.code} ${app.personal_info.phone.number}`
              : app.personal_info?.phone
          },
          contact_info: {
            ...app.contact_info,
            phone: typeof app.contact_info?.phone === 'object'
              ? `${app.contact_info.phone.code} ${app.contact_info.phone.number}`
              : app.contact_info?.phone
          },
          address: app.address || {},
          work_experience: Array.isArray(app.work_experience) ? app.work_experience : [],
          education: Array.isArray(app.education) ? app.education : [],
          skills: Array.isArray(app.skills) ? app.skills : [],
          websites: Array.isArray(app.websites) ? app.websites : [],
          application_questions: app.application_questions || {},
          company: app.job_posting?.company_name || app.company,
          job_title: app.job_posting?.job_title
        }));

        return {
          data: transformedData,
          count: total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        };
      }
      
      // Standard query with pagination (no search)
      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range((page - 1) * limit, page * limit - 1);

      if (error) throw error;
      
      // Transform data
      const transformedData = (data || []).map(app => ({
        ...app,
        personal_info: {
          ...app.personal_info,
          phone: typeof app.personal_info?.phone === 'object'
            ? `${app.personal_info.phone.code} ${app.personal_info.phone.number}`
            : app.personal_info?.phone
        },
        contact_info: {
          ...app.contact_info,
          phone: typeof app.contact_info?.phone === 'object'
            ? `${app.contact_info.phone.code} ${app.contact_info.phone.number}`
            : app.contact_info?.phone
        },
        address: app.address || {},
        work_experience: Array.isArray(app.work_experience) ? app.work_experience : [],
        education: Array.isArray(app.education) ? app.education : [],
        skills: Array.isArray(app.skills) ? app.skills : [],
        websites: Array.isArray(app.websites) ? app.websites : [],
        application_questions: app.application_questions || {},
        company: app.job_posting?.company_name || app.company,
        job_title: app.job_posting?.job_title
      }));

      return {
        data: transformedData,
        count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      };
    } catch (error) {
      console.error("Error in fetchApplications:", error);
      throw new Error(`Failed to fetch applications: ${error.message}`);
    }
  },

  async getApplicationDetails(id) {
    try {
      const { data, error } = await supabase
        .from("applications")
        .select(`
          *
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      if (!data) {
        throw new Error('Application not found');
      }

      // Transform the data
      return {
        ...data,
        personal_info: data.personal_info || {},
        contact_info: data.contact_info || {},
        address: data.address || {},
        work_experience: Array.isArray(data.work_experience) ? data.work_experience : [],
        education: Array.isArray(data.education) ? data.education : [],
        skills: Array.isArray(data.skills) ? data.skills : [],
        websites: Array.isArray(data.websites) ? data.websites : [],
        application_questions: data.application_questions || {},
        company: data.job_posting?.company_name || data.company,
        job_title: data.job_posting?.title
      };
    } catch (error) {
      console.error("Error in getApplicationDetails:", error);
      throw new Error(`Failed to fetch application details: ${error.message}`);
    }
  },

  async updateApplicationStatus(id, status) {
    try {
      const { data, error } = await supabase
        .from("applications")
        .update({ status })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error updating application status:", error);
      throw error;
    }
  },

  getResumeUrl(resumeUrl) {
    if (!resumeUrl) return null;
    try {
      const filename = resumeUrl.split("/").pop();
      const filePath = `applications/${filename}`;
      const { data } = supabase.storage.from("resumes").getPublicUrl(filePath);
      return data.publicUrl;
    } catch (error) {
      console.error("Error generating resume URL:", error);
      return null;
    }
  },

  async analyzeApplicantResume(resumeUrl) {
    try {
      if (!resumeUrl) return null;
      const analysis = await analyzeResume(resumeUrl);
      return analysis;
    } catch (error) {
      console.error("Error analyzing resume:", error);
      return null;
    }
  },

  async downloadResume(resumeUrl) {
    try {
      if (!resumeUrl) throw new Error("No resume URL provided");
      
      const { data, error } = await supabase.storage
        .from("resumes")
        .download(`applications/${resumeUrl.split("/").pop()}`);

      if (error) throw error;

      const blob = new Blob([data], { type: "application/pdf" });
      return blob;
    } catch (error) {
      console.error("Resume access error:", error);
      throw error;
    }
  }
};