import { supabase } from '../supabaseClient';
import { notificationsApi } from './notificationsApi';

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
  }
};