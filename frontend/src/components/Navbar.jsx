import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Search, Menu, User, LogOut, Video, Bell, LayoutDashboard, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import NotificationDropdown from './NotificationDropdown';

const Navbar = ({ onToggleSidebar }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const { user, logout, isLoggedIn } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Notification State
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    // Fetch Initial Unread Count
    useEffect(() => {
        if (isLoggedIn) {
            authService.getNotifications().then(res => {
                if (res.success) setUnreadCount(res.unread_count);
            });
        }
    }, [isLoggedIn]);

    // Debounced search logic
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery.trim() && searchQuery.length >= 2) {
                // Only navigate if we're not already searching for this
                const params = new URLSearchParams(window.location.search);
                if (params.get('q') !== searchQuery) {
                    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
                }
            }
        }, 500); // 500ms debounce

        return () => clearTimeout(timer);
    }, [searchQuery, navigate]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };


    return (
        <nav className="nav-blur h-16 flex items-center justify-between px-4 sticky top-0 transition-all duration-300">
            {/* Left: Logo */}
            <div className="flex items-center gap-4">
                <button 
                    onClick={onToggleSidebar}
                    className="text-white hover:bg-white/10 p-2 rounded-full transition-colors active:scale-90"
                >
                    <Menu size={24} />
                </button>
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="bg-primary p-1.5 rounded-xl group-hover:scale-110 transition-transform shadow-lg shadow-primary/20">
                        <Video size={20} className="text-white fill-white" />
                    </div>
                    <span className="text-xl font-black text-white tracking-tighter hidden sm:block">
                        Wow<span className="text-primary italic">Tube</span>
                    </span>
                </Link>
            </div>

            {/* Center: Search Bar */}
            <form 
                onSubmit={handleSearch}
                className="hidden md:flex flex-1 max-w-2xl mx-8 relative group"
            >
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-primary transition-colors">
                    <Search size={18} />
                </div>
                <input
                    type="text"
                    placeholder="Search premium content..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-card-bg/50 border border-border-color rounded-full py-2.5 pl-12 pr-4 text-white focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 placeholder:text-neutral-500 transition-all font-medium"
                />
            </form>


            {/* Right: User Menu */}
            <div className="flex items-center gap-2 sm:gap-4">
                <div className="relative">
                    <button 
                        onClick={() => {
                            setIsNotificationsOpen(!isNotificationsOpen);
                            setIsProfileOpen(false);
                        }}
                        className={`hidden sm:block p-2.5 rounded-full transition-all relative ${
                            isNotificationsOpen ? 'bg-primary/20 text-primary' : 'text-neutral-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <Bell size={20} />
                        {unreadCount > 0 && (
                            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-primary text-white text-[10px] font-black flex items-center justify-center rounded-full ring-2 ring-app-bg animate-in zoom-in duration-300">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </button>

                    {isNotificationsOpen && (
                        <NotificationDropdown 
                            onClose={() => setIsNotificationsOpen(false)} 
                            onUnreadUpdate={setUnreadCount} 
                        />
                    )}
                </div>
                
                {isLoggedIn ? (
                    <div className="relative">
                        <button 
                            onClick={() => {
                                setIsProfileOpen(!isProfileOpen);
                                setIsNotificationsOpen(false);
                            }}
                            className="flex items-center gap-2 p-1 pl-3 bg-white/5 rounded-full border border-white/10 hover:border-primary/50 transition-all active:scale-95"
                        >
                            <span className="text-sm font-bold text-white hidden sm:block">{user?.name}</span>
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-purple-400 flex items-center justify-center text-white font-bold text-xs ring-2 ring-transparent group-hover:ring-primary/50">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                        </button>

                        {isProfileOpen && (
                            <div className="absolute right-0 mt-3 w-56 bg-card-bg border border-border-color rounded-2xl shadow-2xl overflow-hidden py-1 z-[100] animate-in fade-in zoom-in-95 duration-150">
                                <Link 
                                    to="/profile" 
                                    className="flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-primary/10 transition-colors"
                                    onClick={() => setIsProfileOpen(false)}
                                >
                                    <User size={18} className="text-neutral-400" /> My Profile
                                </Link>
                                <div className="h-px bg-border-color my-1" />
                                <button 
                                    onClick={() => {
                                        logout();
                                        setIsProfileOpen(false);
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors font-medium text-left"
                                >
                                    <LogOut size={18} /> Sign Out
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <Link to="/login" className="text-white text-sm font-bold px-4 py-2 rounded-full hover:bg-white/5 transition-colors">
                            Sign in
                        </Link>
                        <Link 
                            to="/register" 
                            className="bg-primary hover:bg-primary/80 text-white text-sm font-bold px-5 py-2 rounded-full transition-all shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-primary/50"
                        >
                            Get Started
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
