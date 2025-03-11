import { useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { notificationsApi } from '../services/api/notificationsApi';
import { NotificationsContext } from './NotificationsContext';

export const NotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();

    // Set up real-time subscription
    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications'
        },
        (payload) => {
          setNotifications(prev => [payload.new, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await notificationsApi.getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  return (
    <NotificationsContext.Provider value={{ notifications, fetchNotifications }}>
      {children}
    </NotificationsContext.Provider>
  );
};

// useNotifications hook moved to a separate file