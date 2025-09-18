import axios from 'axios';

// More reliable way to detect production vs development
const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';

console.log('api.js - isProduction:', isProduction);
console.log('api.js - window.location.hostname:', window.location.hostname);

// Development backend on localhost
const envBaseURL = 'http://localhost:5000';

// Deployed backend on Render (default)
const renderBase = 'https://zegnite-backend2.onrender.com';

// Force production backend unless explicitly overridden via env
 const baseURL= isProduction ? renderBase : envBaseURL;

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

console.log('api.js - baseURL set to:', baseURL);

// Add request interceptor for better error handling
api.interceptors.request.use(
  async (config) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('api.js - Making request to:', config.url);
      console.log('api.js - Full URL:', (config.baseURL || baseURL) + config.url);
    }
    await new Promise((resolve) => setTimeout(resolve, 300))
    const user = (localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    
    if (user && token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 404) {
      console.error('API endpoint not found. Check if the backend is running and the endpoint exists.');
    }
    return Promise.reject(error);
  }
);

export default api;