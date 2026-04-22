import React, { useState, useEffect } from 'react';
import { videoService } from '../services/api';
import VideoCard from '../components/VideoCard';
import SkeletonLoader from '../components/SkeletonLoader';
import { AlertCircle, RefreshCw } from 'lucide-react';

const Home = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchVideos = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await videoService.getTrending(24);
            if (response.success) {
                setVideos(response.data);
            } else {
                setError('Failed to load videos. Please try again.');
            }
        } catch (err) {
            console.error('Error fetching videos:', err);
            setError('Could not connect to the server. Make sure the backend is running.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVideos();
    }, []);

    if (loading) return (
        <div className="p-4 sm:p-6 md:p-8">
            <SkeletonLoader count={12} />
        </div>
    );

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] p-10 text-center space-y-6">
                <div className="bg-red-500/10 p-6 rounded-full">
                    <AlertCircle size={64} className="text-red-500" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-black text-white">{error}</h2>
                    <p className="text-text-secondary max-w-md mx-auto">
                        This could be due to a network issue or the local backend server being offline.
                    </p>
                </div>
                <button 
                    onClick={fetchVideos}
                    className="bg-primary hover:bg-primary/80 text-white px-8 py-3 rounded-full font-black transition-all shadow-lg shadow-primary/20 flex items-center gap-2 group active:scale-95"
                >
                    <RefreshCw size={20} className="group-hover:rotate-180 transition-transform duration-500" />
                    Retry Now
                </button>
            </div>
        );
    }

    return (
        <main className="p-4 sm:p-6 md:p-8 pb-24">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-x-5 gap-y-10">
                {videos.map((video) => (
                    <VideoCard key={video.videoId} video={video} />
                ))}
            </div>
            
            {videos.length === 0 && !loading && (
                <div className="text-center py-20">
                    <p className="text-text-secondary font-medium">No videos found.</p>
                </div>
            )}
        </main>
    );
};

export default Home;
