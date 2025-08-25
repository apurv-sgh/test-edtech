import React, { useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { FaBookReader } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Header = () => {
   const { user, logout } = useContext(AuthContext);
   const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.info('You have been logged out.');
    navigate('/');
  };
  return (
    <header className="bg-white/90 dark:bg-dark-bg/90 backdrop-blur-sm sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800">
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
        
        {/* Dynamically Render the buttons based on login state */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {user ? (
            <>
              {/* <NavLink to="/profile" className="hidden sm:block text-slate-600 dark:text-slate-300 hover:text-primary font-medium">
                {user.name ||user.user.name|| 'Profile'}
              </NavLink> */}
              <NavLink 
                to={user.role === 'teacher' ? '/teacher-dashboard' : '/profile'} 
                className="font-semibold text-slate-700 dark:text-slate-200 hidden sm:inline hover:text-primary dark:hover:text-primary"
              >
                {user?.name ||user?.user?.name|| 'Profile'}
              </NavLink>

              <button onClick={handleLogout} className="bg-primary text-white px-5 py-2 rounded-lg font-semibold hover:bg-primary-focus transition-colors">
                Logout
              </button>
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

export default Header;