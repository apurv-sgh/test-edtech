import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FaBookReader } from 'react-icons/fa';
import ThemeToggle from '../components/ThemeToggle';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const SignUp = () => {
  const [searchParams] = useSearchParams();
  const [role, setRole] = useState('student');
  const [subRole, setSubRole] = useState('counsellor'); // For counsellor/expert tab
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  // Check for role parameter in URL
  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam === 'teacher' || roleParam === 'student'|| roleParam === 'counsellor' || roleParam === 'industry_expert') {
      if (roleParam === 'industry_expert') {
        setRole('counsellor_expert');
        setSubRole('industry_expert');
      } else if (roleParam === 'counsellor') {
        setRole('counsellor_expert');
        setSubRole('counsellor');
      } else {
        setRole(roleParam);
      }
    }
  }, [searchParams]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let regRole = role;
    if (role === 'counsellor_expert') regRole = subRole;
    const success = await register({ ...form, role: regRole });
    if (success) {
      if (regRole === 'industry_expert') {
        // Check if profile exists
        try {
          const user = JSON.parse(localStorage.getItem('user'));
          const res = await fetch('http://localhost:5000/api/industry-experts/me', {
            headers: { Authorization: `Bearer ${user.token}` }
          });
          if (res.ok) {
            const data = await res.json();
            if (data && data.status) {
              navigate('/industry-experts/dashboard');
            } else {
              navigate('/become-industry-expert');
            }
          } else {
            navigate('/become-industry-expert');
          }
        } catch {
          navigate('/become-industry-expert');
        }
      } else if (regRole === 'teacher') {
        navigate('/teachers');
      } else if (regRole === 'student') {
        navigate('/profile');
      } else if (regRole === 'counsellor') {
        navigate('/become-counsellor');
      } else {
        navigate('/');
      }
    }
  };

  return (
    <>
    <Navbar/>
    <div className="min-h-screen flex flex-col items-center justify-center bg-primary-light dark:bg-dark-bg p-4">
        <div className="absolute top-4 right-4"><ThemeToggle /></div>
      <div className="w-full max-w-md bg-white dark:bg-dark-card p-8 rounded-xl shadow-lg">
        <div className="text-center mb-8">
           <Link to="/" className="flex justify-center items-center gap-2 text-2xl font-bold text-slate-800 dark:text-white mb-2">
            <FaBookReader className="text-primary" /> EdTech
          </Link>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Create Your Account</h2>
        </div>
        
        <div className="bg-slate-100 dark:bg-slate-700 p-1 rounded-lg flex flex-col items-center mb-6">
  <div className="w-full flex justify-around">
    <button onClick={() => setRole('student')} className={`w-1/3 py-2 rounded-md font-semibold transition-colors text-xs sm:text-sm ${role === 'student' ? 'bg-primary text-white' : 'text-slate-500'}`}>Student</button>
    <button onClick={() => setRole('teacher')} className={`w-1/3 py-2 rounded-md font-semibold transition-colors text-xs sm:text-sm ${role === 'teacher' ? 'bg-primary text-white' : 'text-slate-500'}`}>Teacher</button>
    <button onClick={() => setRole('counsellor_expert')} className={`w-1/3 py-2 rounded-md font-semibold transition-colors text-xs sm:text-sm ${role === 'counsellor_expert' ? 'bg-primary text-white' : 'text-slate-500'}`}>Counsellor/Expert</button>
  </div>
  {role === 'counsellor_expert' && (
    <div className="w-3/4 flex flex-col items-center mt-4 mb-2">
      <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Select Role</label>
      <div className="relative w-full">
        <select
          value={subRole}
          onChange={e => setSubRole(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-primary bg-white dark:bg-slate-800 text-slate-800 dark:text-white font-semibold shadow focus:ring-2 focus:ring-primary focus:border-primary appearance-none transition-colors"
        >
          <option value="counsellor">🧑‍💼 Counsellor</option>
          <option value="industry_expert">💡 Industry Expert</option>
        </select>
        <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-primary">▼</span>
      </div>
    </div>
  )}
</div>
        <div className={role === 'counsellor_expert' ? 'mt-10' : ''}>
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
        </div>
        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
          Already have an account? <Link to="/login" className="font-semibold text-primary hover:underline">Log in</Link>
        </p>
      </div>
    </div>
    </>
  );
};

export default SignUp;