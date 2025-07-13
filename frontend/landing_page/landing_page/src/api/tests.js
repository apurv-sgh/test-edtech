import api from './api';

export const getTests = () => api.get('/api/tests');
export const getTest = (id) => api.get(`/api/tests/${id}`);
export const createTest = (data) => api.post('/api/tests', data);
export const updateTest = (id, data) => api.put(`/api/tests/${id}`, data);
export const deleteTest = (id) => api.delete(`/api/tests/${id}`);
export const getTestsForCourse = (courseId) => api.get(`/api/tests/courses/${courseId}`);
export const createTestForCourse = (courseId, data) => api.post(`/api/tests/courses/${courseId}`, data); 