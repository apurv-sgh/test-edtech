import React, { useContext } from 'react';
import { FiSearch, FiBell, FiMenu, FiHome } from 'react-icons/fi';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import ThemeToggle from '../ThemeToggle';
import StudentProfilePic from '../../assets/student-profile.jpg';

const DashboardHeader = ({ onMenuClick }) => {
  const { user } = useContext(AuthContext);
  
  // Backend URL configuration
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const backendUrl = isLocalhost ? 'http://localhost:5000' : 'https://zegnite-backend2.onrender.com';

  return (
    <header className="flex items-center justify-between p-4 bg-white dark:bg-dark-card border-b border-slate-200 dark:border-slate-700">
      <div className="flex items-center w-full max-w-xs">
        {/* Hamburger menu for mobile */}
        <button className="md:hidden mr-3" onClick={onMenuClick} aria-label="Open sidebar">
          <FiMenu className="h-6 w-6 text-gray-700 dark:text-gray-300" />
        </button>
        {/* Back to Home button */}
        <Link
        to="/"
        className="flex-shrink-0 flex items-center mr-6 text-primary hover:text-primary-focus font-semibold whitespace-nowrap"
      >
        <FiHome className="h-6 w-6 mr-1" />
      </Link>
        
      </div>
      <div className="flex items-center space-x-4">
        <FiBell className="text-gray-600 dark:text-gray-400 h-6 w-6 cursor-pointer" />
        <ThemeToggle />
        <div className="flex items-center space-x-2">
          <img
            src={user?.profilePicture ? (user.profilePicture.startsWith('http') ? user.profilePicture : `${backendUrl}${user.profilePicture}`) : user?.profilePic || StudentProfilePic}
            alt={user?.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold text-sm text-slate-800 dark:text-white">{user?.name || 'Student'}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{user?.role || ''}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader; 