import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const CounsellorLogin = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const success = await login({ ...form, role: 'counsellor' });
    if (success) {
      navigate('/become-counsellor');
    } else {
      setError('Login failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-primary-light dark:bg-dark-bg p-4">
      <div className="w-full max-w-md bg-white dark:bg-dark-card p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6 text-center">Counsellor Login</h2>
        {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Email Address</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} required className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Password</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} required className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg" />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-focus transition-colors">{loading ? 'Logging In...' : 'Log In as Counsellor'}</button>
        </form>
        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
          New to EdTech? <span className="font-semibold text-primary hover:underline cursor-pointer" onClick={() => navigate('/counsellor/register')}>Register as Counsellor</span>
        </p>
      </div>
    </div>
  );
};

export default CounsellorLogin; 