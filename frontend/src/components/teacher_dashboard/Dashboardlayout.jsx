import React, { useContext, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar'; 
import { FiSearch, FiBell } from 'react-icons/fi';
import { AuthContext } from '../../context/AuthContext';
import Navbar from '../Navbar';

const DashboardLayout = () => {
  const { user } = useContext(AuthContext);
  const [showNotifications, setShowNotifications] = useState(false);
  // Example notifications (replace with real data or API call)
  const notifications = [
    { id: 1, text: 'New student enrolled in your course.' },
    { id: 2, text: 'Assignment submitted by Alex Sims.' },
    { id: 3, text: 'Live class scheduled for tomorrow.' },
  ];

  return (
    <>
      <Navbar />
      <div className="flex h-screen bg-slate-50 dark:bg-dark-bg text-slate-800 dark:text-slate-200 font-sans">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Bar */}
          <header className="bg-white dark:bg-dark-card shadow-sm p-4 flex-shrink-0">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Dashboard</h1>
            <div className="flex items-center gap-4 relative">
              <button
                className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 relative"
                onClick={() => setShowNotifications((prev) => !prev)}
              >
                <FiBell className="text-slate-600 dark:text-slate-300" />
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>
              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-12 top-12 w-80 bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg z-50">
                  <div className="p-4 border-b border-slate-100 dark:border-slate-700 font-bold">Notifications</div>
                  <ul className="max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700">
                    {notifications.length === 0 ? (
                      <li className="p-4 text-slate-500 text-center">No notifications</li>
                    ) : (
                      notifications.map((n) => (
                        <li key={n.id} className="p-4 hover:bg-primary/10 dark:hover:bg-primary/20 cursor-pointer text-slate-700 dark:text-slate-200">
                          {n.text}
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              )}
              <img
                src={user?.profilePicPreview || `https://placehold.co/40x40/A78BFA/FFFFFF?text=${user?.name ? user.name.charAt(0).toUpperCase() : 'T'}`}
                alt="User Avatar"
                className="w-10 h-10 rounded-full object-cover"
              />
            </div>
          </div>
        </header>
        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
    </>
  );
};

export default DashboardLayout;