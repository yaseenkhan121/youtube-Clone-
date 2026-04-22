import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const { user, token } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const fetchNotifications = async () => {
        if (!token) return;
        
        try {
            setLoading(true);
            const response = await axios.get('http://127.0.0.1:8000/api/notifications');
            if (response.data.success) {
                setNotifications(response.data.data);
                setUnreadCount(response.data.unread_count);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchNotifications();
            // Optional: Set up polling or WebSocket
            const interval = setInterval(fetchNotifications, 60000); // Every minute
            return () => clearInterval(interval);
        } else {
            setNotifications([]);
            setUnreadCount(0);
        }
    }, [user]);

    const markAsRead = async (id) => {
        try {
            const response = await axios.post(`http://127.0.0.1:8000/api/notifications/${id}/read`);
            if (response.data.success) {
                setNotifications(prev => prev.map(n => n.id === id ? { ...n, read_at: new Date() } : n));
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/notifications/read-all');
            if (response.data.success) {
                setNotifications(prev => prev.map(n => ({ ...n, read_at: new Date() })));
                setUnreadCount(0);
            }
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, loading, markAsRead, markAllAsRead, refresh: fetchNotifications }}>
            {children}
        </NotificationContext.Provider>
    );
};
