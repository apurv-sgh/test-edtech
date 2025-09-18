import axios from 'axios';

// More reliable way to detect production vs development
const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';

console.log('apit.js - isProduction:', isProduction);
console.log('apit.js - window.location.hostname:', window.location.hostname);

const apit = axios.create({
  // Use localhost for development, deployed URL for production
  baseURL: isProduction 
    ? 'https://zegnite-teach-back-oini.onrender.com' 
    : 'http://localhost:4000',
  withCredentials: true, // Set to true if using cookies/auth
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

console.log('apit.js - baseURL set to:', apit.defaults.baseURL);

// Add request interceptor for better error handling
apit.interceptors.request.use(
  (config) => {
    console.log('🔍 apit.js - Making request to:', config.url);
    console.log('🔍 apit.js - Full URL:', config.baseURL + config.url);
    console.log('🔍 apit.js - Config object:', config);
    console.log('🔍 apit.js - Request method:', config.method);
    console.log('🔍 apit.js - Request headers:', config.headers);
    const token = localStorage.getItem('teacherToken') || localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for better error handling
apit.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 404) {
      console.error('API endpoint not found. Check if the backend is running and the endpoint exists.');
    }
    return Promise.reject(error);
  }
);

export default apit; 