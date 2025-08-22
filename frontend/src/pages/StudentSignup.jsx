import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaBookReader } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import ThemeToggle from '../components/ThemeToggle';

const StudentSignUp = () => {
  // --- STATE IS NOW LOCAL TO THIS COMPONENT ---
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // This function updates the local state as the user types.
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // --- THIS IS THE DEFINITIVE FIX ---
  // The API call logic is now directly inside this component.
  // It is self-contained and does not rely on any external context.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { name, email, password } = form;

    // 1. Define the correct student signup endpoint.
    const endpoint = 'http://127.0.0.1:5000/api/auth/register';
    
    console.log("Attempting to sign up as student...");
    console.log("Sending to:", endpoint);
    console.log("Payload:", { name, email, password });

    try {
      // 2. Make the API call with the form data.
      const response = await axios.post('http://127.0.0.1:5000/api/auth/register', { name, email, password });

      const { token, user } = response.data;

      // 3. On success, store the credentials and navigate.
      if (token && user) {
        localStorage.setItem('token', token);
        // We add the 'role' to the user object for other pages to work.
        localStorage.setItem('user', JSON.stringify({ ...user, role: 'student' }));
        
        // Force a full page reload to the home page to update all components.
        window.location.href = '/'; 
      } else {
        throw new Error("Signup response was missing token or user data.");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Registration failed. Please try again.";
      console.error("Signup Error:", err.response || err);
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
            <h2 className="text-2xl font-bold">Create a Student Account</h2>
          </div>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium">Full Name</label>
              <input name="name" type="text" value={form.name} onChange={handleChange} required className="w-full mt-1 px-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg"/>
            </div>
            <div>
              <label className="block text-sm font-medium">Email Address</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} required className="w-full mt-1 px-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg"/>
            </div>
            <div>
              <label className="block text-sm font-medium">Password</label>
              <input name="password" type="password" value={form.password} onChange={handleChange} required className="w-full mt-1 px-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg"/>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-focus">
              {loading ? 'Signing Up...' : 'Sign Up'}
            </button>
          </form>
          <div className="text-center mt-6">
            <p className="text-sm text-slate-500">Already have an account? <Link to="/login" className="font-semibold text-primary">Login</Link></p>
            <p className="text-sm text-slate-500 mt-2">Are you a teacher? <Link to="/teacher-signup" className="font-semibold text-primary">Sign up here</Link></p>
          </div>
        </div>
      </div>
    </>
  );
};
export default StudentSignUp;