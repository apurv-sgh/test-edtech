import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:4000/api';

//axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  console.log("Token used for upload:", token);
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Add token to requests if available
/*
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}); 
*/


// Teacher Authentication
export const teacherAuth = {
  register: (data) => api.post('/teachers/register', data),
  login: (data) => api.post('/teachers/login', data),
  getProfile: () => api.get('/teachers/profile'),
  updateProfile: (data) => api.put('/teachers/profile', data),
  getAllTeachers: (params) => api.get('/teachers/all', { params }),
};


// Course Management
export const courseAPI = {
  create: (data) => {
  return axios.post(`${API_BASE_URL}/courses/create`, data, {
    headers: {
      ...getAuthHeaders(),
    },
  });
  },
  getAll: (params) => api.get('/courses/all', { params }),
  getMyCourses: (params) => api.get('/courses/my-courses', { params }),
  getById: (id) => api.get(`/courses/${id}`),
  update: (id, data) => api.put(`/courses/${id}`, data),
  delete: (id) => api.delete(`/courses/${id}`),
  enroll: (id) => api.post(`/courses/${id}/enroll`),
};


// Notes Management
export const notesAPI = {
  upload: (formData) => {
  return axios.post(`${API_BASE_URL}/notes/upload`, formData, {
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'multipart/form-data',
    },
  });
  },
  getAll: (params) => api.get('/notes/all', { params }),
  getMyNotes: (params) => api.get('/notes/my-notes', { params }),
  download: (noteId, fileIndex) => {
    window.open(`${API_BASE_URL}/notes/download/${noteId}/${fileIndex}`, '_blank');
  },
  like: (id) => api.post(`/notes/${id}/like`),
  update: (id, data) => api.put(`/notes/${id}`, data),
  delete: (id) => api.delete(`/notes/${id}`),
  getById: (id) => api.get(`/notes/fetch/${id}`),
 
};


// Videos API
export const videosAPI = {
  upload: (formData) => api.post('/videos/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  getAll: () => api.get('/videos/all'),
  getMyVideos: () => api.get('/videos/my-videos'),
  getByCourse: (id) => api.get(`/videos/course/${id}`),
  download: (id) => api.get(`/videos/download/${id}`, {
    responseType: 'blob',
  }),
  delete: (id) => api.delete(`/videos/${id}`),
};


// Group Chat API
export const groupChatAPI = {
  create: (chatData) => api.post('/group-chat/create', chatData),
  getAll: () => api.get('/group-chat/all'),
  getById: (id) => api.get(`/group-chat/${id}`),
  sendMessage: (id, messageData) => api.post(`/group-chat/${id}/message`, messageData),
  getMessages: (id) => api.get(`/group-chat/${id}/messages`),
  join: (id) => api.post(`/group-chat/${id}/join`),
  leave: (id) => api.post(`/group-chat/${id}/leave`),
};


// Live Sessions
export const liveSessionAPI = {
  create: (data) => api.post('/live-sessions/create', data),
  getAll: (params) => api.get('/live-sessions/all', { params }),
  getMySessions: (params) => api.get('/live-sessions/my-sessions', { params }),
  getById: (id) => api.get(`/live-sessions/${id}`),
  join: (id) => api.post(`/live-sessions/${id}/join`),
  start: (id) => api.post(`/live-sessions/${id}/start`),
  stop: (id) => api.post(`/live-sessions/${id}/stop`),
};


// User Authentication (existing)
export const userAuth = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
};

export default api;
