import api from './config';

export const gradesApi = {
    // List grades (can pass faculty='current' to see grades for courses taught by current faculty, or student='current')
    listGrades: async (facultyId = '', studentId = '') => {
        const response = await api.get('/api/academic/grades/', {
            params: { faculty: facultyId, student: studentId }
        });
        return response.data;
    },

    // Submit grades for multiple students in a course
    bulkSubmitGrades: async (courseCode, gradesData) => {
        // gradesData format expected by backend: [{student_id: 'STU001', grade: 'A'}, ...]
        const response = await api.post('/api/academic/grades/bulk/', {
            course: courseCode,
            grades: gradesData
        });
        return response.data;
    },

    // Update a specific grade entry
    updateGrade: async (gradeId, newGrade) => {
        const response = await api.put(`/api/academic/grades/${gradeId}/`, {
            grade: newGrade
        });
        return response.data;
    },

    // Admin view of all academic records
    getAcademicRecords: async (search = '', semester = '') => {
        // Assume backend supports filtering records via query params
        const response = await api.get('/api/academic/records/', {
            params: { search, semester }
        });
        return response.data;
    }
};
