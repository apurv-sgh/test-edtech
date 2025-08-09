import api from './api';

export const getLiveClasses = () => api.get('/api/liveclasses');
export const getLiveClass = (id) => api.get(`/api/liveclasses/${id}`);
export const createLiveClass = (data) => api.post('/api/liveclasses', data);
export const updateLiveClass = (id, data) => api.put(`/api/liveclasses/${id}`, data);
export const deleteLiveClass = (id) => api.delete(`/api/liveclasses/${id}`);
export const getCourseLiveClasses = (courseId) => api.get(`/api/live-classes/course/${courseId}`);
export const getLiveClassById = (id) => api.get(`/api/liveclasses/${id}`);
export const joinLiveClass = (id) => api.post(`/api/live-classes/${id}/join`);
export const leaveLiveClass = (id) => api.post(`/api/live-classes/${id}/leave`); 