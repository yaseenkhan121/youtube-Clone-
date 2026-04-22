import React, { useState, useEffect } from 'react';
import { Home, Compass, History, Clock, ThumbsUp, LogIn, Library as LibraryIcon, ChevronDown, UserCircle2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { videoService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const SidebarItem = ({ icon: Icon, label, path, active }) => {
  const navigate = useNavigate();
  return (
    <div 
      onClick={() => navigate(path)}
      className={`sidebar-item group ${
        active 
          ? 'sidebar-item-active' 
          : 'text-text-secondary hover:text-white'
      }`}
    >
      <Icon size={20} className={active ? 'text-primary' : 'group-hover:text-primary transition-colors'} strokeWidth={active ? 2.5 : 2} />
      <span className="text-[14px]">{label}</span>
    </div>
  );
};

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[40] lg:hidden animate-in fade-in duration-300" 
          onClick={onClose}
        />
      )}


      <div className={`
        fixed lg:sticky top-16 left-0 z-[45] lg:z-30
        w-64 flex-shrink-0 h-[calc(100vh-64px)] overflow-y-auto 
        bg-app-bg border-r border-border-color p-3 space-y-7 no-scrollbar
        transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0 opacity-100' : '-translate-x-full lg:hidden opacity-0'}
      `}>

      {/* Main Section */}
      <div className="space-y-1">
        <SidebarItem icon={Home} label="Home" path="/" active={location.pathname === '/' || location.pathname === '/home'} />
        <SidebarItem icon={Compass} label="Trending" path="/trending" active={location.pathname === '/trending'} />
      </div>

      <div className="h-px bg-border-color mx-3" />

      {/* Library Section */}
      <div className="space-y-1">
        <div className="px-3 mb-2 flex items-center justify-between group cursor-pointer">
            <h3 className="text-xs font-black text-text-secondary uppercase tracking-widest">
                Dashboard
            </h3>
            <ChevronDown size={14} className="text-text-secondary group-hover:text-white" />
        </div>
        
        <SidebarItem icon={LibraryIcon} label="Library" path="/library" active={location.pathname === '/library'} />
        <SidebarItem icon={History} label="History" path="/history" active={location.pathname === '/history'} />
        
        {isLoggedIn ? (
            <>
                <SidebarItem icon={Clock} label="Watch Later" path="/watch-later" active={location.pathname === '/watch-later'} />
                <SidebarItem icon={ThumbsUp} label="Liked Videos" path="/liked" active={location.pathname === '/liked'} />
            </>
        ) : (
            <div className="mx-3 mt-4 p-5 bg-card-bg/50 rounded-2xl border border-border-color/50 space-y-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <UserCircle2 size={24} />
                </div>
                <p className="text-[13px] text-text-secondary leading-relaxed">
                    Sign in to track history and like videos.
                </p>
                <button 
                    onClick={() => navigate('/login')}
                    className="w-full flex items-center justify-center gap-2 bg-primary/10 border border-primary/20 text-primary py-2.5 rounded-xl text-sm font-bold hover:bg-primary/20 transition-all active:scale-[0.98]"
                >
                    <LogIn size={18} />
                    Sign In
                </button>
            </div>
        )}
      </div>

      {isLoggedIn && (
          <>
            <div className="h-px bg-border-color mx-3" />
            <SubscriptionsList />
          </>
      )}
      
      {/* Footer Section */}
      <div className="px-3 pt-4 text-[11px] text-neutral-600 font-medium space-y-4">
          <div className="flex flex-wrap gap-x-3 gap-y-2 uppercase tracking-tighter">
              <span className="hover:text-white cursor-pointer transition-colors">About</span>
              <span className="hover:text-white cursor-pointer transition-colors">Copyright</span>
              <span className="hover:text-white cursor-pointer transition-colors">Creators</span>
              <span className="hover:text-white cursor-pointer transition-colors">Policy</span>
          </div>
          <p className="text-[10px] opacity-50">© 2026 WOWTUBE PREMIER</p>
      </div>
    </div>
  </>
  );
};



const SubscriptionsList = () => {
    const [subs, setSubs] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSubs = async () => {
            try {
                const res = await videoService.getSubscriptions();
                if (res.success) {
                    setSubs(res.data);
                }
            } catch (err) {
                console.error('Failed to fetch subs:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchSubs();
    }, []);

    if (loading || subs.length === 0) return null;

    return (
        <div className="space-y-1">
            <h3 className="px-3 text-xs font-black text-text-secondary uppercase tracking-widest mb-3">Subscriptions</h3>
            {subs.slice(0, 10).map(sub => (
                <div 
                    key={sub.channel_id}
                    onClick={() => navigate(`/search?q=${encodeURIComponent(sub.channel_title)}`)}
                    className="flex items-center gap-4 py-2 px-3 rounded-xl cursor-pointer hover:bg-card-bg group transition-all"
                >
                    <div className="w-7 h-7 rounded-full overflow-hidden bg-primary/20 flex-shrink-0 border border-white/5 group-hover:scale-110 transition-transform shadow-lg shadow-black/20">
                        {sub.channel_thumbnail ? (
                            <img src={sub.channel_thumbnail} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-primary font-bold">
                                {sub.channel_title.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                    <span className="text-[13px] text-text-secondary group-hover:text-white truncate flex-1 transition-colors">{sub.channel_title}</span>
                </div>
            ))}
        </div>
    );
};

export default Sidebar;
