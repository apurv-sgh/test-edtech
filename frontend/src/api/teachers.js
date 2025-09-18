import api from './api';

// Get featured teachers (high-rated teachers with courses)
export const getFeaturedTeachers = async () => {
    try {
        const response = await api.get('/api/teachers/featured');
        return response.data;
    } catch (error) {
        console.error('Error fetching featured teachers:', error);
        throw error;
    }
};

// Get all teachers with pagination and search
export const getAllTeachers = async (params = {}) => {
    try {
        const { page = 1, limit = 12, search = '' } = params;
        const response = await api.get('/api/teachers', {
            params: { page, limit, search }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching teachers:', error);
        throw error;
    }
};

// Get teacher by ID
export const getTeacherById = async (teacherId) => {
    try {
        const response = await api.get(`/api/teachers/${teacherId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching teacher:', error);
        throw error;
    }
};

// Get teacher's courses
export const getTeacherCourses = async (teacherId, params = {}) => {
    try {
        const { page = 1, limit = 12 } = params;
        const response = await api.get(`/api/teachers/${teacherId}/courses`, {
            params: { page, limit }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching teacher courses:', error);
        throw error;
    }
};
