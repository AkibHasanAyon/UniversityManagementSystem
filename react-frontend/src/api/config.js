import axios from 'axios';

const BASE_URL = 'https://vondobaba.pythonanywhere.com';

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add the auth token header to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle token refresh on 401
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 and we haven't already tried to refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = localStorage.getItem('refresh_token');

            if (refreshToken) {
                try {
                    // Try to get a new access token
                    const response = await axios.post(`${BASE_URL}/api/auth/refresh/`, {
                        refresh: refreshToken
                    });

                    const { access, access_token } = response.data;
                    const newToken = access_token || access;

                    // Update the stored access token
                    localStorage.setItem('access_token', newToken);

                    // Update the original request with new token and retry
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    return api(originalRequest);
                } catch (refreshError) {
                    // Refresh token is invalid or expired
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    localStorage.removeItem('user');

                    // Redirect to login or dispatch an event that auth state should clear
                    window.dispatchEvent(new Event('auth:unauthorized'));
                    return Promise.reject(refreshError);
                }
            } else {
                // No refresh token available, just reject
                window.dispatchEvent(new Event('auth:unauthorized'));
            }
        }

        return Promise.reject(error);
    }
);

export default api;
