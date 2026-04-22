import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Video, User, Mail, Lock, AlertCircle, Loader2, Eye, EyeOff, ChevronRight, Sparkles } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            const result = await register({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                password_confirmation: formData.confirmPassword
            });
            
            if (result.success) {
                navigate('/');
            } else {
                setError(result.message || 'Registration failed');
            }
        } catch (err) {
            setError('An error occurred during registration');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[95vh] flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-1/4 -right-20 w-80 h-80 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-purple-600/10 rounded-full blur-[120px]" />
            
            <div className="w-full max-w-2xl bg-card-bg/40 border border-border-color backdrop-blur-2xl rounded-[3rem] p-10 md:p-14 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] relative z-10 animate-in fade-in zoom-in-95 duration-700">
                <div className="flex flex-col items-center mb-12">
                    <div className="bg-primary p-4 rounded-[2rem] mb-6 text-white shadow-2xl shadow-primary/40 relative">
                        <Video size={40} className="fill-white" />
                        <Sparkles className="absolute -top-2 -right-2 text-yellow-400 animate-bounce" size={24} />
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tighter mb-2 text-center">Create Your Legacy</h1>
                    <p className="text-text-secondary font-bold text-center">Join the most exclusive creator community</p>
                </div>

                {error && (
                    <div className="mb-8 p-5 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center gap-4 text-red-500 text-sm animate-in slide-in-from-top-4">
                        <div className="p-2 bg-red-500/20 rounded-lg">
                            <AlertCircle size={20} className="shrink-0" />
                        </div>
                        <span className="font-black tracking-tight">{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-3">
                        <label className="text-xs font-black text-text-secondary uppercase tracking-[0.2em] ml-2">Full Identity</label>
                        <div className="relative group">
                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors">
                                <User size={20} />
                            </div>
                            <input
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full bg-app-bg/50 border border-border-color rounded-2xl py-4 pl-14 pr-4 text-white focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-neutral-700 font-bold"
                                placeholder="Citizen Name"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-xs font-black text-text-secondary uppercase tracking-[0.2em] ml-2">Digital Address</label>
                        <div className="relative group">
                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors">
                                <Mail size={20} />
                            </div>
                            <input
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full bg-app-bg/50 border border-border-color rounded-2xl py-4 pl-14 pr-4 text-white focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-neutral-700 font-bold"
                                placeholder="identity@luxury-tube.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <label className="text-xs font-black text-text-secondary uppercase tracking-[0.2em] ml-2">Secure Key</label>
                            <div className="relative group">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors">
                                    <Lock size={20} />
                                </div>
                                <input
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full bg-app-bg/50 border border-border-color rounded-2xl py-4 pl-14 pr-4 text-white focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-neutral-700 font-bold text-sm"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-black text-text-secondary uppercase tracking-[0.2em] ml-2">Verify Key</label>
                            <div className="relative group">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors">
                                    <Lock size={20} />
                                </div>
                                <input
                                    name="confirmPassword"
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full bg-app-bg/50 border border-border-color rounded-2xl py-4 pl-14 pr-4 text-white focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-neutral-700 font-bold text-sm"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    
                    <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-xs text-primary font-black uppercase tracking-widest hover:underline ml-2 transition-all"
                    >
                        {showPassword ? 'Conceal Keys' : 'Reveal Keys'}
                    </button>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary hover:brightness-110 disabled:opacity-50 text-white font-black py-5 rounded-[2rem] transition-all shadow-2xl shadow-primary/40 active:scale-[0.97] flex items-center justify-center gap-3 group relative overflow-hidden mt-6"
                    >
                        {loading ? <Loader2 className="animate-spin" size={24} /> : (
                            <>
                                <span className="relative z-10">Initialize Account</span>
                                <ChevronRight size={22} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
                    </button>
                </form>

                <div className="mt-12 text-center border-t border-border-color pt-10">
                    <p className="text-text-secondary font-bold">
                        Already have an established legacy?{' '}
                        <Link to="/login" className="text-primary font-black hover:underline transition-all underline-offset-4 decoration-2">
                             Authorize Now
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
