import { useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';

export const useWebSocket = (url = 'http://localhost:5000', user = null) => {
  const socketRef = useRef(null);
  const eventListenersRef = useRef(new Map());

  // Initialize WebSocket connection
  useEffect(() => {
    if (!user?.token) return;

    // Create socket connection
    socketRef.current = io(url, {
      auth: {
        token: user.token
      },
      transports: ['websocket', 'polling']
    });

    const socket = socketRef.current;

    socket.on('connect', () => {
      console.log('🟢 WebSocket connected:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('🔴 WebSocket disconnected');
    });

    socket.on('connect_error', (error) => {
      console.error('❌ WebSocket connection error:', error);
    });

    // Cleanup on unmount
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [url, user?.token]);

  // Subscribe to events
  const subscribe = useCallback((event, callback) => {
    if (!socketRef.current) return;

    const socket = socketRef.current;
    
    // Remove existing listener if any
    if (eventListenersRef.current.has(event)) {
      socket.off(event, eventListenersRef.current.get(event));
    }

    // Add new listener
    socket.on(event, callback);
    eventListenersRef.current.set(event, callback);

    // Return unsubscribe function
    return () => {
      socket.off(event, callback);
      eventListenersRef.current.delete(event);
    };
  }, []);

  // Unsubscribe from events
  const unsubscribe = useCallback((event) => {
    if (!socketRef.current) return;

    const socket = socketRef.current;
    const callback = eventListenersRef.current.get(event);
    
    if (callback) {
      socket.off(event, callback);
      eventListenersRef.current.delete(event);
    }
  }, []);

  // Emit events
  const emit = useCallback((event, data) => {
    if (socketRef.current) {
      socketRef.current.emit(event, data);
    }
  }, []);

  return {
    socket: socketRef.current,
    subscribe,
    unsubscribe,
    emit,
    isConnected: socketRef.current?.connected || false
  };
};
