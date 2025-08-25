import React, { useContext, useState } from 'react';
import { FiUsers, FiBook, FiVideo, FiDollarSign, FiFileText, FiSearch, FiClock, FiActivity  } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';

// --- DUMMY DATA for the activity page ---
const dummyActivities = [
  // Upcoming
  { id: 1, type: 'quiz', title: 'Calculus Quiz - Chapter 3', date: '2025-08-01T17:00:00Z', status: 'upcoming' },
  { id: 2, type: 'live', title: 'Live Session: Quantum Mechanics Q&A', date: '2025-08-03T18:30:00Z', status: 'upcoming' },
  // History
  { id: 3, type: 'video', title: 'Introduction to Organic Chemistry', date: '2025-07-20T10:00:00Z', status: 'history' },
  { id: 4, type: 'note', title: 'Modern History - Full Notes PDF', date: '2025-07-18T15:00:00Z', status: 'history' },
  { id: 5, type: 'live', title: 'Live Session: JEE Physics Strategy', date: '2025-07-15T19:00:00Z', status: 'history' },
  { id: 6, type: 'video', title: 'Solving Advanced Limits', date: '2025-07-12T11:00:00Z', status: 'history' },
];

const activityCategories = [
  { key: 'upcoming', label: 'Upcoming Events', icon: <FiClock/> },
  { key: 'video', label: 'Video History', icon: <FiVideo/> },
  { key: 'note', label: 'Notes History', icon: <FiFileText/> },
  { key: 'live', label: 'Live Session History', icon: <FiClock/> },
];

// Reusable Activity Card
const ActivityCard = ({ item }) => {
  const typeStyles = {
    quiz: { icon: <FiActivity/>, color: 'text-amber-500 bg-amber-500/10' },
    live: { icon: <FiClock/>, color: 'text-red-500 bg-red-500/10' },
    video: { icon: <FiVideo/>, color: 'text-sky-500 bg-sky-500/10' },
    note: { icon: <FiFileText/>, color: 'text-emerald-500 bg-emerald-500/10' },
  };
  const style = typeStyles[item.type] || {};
  return (
    <div className="bg-white dark:bg-dark-card p-4 rounded-xl shadow-md flex items-center gap-4">
      <div className={`p-3 rounded-lg ${style.color}`}>
        {style.icon}
      </div>
      <div className="flex-grow">
        <h3 className="font-bold text-slate-800 dark:text-white">{item.title}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {new Date(item.date).toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
      <Link to="#" className="font-semibold text-primary hover:underline text-sm">View</Link>
    </div>
  );
};

// --- Reusable Components for the Dashboard Widgets ---
const StatCard = ({ icon, value, label, color }) => (
  <div className="bg-white dark:bg-dark-card p-5 rounded-xl shadow-md flex items-center gap-4">
    <div className={`p-3 rounded-full ${color.bg}`}>
      <div className={`text-2xl ${color.text}`}>{icon}</div>
    </div>
    <div>
      <p className="text-2xl font-bold text-slate-800 dark:text-white">{value}</p>
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
    </div>
  </div>
);

const StudentQuery = ({ name, query }) => (
  <div className="flex items-center justify-between p-3 hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-lg">
    <div className="flex items-center gap-3">
      <img src={`https://placehold.co/40x40/6366f1/ffffff?text=${name.charAt(0)}`} alt={name} className="w-10 h-10 rounded-full"/>
      <div>
        <p className="font-semibold text-slate-800 dark:text-white text-sm">{query}</p>
        <p className="text-xs text-slate-500">{name}</p>
      </div>
    </div>
    <div className="flex gap-2">
      <button className="text-xs text-red-500 font-semibold hover:underline">Decline</button>
      <button className="text-xs text-primary font-semibold bg-primary/10 py-1 px-3 rounded-full hover:bg-primary/20">View Details</button>
    </div>
  </div>
);

const TeacherDashboard = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredActivities = dummyActivities.filter(item => {
    const matchesTab = activeTab === 'upcoming' ? item.status === 'upcoming' : item.type === activeTab && item.status === 'history';
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // Protected view for teachers only
  if (user?.role !== 'teacher') {
    return (
      <div className="text-center py-20 min-h-screen">
        <h1 className="text 3xl font-bold">Access Denied</h1>
        <p className="mt-2 text-slate-500">Only teachers can view this page.</p>
        <Link to='/' className="text-primary mt-4 inline-block font-semibold">← Go Back Home</Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Row: Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<FiUsers/>} value="40k" label="Total students" color={{bg: 'bg-green-500/10', text: 'text-green-500'}} />
        <StatCard icon={<FiBook/>} value="45" label="Courses" color={{bg: 'bg-sky-500/10', text: 'text-sky-500'}} />
        <StatCard icon={<FiVideo/>} value="120" label="Total Videos" color={{bg: 'bg-red-500/10', text: 'text-red-500'}} />
        <StatCard icon={<FiDollarSign/>} value="$3200" label="Total Earning" color={{bg: 'bg-amber-500/10', text: 'text-amber-500'}} />
      </div>

      {/* Your Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sidebar: Filters */}
        <aside className="lg:col-span-1">
          <div className="bg-white dark:bg-dark-card p-4 rounded-xl shadow-lg sticky top-24">
            <div className="relative mb-4">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
              <input type="text" placeholder="Search activities..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800/50 rounded-lg"/>
            </div>
            <nav className="space-y-2">
              {activityCategories.map(cat => (
                <button
                  key={cat.key}
                  onClick={() => setActiveTab(cat.key)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg font-semibold text-left transition-colors
                    ${activeTab === cat.key ? 'bg-primary text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-primary-light/50 dark:hover:bg-slate-700/50'}`
                  }
                >
                  {cat.icon} {cat.label}
                </button>
              ))}
            </nav>
          </div>
        </aside>

{/* Right Content: Activity List */}
        <main className="lg:col-span-3">
          <motion.div layout className="space-y-4">
            <AnimatePresence>
              {filteredActivities.length > 0 ? (
                filteredActivities.map(item => (
                  <motion.div
                    key={item.id} layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <ActivityCard item={item} />
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-16 bg-white dark:bg-dark-card rounded-xl">
                  <h3 className="text-xl font-semibold">No Activity Found</h3>
                  <p className="text-slate-500 mt-2">There's no activity matching your filters.</p>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        </main>
      </div>
    </div>
  );
};
export default TeacherDashboard;