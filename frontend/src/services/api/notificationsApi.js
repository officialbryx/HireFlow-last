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
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      // Calculate range for pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

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
        .eq('recipient_id', user.id)  // Only get notifications for this user
        .order('created_at', { ascending: false })
        .range(from, to); // Apply pagination

      if (error) throw error;

      return {
        data: data || [],
        total: count || 0,
        page,
        pageSize,
        totalPages: Math.ceil((count || 0) / pageSize)
      };
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return { data: [], total: 0, page, pageSize, totalPages: 0 };
    }
  },

  async getJobseekerNotifications({ page = 1, pageSize = 10 } = {}) {
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      // Calculate range for pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      const { data, count, error } = await supabase
        .from('notifications')
        .select(`
          *,
          job_posting:job_posting_id (
            job_title,
            company_name
          )
        `, { count: 'exact' })
        .eq('recipient_id', user.id) // Only get notifications for this user
        .order('created_at', { ascending: false })
        .range(from, to); // Apply pagination

      if (error) throw error;

      return {
        data: data || [],
        total: count || 0,
        page,
        pageSize,
        totalPages: Math.ceil((count || 0) / pageSize)
      };
    } catch (error) {
      console.error('Error fetching jobseeker notifications:', error);
      return { data: [], total: 0, page, pageSize, totalPages: 0 };
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
  },

  // New methods for real-time subscriptions
  subscribeToNotifications(callback) {
    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications'
        },
        callback
      )
      .subscribe();

    return channel;
  },

  unsubscribeFromChannel(channel) {
    if (channel) {
      supabase.removeChannel(channel);
    }
  }
};