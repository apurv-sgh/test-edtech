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
      console.log('Login attempt for role:', credentials.role);
      
      // Route to appropriate API based on role
      if (credentials.role === 'student') {
        console.log('Using main backend for student login');
        res = await loginStudent(credentials);
      } else if (credentials.role === 'teacher') {
        console.log('Using Teach_Backend for teacher login');
        res = await loginTeacher(credentials);
        // Ensure role is set to teacher in user object
        if (res.data) res.data.role = 'teacher';
      } else {
        // counsellor, industry_expert, etc.
        console.log('Using main backend for counsellor/expert login');
        res = await apiLogin(credentials);
      }
      
      console.log('Login successful for role:', credentials.role);
      setUser(res.data);
      
      // Store appropriate token based on role
      if (credentials.role === 'teacher' && res.data.token) {
        localStorage.setItem('teacherToken', res.data.token);
        console.log('Teacher token stored');
      } else if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        console.log('User token stored');
      }
      
      toast.success('Logged in successfully!');
      return true;
    } catch (err) {
      console.error('Login error for role:', credentials.role, err);
      let msg = 'Login failed';
      if (err.response) {
        if (err.response.data?.message) msg = err.response.data.message;
        else if (typeof err.response.data === 'string') msg = err.response.data;
        else if (err.response.status) msg += ` (Status: ${err.response.status})`;
      } else if (err.message) {
        msg = err.message;
      }
      toast.error(msg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data) => {
    setLoading(true);
    try {
      let res;
      console.log('Registration attempt for role:', data.role);
      
      // Route to appropriate API based on role
      if (data.role === 'student') {
        console.log('Using main backend for student registration');
        res = await registerStudent(data);
      } else if (data.role === 'teacher') {
        console.log('Using Teach_Backend for teacher registration');
        res = await registerTeacher(data);
        // Ensure role is set to teacher in user object
        if (res.data) res.data.role = 'teacher';
      } else {
        // counsellor, industry_expert, etc.
        console.log('Using main backend for counsellor/expert registration');
        res = await apiRegister(data);
      }
      
      console.log('Registration successful for role:', data.role);
      setUser(res.data);

      const normalizeUser = (data) => {
        if (!data) return null;
        return {
          ...data,
          id: data._id || data.id || data.userId || data.uid,
        };
      };

      setUser(normalizeUser(res.data));
      
      
      // Store appropriate token based on role
      if (data.role === 'teacher' && res.data.token) {
        localStorage.setItem('teacherToken', res.data.token);
        console.log('Teacher token stored');
      } else if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        console.log('User token stored');
      }
      
      toast.success('Registration successful!');
      return true;
    } catch (err) {
      console.error('Registration error for role:', data.role, err);
      let msg = 'Registration failed';
      if (err.response?.data?.message) msg = err.response.data.message;
      else if (err.message) msg = err.message;
      toast.error(msg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('teacherToken');
    localStorage.removeItem('token');
    toast.info('Logged out successfully');
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
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout, fetchProfile }}>
      {children}
    </AuthContext.Provider>
  );
}; 