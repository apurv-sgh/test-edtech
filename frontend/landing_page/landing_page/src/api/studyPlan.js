import api from './api';

export const getStudyPlans = () => api.get('/api/study-plans');
export const createStudyPlan = (data) => api.post('/api/study-plans', data);
export const updateStudyPlan = (id, data) => api.put(`/api/study-plans/${id}`, data);
export const deleteStudyPlan = (id) => api.delete(`/api/study-plans/${id}`);
export const getStudyPlanById = (id) => api.get(`/api/study-plans/${id}`); 