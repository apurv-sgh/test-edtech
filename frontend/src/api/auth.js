import api from './api';
import apit from './apit';

// For students - Use main backend
export const registerStudent = (data) => {
  console.log('registerStudent called with data:', data);
  console.log('Using api with baseURL:', api.defaults.baseURL);
  return api.post('/api/auth/register', data);
};

export const loginStudent = (data) => {
  console.log('loginStudent called with data:', data);
  console.log('Using api with baseURL:', api.defaults.baseURL);
  return api.post('/api/auth/login', data);
};

// For teachers - Use Teach_Backend
export const registerTeacher = (data) => {
  console.log('registerTeacher called with data:', data);
  console.log('Using apit with baseURL:', apit.defaults.baseURL);
  return apit.post('/api/teachers/register', data);
};

export const loginTeacher = (data) => {
  console.log('loginTeacher called with data:', data);
  console.log('Using apit with baseURL:', apit.defaults.baseURL);
  return apit.post('/api/teachers/login', data);
};

// For counsellors and industry experts - Use main backend
export const register = (data) => {
  console.log('register called with data:', data);
  console.log('Using api with baseURL:', api.defaults.baseURL);
  return api.post('/api/users/register', data);
};

export const login = (data) => {
  console.log('login called with data:', data);
  console.log('Using api with baseURL:', api.defaults.baseURL);
  return api.post('/api/users/login', data);
};

// Profile management - Use main backend
export const getProfile = () => api.get('/api/auth/profile');
export const updateProfile = (data) => api.put('/api/auth/update-profile', data);
export const changePassword = (data) => api.put('/api/auth/change-password', data); 