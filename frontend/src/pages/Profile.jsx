import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import { User as UserIcon, Camera, Save, Loader2, CheckCircle, Video, History, Heart, Bookmark, Sparkles, ShieldCheck, Mail, User } from 'lucide-react';

const Profile = () => {
    const { user, updateProfile } = useAuth();
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');
    const [stats, setStats] = useState({ liked_count: 0, history_count: 0, watch_later_count: 0 });

    useEffect(() => {
        if (user) {
            fetchStats();
            setName(user.name);
            setEmail(user.email);
        }
    }, [user]);

    const fetchStats = async () => {
        try {
            const data = await authService.getStats();
            if (data.success) {
                setStats(data.stats);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await authService.updateProfile({ name, email });
            if (response.success) {
                updateProfile(response.user);
                setMessage('Profile updated successfully!');
            }
        } catch (error) {
            setMessage('Error updating profile.');
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('avatar', file);

        setUploading(true);
        setMessage('');

        try {
            const response = await authService.uploadAvatar(formData);
            if (response.success) {
                const updatedUser = { ...user, avatar_path: response.avatar_url };
                updateProfile(updatedUser);
                setMessage('Avatar uploaded successfully!');
            }
        } catch (error) {
            setMessage('Error uploading avatar.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="max-w-[1200px] mx-auto p-4 md:p-10 space-y-16 pb-32">
            {/* Monumental Profile Header */}
            <div className="relative group overflow-hidden rounded-[4rem] p-12 bg-card-bg/20 border border-border-color backdrop-blur-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] flex flex-col md:flex-row items-center gap-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-purple-600/5 pointer-events-none" />
                
                <div className="relative z-10 shirk-0">
                    <div className="w-44 h-44 rounded-[3rem] bg-card-bg flex items-center justify-center overflow-hidden border-4 border-primary/20 shadow-2xl relative group/avatar">
                        {user?.avatar_path ? (
                            <img 
                                src={user.avatar_path.startsWith('http') ? user.avatar_path : `http://127.0.0.1:8000/storage/${user.avatar_path}`} 
                                alt="Avatar" 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover/avatar:scale-110" 
                            />
                        ) : (
                            <User size={80} className="text-primary/40" />
                        )}
                        
                        <label className="absolute inset-0 bg-black/60 opacity-0 group-hover/avatar:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-all duration-300">
                            <Camera size={28} className="text-white mb-2" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-white">Update Vision</span>
                            <input type="file" className="hidden" onChange={handleAvatarUpload} accept="image/*" />
                        </label>
                        
                        {uploading && (
                            <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-20">
                                <Loader2 className="text-primary animate-spin" size={40} />
                            </div>
                        )}
                    </div>
                </div>

                <div className="relative z-10 flex-1 text-center md:text-left space-y-6">
                    <div className="space-y-1">
                        <div className="flex items-center justify-center md:justify-start gap-4">
                            <h1 className="text-5xl font-black text-white tracking-tighter italic uppercase">{user?.name}</h1>
                            <div className="bg-primary/20 text-primary p-1.5 rounded-xl border border-primary/20 shadow-md">
                                <ShieldCheck size={20} />
                            </div>
                        </div>
                        <p className="text-text-secondary font-black tracking-widest text-sm uppercase opacity-60">{user?.email}</p>
                    </div>

                    <div className="flex flex-wrap justify-center md:justify-start gap-6">
                        <div className="bg-card-bg/40 backdrop-blur-xl px-6 py-4 rounded-[2rem] flex flex-col items-center md:items-start gap-1 border border-border-color shadow-xl min-w-[120px]">
                            <Heart size={20} className="text-primary mb-1" />
                            <span className="text-2xl font-black text-white leading-none tracking-tighter">{stats.liked_count}</span>
                            <span className="text-[10px] text-text-secondary font-black uppercase tracking-widest">Favorites</span>
                        </div>
                        <div className="bg-card-bg/40 backdrop-blur-xl px-6 py-4 rounded-[2rem] flex flex-col items-center md:items-start gap-1 border border-border-color shadow-xl min-w-[120px]">
                            <History size={20} className="text-primary mb-1" />
                            <span className="text-2xl font-black text-white leading-none tracking-tighter">{stats.history_count}</span>
                            <span className="text-[10px] text-text-secondary font-black uppercase tracking-widest">Journeys</span>
                        </div>
                        <div className="bg-card-bg/40 backdrop-blur-xl px-6 py-4 rounded-[2rem] flex flex-col items-center md:items-start gap-1 border border-border-color shadow-xl min-w-[120px]">
                            <Bookmark size={20} className="text-primary mb-1" />
                            <span className="text-2xl font-black text-white leading-none tracking-tighter">{stats.watch_later_count}</span>
                            <span className="text-[10px] text-text-secondary font-black uppercase tracking-widest">Enqueued</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-10">
                    <div className="bg-card-bg/20 backdrop-blur-3xl p-10 rounded-[3rem] border border-border-color shadow-2xl relative overflow-hidden">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="p-3 bg-primary/10 rounded-2xl text-primary border border-primary/20">
                                <Sparkles size={24} />
                            </div>
                            <h2 className="text-2xl font-black text-white tracking-tighter uppercase">Identity Configuration</h2>
                        </div>

                        <form onSubmit={handleUpdate} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3 px-2">
                                    <label className="text-xs font-black text-text-secondary uppercase tracking-[0.2em] ml-2">Public Name</label>
                                    <div className="relative group">
                                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors">
                                            <UserIcon size={20} />
                                        </div>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full bg-app-bg/50 border border-border-color rounded-2xl py-4 pl-14 pr-4 text-white focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all font-bold"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3 px-2">
                                    <label className="text-xs font-black text-text-secondary uppercase tracking-[0.2em] ml-2">Communication Link</label>
                                    <div className="relative group">
                                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors">
                                            <Mail size={20} />
                                        </div>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-app-bg/50 border border-border-color rounded-2xl py-4 pl-14 pr-4 text-white focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all font-bold"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 pt-4 px-2">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-primary hover:brightness-110 disabled:opacity-50 text-white font-black px-10 py-4 rounded-2xl transition-all flex items-center gap-3 shadow-2xl shadow-primary/30 active:scale-95 group"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} className="group-hover:scale-110 transition-transform" />}
                                    Preserve Changes
                                </button>
                                
                                {message && (
                                    <div className={`flex items-center gap-3 font-black text-sm animate-in fade-in slide-in-from-left-4 ${message.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>
                                        <CheckCircle size={20} />
                                        <span>{message}</span>
                                    </div>
                                )}
                            </div>
                        </form>
                    </div>
                </div>

                <div className="space-y-10">
                   <div className="bg-card-bg/20 backdrop-blur-3xl p-10 rounded-[3rem] border border-border-color shadow-2xl relative overflow-hidden h-full">
                        <h2 className="text-2xl font-black text-white tracking-tighter uppercase mb-8 pb-4 border-b border-white/5">Vault Intel</h2>
                        <div className="space-y-8">
                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Membership</span>
                                    <span className="text-white font-black text-lg">High-Fidelity Tier</span>
                                </div>
                                <span className="text-primary text-[10px] font-black px-3 py-1 bg-primary/20 rounded-lg border border-primary/20 shadow-inner">VIP</span>
                            </div>
                            
                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Era Joined</span>
                                    <span className="text-white font-black text-lg">{new Date(user?.created_at).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</span>
                                </div>
                            </div>

                            <div className="p-6 bg-primary/5 rounded-[2rem] border border-primary/10 mt-12 text-center group hover:bg-primary/10 transition-all duration-500">
                                <Sparkles className="mx-auto text-primary mb-4 animate-bounce" size={32} />
                                <p className="text-white text-xs font-black uppercase tracking-[0.2em] group-hover:tracking-[0.3em] transition-all">Premium User Verified</p>
                            </div>
                        </div>
                   </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
