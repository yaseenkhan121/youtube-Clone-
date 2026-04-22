import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Attach Bearer token from localStorage on every request
api.interceptors.request.use(config => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle 401 Unauthorized
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('auth_token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const videoService = {
    // Video browsing (Public)
    getTrending: async () => {
        const response = await api.get('/videos/trending');
        return response.data;
    },
    getVideoById: async (id) => {
        const response = await api.get(`/videos/${id}`);
        return response.data;
    },
    getRelatedVideos: async (id) => {
        const response = await api.get(`/videos/related/${id}`);
        return response.data;
    },
    searchVideos: async (query) => {
        const response = await api.get(`/videos/search?q=${encodeURIComponent(query)}`);
        return response.data;
    },

    // Channel specific
    getChannelDetails: async (id) => {
        const response = await api.get(`/channels/${id}`);
        return response.data;
    },
    getChannelVideos: async (id) => {
        const response = await api.get(`/channels/${id}/videos`);
        return response.data;
    },

    // Subscriptions (Auth)
    toggleSubscription: async (channelData) => {
        const response = await api.post('/subscriptions', channelData);
        return response.data;
    },
    getSubscriptions: async () => {
        const response = await api.get('/subscriptions');
        return response.data;
    },
    getSubscriptionStatus: async (channelId) => {
        const response = await api.get(`/subscriptions/${channelId}/status`);
        return response.data;
    },

    // Likes (Auth)
    toggleLike: async (videoData) => {
        const response = await api.post('/liked-videos', videoData);
        return response.data;
    },
    getLikedVideos: async () => {
        const response = await api.get('/liked-videos');
        return response.data;
    },
    getLikeStatus: async (videoId) => {
        const response = await api.get(`/liked-videos/${videoId}/status`);
        return response.data;
    },

    // Watch Later (Auth)
    toggleWatchLater: async (videoData) => {
        const response = await api.post('/watch-later', videoData);
        return response.data;
    },
    getWatchLater: async () => {
        const response = await api.get('/watch-later');
        return response.data;
    },
    getWatchLaterStatus: async (videoId) => {
        const response = await api.get(`/watch-later/${videoId}/status`);
        return response.data;
    },

    // History (Auth)
    recordHistory: async (videoData) => {
        const response = await api.post('/history', videoData);
        return response.data;
    },
    getHistory: async () => {
        const response = await api.get('/history');
        return response.data;
    },
    deleteHistoryItem: async (videoId) => {
        const response = await api.delete(`/history/${videoId}`);
        return response.data;
    },
    clearHistory: async () => {
        const response = await api.delete('/history');
        return response.data;
    },
};

export const authService = {
    register: (userData) => api.post('/register', userData).then(res => res.data),
    login: (credentials) => api.post('/login', credentials).then(res => res.data),
    logout: () => api.post('/logout').then(res => res.data),
    getUser: () => api.get('/user').then(res => res.data),
    // Notifications
    getNotifications: () => api.get('/notifications').then(res => res.data),
    markNotificationRead: (id) => api.post(`/notifications/${id}/read`).then(res => res.data),
    markAllNotificationsRead: () => api.post('/notifications/mark-all-read').then(res => res.data),
    // Profile
    getStats: () => api.get('/profile/stats').then(res => res.data),
    updateProfile: (data) => api.post('/profile/update', data).then(res => res.data),
    uploadAvatar: (formData) => api.post('/profile/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => res.data),
};

export default api;
