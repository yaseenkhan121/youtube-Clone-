import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MoreVertical, Clock, ListPlus, Volume2, CheckCircle2 } from 'lucide-react';
import { videoService } from '../services/api';

const VideoListCard = ({ video, actions }) => {
  const navigate = useNavigate();

  // Normalize data
  const title = video.title || 'Untitled Video';
  const channelName = video.channelTitle || video.channel_title || 'Unknown Channel';
  const views = video.viewCount || video.views || '0';
  const time = video.publishedAt || video.created_at || 'Recently';
  const description = video.description || '';

  return (
    <div 
      onClick={() => navigate(`/watch/${video.videoId}`)}
      className="flex flex-col sm:flex-row gap-5 group cursor-pointer w-full p-2 rounded-2xl hover:bg-card-bg/30 transition-all duration-300"
    >
      {/* Thumbnail Section */}
      <div className="relative w-full sm:w-[320px] md:w-[360px] shrink-0 aspect-video rounded-2xl overflow-hidden bg-card-bg shadow-lg shadow-black/20">
        <img 
          src={video.thumbnail} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Glass Overlays on Hover */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Top left overlay */}
        <div className="absolute top-2.5 left-2.5 p-1.5 bg-black/60 backdrop-blur-md rounded-xl opacity-0 group-hover:opacity-100 transition-all transform translate-y-[-10px] group-hover:translate-y-0 duration-300">
          <Volume2 size={16} className="text-white" />
        </div>

        {/* Top right overlays */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-[10px] group-hover:translate-x-0 duration-300">
          <div 
            onClick={(e) => {
              e.stopPropagation();
              // Add watch later logic if needed
            }}
            className="p-2 bg-black/80 backdrop-blur-md rounded-xl hover:bg-primary transition-colors cursor-pointer shadow-lg"
            title="Watch Later"
          >
            <Clock size={18} className="text-white" />
          </div>
          <div className="p-2 bg-black/80 backdrop-blur-md rounded-xl hover:bg-black transition-colors shadow-lg">
            <ListPlus size={18} className="text-white" />
          </div>
        </div>

        {/* Duration badge */}
        {video.duration && (
          <span className="absolute bottom-2.5 right-2.5 bg-black/80 backdrop-blur-md text-white text-[11px] px-2 py-0.5 rounded-lg font-black shadow-lg">
            {video.duration}
          </span>
        )}
      </div>

      {/* Info Section */}
      <div className="flex flex-col flex-1 min-w-0 py-1">
        <div className="flex justify-between items-start gap-4">
          <h3 className="text-white text-[17px] md:text-[19px] font-bold line-clamp-2 leading-tight transition-colors group-hover:text-primary">
            {title}
          </h3>
          <div className="flex items-center gap-1 shrink-0">
             {actions}
             <button className="text-neutral-500 hover:text-white transition-opacity p-1 opacity-0 group-hover:opacity-100">
               <MoreVertical size={20} />
             </button>
          </div>
        </div>

        <div className="flex items-center gap-2 text-neutral-400 text-[13px] font-medium mt-2">
          <span>{views} views</span>
          <span className="w-1 h-1 bg-neutral-600 rounded-full" />
          <span>{time}</span>
        </div>

        <div 
            className="flex items-center gap-3 py-4 group/channel cursor-pointer"
            onClick={(e) => {
                e.stopPropagation();
                navigate(`/channel/${video.channelId}`);
            }}
        >
          <div className="w-8 h-8 rounded-full overflow-hidden bg-card-bg border border-white/10 flex items-center justify-center text-primary font-black text-xs uppercase shadow-lg group-hover/channel:ring-2 group-hover/channel:ring-primary transition-all">
             {video.channelThumbnail ? (
                 <img src={video.channelThumbnail} className="w-full h-full object-cover" />
             ) : (
                channelName.charAt(0)
             )}
          </div>
          <span className="text-neutral-300 text-[14px] font-bold group-hover/channel:text-white transition-colors flex items-center gap-1.5">
            {channelName}
            <CheckCircle2 size={14} className="text-secondary fill-secondary/10" />
          </span>
        </div>

        <p className="text-neutral-400 text-[13px] line-clamp-2 leading-relaxed hidden sm:block max-w-[650px] font-medium">
          {description}
        </p>

        {/* Status Badges */}
        <div className="mt-4 flex items-center gap-2 hidden sm:flex">
          <span className="bg-primary/10 text-primary text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider border border-primary/20">
            4K Ultra HD
          </span>
          <span className="bg-neutral-800/80 text-neutral-400 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
            Premium
          </span>
        </div>
      </div>
    </div>
  );
};

export default VideoListCard;
