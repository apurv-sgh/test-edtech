import axios from 'axios';
import apit from './apit';
const API_URL = `${apit.defaults.baseURL}/api/community`;

const getAuthHeaders = (isFormData = false) => {
  const token = localStorage.getItem('token');
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
};

export const getCommunityDetails = (id) => axios.get(`${API_URL}/${id}`, { headers: getAuthHeaders() });
export const getCommunityMessages = (id) => axios.get(`${API_URL}/${id}/messages`, { headers: getAuthHeaders() });
export const postTextMessage = (id, content) => axios.post(`${API_URL}/${id}/messages`, { messageType: 'text', content }, { headers: getAuthHeaders() });
export const postFileMessage = (id, formData) => axios.post(`${API_URL}/${id}/messages`, formData, { headers: getAuthHeaders(true) });