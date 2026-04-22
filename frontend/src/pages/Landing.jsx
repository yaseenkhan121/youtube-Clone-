import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Video, Sparkles, Shield, Zap, ArrowRight, Play, Users, Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Landing = () => {
    const navigate = useNavigate();
    const { token } = useAuth();

    if (token) {
        navigate('/home');
    }

    return (
        <div className="min-h-screen bg-app-bg text-text-primary selection:bg-primary selection:text-white">
            {/* Hero Section */}
            <header className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
                {/* Immersive Background Effects */}
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full -z-10 animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 blur-[120px] rounded-full -z-10" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 -z-10" />
                
                <div className="max-w-6xl mx-auto text-center space-y-10 py-20">
                    <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-xl px-5 py-2.5 rounded-full border border-white/10 text-primary text-sm font-black tracking-widest uppercase animate-in fade-in slide-in-from-top-4 duration-1000">
                        <Sparkles size={16} className="animate-pulse" />
                        <span>Production-Grade Streaming</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black text-white leading-tight">
                        Experience Content with <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-purple-400">
                            Wow<span className="text-white">Tube</span>
                        </span>
                    </h1>

                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-text-secondary leading-relaxed">
                        A production-grade video platform built for architects, engineers, and creators who demand excellence in every pixel.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <Link to="/register" className="w-full sm:w-auto bg-secondary hover:bg-secondary/90 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(124,58,237,0.4)] hover:scale-105 active:scale-95">
                            Get Started for Free <ArrowRight size={20} />
                        </Link>
                        <Link to="/home" className="w-full sm:w-auto bg-card-bg border border-border-color hover:bg-border-color text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2">
                            Explore Content <Play size={20} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-4xl mx-auto opacity-50">
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-2xl font-bold text-white">1M+</span>
                            <span className="text-xs uppercase font-bold tracking-widest text-text-secondary">Videos</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-2xl font-bold text-white">500K+</span>
                            <span className="text-xs uppercase font-bold tracking-widest text-text-secondary">Creators</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-2xl font-bold text-white">24/7</span>
                            <span className="text-xs uppercase font-bold tracking-widest text-text-secondary">Uptime</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-2xl font-bold text-white">4K</span>
                            <span className="text-xs uppercase font-bold tracking-widest text-text-secondary">Quality</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Features Section */}
            <section className="py-24 px-4 bg-card-bg/30">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-3xl md:text-4xl font-bold text-white">Engineered for Performance</h2>
                        <p className="text-text-secondary">Standard features built to non-standard levels of perfection.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-card-bg border border-border-color p-8 rounded-3xl space-y-4 hover:border-secondary/50 transition-colors">
                            <div className="w-12 h-12 bg-secondary/20 rounded-2xl flex items-center justify-center text-secondary">
                                <Zap size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-white">Lightning Fast</h3>
                            <p className="text-text-secondary text-sm leading-relaxed">
                                Experience zero-latency navigation and instant video playback with our optimized caching engine.
                            </p>
                        </div>

                        <div className="bg-card-bg border border-border-color p-8 rounded-3xl space-y-4 hover:border-secondary/50 transition-colors">
                            <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400">
                                <Shield size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-white">Top-Tier Security</h3>
                            <p className="text-text-secondary text-sm leading-relaxed">
                                Your data is protected by industry-standard encryption and real-time authentication.
                            </p>
                        </div>

                        <div className="bg-card-bg border border-border-color p-8 rounded-3xl space-y-4 hover:border-secondary/50 transition-colors">
                            <div className="w-12 h-12 bg-green-500/20 rounded-2xl flex items-center justify-center text-green-400">
                                <Users size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-white">Creator Community</h3>
                            <p className="text-text-secondary text-sm leading-relaxed">
                                Join thousands of professionals sharing high-value content every single day.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-border-color">
                <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-2">
                        <Video className="text-secondary" size={24} />
                        <span className="text-lg font-bold text-white">WowTube</span>
                    </div>
                    <div className="flex gap-8 text-sm text-text-secondary">
                        <Link to="/home" className="hover:text-white">Browse</Link>
                        <Link to="/login" className="hover:text-white">Sign In</Link>
                        <Link to="/register" className="hover:text-white">Register</Link>
                        <a href="#" className="hover:text-white">API Docs</a>
                    </div>
                    <p className="text-xs text-text-secondary/50">© 2026 WowTube. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
