import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
  //withCredentials: true, // Set to true if using cookies/auth
});

// Add this interceptor:
api.interceptors.request.use(
 async (config) => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    if (user && token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(token);
    return config;
  },
  (error) => Promise.reject(error)
);

export default api; 