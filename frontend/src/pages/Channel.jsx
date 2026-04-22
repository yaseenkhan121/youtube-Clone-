import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { videoService } from '../services/api';
import VideoCard from '../components/VideoCard';
import SkeletonLoader from '../components/SkeletonLoader';
import { CheckCircle2, Users, Video, Eye, Calendar, Share2, MoreHorizontal } from 'lucide-react';

const Channel = () => {
    const { id } = useParams();
    const [channel, setChannel] = useState(null);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [videosLoading, setVideosLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('videos');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchChannelData = async () => {
            try {
                setLoading(true);
                const res = await videoService.getChannelDetails(id);
                if (res.success) {
                    setChannel(res.data);
                }
            } catch (err) {
                console.error('Failed to fetch channel:', err);
            } finally {
                setLoading(false);
            }
        };

        const fetchChannelVideos = async () => {
            try {
                setVideosLoading(true);
                const res = await videoService.getChannelVideos(id);
                if (res.success) {
                    setVideos(res.data);
                }
            } catch (err) {
                console.error('Failed to fetch channel videos:', err);
            } finally {
                setVideosLoading(false);
            }
        };

        fetchChannelData();
        fetchChannelVideos();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-app-bg">
                <div className="h-48 md:h-64 bg-card-bg animate-pulse" />
                <div className="max-w-[1300px] mx-auto px-4 -mt-12 flex flex-col md:flex-row gap-6 items-end">
                    <div className="w-32 h-32 rounded-full bg-card-bg border-4 border-app-bg animate-pulse" />
                    <div className="flex-1 space-y-4 pb-4">
                        <div className="h-8 bg-card-bg w-48 rounded animate-pulse" />
                        <div className="h-4 bg-card-bg w-32 rounded animate-pulse" />
                    </div>
                </div>
            </div>
        );
    }

    if (!channel) return <div className="p-20 text-center text-white">Channel not found.</div>;

    return (
        <div className="min-h-screen bg-app-bg pb-20">
            {/* Banner Section */}
            <div className="relative w-full h-48 md:h-64 lg:h-80 overflow-hidden bg-card-bg">
                {channel.banner ? (
                    <img src={channel.banner} alt="Banner" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full bg-gradient-to-r from-primary/20 via-purple-900/40 to-primary/20" />
                )}
            </div>

            {/* Header Section */}
            <div className="max-w-[1300px] mx-auto px-4 md:px-8">
                <div className="flex flex-col md:flex-row gap-6 md:items-end -mt-12 md:-mt-16 pb-8 border-b border-border-color">
                    <div className="relative shrink-0">
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-app-bg bg-card-bg shadow-2xl">
                            <img src={channel.thumbnail} alt={channel.title} className="w-full h-full object-cover" />
                        </div>
                    </div>
                    
                    <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight">{channel.title}</h1>
                                <CheckCircle2 size={24} className="text-secondary fill-secondary/20" />
                            </div>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-text-secondary font-medium">
                                <span className="flex items-center gap-1.5"><Users size={16} />{channel.subscriberCount} Subscribers</span>
                                <span className="w-1 h-1 bg-neutral-600 rounded-full hidden md:block" />
                                <span className="flex items-center gap-1.5"><Video size={16} />{channel.videoCount} Videos</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button className="flex-1 md:flex-none bg-white text-black px-8 py-2.5 rounded-full font-black text-sm hover:bg-neutral-200 transition-all active:scale-95 shadow-xl shadow-white/5">
                                Subscribe
                            </button>
                            <button className="p-2.5 bg-card-bg border border-border-color rounded-full text-white hover:bg-white/5 transition-all">
                                <Share2 size={20} />
                            </button>
                            <button className="p-2.5 bg-card-bg border border-border-color rounded-full text-white hover:bg-white/5 transition-all">
                                <MoreHorizontal size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-8 mt-4 border-b border-border-color sticky top-16 bg-app-bg z-20 overflow-x-auto no-scrollbar">
                    {['Home', 'Videos', 'About'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab.toLowerCase())}
                            className={`px-4 py-4 text-sm font-black transition-all relative ${
                                activeTab === tab.toLowerCase() ? 'text-primary' : 'text-text-secondary hover:text-white'
                            }`}
                        >
                            {tab}
                            {activeTab === tab.toLowerCase() && (
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full shadow-[0_0_10px_rgba(124,58,237,0.5)]" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="mt-8">
                    {activeTab === 'videos' ? (
                        videosLoading ? (
                            <SkeletonLoader count={8} />
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10">
                                {videos.map(video => (
                                    <VideoCard key={video.videoId} video={video} />
                                ))}
                            </div>
                        )
                    ) : activeTab === 'about' ? (
                        <div className="max-w-4xl grid md:grid-cols-3 gap-12 text-white animate-in fade-in duration-500">
                            <div className="md:col-span-2 space-y-6">
                                <h3 className="text-xl font-bold">Description</h3>
                                <p className="text-text-secondary leading-relaxed whitespace-pre-wrap font-medium">
                                    {channel.description || "No description available."}
                                </p>
                            </div>
                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold">Stats</h3>
                                    <div className="space-y-4 border-t border-border-color pt-4">
                                        <div className="flex items-center gap-3 text-sm font-medium text-text-secondary">
                                            <Calendar size={18} />
                                            <span>Joined {new Date(channel.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm font-medium text-text-secondary">
                                            <Eye size={18} />
                                            <span>{channel.viewCount} views</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                         <div className="text-center py-20 text-text-secondary font-medium italic">
                            Welcome to {channel.title}'s home feed. Check out our videos tab for full content.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Channel;
