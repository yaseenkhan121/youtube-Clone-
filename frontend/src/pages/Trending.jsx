import React, { useState, useEffect } from 'react';
import { videoService } from '../services/api';
import VideoCard from '../components/VideoCard';
import SkeletonLoader from '../components/SkeletonLoader';
import { Compass, Sparkles, RefreshCcw, AlertCircle } from 'lucide-react';

const Trending = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchTrending = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await videoService.getTrending(24);
            if (response.success) {
                setVideos(response.data);
            } else {
                setError('Trending data is currently unavailable.');
            }
        } catch (err) {
            console.error('Error fetching trending:', err);
            setError('Could not connect to the high-fidelity server.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrending();
    }, []);

    if (loading) return (
        <div className="p-4 md:p-8 max-w-[1500px] mx-auto space-y-12">
            <div className="h-20 bg-card-bg rounded-[2rem] w-full animate-pulse" />
            <SkeletonLoader count={12} />
        </div>
    );

    return (
        <div className="p-4 md:p-8 lg:p-10 max-w-[1600px] mx-auto space-y-12 pb-32">
            {/* Premium Trending Header */}
            <div className="relative group overflow-hidden rounded-[3rem] p-10 flex flex-col md:flex-row items-center gap-8 bg-card-bg/20 border border-border-color backdrop-blur-3xl shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-purple-600/5 pointer-events-none" />
                <div className="relative z-10 w-24 h-24 rounded-[2rem] bg-primary flex items-center justify-center text-white shadow-2xl shadow-primary/30 group-hover:scale-110 transition-transform duration-500">
                    <Compass size={48} className="animate-pulse" />
                    <Sparkles className="absolute -top-2 -right-2 text-yellow-400" size={24} />
                </div>
                <div className="relative z-10 text-center md:text-left space-y-2">
                    <h1 className="text-5xl font-black text-white tracking-tighter uppercase italic">Discovery</h1>
                    <p className="text-text-secondary font-black tracking-widest text-sm uppercase flex items-center gap-2 justify-center md:justify-start">
                        The hottest content on the network <span className="w-2 h-2 bg-primary rounded-full animate-ping" />
                    </p>
                </div>
                <div className="md:ml-auto relative z-10">
                    <button 
                        onClick={fetchTrending}
                        className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 text-white transition-all group"
                        title="Refresh trends"
                    >
                        <RefreshCcw size={24} className="group-active:rotate-180 transition-transform duration-500" />
                    </button>
                </div>
            </div>

            {error ? (
                <div className="flex flex-col items-center justify-center py-32 text-center gap-6 bg-card-bg/10 rounded-[3rem] border border-dashed border-red-500/20">
                    <div className="p-6 bg-red-500/10 rounded-full text-red-500">
                        <AlertCircle size={48} />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-black text-white">{error}</h2>
                        <p className="text-text-secondary font-medium">We're working on restoring the trending pulse.</p>
                    </div>
                    <button 
                        onClick={fetchTrending}
                        className="bg-primary text-white px-10 py-3.5 rounded-full font-black shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                    >
                        Force Restabilization
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
                    {videos.map((video, index) => (
                        <div key={video.videoId} className="animate-in fade-in slide-in-from-bottom-6 duration-700" style={{ animationDelay: `${index * 50}ms` }}>
                            <VideoCard video={video} />
                        </div>
                    ))}
                </div>
            )}

            <div className="mt-24 text-center">
                <p className="text-text-secondary font-black tracking-widest uppercase text-xs opacity-40">End of Discovery Feed</p>
            </div>
        </div>
    );
};

export default Trending;
