import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FiGrid, FiBookOpen, FiClipboard, FiCalendar, FiUsers, FiLogOut, FiFileText, FiX, FiHash
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const navLinks = [
  { icon: FiGrid, name: 'Dashboard', path: '/profile' },
  { icon: FiBookOpen, name: 'Courses', path: '/profile/courses' },
  { icon: FiFileText, name: 'Notes', path: '/profile/notes' },
  { icon: FiCalendar, name: 'Study Plan', path: '/profile/studyplan' },
  { icon: FiUsers, name: 'Discussions', path: '/profile/discussions' },
  { icon: FiHash, name: 'Channels', path: '/profile/channels' },
];

const DashboardSidebar = ({ open, onClose }) => {
  const { logout } = useAuth();

  return (
    <div
      className={`fixed md:static z-40 top-0 left-0 h-full w-64 bg-gradient-to-b from-primary to-primary-light text-white flex flex-col p-4 rounded-r-2xl shadow-lg transform transition-transform duration-300
        ${open ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:block`}
      style={{ minWidth: 256 }}
    >
      {/* Close button for mobile */}
      <div className="flex items-center justify-between p-4 mb-8 md:mb-8">
        <div className="flex items-center space-x-3">
          <div className="bg-white p-3 rounded-lg">
            <FiClipboard className="h-8 w-8 text-primary" />
          </div>
          <span className="text-xl font-bold">Student Portal</span>
        </div>
        <button className="md:hidden p-2 ml-2" onClick={onClose} aria-label="Close sidebar">
          <FiX className="h-6 w-6" />
        </button>
      </div>
      <nav className="flex-1">
        <ul>
          {navLinks.map((link) => (
            <li key={link.name}>
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 p-3 my-1 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? 'bg-white/30 font-semibold'
                      : 'hover:bg-white/20'
                  }`
                }
                end={link.path === '/profile'}
                onClick={onClose}
              >
                <link.icon className="h-5 w-5" />
                <span>{link.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div>
        <button onClick={logout} className="flex w-full items-center space-x-3 p-3 rounded-lg hover:bg-white/20">
          <FiLogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default DashboardSidebar; 