// Industry expert profile API functions only. Authentication is handled by the shared auth API.
import api from './api';

// Fetch all industry expert profiles
export const getIndustryExpertProfiles = () => api.get('/api/industry-experts/profiles');
export const getIndustryExpertProfileById = (id) => api.get(`/api/industry-experts/profile/${id}`);

// Review functions
export const getExpertReviews = (expertId) => api.get(`/api/industry-experts/${expertId}/reviews`);
export const postExpertReview = (expertId, reviewData) => api.post(`/api/industry-experts/${expertId}/reviews`, reviewData); 