import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { videoService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ThumbsUp, Share2, MoreHorizontal, Check, ListPlus, X, Send, Globe, MessageCircle, ChevronDown, CheckCircle2 } from 'lucide-react';

const Watch = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();
    
    const [video, setVideo] = useState(null);
    const [related, setRelated] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    
    const [shareModal, setShareModal] = useState(false);
    const [toast, setToast] = useState(null);
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

    const showToast = (message) => {
        setToast(message);
        setTimeout(() => setToast(null), 3000);
    };

    useEffect(() => {
        const fetchVideoData = async () => {
            try {
                setLoading(true);
                window.scrollTo(0, 0);
                const response = await videoService.getVideoById(id);
                
                if (response.success) {
                    setVideo(response.data);
                    setIsSubscribed(response.isSubscribed);
                    setIsLiked(response.isLiked);
                    setIsSaved(response.isSaved);
                    
                    const relatedRes = await videoService.getRelatedVideos(id);
                    setRelated(relatedRes.data || []);
                    
                    if (isLoggedIn) {
                        videoService.recordHistory({
                            video_id: id,
                            title: response.data.title,
                            thumbnail: response.data.thumbnail,
                            channel_title: response.data.channelTitle
                        }).catch(err => console.error('History error', err));
                    }
                }
            } catch (err) {
                setError(err.response?.status === 429 ? 'WowTube is currently over capacity.' : 'Failed to load video.');
            } finally {
                setLoading(false);
            }
        };

        fetchVideoData();
    }, [id, isLoggedIn]);

    const handleLike = async () => {
        if (!isLoggedIn) return navigate('/login');
        setIsLiked(!isLiked);
        try {
            const res = await videoService.toggleLike({ video_id: id, title: video.title, thumbnail: video.thumbnail, channel_title: video.channelTitle });
            if (res.success) setIsLiked(res.liked);
        } catch (err) { setIsLiked(!isLiked); }
    };

    const handleSave = async () => {
        if (!isLoggedIn) return navigate('/login');
        try {
            const res = await videoService.toggleWatchLater({ video_id: id, title: video.title, thumbnail: video.thumbnail, channel_title: video.channelTitle });
            if (res.success) {
                setIsSaved(res.saved);
                showToast(res.saved ? 'Saved to Watch Later' : 'Removed from Watch Later');
            }
        } catch (err) { showToast('Failed to save'); }
    };

    const handleSubscribe = async () => {
        if (!isLoggedIn) return navigate('/login');
        if (isSubscribed && !window.confirm(`Unsubscribe from ${video.channelTitle}?`)) return;
        try {
            const res = await videoService.toggleSubscription({ channel_id: video.channelId, channel_title: video.channelTitle, channel_thumbnail: video.channelThumbnail || '' });
            if (res.success) setIsSubscribed(res.subscribed);
        } catch (err) { showToast('Action failed'); }
    };

    if (loading) return (
        <div className="flex flex-col lg:flex-row gap-6 p-4 lg:p-8 animate-pulse min-h-screen bg-app-bg">
            <div className="flex-1 space-y-6">
                <div className="aspect-video bg-card-bg rounded-3xl" />
                <div className="h-10 bg-card-bg rounded-xl w-3/4" />
                <div className="h-20 bg-card-bg rounded-2xl w-full" />
            </div>
            <div className="lg:w-96 space-y-4">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-card-bg rounded-2xl" />)}
            </div>
        </div>
    );

    if (error) return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-10 text-center gap-6">
            <div className="bg-red-500/10 p-6 rounded-full text-red-500">
                <MessageCircle size={64} />
            </div>
            <h2 className="text-2xl font-black text-white">{error}</h2>
            <button onClick={() => window.location.reload()} className="bg-primary px-8 py-3 rounded-full font-bold text-white shadow-lg shadow-primary/20">Retry</button>
        </div>
    );

    return (
        <div className="p-4 lg:p-8 max-w-[1800px] mx-auto pb-24">
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Main Content */}
                <div className="flex-1 min-w-0">
                    {/* Player Card */}
                    <div className="aspect-video w-full rounded-3xl overflow-hidden bg-card-bg shadow-2xl ring-1 ring-white/5 relative group">
                        <iframe
                            src={`https://www.youtube.com/embed/${id}?autoplay=1&modestbranding=1&rel=0`}
                            title={video.title}
                            className="w-full h-full border-none"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>

                    {/* Metadata Header */}
                    <div className="mt-6 space-y-6">
                        <h1 className="text-2xl md:text-3xl font-black text-white leading-tight">{video.title}</h1>
                        
                        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 pb-6 border-b border-border-color">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-primary to-purple-400 p-0.5 shadow-lg">
                                    <div className="w-full h-full rounded-full bg-card-bg flex items-center justify-center text-white font-black text-xl overflow-hidden border-2 border-app-bg">
                                        {video.channelThumbnail ? <img src={video.channelThumbnail} className="w-full h-full object-cover" /> : video.channelTitle.charAt(0)}
                                    </div>
                                </div>
                                <div className="min-w-0">
                                    <div className="flex items-center gap-1.5" onClick={() => navigate(`/channel/${video.channelId}`)}>
                                        <h3 className="text-white font-black text-lg truncate hover:text-primary transition-colors cursor-pointer">{video.channelTitle}</h3>
                                        <CheckCircle2 size={16} className="text-primary fill-primary/10" />
                                    </div>
                                    <p className="text-text-secondary text-sm font-medium">{video.subscriberCount} subscribers</p>
                                </div>
                                <button 
                                    onClick={handleSubscribe}
                                    className={`ml-4 px-8 py-3 rounded-full font-black text-sm transition-all shadow-lg active:scale-95 ${
                                        isSubscribed 
                                            ? 'bg-card-bg text-white border border-border-color hover:bg-neutral-800' 
                                            : 'bg-primary text-white hover:bg-primary/90 shadow-primary/20'
                                    }`}
                                >
                                    {isSubscribed ? <span className="flex items-center gap-1.5">Subscribed</span> : 'Subscribe'}
                                </button>
                            </div>

                            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2 xl:pb-0">
                                <div className="flex items-center bg-card-bg border border-border-color rounded-2xl p-1 shadow-sm">
                                    <button onClick={handleLike} className="flex items-center gap-2.5 hover:bg-white/5 py-2 px-6 rounded-xl transition-all group">
                                        <ThumbsUp size={20} className={isLiked ? 'fill-primary text-primary drop-shadow-[0_0_8px_rgba(124,58,237,0.5)]' : 'text-neutral-300 group-hover:text-white'} />
                                        <span className={`text-sm font-black transition-colors ${isLiked ? 'text-primary' : 'text-white'}`}>{video.viewCount}</span>
                                    </button>
                                    <div className="w-px h-6 bg-border-color mx-1" />
                                    <button className="py-2 px-4 hover:bg-white/5 rounded-xl text-neutral-400 transition-all hover:text-white group">
                                        <ThumbsUp size={20} className="rotate-180 group-hover:scale-110 transition-transform" />
                                    </button>
                                </div>

                                <button onClick={() => setShareModal(true)} className="flex items-center gap-2.5 bg-card-bg border border-border-color hover:bg-white/5 text-white px-6 py-2.5 rounded-2xl font-black text-sm transition-all shadow-sm">
                                    <Share2 size={18} className="text-text-secondary" />
                                    <span>Share</span>
                                </button>

                                <button onClick={handleSave} className="flex items-center gap-2.5 bg-card-bg border border-border-color hover:bg-white/5 text-white px-6 py-2.5 rounded-2xl font-black text-sm transition-all shadow-sm">
                                    <ListPlus size={18} className={isSaved ? 'text-primary' : 'text-text-secondary'} />
                                    <span>{isSaved ? 'Saved' : 'Save'}</span>
                                </button>

                                <button className="p-3 bg-card-bg border border-border-color hover:bg-white/5 text-neutral-400 hover:text-white rounded-2xl transition-all shadow-sm">
                                    <MoreHorizontal size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Description Section */}
                        <div 
                            className="bg-card-bg/40 backdrop-blur-sm border border-border-color rounded-3xl p-6 hover:bg-card-bg/60 transition-all cursor-pointer group relative"
                            onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                        >
                            <div className="flex gap-4 text-white font-black text-[14px] mb-3">
                                <span className="flex items-center gap-1.5"><Globe size={14} className="text-primary" /> {video.viewCount} views</span>
                                <span className="flex items-center gap-1.5">{new Date(video.publishedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                            </div>
                            <div className={`text-neutral-300 text-[14px] font-medium leading-relaxed whitespace-pre-wrap ${!isDescriptionExpanded ? 'line-clamp-2' : ''}`}>
                                {video.description}
                            </div>
                            <button className="text-primary font-black text-[13px] mt-4 flex items-center gap-1 group-hover:underline">
                                {isDescriptionExpanded ? 'Show less' : <span className="flex items-center gap-1">Read more <ChevronDown size={14} /></span>}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sidebar suggestions */}
                <div className="lg:w-[380px] xl:w-[420px] shrink-0 space-y-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-white font-black text-lg">Next for you</h2>
                        <span className="text-primary font-black text-xs uppercase tracking-widest bg-primary/10 px-2 py-1 rounded">Autoplay</span>
                    </div>
                    <div className="flex flex-col gap-5">
                        {related.map((v) => (
                            <div 
                                key={v.videoId} 
                                className="flex gap-4 group cursor-pointer" 
                                onClick={() => navigate(`/watch/${v.videoId}`)}
                            >
                                <div className="relative w-44 flex-shrink-0 aspect-video rounded-2xl overflow-hidden bg-card-bg ring-1 ring-white/5 shadow-lg">
                                    <img src={v.thumbnail} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                    <span className="absolute bottom-2 right-2 bg-black/90 backdrop-blur-md text-white text-[10px] px-1.5 py-0.5 rounded-lg font-black">{v.duration}</span>
                                </div>
                                <div className="flex flex-col gap-1 min-w-0 py-0.5">
                                    <h4 className="text-white text-sm font-bold line-clamp-2 leading-tight group-hover:text-primary transition-colors">{v.title}</h4>
                                    <div>
                                        <p className="text-text-secondary text-[12px] font-bold hover:text-white transition-colors mt-1 flex items-center gap-1">
                                            {v.channelTitle}
                                            <CheckCircle2 size={10} className="text-primary" />
                                        </p>
                                        <p className="text-neutral-500 text-[11px] font-bold mt-0.5">{v.viewCount} views</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {related.length === 0 && (
                        <div className="p-8 text-center bg-card-bg/20 rounded-3xl border border-border-color border-dashed">
                            <p className="text-text-secondary text-sm font-medium">No suggested videos found.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Share Modal */}
            {shareModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-app-bg/90 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-card-bg w-full max-w-sm rounded-[32px] p-8 border border-border-color shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-white font-black text-2xl tracking-tighter">Share Video</h2>
                            <button onClick={() => setShareModal(false)} className="bg-white/5 p-2 rounded-full text-neutral-400 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="flex justify-between mb-10">
                            {[
                                { name: 'X', icon: Send, color: 'bg-[#1DA1F2]', url: `https://twitter.com/intent/tweet?url=${window.location.href}` },
                                { name: 'FB', icon: Globe, color: 'bg-[#4267B2]', url: `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}` },
                                { name: 'WA', icon: MessageCircle, color: 'bg-[#25D366]', url: `https://wa.me/?text=${window.location.href}` }
                            ].map(social => (
                                <button key={social.name} onClick={() => window.open(social.url)} className="flex flex-col items-center gap-3 group">
                                    <div className={`${social.color} w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-black/40 group-hover:scale-110 transition-transform`}>
                                        <social.icon size={28} />
                                    </div>
                                    <span className="text-text-secondary text-xs font-black uppercase tracking-widest">{social.name}</span>
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-2 bg-app-bg p-3 rounded-2xl border border-border-color shadow-inner">
                            <input readOnly value={window.location.href} className="bg-transparent flex-1 text-text-secondary text-xs truncate focus:outline-none font-bold" />
                            <button 
                                onClick={() => {
                                    navigator.clipboard.writeText(window.location.href);
                                    showToast('Copied to Clipboard!');
                                }}
                                className="bg-primary text-white px-5 py-2 rounded-xl text-xs font-black hover:bg-primary/80 transition-all active:scale-95 shadow-lg shadow-primary/20"
                            >
                                Copy
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom Toast */}
            {toast && (
                <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[300] bg-primary text-white px-8 py-4 rounded-2xl shadow-2xl font-black text-sm animate-in slide-in-from-bottom-10 duration-300 flex items-center gap-3">
                    <div className="bg-white/20 p-1 rounded-full"><Check size={16} /></div>
                    {toast}
                </div>
            )}
        </div>
    );
};

export default Watch;
