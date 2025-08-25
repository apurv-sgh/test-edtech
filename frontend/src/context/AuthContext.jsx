import React, { createContext,useContext, useState, useEffect } from 'react';
import { loginStudent, loginTeacher, registerStudent, registerTeacher, getProfile, login as apiLogin, register as apiRegister} from '../api/auth';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')) || null);
  const [loading, setLoading] = useState(false);
  const Navigate = useNavigate();

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }, [user]);

  const login = async (credentials) => {
    setLoading(true);
    try {
      let res;
      // Use different endpoints based on role
      if (credentials.role === 'student' ) {
        res = await loginStudent(credentials);
      }else if (credentials.role === 'teacher') {
        res = await loginTeacher(credentials);
        // Ensure role is set to teacher in user object
        if (res.data) res.data.role = 'teacher';
      } else {
        res = await apiLogin(credentials);
      }
      
      setUser(res.data);
      if (credentials.role === 'teacher' && res.data.token) {
        localStorage.setItem('teacherToken', res.data.token);
      }
      toast.success('Logged in!');
      return true;
    } catch (err) {
      let msg = 'Login failed';
      if (err.response) {
        if (err.response.data?.message) msg = err.response.data.message;
        else if (typeof err.response.data === 'string') msg = err.response.data;
        else if (err.response.status) msg += ` (Status: ${err.response.status})`;
      } else if (err.message) {
        msg = err.message;
      }
      toast.error(msg);
      console.error('Login error:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data) => {
    setLoading(true);
    try {
      let res;
      // Use different endpoints based on role
      if (data.role === 'student') {
        res = await registerStudent(data);
      } else if (data.role === 'teacher') {
        res = await registerTeacher(data);
        // Ensure role is set to teacher in user object
        if (res.data) res.data.role = 'teacher';
      } else {
        res = await apiRegister(data);
      }
      
      setUser(res.data);
      if (data.role === 'teacher' && res.data.token) {
        localStorage.setItem('teacherToken', res.data.token);
      }
      toast.success('Registered!');
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('teacherToken');
    toast.info('Logged out');
    Navigate('/');
  };

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await getProfile();
      setUser(res.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, fetchProfile }}>
      {children}
    </AuthContext.Provider>
  );
}; 