import { supabase } from '../supabaseClient';

export const notificationsApi = {
  async createNotification({ job_posting_id, application_id, recipient_id, message, type = 'application' }) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          job_posting_id,
          application_id,
          recipient_id,
          message,
          type
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  },

  async getNotifications() {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select(`
          *,
          job_posting:job_posting_id (
            job_title,
            company_name
          ),
          applications:application_id (
            personal_info
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  },

  async markAsRead(notificationId) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }
};