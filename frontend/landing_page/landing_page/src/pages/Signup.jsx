import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBookReader } from 'react-icons/fa';
import ThemeToggle from '../components/ThemeToggle';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import axios from "axios";

const SignUp = () => {
  const [role, setRole] = useState('student');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const { setUserManually } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isStudent = role === 'student';
    const endpoint = isStudent
      ? 'https://zegnite-sdi-c-1.onrender.com/api/auth/register'
      : 'http://127.0.0.1:4000/api/teachers/register';
    console.log(role, endpoint)
    console.log("Sending to backend:", form);
    try {
      const response = await axios.post(endpoint, {
        name: form.name,
        email: form.email,
        password: form.password,
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const { token, user } = response.data;
      localStorage.setItem("token", token);

      if (isStudent) {
        setUserManually(user, token);
        navigate('/');
      }
      else {
        window.location.href = `http://localhost:5174/?token=${token}`;
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Registration failed";
      console.error(errorMessage);
      alert(errorMessage);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center bg-primary-light dark:bg-dark-bg p-4">
        <div className="absolute top-4 right-4"><ThemeToggle /></div>
        <div className="w-full max-w-md bg-white dark:bg-dark-card p-8 rounded-xl shadow-lg">
          <div className="text-center mb-8">
            <Link to="/" className="flex justify-center items-center gap-2 text-2xl font-bold text-slate-800 dark:text-white mb-2">
              <FaBookReader className="text-primary" /> EdTech
            </Link>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Create Your Account</h2>
          </div>

          <div className="bg-slate-100 dark:bg-slate-700 p-1 rounded-lg flex justify-around mb-6">
            <button onClick={() => setRole('student')} className={`w-1/2 py-2 rounded-md font-semibold transition-colors ${role === 'student' ? 'bg-primary text-white' : 'text-slate-500'}`}>Student</button>
            <button onClick={() => setRole('teacher')} className={`w-1/2 py-2 rounded-md font-semibold transition-colors ${role === 'teacher' ? 'bg-primary text-white' : 'text-slate-500'}`}>Teacher</button>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Full Name</label>
              <input name="name" type="text" value={form.name} onChange={handleChange} placeholder="John Doe" className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Email Address</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Password</label>
              <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="••••••••" className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg" required />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-focus transition-colors">{loading ? 'Signing Up...' : 'Sign Up →'}</button>
          </form>
          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
            Already have an account? <Link to="/login" className="font-semibold text-primary hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default SignUp;
