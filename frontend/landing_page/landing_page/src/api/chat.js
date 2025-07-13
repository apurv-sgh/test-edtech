import api from './api';

export const getChats = () => api.get('/api/chats');
export const getChat = (id) => api.get(`/api/chats/${id}`);
export const createChat = (data) => api.post('/api/chats', data);
export const updateChat = (id, data) => api.put(`/api/chats/${id}`, data);
export const deleteChat = (id) => api.delete(`/api/chats/${id}`);
export const getCourseChats = (courseId) => api.get(`/api/chats/course/${courseId}`);
export const getChatById = (id) => api.get(`/api/chats/${id}`);
export const sendMessage = (chatId, data) => api.post(`/api/chats/${chatId}/messages`, data);
export const markMessagesAsRead = (chatId) => api.put(`/api/chats/${chatId}/read`); 