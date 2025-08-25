import axios from 'axios';

const API_URL = 'http://localhost:4000/api/notes';

// A helper function to get the authentication token from localStorage
const getAuthHeaders = (isFormData = false) => {
  // Use teacherToken if available, otherwise fallback to token
  const token = localStorage.getItem('teacherToken') || localStorage.getItem('token');
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  // Let browser set Content-Type for FormData
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
};

// POST /api/notes/my-notes
export const getNotes = () => {
  return axios.get(`${API_URL}/my-notes`, { headers: getAuthHeaders() });
};

// POST /api/notes/upload
export const uploadNote = (formData) => {
  return axios.post(`${API_URL}/upload`, formData, { headers: getAuthHeaders(true) });
};

// The download URL is constructed directly, as it's a simple GET request for a file
export const getDownloadUrl = (noteId, fileIndex = 0) => {
  return `${API_URL}/download/${noteId}/${fileIndex}`;
};

// DELETE /api/notes/:id
export const deleteNote = (noteId) => {
  return axios.delete(`${API_URL}/${noteId}`, { headers: getAuthHeaders() });
};