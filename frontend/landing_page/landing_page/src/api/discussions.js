import api from './api';

export const getDiscussions = () => api.get('/api/discussions');
export const getDiscussion = (id) => api.get(`/api/discussions/${id}`);
export const createDiscussion = (data) => api.post('/api/discussions', data);
export const updateDiscussion = (id, data) => api.put(`/api/discussions/${id}`, data);
export const deleteDiscussion = (id) => api.delete(`/api/discussions/${id}`);
export const getCourseDiscussions = (courseId) => api.get(`/api/discussions/course/${courseId}`);
export const getDiscussionById = (id) => api.get(`/api/discussions/${id}`);
export const addComment = (discussionId, data) => api.post(`/api/discussions/${discussionId}/comments`, data);
export const addReply = (discussionId, commentId, data) => api.post(`/api/discussions/${discussionId}/comments/${commentId}/replies`, data);
export const toggleLike = (discussionId) => api.put(`/api/discussions/${discussionId}/like`); 