import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { videoService } from '../services/api';
import SkeletonLoader from '../components/SkeletonLoader';
import { Search as SearchIcon, Filter, SlidersHorizontal, RefreshCcw } from 'lucide-react';
import VideoListCard from '../components/VideoListCard';

const Search = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');
    const navigate = useNavigate();
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchResults = async () => {
        if (!query) return;
        try {
            setLoading(true);
            setError(null);
            const response = await videoService.searchVideos(query);
            if (response.success) {
                setResults(response.data);
            } else {
                setError('Search failed. Please try again.');
            }
        } catch (err) {
            setError('Could not connect to the server.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResults();
    }, [query]);

    if (loading) return (
        <div className="max-w-[1200px] mx-auto p-4 md:p-8 space-y-6">
            <div className="h-8 bg-card-bg rounded-lg w-64 animate-pulse" />
            <SkeletonLoader count={6} />
        </div>
    );

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] p-10 text-center gap-6">
                <div className="bg-red-500/10 p-6 rounded-full text-red-500">
                    <RefreshCcw size={48} />
                </div>
                <h2 className="text-2xl font-black text-white">{error}</h2>
                <button onClick={fetchResults} className="bg-primary px-8 py-3 rounded-full font-bold text-white shadow-lg shadow-primary/20">Try Again</button>
            </div>
        );
    }

    if (results.length === 0 && !loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] p-20 text-center gap-6">
                <div className="w-24 h-24 bg-card-bg/50 rounded-[2rem] flex items-center justify-center text-text-secondary border border-border-color shadow-xl">
                    <SearchIcon size={48} className="opacity-40" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-3xl font-black text-white tracking-tight">No results for "{query}"</h2>
                    <p className="text-text-secondary font-medium">Try checking your spelling or use more general terms.</p>
                </div>
                <button 
                  onClick={() => navigate('/')}
                  className="mt-4 bg-primary px-10 py-3 rounded-full font-black text-white hover:bg-primary/80 transition-all shadow-lg shadow-primary/20 active:scale-95"
                >
                  Return to Discovery
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-[1100px] mx-auto p-4 md:p-8 pb-32">
            <div className="flex items-center justify-between mb-8 border-b border-border-color pb-6">
                <div className="space-y-1">
                    <h2 className="text-white text-2xl font-black tracking-tight flex items-center gap-3">
                        <span className="text-text-secondary">Search results for</span> 
                        <span className="text-primary italic">"{query}"</span>
                    </h2>
                    <p className="text-text-secondary text-sm font-medium">About {results.length} high-fidelity results found</p>
                </div>
                <button className="flex items-center gap-2 bg-card-bg border border-border-color text-white px-5 py-2.5 rounded-2xl font-black text-sm hover:bg-white/5 transition-all shadow-sm">
                    <SlidersHorizontal size={18} />
                    <span>Filters</span>
                </button>
            </div>

            <div className="flex flex-col gap-8 md:gap-4">
                {results.map((video) => (
                    <div key={video.videoId} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <VideoListCard video={video} />
                    </div>
                ))}
            </div>
            
            <div className="mt-20 text-center">
                <div className="inline-flex items-center gap-3 p-4 bg-card-bg/20 rounded-3xl border border-border-color border-dashed">
                    <p className="text-text-secondary text-sm font-medium">End of results. Missing something?</p>
                    <button className="text-primary font-black text-sm hover:underline">Send Feedback</button>
                </div>
            </div>
        </div>
    );
};

export default Search;
