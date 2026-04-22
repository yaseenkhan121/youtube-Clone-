import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell, CheckCircle, ExternalLink, Inbox, Loader2 } from 'lucide-react';
import { authService } from '../services/api';

const NotificationDropdown = ({ onClose, onUnreadUpdate }) => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            const response = await authService.getNotifications();
            if (response.success) {
                setNotifications(response.data.slice(0, 5)); // Show only 5 recent
                if (onUnreadUpdate) onUnreadUpdate(response.unread_count);
            }
        } catch (err) {
            console.error('Failed to fetch notifications:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Set up a small interval to poll for new ones
        const interval = setInterval(fetchNotifications, 30000); // 30s
        return () => clearInterval(interval);
    }, []);

    const markAsRead = async (e, id) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            const res = await authService.markNotificationRead(id);
            if (res.success) {
                setNotifications(notifications.map(n => 
                    n.id === id ? { ...n, read_at: new Date() } : n
                ));
                // Update parent count
                fetchNotifications();
            }
        } catch (err) {
            console.error('Error marking as read:', err);
        }
    };

    const formatTimeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        if (seconds < 60) return 'Just now';
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        return Math.floor(hours / 24) + 'd ago';
    };

    return (
        <div className="absolute right-0 mt-3 w-80 md:w-96 bg-card-bg/95 border border-border-color backdrop-blur-2xl rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.4)] overflow-hidden z-[100] animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-border-color flex items-center justify-between bg-white/5">
                <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                    <Bell size={16} className="text-primary" />
                    Notifications
                </h3>
                <Link 
                    to="/notifications" 
                    onClick={onClose}
                    className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                >
                    View All <ExternalLink size={12} />
                </Link>
            </div>

            <div className="max-h-[400px] overflow-y-auto no-scrollbar">
                {loading ? (
                    <div className="p-12 flex flex-col items-center justify-center gap-3">
                        <Loader2 className="text-primary animate-spin" size={32} />
                        <p className="text-xs font-bold text-text-secondary uppercase tracking-widest">Scanning Intel...</p>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="p-12 flex flex-col items-center justify-center text-center gap-4">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-neutral-700">
                            <Inbox size={32} />
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-black text-white uppercase">Void Detected</p>
                            <p className="text-xs text-text-secondary font-medium">No new transmissions found in your frequency.</p>
                        </div>
                    </div>
                ) : (
                    <div className="divide-y divide-border-color/50">
                        {notifications.map((notification) => (
                            <div 
                                key={notification.id}
                                className={`p-4 flex items-start gap-4 transition-all hover:bg-white/5 group relative ${notification.read_at ? 'opacity-50' : 'bg-primary/5'}`}
                            >
                                {!notification.read_at && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary shadow-[0_0_15px_rgba(124,58,237,0.8)]" />
                                )}
                                
                                <div className="flex-1 space-y-1.5">
                                    <p className="text-sm text-white font-medium leading-relaxed">
                                        {notification.data.message}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black text-text-secondary uppercase tracking-tighter">
                                            {formatTimeAgo(notification.created_at)}
                                        </span>
                                        {!notification.read_at && (
                                            <button 
                                                onClick={(e) => markAsRead(e, notification.id)}
                                                className="p-1.5 rounded-lg bg-primary/10 text-primary opacity-0 group-hover:opacity-100 transition-all hover:bg-primary hover:text-white"
                                                title="Mark as read"
                                            >
                                                <CheckCircle size={14} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="p-4 bg-white/5 border-t border-border-color text-center">
                <p className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em]">End of Transmission</p>
            </div>
        </div>
    );
};

export default NotificationDropdown;
