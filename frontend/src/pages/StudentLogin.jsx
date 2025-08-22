import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaBookReader } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import ThemeToggle from '../components/ThemeToggle';

const StudentLogin = () => {
  // --- STATE IS 100% LOCAL TO THIS COMPONENT ---
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // This function updates the local state as the user types.
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // --- THIS IS THE DEFINITIVE FIX ---
  // The API call logic is now directly inside this component and is self-reliant.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // 1. Get the data directly from the component's state.
    const { email, password } = form;
    if (!email || !password) {
      alert('Please fill out both email and password fields.');
      setLoading(false);
      return;
    }

    // 2. Define the correct student endpoint.
    const endpoint = 'http://127.0.0.1:5000/api/auth/login';
    
    console.log("Attempting to log in as student...");
    console.log("Sending to:", endpoint);
    console.log("Payload:", { email, password });

    try {
      // 3. Make the API call with the form data.
      const response = await axios.post(endpoint, { email, password });

      const { token, user } = response.data;

      // 4. On success, store the credentials and navigate.
      if (token && user) {
        localStorage.setItem('token', token);
        // We must add the 'role' to the user object for other pages to work.
        localStorage.setItem('user', JSON.stringify({ ...user, role: 'student' }));
        
        // This is a very robust way to navigate after login.
        // It forces a full page refresh, ensuring all components (like the Header)
        // re-read the new localStorage data and update their state correctly.
        setTimeout(() => {
        window.location.href = '/'; 
        }, 100);
      } else {
        throw new Error("Login response was missing token or user data.");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Login failed. Please check your credentials and try again.";
      console.error("Login Error:", err.response || err);
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-primary-light dark:bg-dark-bg p-4">
        <div className="absolute top-4 right-4"><ThemeToggle /></div>
        <div className="w-full max-w-md bg-white dark:bg-dark-card p-8 rounded-xl shadow-lg">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold">Student Login</h2>
          </div>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium">Email Address</label>
              <input 
                name="email" 
                type="email" 
                value={form.email} 
                onChange={handleChange} 
                required 
                className="w-full mt-1 px-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Password</label>
              <input 
                name="password" 
                type="password" 
                value={form.password} 
                onChange={handleChange} 
                required 
                className="w-full mt-1 px-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg"
              />
            </div>
            {error && <p className="text-sm text-red-500 text-center">{error}</p>}
            <button type="submit" disabled={loading} className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-focus transition-colors">
              {loading ? 'Logging In...' : 'Log In'}
            </button>
          </form>
          <div className="text-center mt-6">
            <p className="text-sm text-slate-500">New student? <Link to="/signup" className="font-semibold text-primary">Sign up</Link></p>
            <p className="text-sm text-slate-500 mt-2">Are you a teacher? <Link to="/teacher-login" className="font-semibold text-primary">Login here</Link></p>
          </div>
        </div>
      </div>
    </>
  );
};
export default StudentLogin;