import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { videoService } from '../services/api';
import { History as HistoryIcon, Trash2, X, AlertCircle, RefreshCcw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import VideoListCard from '../components/VideoListCard';

const History = () => {
    const [groups, setGroups] = useState({ today: [], yesterday: [], this_week: [], older: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();

    const fetchHistory = async () => {
        try {
            setLoading(true);
            const response = await videoService.getHistory();
            if (response.success) {
                setGroups(response.data);
            }
        } catch (err) {
            setError(err.response?.status === 401 ? 'Please login to see history' : 'Failed to load history');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isLoggedIn) fetchHistory();
        else setLoading(false);
    }, [isLoggedIn]);

    const handleDeleteItem = async (e, videoId) => {
        e.stopPropagation();
        try {
            const res = await videoService.deleteHistoryItem(videoId);
            if (res.success) fetchHistory();
        } catch (err) { console.error('Delete failed', err); }
    };

    const handleClearHistory = async () => {
        if (!window.confirm('Wipe all watch history? This cannot be undone.')) return;
        try {
            const res = await videoService.clearHistory();
            if (res.success) setGroups({ today: [], yesterday: [], this_week: [], older: [] });
        } catch (err) { console.error('Clear failed', err); }
    };

    if (loading) return (
        <div className="max-w-[1100px] mx-auto p-4 md:p-8 space-y-10 animate-pulse">
            <div className="h-10 bg-card-bg rounded-xl w-64" />
            {[1, 2].map(i => (
                <div key={i} className="space-y-6">
                    <div className="h-6 bg-card-bg rounded-lg w-40" />
                    <div className="h-32 bg-card-bg rounded-2xl w-full" />
                </div>
            ))}
        </div>
    );

    if (!isLoggedIn) return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] p-20 text-center gap-6">
            <div className="w-24 h-24 bg-card-bg/50 rounded-[2rem] flex items-center justify-center text-primary border border-border-color shadow-xl">
                <HistoryIcon size={48} />
            </div>
            <div className="space-y-2">
                <h2 className="text-3xl font-black text-white tracking-tight">Keep track of your journey</h2>
                <p className="text-text-secondary font-medium">Your watch history is only available when you're signed in.</p>
            </div>
            <button 
                onClick={() => navigate('/login')}
                className="mt-4 bg-primary px-10 py-3 rounded-full font-black text-white hover:bg-primary/80 transition-all shadow-lg shadow-primary/20"
            >
                Sign In Now
            </button>
        </div>
    );

    const hasAnyHistory = Object.values(groups).some(g => g.length > 0);

    return (
        <div className="max-w-[1100px] mx-auto p-4 md:p-8 pb-32">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20 text-primary">
                        <HistoryIcon size={28} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tighter">Your History</h1>
                        <p className="text-text-secondary text-sm font-medium">Manage and revisit your recently watched content</p>
                    </div>
                </div>
                {hasAnyHistory && (
                    <button 
                        onClick={handleClearHistory}
                        className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-5 py-2.5 rounded-2xl font-black text-sm transition-all border border-red-500/20 shadow-sm group"
                    >
                        <Trash2 size={18} className="group-hover:scale-110 transition-transform" />
                        Clear All
                    </button>
                )}
            </div>

            {!hasAnyHistory ? (
                <div className="flex flex-col items-center justify-center py-32 text-center bg-card-bg/20 rounded-[3rem] border border-dashed border-border-color">
                    <HistoryIcon size={64} className="text-neutral-800 mb-6" />
                    <h3 className="text-xl font-black text-white mb-2">No history to show</h3>
                    <p className="text-text-secondary font-medium">Start watching some videos to see them here!</p>
                    <button onClick={() => navigate('/')} className="mt-8 text-primary font-black hover:underline underline-offset-4">Browse Trending</button>
                </div>
            ) : (
                <div className="space-y-16">
                    <HistorySection title="Today" items={groups.today} onDelete={handleDeleteItem} />
                    <HistorySection title="Yesterday" items={groups.yesterday} onDelete={handleDeleteItem} />
                    <HistorySection title="Recent" items={groups.this_week} onDelete={handleDeleteItem} />
                    <HistorySection title="Full History" items={groups.older} onDelete={handleDeleteItem} />
                </div>
            )}
        </div>
    );
};

const HistorySection = ({ title, items, onDelete }) => {
    if (!items || items.length === 0) return null;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-6">
                <h2 className="text-white font-black text-lg uppercase tracking-widest bg-card-bg px-4 py-1.5 rounded-xl border border-border-color shadow-sm">
                    {title}
                </h2>
                <div className="h-px bg-border-color flex-1" />
            </div>
            <div className="flex flex-col gap-6">
                {items.map((item) => (
                    <div key={item.id} className="animate-in fade-in slide-in-from-left-4 duration-500">
                        <VideoListCard 
                            video={{
                                videoId: item.video_id,
                                title: item.title,
                                thumbnail: item.thumbnail,
                                channelTitle: item.channel_title,
                                description: '', // History doesnt store full description usually
                                views: 'Watched',
                                publishedAt: '' 
                            }} 
                            actions={
                                <button 
                                    onClick={(e) => onDelete(e, item.video_id)}
                                    className="p-2.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all shadow-sm"
                                    title="Remove from history"
                                >
                                    <X size={18} />
                                </button>
                            }
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default History;
