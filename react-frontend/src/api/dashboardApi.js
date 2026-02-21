import api from './config';

export const dashboardApi = {
    getAdminStats: async () => {
        const response = await api.get('/api/dashboard/admin/stats/');
        return response.data;
    },

    getFacultyStats: async () => {
        const response = await api.get('/api/dashboard/faculty/stats/');
        return response.data;
    },

    getStudentStats: async () => {
        const response = await api.get('/api/dashboard/student/stats/');
        return response.data;
    }
};
