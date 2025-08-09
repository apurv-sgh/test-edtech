import React, { createContext,useContext, useState, useEffect } from 'react';
import { login as apiLogin, register as apiRegister, getProfile } from '../api/auth';
import { toast } from 'react-toastify';

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      return JSON.parse(storedUser);
    }
    return null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // On mount, check if both token and user exist, else clear
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (!(token && storedUser)) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    }
  }, []);

  const setUserManually = (currentUser, token) => {
    setUser(currentUser);
    localStorage.setItem('user', JSON.stringify(currentUser));
    if (token) {
      localStorage.setItem('token', token);
    }
  };

  const login = async (credentials) => {
    setLoading(true);
    try {
      const res = await apiLogin(credentials);
      setUser(res.data.user);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
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

  const register = async ({ data }) => {
    setLoading(true);
    try {
      const res = await apiRegister({ data });
      setUser(res.data.user);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      toast.success('Registered!');
      return true;
    } catch (err) {
      let msg = 'Registration failed';
      if (err.response) {
        if (err.response.data?.message) msg = err.response.data.message;
        else if (typeof err.response.data === 'string') msg = err.response.data;
        else if (err.response.status) msg += ` (Status: ${err.response.status})`;
      } else if (err.message) {
        msg = err.message;
      }
      toast.error(msg);
      console.error('Register error:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    toast.success('Logged out!');
  };

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await getProfile();
      setUser(res.data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, loading, register, logout, fetchProfile, setUserManually }}>
      {children}
    </AuthContext.Provider>
  );
};