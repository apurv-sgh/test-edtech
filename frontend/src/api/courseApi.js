import axios from 'axios';

const API_URL = 'http://localhost:4000/api/courses';

const getAuthHeaders = () => {
  // Use teacherToken if available, otherwise fallback to token
  const token = localStorage.getItem('teacherToken') || localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// API functions that match your backend routes

// GET /api/courses/my-courses
export const getMyCourses = () => {
  return axios.get(`${API_URL}/my-courses`, { headers: getAuthHeaders() });
};

// POST /api/courses/create
export const createCourse = (courseData) => {
  // The payload here matches the fields in your backend's create function
  const payload = {
    title: courseData.title,
    description: courseData.description,
    subjects: courseData.subjects,
    category: courseData.category,
    level: courseData.level,
    duration: courseData.duration,
    tags: courseData.tags
  };
  return axios.post(`${API_URL}/create`, payload, { headers: getAuthHeaders() });
};

// PUT /api/courses/:courseId
export const updateCourse = (courseId, courseData) => {
  const payload = {
    title: courseData.title,
    description: courseData.description,
    category: courseData.category,
    level: courseData.level,
  };
  return axios.put(`${API_URL}/${courseId}`, payload, { headers: getAuthHeaders() });
};

// DELETE /api/courses/:courseId
export const deleteCourse = (courseId) => {
  return axios.delete(`${API_URL}/${courseId}`, { headers: getAuthHeaders() });
};