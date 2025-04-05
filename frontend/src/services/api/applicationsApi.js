import { supabase } from '../supabaseClient';
import { analyzeResume } from '../resumeAnalysis';

export const applicationsApi = {
  async submitApplication(applicationData) {
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      
      // Add applicant_id to data
      applicationData.applicant_id = user.id;
      
      // Handle resume upload if exists
      if (applicationData.resume_file instanceof File) {
        const fileName = `${Date.now()}-${applicationData.resume_file.name}`;
        const { error: uploadError, data } = await supabase.storage
          .from('resumes')
          .upload(`applications/${fileName}`, applicationData.resume_file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('resumes')
          .getPublicUrl(`applications/${fileName}`);

        applicationData.resume_url = publicUrl;
      }
      
      // Remove the file object as it can't be stored in the database
      delete applicationData.resume_file;
      
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
      // Build the base query
      let query = supabase
        .from("applications")
        .select(`
          *,
          job_posting:job_posting_id (
            job_title,
            company_name
          )
        `, { count: 'exact' });  // This is correct for the select query
      
      // Apply filters if provided
      if (filters.status) {
        // Special case for shortlisted filter
        if (filters.status === 'shortlisted') {
          query = query.eq('shortlisted', true);
        } else {
          query = query.eq('status', filters.status);
        }
      }
      
      if (filters.company) {
        query = query.eq('company', filters.company);
      }
      
      if (filters.job_id) {
        query = query.eq('job_posting_id', filters.job_id);
      }
      
      // For search functionality (if you have text search)
      if (filters.search) {
        // Client-side search in JSON fields since Supabase doesn't support it well
        // First get all items to perform client-side searching
        const { data: allData, error: allDataError } = await supabase
          .from("applications")
          .select(`
            *,
            job_posting:job_posting_id (
              job_title,
              company_name
            )
          `)
          .order('created_at', { ascending: false });
        
        if (allDataError) throw allDataError;
        
        // Perform client-side filtering
        const searchTerm = filters.search.toLowerCase();
        const filteredData = allData.filter(app => {
          // Search in basic fields
          if (app.company?.toLowerCase().includes(searchTerm)) return true;
          
          // Search in personal info
          const personalInfo = app.personal_info || {};
          if (personalInfo.given_name?.toLowerCase().includes(searchTerm)) return true;
          if (personalInfo.family_name?.toLowerCase().includes(searchTerm)) return true;
          if (personalInfo.email?.toLowerCase().includes(searchTerm)) return true;
          
          // Search in work experience
          const workExperience = Array.isArray(app.work_experience) ? app.work_experience : [];
          if (workExperience.some(exp => 
            exp.job_title?.toLowerCase().includes(searchTerm) || 
            exp.company?.toLowerCase().includes(searchTerm)
          )) return true;
          
          // Search in skills
          const skills = Array.isArray(app.skills) ? app.skills : [];
          if (skills.some(skill => skill.toLowerCase().includes(searchTerm))) return true;
          
          return false;
        });
        
        // Manual pagination for search results
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedResults = filteredData.slice(startIndex, endIndex);
        
        // Return the paginated search results
        return {
          data: paginatedResults,
          count: filteredData.length,
          page,
          limit,
          totalPages: Math.ceil(filteredData.length / limit)
        };
      }
      
      // Execute query with pagination and get count
      const { data, error, count: totalCount } = await query
        .order('created_at', { ascending: false })
        .range((page - 1) * limit, (page * limit) - 1);

      if (error) throw error;
      
      // Handle no results case
      if (!data || data.length === 0) {
        return {
          data: [],
          count: 0,
          page,
          limit,
          totalPages: 0
        };
      }
      
      // Transform data (your existing transformation code)
      const transformedData = data.map(app => ({
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
        count: totalCount || 0,
        page,
        limit,
        totalPages: Math.ceil((totalCount || 0) / limit)
      };
    } catch (error) {
      console.error("Error in fetchApplications:", error);
      throw error;
    }
  },

  async getApplicationDetails(id) {
    try {
      const { data, error } = await supabase
        .from("applications")
        .select(`
          *,
          job_posting:job_posting_id (*)
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
      console.log(`Updating application ${id} status to ${status}`);
      
      const { data, error } = await supabase
        .from('applications')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
        
      if (error) throw error;
      
      // Create notification for the applicant about status change
      const { data: appData } = await supabase
        .from('applications')
        .select(`
          applicant_id,
          job_posting_id,
          job_posting:job_posting_id (
            job_title
          )
        `)
        .eq('id', id)
        .single();
        
      if (appData) {
        await supabase
          .from('notifications')
          .insert({
            job_posting_id: appData.job_posting_id,
            application_id: id,
            recipient_id: appData.applicant_id, // Send to applicant, not employer
            message: `Your application for ${appData.job_posting.job_title} status changed to ${status}`,
            type: status
          });
      }
      
      return data;
    } catch (error) {
      console.error('Error updating application status:', error);
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
  },

  updateApplicantShortlist: async (applicantId, shortlisted) => {
    console.log("API: updateApplicantShortlist called with:", { applicantId, shortlisted });
    
    try {
      // First get the current application
      const { data: currentApp, error: fetchError } = await supabase
        .from('applications')
        .select(`
          id, 
          shortlisted,
          applicant_id,
          job_posting_id,
          job_posting:job_posting_id (
            job_title
          )
        `)
        .eq('id', applicantId)
        .single();
        
      if (fetchError) {
        console.error("API: Error fetching current app:", fetchError);
        throw fetchError;
      }
      
      console.log("API: Current app data:", currentApp);
      
      // Only proceed with update if value is changing
      if (currentApp.shortlisted !== shortlisted) {
        console.log("API: Updating shortlist status to:", shortlisted);
        
        // Update the application
        const { data, error } = await supabase
          .from('applications')
          .update({ 
            shortlisted,
            updated_at: new Date().toISOString() // Update the timestamp
          })
          .eq('id', applicantId);
            
        if (error) {
          console.error("API: Error updating shortlist status:", error);
          throw error;
        }
        
        console.log("API: Shortlist updated successfully");
        
        // Create notification for the applicant about shortlist change
        if (currentApp.job_posting) {
          const { error: notificationError } = await supabase
            .from('notifications')
            .insert({
              job_posting_id: currentApp.job_posting_id,
              application_id: currentApp.id,
              recipient_id: currentApp.applicant_id, // Send to applicant
              message: shortlisted 
                ? `You've been shortlisted for ${currentApp.job_posting.job_title}`
                : `You've been removed from the shortlist for ${currentApp.job_posting.job_title}`,
              type: 'shortlisted'
            });
          
          if (notificationError) {
            console.error('Notification creation error:', notificationError);
            // Continue even if notification fails
          }
        }
        
        return { success: true, data };
      } else {
        console.log("API: No change needed, current shortlist status already matches");
        return { success: true, data: currentApp };
      }
      
    } catch (error) {
      console.error('API: Error updating applicant shortlist:', error);
      throw error;
    }
  },

  async getApplicationsByJob(jobId) {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')  // Just select all fields from applications
        .eq('job_posting_id', jobId);
        
      if (error) throw error;
      
      // Transform the data for consistency with other methods
      const transformedData = data.map(app => ({
        ...app,
        personal_info: app.personal_info || {},
        contact_info: app.contact_info || {},
        address: app.address || {},
        work_experience: Array.isArray(app.work_experience) ? app.work_experience : [],
        education: Array.isArray(app.education) ? app.education : [],
        skills: Array.isArray(app.skills) ? app.skills : [],
        websites: Array.isArray(app.websites) ? app.websites : [],
        application_questions: app.application_questions || {}
      }));
      
      return transformedData;
    } catch (error) {
      console.error('Error fetching applications by job:', error);
      throw error;
    }
  },

  async getMyApplications({ page = 1, pageSize = 10, status = undefined } = {}) {
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      
      // Build query with the applicant_id filter
      let query = supabase
        .from("applications")
        .select(`
          *,
          job_posting:job_posting_id (
            job_title,
            company_name,
            location,  
            salary_range,
            status
          )
        `, { count: 'exact' })
        .eq('applicant_id', user.id);
      
      // Apply status filter if provided
      if (status) {
        query = query.eq('status', status);
      }
      
      // Calculate range for pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      
      // Execute query with pagination
      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(from, to);
      
      if (error) throw error;
      
      return {
        data: data || [],
        total: count || 0,
        page,
        pageSize,
        totalPages: Math.ceil((count || 0) / pageSize)
      };
    } catch (error) {
      console.error('Error fetching my applications:', error);
      return { data: [], total: 0, page, pageSize, totalPages: 0 };
    }
  },

  withdrawApplication: async (applicationId) => {
    try {
      console.log(`Withdrawing application ${applicationId}`);
      
      // Update application status to 'withdrawn'
      const { data, error } = await supabase
        .from('applications')
        .update({ 
          status: 'withdrawn',
          updated_at: new Date().toISOString()
        })
        .eq('id', applicationId);
        
      if (error) throw error;
      
      // Create notification for the employer about withdrawal
      const { data: appData } = await supabase
        .from('applications')
        .select(`
          applicant_id,
          job_posting_id,
          job_posting:job_posting_id (
            job_title,
            creator_id
          )
        `)
        .eq('id', applicationId)
        .single();
        
      if (appData && appData.job_posting) {
        await supabase
          .from('notifications')
          .insert({
            job_posting_id: appData.job_posting_id,
            application_id: applicationId,
            recipient_id: appData.job_posting.creator_id, // Send to employer
            message: `An applicant has withdrawn their application for ${appData.job_posting.job_title}`,
            type: 'withdrawn'
          });
      }
      
      return data;
    } catch (error) {
      console.error('Error withdrawing application:', error);
      throw error;
    }
  },
};