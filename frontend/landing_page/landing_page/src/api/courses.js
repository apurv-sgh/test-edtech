import api from './api';

export const getCourses = () => api.get('/api/courses');
export const getCourse = (id) => api.get(`/api/courses/${id}`);
export const createCourse = (data) => api.post('/api/courses', data);
export const updateCourse = (id, data) => api.put(`/api/courses/${id}`, data);
export const deleteCourse = (id) => api.delete(`/api/courses/${id}`);
export const enrollInCourse = (id) => api.post(`/api/courses/${id}/enroll`);
export const unenrollFromCourse = (id) => api.delete(`/api/courses/${id}/unenroll`);
export const getMyCourses = () => api.get('/api/courses/my-courses');
export const addLessonToCourse = (courseId, data) => api.post(`/api/courses/${courseId}/lessons`, data); 