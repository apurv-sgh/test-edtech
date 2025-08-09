// src/components/Navbar.jsx
import React, { useContext } from 'react';
import { Link, NavLink } from 'react-router-dom'; // Use NavLink for active styles
import { FaBookReader } from 'react-icons/fa';
import ThemeToggle from './ThemeToggle';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const activeLinkStyle = {
        color: '#5846E0', // primary color
        fontWeight: '600',
    };
    const { user, logout } = useContext(AuthContext) || {};

    return (
        <header className="bg-neutral-light/80 backdrop-blur-sm sticky top-0 z-50">
            <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-slate-800 dark:text-white">
          <FaBookReader className="text-primary" />
          EdTech
        </Link>
        <div className="hidden md:flex items-center space-x-8 text-slate-600 dark:text-slate-300 font-medium">
          <NavLink to="/" className={({ isActive }) => isActive ? 'text-primary font-semibold' : 'hover:text-primary'}>Home</NavLink>
          <NavLink to="/features" className={({ isActive }) => isActive ? 'text-primary font-semibold' : 'hover:text-primary'}>Features</NavLink>
          <NavLink to="/contact" className={({ isActive }) => isActive ? 'text-primary font-semibold' : 'hover:text-primary'}>Contact</NavLink>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {user ? (
            <>
              <span className="text-slate-700 dark:text-slate-200 font-medium">Hi, {user.name || user.email}</span>
              <button onClick={logout} className="bg-red-500 text-white px-5 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="hidden sm:block text-slate-600 dark:text-slate-300 hover:text-primary font-medium">Login</Link>
              <Link to="/signup" className="bg-primary text-white px-5 py-2 rounded-lg font-semibold hover:bg-primary-focus transition-colors">Sign up</Link>
            </>
          )}
        </div>
      </nav>
        </header>
    );
};

export default Navbar;