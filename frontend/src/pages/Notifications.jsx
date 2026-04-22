import React, { useState, useEffect } from 'react';
import { authService } from '../services/api';
import { Bell, CheckCircle, Trash2, AlertCircle, Loader2 } from 'lucide-react';

const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
};

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const response = await authService.getNotifications();
            if (response.success) {
                setNotifications(response.data);
            }
        } catch (err) {
            setError('Failed to load notifications.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const markAsRead = async (id) => {
        try {
            const res = await authService.markNotificationRead(id);
            if (res.success) {
                setNotifications(notifications.map(n => 
                    n.id === id ? { ...n, read_at: new Date() } : n
                ));
            }
        } catch (err) {
            console.error('Error marking as read:', err);
        }
    };

    const markAllRead = async () => {
        try {
            const res = await authService.markAllNotificationsRead();
            if (res.success) {
                setNotifications(notifications.map(n => ({ ...n, read_at: new Date() })));
            }
        } catch (err) {
            console.error('Error marking all as read:', err);
        }
    };

    if (loading) return (
        <div className="max-w-3xl mx-auto p-6 space-y-4 animate-pulse">
            <div className="h-8 bg-neutral-800 rounded w-48 mb-8" />
            {[1, 2, 3, 4].map(i => <div key={i} className="h-20 bg-neutral-800 rounded-xl" />)}
        </div>
    );

    return (
        <div className="max-w-3xl mx-auto p-4 md:p-8 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <Bell size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Notifications</h1>
                        <p className="text-neutral-400 text-sm font-medium">Updates from your subscriptions and interactions</p>
                    </div>
                </div>
                {notifications.some(n => !n.read_at) && (
                    <button 
                        onClick={markAllRead}
                        className="text-xs font-bold text-primary hover:text-white transition-colors bg-primary/10 px-4 py-2 rounded-full border border-primary/20"
                    >
                        Mark all as read
                    </button>
                )}
            </div>

            {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                    <div className="w-20 h-20 bg-neutral-900 rounded-full flex items-center justify-center text-neutral-800">
                        <Bell size={40} />
                    </div>
                    <h3 className="text-lg font-bold text-white">No notifications yet</h3>
                    <p className="text-neutral-500 max-w-xs mx-auto">We'll notify you when there's something new for you to see.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {notifications.map((notification) => (
                        <div 
                            key={notification.id}
                            className={`p-4 rounded-2xl border transition-all flex items-start gap-4 ${
                                notification.read_at 
                                    ? 'bg-neutral-900/30 border-neutral-800/50 grayscale opacity-60' 
                                    : 'bg-neutral-900 border-neutral-800 hover:border-primary/30 shadow-xl'
                            }`}
                        >
                            <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${notification.read_at ? 'bg-transparent' : 'bg-primary shadow-[0_0_8px_rgba(124,58,237,0.6)]'}`} />
                            
                            <div className="flex-1 space-y-1">
                                <p className="text-white text-[15px] leading-relaxed">
                                    {notification.data.message || 'New update available'}
                                </p>
                                <p className="text-xs text-neutral-500 font-medium lowercase first-letter:uppercase">
                                    {formatTimeAgo(notification.created_at)}
                                </p>
                            </div>

                            {!notification.read_at && (
                                <button 
                                    onClick={() => markAsRead(notification.id)}
                                    className="p-2 hover:bg-neutral-800 text-neutral-500 hover:text-primary rounded-full transition-colors"
                                    title="Mark as read"
                                >
                                    <CheckCircle size={18} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Notifications;
