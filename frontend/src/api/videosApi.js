import axios from 'axios';

const API_URL = 'http://localhost:4000/api/videos';

// A helper function to get the authentication token from localStorage
const getAuthHeaders = (isFormData = false) => {
  // Use teacherToken if available, otherwise fallback to token
  const token = localStorage.getItem('teacherToken') || localStorage.getItem('token');
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  // Let the browser set the Content-Type for FormData, which is crucial for file uploads
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
};

// GET /api/videos/my-videos
export const getMyVideos = () => {
  return axios.get(`${API_URL}/my-videos`, { headers: getAuthHeaders() });
};

// POST /api/videos/upload
export const uploadVideo = (formData) => {
  // For file uploads, we pass true to get the correct headers
  return axios.post(`${API_URL}/upload`, formData, { headers: getAuthHeaders(true) });
};

// DELETE /api/videos/:videoId
export const deleteVideo = (videoId) => {
  return axios.delete(`${API_URL}/${videoId}`, { headers: getAuthHeaders() });
};