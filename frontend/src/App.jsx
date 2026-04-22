import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Watch from './pages/Watch';
import Search from './pages/Search';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing';
import History from './pages/History';
import LikedVideos from './pages/LikedVideos';
import WatchLater from './pages/WatchLater';
import Library from './pages/Library';
import Trending from './pages/Trending';
import Notifications from './pages/Notifications';
import Channel from './pages/Channel';
import { useAuth } from './context/AuthContext';

import { Loader2 } from 'lucide-react';

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const { loading } = useAuth();
  
  // Previous hideLayout logic removed - keeping layout always visible for common project start
  const hideLayout = false;

  if (loading) {
    return (
      <div className="min-h-screen bg-app-bg flex items-center justify-center">
        <Loader2 className="text-secondary animate-spin" size={48} />
      </div>
    );
  }

  if (hideLayout) return children;

  return (
    <div className="min-h-screen bg-app-bg text-text-primary">
      <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <main className={`flex-1 w-full transition-all duration-300 ${!isSidebarOpen ? 'lg:pl-0' : ''}`}>
          {children}
        </main>
      </div>
    </div>
  );
};

const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuth();
  
  if (loading) return null;
  if (!token) return <Navigate to="/login" />;
  
  return children;
};

function App() {
  const { token } = useAuth();
  
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/landing" element={<Landing />} />
          
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/trending" element={<Trending />} />

          <Route path="/notifications" element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          } />
          
          <Route path="/watch/:id" element={<Watch />} />
          
          <Route path="/search" element={<Search />} />
          <Route path="/channel/:id" element={<Channel />} />
          
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          
          <Route path="/history" element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          } />
          
          <Route path="/liked" element={
            <ProtectedRoute>
              <LikedVideos />
            </ProtectedRoute>
          } />

          <Route path="/watch-later" element={
            <ProtectedRoute>
              <WatchLater />
            </ProtectedRoute>
          } />

          <Route path="/library" element={
            <ProtectedRoute>
              <Library />
            </ProtectedRoute>
          } />


          {/* Catch all redirect to landing or home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
