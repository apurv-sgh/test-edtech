import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apit from '../api/apit';
import { FaBookReader } from 'react-icons/fa';
import Navbar from '../components/Navbar';


const TeacherLogin = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { email, password } = form;
    
    console.log("Attempting to log in as teacher...");

    try {
      const response = await apit.post('/api/teachers/login', { email, password });

      const { token, teacher } = response.data;

      if (token) {
        // Store teacher-specific token
        localStorage.setItem('teacherToken', token);
        // Store user data with teacher role
        localStorage.setItem('user', JSON.stringify({ 
          id: teacher.id,
          name: teacher.name, 
          email: teacher.email, 
          role: 'teacher' 
        }));
        
        // Navigate to teacher dashboard
        window.location.href = '/teacher-dashboard'; 
      } else {
        // This will catch cases where the server responds with 200 OK but no token.
        throw new Error("Login response was successful but did not contain a token.");
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
        {/* <div className="absolute top-4 right-4"><ThemeToggle /></div> */}
        <div className="w-full max-w-md bg-white dark:bg-dark-card p-8 rounded-xl shadow-lg">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold">Teacher Login</h2>
          </div>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium">Email Address</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} required className="w-full mt-1 px-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg"/>
            </div>
            <div>
              <label className="block text-sm font-medium">Password</label>
              <input name="password" type="password" value={form.password} onChange={handleChange} required className="w-full mt-1 px-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg"/>
            </div>
            {error && <p className="text-sm text-red-500 text-center">{error}</p>}
            <button type="submit" disabled={loading} className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-focus transition-colors">
              {loading ? 'Logging In...' : 'Log In as Teacher'}
            </button>
          </form>
          <div className="text-center mt-6">
            <p className="text-sm text-slate-500">Not a teacher? <Link to="/login" className="font-semibold text-primary">Login as a student</Link></p>
            <p className="text-sm text-slate-500 mt-2">New teacher? <Link to="/teacher-signup" className="font-semibold text-primary">Sign up here</Link></p>
          </div>
        </div>
      </div>
    </>
  );
};
export default TeacherLogin;