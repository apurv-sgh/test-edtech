import api from './api';

export const register = (data) => api.post('/api/auth/register', data);
export const login = (data) => api.post('/api/auth/login', data);
export const getProfile = () => api.get('/api/auth/profile');
export const updateProfile = (data) => api.put('/api/auth/update-profile', data);
export const changePassword = (data) => api.put('/api/auth/change-password', data); 