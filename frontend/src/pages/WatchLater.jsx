import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { videoService } from '../services/api';
import { Clock, Trash2, X, RefreshCcw, Bookmark, BookmarkX } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import VideoListCard from '../components/VideoListCard';

const WatchLater = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();

    const fetchSaved = async () => {
        try {
            setLoading(true);
            const response = await videoService.getWatchLater();
            if (response.success) {
                setVideos(response.data);
            }
        } catch (err) {
            setError(err.response?.status === 401 ? 'Login to see saved videos' : 'Failed to load list');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isLoggedIn) fetchSaved();
        else setLoading(false);
    }, [isLoggedIn]);

    const handleRemove = async (e, video) => {
        e.stopPropagation();
        try {
            const res = await videoService.toggleWatchLater({
                video_id: video.video_id,
                title: video.title,
                thumbnail: video.thumbnail,
                channel_title: video.channel_title
            });
            if (res.success && !res.saved) {
                setVideos(videos.filter(v => v.video_id !== video.video_id));
            }
        } catch (err) {
            console.error('Remove failed', err);
        }
    };

    if (loading) return (
        <div className="max-w-[1100px] mx-auto p-4 md:p-8 space-y-10 animate-pulse">
            <div className="h-10 bg-card-bg rounded-xl w-64" />
            {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-card-bg rounded-2xl w-full" />
            ))}
        </div>
    );

    if (!isLoggedIn) return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] p-20 text-center gap-6">
            <div className="w-24 h-24 bg-card-bg/50 rounded-[2rem] flex items-center justify-center text-primary border border-border-color shadow-xl">
                <Bookmark size={48} />
            </div>
            <div className="space-y-2">
                <h2 className="text-3xl font-black text-white tracking-tight">Your Personal Queue</h2>
                <p className="text-text-secondary font-medium">Save videos for later and watch them when you're ready.</p>
            </div>
            <button 
                onClick={() => navigate('/login')}
                className="mt-4 bg-primary px-10 py-3 rounded-full font-black text-white hover:bg-primary/80 transition-all shadow-lg shadow-primary/20"
            >
                Sign In Now
            </button>
        </div>
    );

    return (
        <div className="max-w-[1100px] mx-auto p-4 md:p-8 pb-32">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
                <div className="flex items-center gap-4">
                    <div className="p-4 bg-primary/10 rounded-2xl border border-primary/20 text-primary shadow-lg shadow-primary/5">
                        <Bookmark size={28} className="fill-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tighter">Watch Later</h1>
                        <p className="text-text-secondary text-sm font-medium">{videos.length} videos waiting for you</p>
                    </div>
                </div>
                <button 
                    onClick={fetchSaved}
                    className="flex items-center gap-2 bg-card-bg border border-border-color text-text-secondary hover:text-white px-5 py-2.5 rounded-2xl font-black text-sm transition-all shadow-sm group"
                >
                    <RefreshCcw size={18} className="group-hover:rotate-180 transition-transform duration-500" />
                    Refresh
                </button>
            </div>

            {videos.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 text-center bg-card-bg/20 rounded-[3rem] border border-dashed border-border-color">
                    <BookmarkX size={64} className="text-neutral-800 mb-6" />
                    <h3 className="text-xl font-black text-white mb-2">Queue is empty</h3>
                    <p className="text-text-secondary font-medium">Add some videos to your queue to watch them later.</p>
                    <button onClick={() => navigate('/')} className="mt-8 text-primary font-black hover:underline underline-offset-4">Browse Content</button>
                </div>
            ) : (
                <div className="flex flex-col gap-6">
                    {videos.map((item) => (
                        <div key={item.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <VideoListCard 
                                video={{
                                    videoId: item.video_id,
                                    title: item.title,
                                    thumbnail: item.thumbnail,
                                    channelTitle: item.channel_title,
                                    description: '',
                                    views: '',
                                    publishedAt: ''
                                }} 
                                actions={
                                    <button 
                                        onClick={(e) => handleRemove(e, item)}
                                        className="p-2.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all shadow-sm"
                                        title="Remove from queue"
                                    >
                                        <X size={18} />
                                    </button>
                                }
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default WatchLater;
