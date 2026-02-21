import api from './config';

export const authApi = {
    login: async (email, password) => {
        const response = await api.post('/api/auth/login/', { email, password });
        return response.data;
    },

    logout: async (refreshToken) => {
        const response = await api.post('/api/auth/logout/', { refresh: refreshToken });
        return response.data;
    },

    refreshToken: async (refresh) => {
        const response = await api.post('/api/auth/refresh/', { refresh });
        return response.data;
    },

    forgotPassword: async (email) => {
        const response = await api.post('/api/auth/forgot-password/', { email });
        return response.data;
    },

    resetPassword: async (uidb64, token, newPassword) => {
        const response = await api.post('/api/auth/reset-password/', {
            uidb64,
            token,
            new_password: newPassword
        });
        return response.data;
    }
};
