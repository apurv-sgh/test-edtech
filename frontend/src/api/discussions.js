import api from './api';

// Get all discussions the user is authorized to see
export const getAllDiscussions = () => api.get('/api/discussions');

// Alias for backward compatibility
export const getDiscussions = () => api.get('/api/discussions');

// Get all discussions for a course
export const getCourseDiscussions = (courseId) => api.get(`/api/discussions/course/${courseId}`);

// Get a single discussion
export const getDiscussionById = (id) => api.get(`/api/discussions/${id}`);

// Chat-like messaging functions
export const getDiscussionMessages = (discussionId, params = {}) => {
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== '') {
            queryParams.append(key, params[key]);
        }
    });
    return api.get(`/api/discussions/${discussionId}/messages?${queryParams.toString()}`);
};

export const sendMessage = (discussionId, data) => api.post(`/api/discussions/${discussionId}/messages`, data);

export const replyToMessage = (discussionId, messageId, data) => 
    api.post(`/api/discussions/${discussionId}/messages/${messageId}/replies`, data);

export const toggleMessageLike = (discussionId, messageId) => 
    api.put(`/api/discussions/${discussionId}/messages/${messageId}/like`);

export const resolveDoubt = (discussionId, messageId) => 
    api.put(`/api/discussions/${discussionId}/messages/${messageId}/resolve`);

export const markMessagesAsRead = (discussionId) => 
    api.put(`/api/discussions/${discussionId}/messages/read`);

// Traditional forum functions
export const createDiscussion = (data) => api.post('/api/discussions', data);

export const addComment = (discussionId, data) => api.post(`/api/discussions/${discussionId}/comments`, data);

export const addReply = (discussionId, commentId, data) => 
    api.post(`/api/discussions/${discussionId}/comments/${commentId}/replies`, data);

export const toggleLike = (discussionId) => api.put(`/api/discussions/${discussionId}/like`);

// Delete a discussion
export const deleteDiscussion = (discussionId) => api.delete(`/api/discussions/${discussionId}`);
 