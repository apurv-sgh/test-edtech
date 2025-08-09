import React, { useContext } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { FiGrid, FiBook, FiUsers, FiBookOpen, FiCalendar, FiVideo, FiSettings, FiLogOut, FiBookmark, FiClipboard, FiAward } from 'react-icons/fi';
import { FaTrophy } from 'react-icons/fa';

const Sidebar = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/'); // Redirect to home after logout
  };

  const navLinks = [
    { icon: <FiGrid />, text: 'Dashboard', path: '/teacher-dashboard' },
    { icon: <FiBook />, text: 'Courses', path: '/teacher-dashboard/courses' },
    { icon: <FiUsers />, text: 'Communities', path: '/teacher-dashboard/communities' },
    { icon: <FiBookOpen />, text: 'Upload Notes', path: '/teacher-dashboard/upload-notes' },
    { icon: <FiCalendar />, text: 'Upload Videos', path: '/teacher-dashboard/upload-videos' },
    { icon: <FiVideo />, text: 'Live Session', path: '/live-classes' },
    { icon: <FiClipboard />, text: 'Quizzes', path: '/quizzes' },
    { icon: <FiBookmark />, text: 'Test Series', path: '/test-series' },
    { icon: <FiAward />, text: 'Competitions', path: '/competitions' },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-dark-card shadow-lg flex-col hidden lg:flex">
      <nav className="flex-grow p-4 space-y-1">
        {navLinks.map(link => (
          <NavLink
            key={link.text} to={link.path} end
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-slate-600 dark:text-slate-300 font-semibold hover:bg-primary-light dark:hover:bg-slate-700 hover:text-primary dark:hover:text-white ${
                isActive ? 'bg-primary text-white shadow-md' : ''
              }`
            }
          >
            {link.icon} <span>{link.text}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-200 dark:border-slate-700">
        <NavLink to="/teacher-dashboard/settings" className={({ isActive }) => `flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-slate-600 dark:text-slate-300 font-semibold hover:bg-primary-light ${isActive ? 'bg-primary text-white' : ''}`}>
          <FiSettings/> <span>Setting</span>
        </NavLink>
        <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-red-500/10 hover:text-red-500 font-medium mt-1">
          <FiLogOut/> <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
export default Sidebar;