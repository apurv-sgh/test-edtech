import axios from 'axios';
import apit from './apit';

const API_URL = `${apit.defaults.baseURL}/api/courses`;
// const API_URL = `https://zegnite-teach-back-oini.onrender.com/api/courses`;

const getAuthHeaders = () => {
  // Use teacherToken if available, otherwise fallback to token
  const token = localStorage.getItem('teacherToken') || localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// API functions that match your backend routes

// GET /api/courses/my-courses
export const getMyCourses = () => {
  const url = `${API_URL}/my-courses`;
  const headers = getAuthHeaders();
  console.log('[courseApi] GET', url, 'headers:', headers);
  return axios.get(url, { headers });
};

// POST /api/courses/create (Teach backend)
export const createCourse = (courseData) => {
  // The payload here matches the fields in your backend's create function
  const payload = {
    title: courseData.title,
    description: courseData.description,
    category: courseData.category,
    subject: courseData.subject,
    level: courseData.level,
    duration: courseData.duration,
    price: courseData.price,
    thumbnail: courseData.thumbnail
  };
  const url = `${API_URL}/create`;
  const headers = getAuthHeaders();
  console.log('[courseApi] POST', url, 'headers:', headers, 'payload:', payload);
  return axios.post(url, payload, { headers });
};

// PUT /api/courses/:courseId
export const updateCourse = (courseId, courseData) => {
  const payload = {
    title: courseData.title,
    description: courseData.description,
    category: courseData.category,
    level: courseData.level,
  };
  const url = `${API_URL}/${courseId}`;
  const headers = getAuthHeaders();
  console.log('[courseApi] PUT', url, 'headers:', headers, 'payload:', payload);
  return axios.put(url, payload, { headers });
};

// DELETE /api/courses/:courseId
export const deleteCourse = (courseId) => {
  const url = `${API_URL}/${courseId}`;
  const headers = getAuthHeaders();
  console.log('[courseApi] DELETE', url, 'headers:', headers);
  return axios.delete(url, { headers });
};