import axios from 'axios';

const apit = axios.create({
  baseURL: 'http://localhost:4000',
  // withCredentials: true, // Set to true if using cookies/auth
});

// import axios from 'axios';
// import { toast } from 'react-toastify';

// const apit = axios.create({
//   baseURL: '/api', // This is CORRECT. It matches the '/api' prefix in server.js
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// A helper function to get the authentication token from localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Add this interceptor:
apit.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('teacherToken');
    if (user && token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(token);
    return config;
  },
  (error) => Promise.reject(error)
);

export default apit; 