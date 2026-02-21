import api from './config';

export const usersApi = {
    // --- Students ---
    listStudents: async (search = '', page = 1, pageSize = 5) => {
        const response = await api.get('/api/users/students/', {
            params: { search, page, page_size: pageSize }
        });
        return response.data;
    },

    getStudent: async (studentId) => {
        const response = await api.get(`/api/users/students/${studentId}/`);
        return response.data;
    },

    createStudent: async (studentData) => {
        const response = await api.post('/api/users/students/', studentData);
        return response.data;
    },

    updateStudent: async (studentId, studentData) => {
        const response = await api.put(`/api/users/students/${studentId}/`, studentData);
        return response.data;
    },

    deleteStudent: async (studentId) => {
        const response = await api.delete(`/api/users/students/${studentId}/`);
        return response.data;
    },

    // --- Faculty ---
    listFaculty: async (search = '', page = 1, pageSize = 5) => {
        const response = await api.get('/api/users/faculty/', {
            params: { search, page, page_size: pageSize }
        });
        return response.data;
    },

    getFaculty: async (facultyId) => {
        const response = await api.get(`/api/users/faculty/${facultyId}/`);
        return response.data;
    },

    createFaculty: async (facultyData) => {
        const response = await api.post('/api/users/faculty/', facultyData);
        return response.data;
    },

    updateFaculty: async (facultyId, facultyData) => {
        const response = await api.put(`/api/users/faculty/${facultyId}/`, facultyData);
        return response.data;
    },

    deleteFaculty: async (facultyId) => {
        const response = await api.delete(`/api/users/faculty/${facultyId}/`);
        return response.data;
    }
};
