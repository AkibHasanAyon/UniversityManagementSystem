import React, { createContext, useState, useContext, useEffect } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for existing session on mount
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('access_token');

        if (storedUser && token) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse stored user", e);
            }
        }

        setLoading(false);

        // Listen for unauthorized events from axios interceptor
        const handleUnauthorized = () => {
            logout();
        };

        window.addEventListener('auth:unauthorized', handleUnauthorized);
        return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await authApi.login(email, password);

            // Assuming response contains { access_token, refresh_token, user: { id, email, role, first_name, last_name, ... } }
            const { access_token, refresh_token, user: responseUser } = response;

            // Create a user object based on what the API returns
            const name = `${responseUser?.first_name || ''} ${responseUser?.last_name || ''}`.trim();
            const userData = {
                ...responseUser,
                name: name || email.split('@')[0], // Fallback name for now
            };

            localStorage.setItem('access_token', access_token || response.access);
            if (refresh_token || response.refresh) localStorage.setItem('refresh_token', refresh_token || response.refresh);
            localStorage.setItem('user', JSON.stringify(userData));

            setUser(userData);
            return { success: true };
        } catch (error) {
            console.error("Login failed:", error);
            return {
                success: false,
                error: error.response?.data?.detail || 'Login failed. Please check your credentials.'
            };
        }
    };

    const logout = async () => {
        const refresh = localStorage.getItem('refresh_token');
        if (refresh) {
            try {
                await authApi.logout(refresh);
            } catch (error) {
                console.error("Logout API failed:", error);
            }
        }

        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        setUser(null);
    };

    if (loading) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading session...</div>;
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
