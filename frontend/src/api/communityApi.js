import axios from 'axios';
import apit from './apit';
// Your backend now runs on port 5000 as per your index.js
const API_URL = `${apit.defaults.baseURL}/api/community`; 

const getAuthHeaders = (isFormData = false) => {
  // Use teacherToken if available, otherwise fallback to token
  const token = localStorage.getItem('teacherToken') || localStorage.getItem('token');
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
};

// GET /api/community/my-community
export const getMyCommunity = () => axios.get(`${API_URL}/my-community`, { headers: getAuthHeaders() });

// POST /api/community/create
export const createCommunity = (formData) => axios.post(`${API_URL}/create`, formData, { headers: getAuthHeaders(true) });

// PUT /api/community/:communityId
export const updateCommunity = (id, formData) => axios.put(`${API_URL}/${id}`, formData, { headers: getAuthHeaders(true) });

// DELETE /api/community/:communityId
export const deleteCommunity = (id) => axios.delete(`${API_URL}/${id}`, { headers: getAuthHeaders() });