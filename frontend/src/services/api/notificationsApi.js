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

  async getNotifications({ page = 1, pageSize = 10 } = {}) {
    try {
      const { data, count, error } = await supabase
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
        `, { count: 'exact' })
        .order('created_at', { ascending: false });

      if (error) throw error;

      return {
        data: data || [],
        total: count || 0
      };
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return { data: [], total: 0 };
    }
  },

  async markAsRead(notificationId) {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  async toggleReadStatus(notificationId, currentReadStatus) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .update({ read: !currentReadStatus })
        .eq('id', notificationId)
        .select(); // Add select to return updated data

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error toggling notification status:', error);
      throw error;
    }
  }
};