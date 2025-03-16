import { useContext, useState, useEffect } from 'react';
import { notificationsApi } from '../services/api/notificationsApi';
import { NotificationsContext } from './NotificationsContext';

export const NotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();

    const channel = notificationsApi.subscribeToNotifications((payload) => {
      if (payload.eventType === 'INSERT') {
        setNotifications(prev => [payload.new, ...prev]);
      }
    });

    return () => {
      notificationsApi.unsubscribeFromChannel(channel);
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await notificationsApi.getNotifications();
      setNotifications(data?.data || []);
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

