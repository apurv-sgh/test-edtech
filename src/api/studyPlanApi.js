// src/api/studyPlanApi.js
import axios from 'axios';

// This must match the port your main backend is running on.
const API_URL = createStudyPlan; 

// This helper function gets the auth token from localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// These functions now match your backend routes and include the auth token
export const getStudyPlans = () => axios.get(API_URL, { headers: getAuthHeaders() });

export const createStudyPlan = (planData) => {
  // The payload now perfectly matches your Mongoose schema and controller
  return axios.post(API_URL, planData, { headers: getAuthHeaders() });
};

export const updateStudyPlan = (id, planData) => {
  return axios.put(`${API_URL}/${id}`, planData, { headers: getAuthHeaders() });
};

export const deleteStudyPlan = (id) => {
  return axios.delete(`${API_URL}/${id}`, { headers: getAuthHeaders() });
};