import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { videoService } from '../services/api';
import { Library as LibraryIcon, History, Heart, Clock, ChevronRight, User, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Library = () => {
    const [data, setData] = useState({ history: [], liked: [], watchLater: [] });
    const [loading, setLoading] = useState(true);
    const { isLoggedIn, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoggedIn) {
            setLoading(false);
            return;
        }

        const fetchLibraryData = async () => {
            try {
                const [historyRes, likedRes, savedRes] = await Promise.all([
                    videoService.getHistory(),
                    videoService.getLikedVideos(),
                    videoService.getWatchLater()
                ]);

                // Flatten history groups for the summary
                const historyFlat = historyRes.data ? [
                    ...historyRes.data.today,
                    ...historyRes.data.yesterday,
                    ...historyRes.data.this_week
                ].slice(0, 12) : [];

                setData({
                    history: historyFlat,
                    liked: likedRes.data || [],
                    watchLater: savedRes.data || []
                });
            } catch (err) {
                console.error('Error fetching library data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchLibraryData();
    }, [isLoggedIn]);

    if (loading) return (
        <div className="max-w-[1400px] mx-auto p-4 md:p-8 space-y-16 animate-pulse">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-card-bg rounded-2xl" />
                <div className="space-y-2">
                    <div className="h-6 bg-card-bg rounded-lg w-48" />
                    <div className="h-4 bg-card-bg rounded-lg w-32" />
                </div>
            </div>
            {[1, 2, 3].map(i => (
                <div key={i} className="space-y-6">
                    <div className="h-8 bg-card-bg rounded-xl w-64" />
                    <div className="flex gap-4 overflow-hidden">
                        {[1, 2, 3, 4, 5].map(j => (
                            <div key={j} className="h-44 bg-card-bg rounded-2xl w-72 shrink-0" />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );

    if (!isLoggedIn) return (
        <div className="flex flex-col items-center justify-center min-h-[75vh] p-20 text-center gap-8">
            <div className="w-32 h-32 bg-card-bg/50 rounded-[3rem] flex items-center justify-center text-primary border border-border-color shadow-2xl relative">
                <LibraryIcon size={64} />
                <Sparkles className="absolute -top-4 -right-4 text-primary animate-pulse" size={48} />
            </div>
            <div className="space-y-3">
                <h2 className="text-4xl font-black text-white tracking-tight">Your Digital Library</h2>
                <p className="text-text-secondary text-lg font-medium max-w-md mx-auto">Store your favorites, keep track of your history, and save videos for later enjoyment.</p>
            </div>
            <button 
                onClick={() => navigate('/login')}
                className="mt-4 bg-primary px-12 py-4 rounded-full font-black text-white hover:bg-primary/80 transition-all shadow-xl shadow-primary/30 active:scale-95"
            >
                Start Your Journey
            </button>
        </div>
    );

    return (
        <div className="max-w-[1500px] mx-auto p-4 md:p-8 pb-32 space-y-24">
            {/* Library Header */}
            <div className="flex items-center gap-6 p-8 bg-card-bg/20 rounded-[3rem] border border-border-color backdrop-blur-xl">
               <div className="w-20 h-20 rounded-[2rem] bg-primary flex items-center justify-center text-white shadow-2xl shadow-primary/20">
                    <User size={40} />
               </div>
               <div>
                   <h1 className="text-4xl font-black text-white tracking-tighter">Welcome, {user?.name || 'Explorer'}</h1>
                   <p className="text-text-secondary font-bold text-lg">Manage your high-fidelity content vault</p>
               </div>
            </div>

            <div className="space-y-24">
                <LibrarySection 
                    title="Watch History" 
                    icon={History} 
                    items={data.history} 
                    link="/history" 
                    navigate={navigate} 
                />
                
                <LibrarySection 
                    title="Watch Later" 
                    icon={Clock} 
                    items={data.watchLater} 
                    link="/watch-later" 
                    navigate={navigate} 
                    emptyText="Your future favorites wait here. Start saving!"
                />
                
                <LibrarySection 
                    title="Liked Content" 
                    icon={Heart} 
                    items={data.liked} 
                    link="/liked" 
                    navigate={navigate} 
                    emptyText="No favorites yet? The explore page is waiting."
                />
            </div>
        </div>
    );
};

const LibrarySection = ({ title, icon: Icon, items, link, navigate, emptyText }) => {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-5">
                    <div className="p-3 bg-card-bg border border-border-color rounded-2xl text-white shadow-sm">
                        <Icon size={24} />
                    </div>
                    <h2 className="text-2xl font-black text-white tracking-tighter uppercase">{title}</h2>
                    <span className="bg-primary/20 text-primary text-xs font-black px-3 py-1 rounded-full border border-primary/20">
                        {items.length} Items
                    </span>
                </div>
                <Link 
                    to={link} 
                    className="flex items-center gap-2 text-primary font-black hover:bg-primary/10 px-5 py-2.5 rounded-2xl transition-all group"
                >
                    View All
                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>

            {items.length === 0 ? (
                <div className="bg-card-bg/10 border border-dashed border-border-color rounded-[3rem] p-16 text-center group hover:border-primary/30 transition-colors">
                    <Icon size={48} className="mx-auto text-neutral-800 mb-4 group-hover:text-primary/20 transition-colors" />
                    <p className="text-text-secondary font-bold text-lg">{emptyText || `No ${title.toLowerCase()} found.`}</p>
                    <button onClick={() => navigate('/')} className="mt-6 text-primary font-black hover:underline">Start Exploring</button>
                </div>
            ) : (
                <div className="flex gap-6 overflow-x-auto pb-8 no-scrollbar scroll-smooth px-2">
                    {items.slice(0, 15).map((item) => (
                        <div 
                            key={item.id} 
                            onClick={() => navigate(`/watch/${item.video_id}`)}
                            className="w-64 sm:w-72 shrink-0 group cursor-pointer space-y-4"
                        >
                            <div className="relative aspect-video rounded-[2rem] overflow-hidden bg-card-bg border border-border-color shadow-xl transition-all duration-500 group-hover:scale-[1.03] group-hover:shadow-primary/10 group-hover:border-primary/30">
                                <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                    <span className="text-white text-xs font-black uppercase tracking-widest bg-primary px-3 py-1.5 rounded-lg shadow-lg">Watch Now</span>
                                </div>
                            </div>
                            <div className="px-2 space-y-1">
                                <h3 className="text-white font-black text-base line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                                    {item.title}
                                </h3>
                                <p className="text-text-secondary text-sm font-bold flex items-center gap-2">
                                    <span className="w-1 h-1 bg-text-secondary rounded-full" />
                                    {item.channel_title}
                                </p>
                            </div>
                        </div>
                    ))}
                    
                    {/* View All Card at the end */}
                    <div 
                        onClick={() => navigate(link)}
                        className="w-64 sm:w-72 shrink-0 aspect-video rounded-[2rem] bg-card-bg/40 border border-dashed border-border-color flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-card-bg transition-all hover:border-primary/50 group"
                    >
                        <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                            <ChevronRight size={32} />
                        </div>
                        <span className="text-white font-black uppercase tracking-widest text-sm">See everything</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Library;
