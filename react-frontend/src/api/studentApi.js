import api from './config';

export const studentApi = {
    // Gets schedule for the current day. Role can be 'student' or 'faculty' based on usage.
    getMySchedule: async (role = 'student') => {
        const response = await api.get('/api/academic/schedules/today/', {
            params: { role }
        });
        return response.data;
    },

    // Full academic history semester by semester
    getAcademicHistory: async () => {
        const response = await api.get('/api/academic/history/');
        return response.data;
    },

    // Summary stats (credit earned, overall GPA, etc.)
    getAcademicSummary: async () => {
        const response = await api.get('/api/academic/history/summary/');
        return response.data;
    },

    // Download transcript as PDF blob
    downloadTranscript: async () => {
        const response = await api.get('/api/academic/transcript/', {
            responseType: 'blob' // Important for handling binary data
        });
        return response.data;
    }
};
