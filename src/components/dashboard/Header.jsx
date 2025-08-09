import React, { useContext } from 'react';
import { FiSearch, FiBell, FiMenu, FiHome } from 'react-icons/fi';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import ThemeToggle from '../ThemeToggle';

const DashboardHeader = ({ onMenuClick }) => {
  const { user } = useContext(AuthContext);

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
        <span className="hidden sm:inline">Back to Home</span>
      </Link>
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-full bg-gray-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-light"
          />
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <FiBell className="text-gray-600 dark:text-gray-400 h-6 w-6 cursor-pointer" />
        <ThemeToggle />
        <div className="flex items-center space-x-2">
          <img
            src={`https://i.pravatar.cc/150?u=${user?.email}`}
            alt={user?.name}
            className="w-10 h-10 rounded-full"
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