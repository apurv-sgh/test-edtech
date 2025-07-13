import api from './api';

// Get all channels with filters
export const getAllChannels = (params = {}) => {
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== '') {
            queryParams.append(key, params[key]);
        }
    });
    return api.get(`/api/channels/all?${queryParams.toString()}`);
};

// Get channel by ID
export const getChannelById = (id) => api.get(`/api/channels/${id}`);

// Get user's joined channels
export const getMyChannels = () => api.get('/api/channels/my/channels');

// Join a channel
export const joinChannel = (channelId) => api.post(`/api/channels/${channelId}/join`);

// Leave a channel
export const leaveChannel = (channelId) => api.delete(`/api/channels/${channelId}/leave`);

// Create a new channel (for teachers)
export const createChannel = (data) => api.post('/api/channels', data);

// Get channel messages
export const getChannelMessages = (channelId, params = {}) => {
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== '') {
            queryParams.append(key, params[key]);
        }
    });
    return api.get(`/api/channels/${channelId}/messages?${queryParams.toString()}`);
};

// Send message to channel
export const sendMessage = (channelId, data) => api.post(`/api/channels/${channelId}/messages`, data);

// Get available subjects
export const getSubjects = () => api.get('/api/channels/subjects');

// Get available tags
export const getTags = () => api.get('/api/channels/tags'); 