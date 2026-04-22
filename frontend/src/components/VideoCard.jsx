import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MoreVertical, CheckCircle2 } from 'lucide-react';

const VideoCard = ({ video }) => {
    const navigate = useNavigate();

    // Normalize data
    const title = video.title || 'Untitled Video';
    const channelName = video.channelTitle || 'Unknown Channel';
    const views = video.viewCount || '0';
    const time = video.publishedAt || 'Recently';

    return (
        <div 
            onClick={() => navigate(`/watch/${video.videoId}`)}
            className="flex flex-col gap-3 group cursor-pointer animate-in fade-in duration-700"
        >
            {/* Thumbnail Wrapper */}
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-card-bg shadow-lg video-card-hover">
                <img 
                    src={video.thumbnail} 
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Duration Badge */}
                {video.duration && (
                    <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-md text-white text-[11px] font-black px-1.5 py-0.5 rounded-md shadow-lg">
                        {video.duration}
                    </div>
                )}

                {/* Progress Bar (Simulated) */}
                <div className="absolute bottom-0 left-0 w-full h-[3px] bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-1/3 h-full bg-primary shadow-[0_0_10px_#7C3AED]" />
                </div>
            </div>

            {/* Content Section */}
            <div className="flex gap-3 px-1">
                {/* Channel Avatar */}
                <div 
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/channel/${video.channelId}`);
                    }}
                    className="shrink-0 pt-0.5"
                >
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-white/5 bg-card-bg hover:ring-2 hover:ring-primary transition-all shadow-xl group/avatar">
                        {video.channelThumbnail ? (
                            <img src={video.channelThumbnail} className="w-full h-full object-cover" alt={channelName} />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-black text-sm uppercase">
                                {channelName.charAt(0)}
                            </div>
                        )}
                    </div>
                </div>

                {/* Meta Info */}
                <div className="flex flex-col flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                        <h3 className="text-white font-bold text-[15px] leading-tight line-clamp-2 transition-colors group-hover:text-primary">
                            {title}
                        </h3>
                        <button className="text-neutral-500 hover:text-white p-1 -mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreVertical size={18} />
                        </button>
                    </div>

                    <div className="mt-1.5 space-y-0.5">
                        <div 
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/channel/${video.channelId}`);
                            }}
                            className="text-neutral-400 text-[13px] font-black flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
                        >
                            {channelName}
                            <CheckCircle2 size={13} className="text-secondary fill-secondary/10 shrink-0" />
                        </div>
                        <div className="flex items-center text-neutral-500 text-[12px] font-bold">
                            <span>{views} views</span>
                            <span className="mx-1.5 w-1 h-1 bg-neutral-600 rounded-full" />
                            <span>{time}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoCard;
