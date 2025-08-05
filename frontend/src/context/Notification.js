import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';

// Notification context and provider
const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch notifications from backend API
  const { user } = require('./Auth').useAuth();
  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      if (!user || !user.token) throw new Error('No user token');
      const res = await fetch('http://localhost:5000/api/notifications', {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      if (!res.ok) throw new Error('Failed to fetch notifications');
      const data = await res.json();
      setNotifications(data);
    } catch (err) {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchNotifications();
    
    // Set up WebSocket connection for real-time notification updates
    if (!user?.token) return;
    
    const socket = io('http://localhost:5000', {
      auth: {
        token: user.token
      },
      transports: ['websocket', 'polling']
    });

    socket.on('connect', () => {
      console.log('🟢 Notification WebSocket connected:', socket.id);
    });

    // Listen for real-time notification updates
    socket.on('notifications-updated', () => {
      console.log('📡 Received notifications-updated event');
      fetchNotifications();
    });

    socket.on('admin-notification', (data) => {
      console.log('📡 Received admin-notification event:', data);
      fetchNotifications();
    });

    socket.on('notification-seen', (notification) => {
      console.log('📡 Received notification-seen event:', notification);
      fetchNotifications();
    });

    // Listen for user-specific notification events
    if (user.userId || user._id || user.id) {
      const userId = user.userId || user._id || user.id;
      socket.on(`user-${userId}`, (data) => {
        console.log('📡 Received user-specific notification event:', data);
        fetchNotifications();
      });
    }

    // Listen for admin-specific events if user is admin
    if (user.role === 'admin') {
      socket.on('admin-notification-seen', (notification) => {
        console.log('📡 Received admin-notification-seen event:', notification);
        fetchNotifications();
      });
    }

    socket.on('disconnect', () => {
      console.log('🔴 Notification WebSocket disconnected');
    });

    socket.on('connect_error', (error) => {
      console.error('❌ Notification WebSocket connection error:', error);
    });
    
    // Cleanup WebSocket on unmount
    return () => {
      socket.disconnect();
    };
  }, [fetchNotifications, user]);

  // Mark as seen
  const markAsSeen = async (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, seen: true } : n))
    );
    try {
      if (!user || !user.token) throw new Error('No user token');
      await fetch(`http://localhost:5000/api/notifications/${id}/mark-as-seen`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
    } catch (err) {
      // Optionally handle error
    }
  };

  return (
    <NotificationContext.Provider value={{ notifications, loading, markAsSeen, fetchNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

// Hook
export const useNotification = () => useContext(NotificationContext);