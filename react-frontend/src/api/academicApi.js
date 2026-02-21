import api from './config';

export const academicApi = {
    // --- Courses ---
    // Example usage: listCourses('', 'current') to filter by current faculty
    listCourses: async (search = '', facultyId = '') => {
        const response = await api.get('/api/academic/courses/', {
            params: { search, faculty: facultyId }
        });
        return response.data;
    },

    getCourse: async (courseId) => {
        const response = await api.get(`/api/academic/courses/${courseId}/`);
        return response.data;
    },

    createCourse: async (courseData) => {
        const response = await api.post('/api/academic/courses/', courseData);
        return response.data;
    },

    updateCourse: async (courseId, courseData) => {
        const response = await api.put(`/api/academic/courses/${courseId}/`, courseData);
        return response.data;
    },

    deleteCourse: async (courseId) => {
        const response = await api.delete(`/api/academic/courses/${courseId}/`);
        return response.data;
    },

    // --- Assignments ---
    assignFacultyToCourse: async (facultyId, courseCode) => {
        const response = await api.post('/api/academic/assignments/', {
            faculty: facultyId,
            course: courseCode
        });
        return response.data;
    },

    // --- Enrollments ---
    // Example usage: listEnrollments('CS301') to get students for a course
    // Example usage: listEnrollments('', 'current') to get enrollments for current student
    listEnrollments: async (courseCode = '', studentId = '') => {
        const response = await api.get('/api/academic/enrollments/', {
            params: { course: courseCode, student: studentId }
        });
        return response.data;
    },

    enrollStudent: async (studentId, courseCode) => {
        const response = await api.post('/api/academic/enrollments/', {
            student: studentId,
            course: courseCode
        });
        return response.data;
    },

    // Note: To "remove" an enrollment, the backend might use a specific DELETE endpoint or an action on enrollments.
    // The Postman collection doesn't explicitly show a DELETE /enrollments/, we might need to verify this or rely on a different mechanism.
    removeEnrollment: async (enrollmentId) => {
        const response = await api.delete(`/api/academic/enrollments/${enrollmentId}/`);
        return response.data;
    }
};
