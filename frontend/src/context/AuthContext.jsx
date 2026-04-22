import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('auth_token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            fetchUser();
        } else {
            setLoading(false);
        }
    }, [token]);

    const fetchUser = async () => {
        try {
            const response = await authService.getUser();
            if (response.success) {
                setUser(response.user);
            } else {
                logout();
            }
        } catch (error) {
            console.error('Error fetching user:', error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const response = await authService.login({ email, password });
            if (response.success) {
                const newToken = response.access_token;
                localStorage.setItem('auth_token', newToken);
                setToken(newToken);
                setUser(response.user);
                return { success: true };
            }
        } catch (error) {
            return { 
                success: false, 
                message: error.response?.data?.message || 'Login failed' 
            };
        }
    };

    const register = async (userData) => {
        try {
            const response = await authService.register(userData);
            if (response.success) {
                const newToken = response.access_token;
                localStorage.setItem('auth_token', newToken);
                setToken(newToken);
                setUser(response.user);
                return { success: true };
            }
        } catch (error) {
            const errorData = error.response?.data;
            let errorMessage = 'Registration failed';
            
            if (errorData?.errors) {
                // Flatten Laravel validation errors (prioritize these)
                errorMessage = Object.values(errorData.errors).flat().join(' ');
            } else if (errorData?.message) {
                errorMessage = errorData.message;
            } else if (error.message) {
                errorMessage = error.message;
            }

            return { 
                success: false, 
                message: errorMessage 
            };
        }
    };

    const logout = async () => {
        try {
            if (token) {
                await authService.logout();
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('auth_token');
            setToken(null);
            setUser(null);
        }
    };

    const updateProfile = (userData) => {
        setUser(userData);
    };

    const isLoggedIn = !!user;

    return (
        <AuthContext.Provider value={{ user, token, isLoggedIn, loading, login, register, logout, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
};
