import api from './api';

// Get all communities with filters
export const getAllChannels = (params = {}) => {
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== '') {
            queryParams.append(key, params[key]);
        }
    });
    return api.get(`/api/channels/all?${queryParams.toString()}`);
};

// Get community by ID
export const getChannelById = (id) => api.get(`/api/channels/${id}`);

// Get user's joined communities
export const getMyChannels = () => api.get('/api/channels/my/channels');

// Join a community
export const joinChannel = (channelId) => api.post(`/api/channels/${channelId}/join`);

// Leave a community
export const leaveChannel = (channelId) => api.delete(`/api/channels/${channelId}/leave`);

// Create a new community (for teachers)
export const createChannel = (data) => api.post('/api/channels', data);

// Get community messages
export const getChannelMessages = (channelId, params = {}) => {
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== '') {
            queryParams.append(key, params[key]);
        }
    });
    return api.get(`/api/channels/${channelId}/messages?${queryParams.toString()}`);
};

// Send message to community
export const sendMessage = (channelId, data) => api.post(`/api/channels/${channelId}/messages`, data);

// Get available subjects
export const getSubjects = () => api.get('/api/channels/subjects');

// Get available tags
export const getTags = () => api.get('/api/channels/tags'); 