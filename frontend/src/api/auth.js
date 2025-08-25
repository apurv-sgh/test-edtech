import api from './api';
import apit from './apit';

// For students
export const registerStudent = (data) => api.post('/api/auth/register', data);
export const loginStudent = (data) => api.post('/api/auth/login', data);
// export const getProfile = () => api.get('/api/auth/profile');
// export const updateProfile = (data) => api.put('/api/auth/update-profile', data);
// export const changePassword = (data) => api.put('/api/auth/change-password', data); 

// For teachers
export const registerTeacher = (data) => apit.post('http://localhost:4000/api/teachers/register', data);
export const loginTeacher = (data) => apit.post('http://localhost:4000/api/teachers/login', data);

// For experts and counsellors
export const register = (data) => api.post('/api/users/register', data);
export const login = (data) => api.post('/api/users/login', data);

export const getProfile = () => api.get('/api/auth/profile');
export const updateProfile = (data) => api.put('/api/auth/update-profile', data);
export const changePassword = (data) => api.put('/api/auth/change-password', data); 