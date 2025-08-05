import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './Auth';
import { io } from 'socket.io-client';

const TowingContext = createContext(null);

export const useTowing = () => {
  const context = useContext(TowingContext);
  if (!context) {
    throw new Error('useTowing must be used within a TowingProvider');
  }
  return context;
};

export const TowingProvider = ({ children }) => {
  // Helper functions for analytics are added below.
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notificationRefreshCallback, setNotificationRefreshCallback] = useState(null);

  // Fetch requests from backend
  // Move fetchRequests to top-level so it can be called from anywhere
  const fetchRequests = async () => {
      if (!user?.token || !user?.role) return;
      setLoading(true);
      try {
        let url = '';
        let options = {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        };
        if (user.role === 'admin') {
          url = 'http://localhost:5000/api/AllRequests';
        } else {
          // Try user.userId, fallback to user._id or user.id
          const uid = user.userId || user._id || user.id || '';
          url = `http://localhost:5000/api/requests/${uid}`;
        }
        const res = await fetch(url, options);
        const data = await res.json();
        if (res.ok) {
          setRequests(data);
        } else {
          setRequests([]);
        }
      } catch (error) {
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchRequests();
    
    // Set up WebSocket connection for real-time updates
    if (!user?.token) return;
    
    const socket = io('http://localhost:5000', {
      auth: {
        token: user.token
      },
      transports: ['websocket', 'polling']
    });

    socket.on('connect', () => {
      console.log('🟢 Towing WebSocket connected:', socket.id);
    });

    // Listen for real-time request updates
    socket.on('requests-updated', () => {
      console.log('📡 Received requests-updated event');
      fetchRequests();
    });

    socket.on('request-created', (newRequest) => {
      console.log('📡 Received request-created event:', newRequest);
      fetchRequests();
    });

    socket.on('request-status-updated', (updatedRequest) => {
      console.log('📡 Received request-status-updated event:', updatedRequest);
      fetchRequests();
    });

    socket.on('request-cancelled', (cancelledRequest) => {
      console.log('📡 Received request-cancelled event:', cancelledRequest);
      fetchRequests();
    });

    // Listen for user-specific events
    if (user.userId || user._id || user.id) {
      const userId = user.userId || user._id || user.id;
      socket.on(`user-${userId}`, (data) => {
        console.log('📡 Received user-specific event:', data);
        fetchRequests();
        // Trigger notification refresh if callback is set
        if (notificationRefreshCallback) {
          notificationRefreshCallback();
        }
      });
    }

    socket.on('disconnect', () => {
      console.log('🔴 Towing WebSocket disconnected');
    });

    socket.on('connect_error', (error) => {
      console.error('❌ Towing WebSocket connection error:', error);
    });
    
    // Cleanup WebSocket on unmount
    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line
  }, [user]);

  const createRequest = async (requestData) => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(requestData)
      });
      const data = await res.json();
      if (res.ok) {
        setRequests(prev => [data, ...prev]);
        return { success: true, requestId: data._id };
      } else {
        return { success: false, error: data.message };
      }
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const updateRequestStatus = async (requestId, newStatus, assignedTo = null) => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/requests/${requestId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ newStatus })
      });
      const data = await res.json();
      if (res.ok) {
        // For admin, re-fetch all requests to ensure userId is populated (with passenger info)
        if (user.role === 'admin') {
          await fetchRequests();
        } else {
          setRequests(prev => prev.map(request =>
            request._id === requestId ? data : request
          ));
        }
        
        // Trigger notification refresh if callback is set
        if (notificationRefreshCallback) {
          notificationRefreshCallback();
        }
        
        return { success: true };
      } else {
        return { success: false, error: data.message };
      }
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const cancelRequest = async (requestId) => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/requests/${requestId}/cancel`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        setRequests(prev => prev.map(request =>
          request._id === requestId ? data.request : request
        ));
        
        // Trigger notification refresh if callback is set
        if (notificationRefreshCallback) {
          notificationRefreshCallback();
        }
        
        return { success: true };
      } else {
        return { success: false, error: data.message };
      }
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const getRequestsByStatus = (status) => {
    return requests.filter(request => request.status === status);
  };

  const getRequestStats = () => {
    return {
      total: requests.length,
      pending: requests.filter(r => r.status === 'pending').length,
      accepted: requests.filter(r => r.status === 'accepted').length,
      completed: requests.filter(r => r.status === 'completed').length
    };
  };

  // Helper: compute resolution rate for current month
  const getMonthlyResolutionRate = () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    const thisMonthRequests = requests.filter(r => {
      const created = new Date(r.createdAt);
      return created >= startOfMonth && created <= endOfMonth;
    });
    const completedThisMonth = thisMonthRequests.filter(r => r.status === 'completed');
    if (thisMonthRequests.length === 0) return 0;
    return Math.round((completedThisMonth.length / thisMonthRequests.length) * 1000) / 10; // e.g. 98.5
  };

  // Helper: compute average response time (creation to first status change) for requests this month
  const getMonthlyAverageResponseTime = () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    // Only consider requests created this month
    const thisMonthRequests = requests.filter(r => {
      const created = new Date(r.createdAt);
      return created >= startOfMonth && created <= endOfMonth;
    });
    // For each request, use createdAt and updatedAt
    // If status is still 'pending', skip (not responded to)
    const responseTimes = thisMonthRequests
      .filter(r => r.status !== 'pending')
      .map(r => {
        const created = new Date(r.createdAt);
        const updated = new Date(r.updatedAt);
        return (updated - created) / 60000; // minutes
      });
    if (responseTimes.length === 0) return null;
    const avg = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
    return Math.round(avg * 10) / 10; // e.g. 18.2
  };

  const value = {
    requests,
    loading,
    fetchRequests,
    createRequest,
    updateRequestStatus,
    cancelRequest,
    getRequestsByStatus,
    getRequestStats,
    getMonthlyResolutionRate,
    getMonthlyAverageResponseTime,
    setNotificationRefreshCallback
  };

  return (
    <TowingContext.Provider value={value}>
      {children}
    </TowingContext.Provider>
  );
};