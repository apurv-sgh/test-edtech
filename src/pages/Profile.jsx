import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { FiBook, FiCalendar, FiFileText, FiArrowRight } from 'react-icons/fi';
import { motion } from 'framer-motion';

// --- ENRICHED DUMMY DATA to power the new designs ---
const recentCourses = [
  { id: '1', title: 'Advanced Quantum Mechanics', progress: 75, thumb: 'https://placehold.co/600x400/A78BFA/ffffff?text=Physics' },
  { id: '2', title: 'Organic Chemistry Reactions', progress: 40, thumb: 'https://placehold.co/600x400/F472B6/FFFFFF?text=Chemistry' },
  { id: '3', title: 'Calculus for Engineers', progress: 90, thumb: 'https://placehold.co/600x400/EF4444/ffffff?text=Maths' },
];

const upcomingDeadlines = [
  { id: '1', title: 'Quiz 3: Electromagnetism', course: 'Advanced Quantum Mechanics', dueDate: new Date('2025-07-28T23:59:00') },
  { id: '2', title: 'Assignment 2 Submission', course: 'Calculus for Engineers', dueDate: new Date('2025-08-05T23:59:00') },
  { id: '3', title: 'Final Project Proposal', course: 'Data Structures in C++', dueDate: new Date('2025-08-15T23:59:00') },
];

const quickActions = [
  { title: 'Browse Courses', description: 'Find your next challenge.', icon: <FiBook/>, link: '/profile/courses', color: 'text-sky-500 bg-sky-500/10' },
  { title: 'Study Plan', description: 'Organize your schedule.', icon: <FiCalendar/>, link: '/profile/studyplan', color: 'text-emerald-500 bg-emerald-500/10' },
  { title: 'My Notes', description: 'Review your essentials.', icon: <FiFileText/>, link: '/profile/notes', color: 'text-amber-500 bg-amber-500/10' },
];


const Profile = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return (
      <div className="text-center py-20 min-h-screen">
        <h1 className="text-3xl font-bold">Access Denied</h1>
        <Link to="/login" className="text-primary mt-4 inline-block font-semibold">→ Go to Login</Link>
      </div>
    );
  }

  return (
    <div className="bg-primary-light/60 dark:bg-dark-bg min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        
        <div className="relative bg-gradient-to-r from-primary to-primary-focus text-white p-8 rounded-2xl shadow-lg overflow-hidden mb-10">
          <div className="relative z-10">
            <h1 className="text-4xl font-bold">Welcome back, {user?.name || 'Student'}!</h1>
            <p className="mt-1 opacity-90">Let's continue making progress. Keep up the great work!</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          <main className="lg:col-span-2 space-y-12">
            
            <section>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Continue Learning</h2>
              <div className="flex gap-6 pb-4 -mx-6 px-6 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
                {recentCourses.map((course, index) => (
                  <motion.div key={course.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }} className="w-72 flex-shrink-0">
                    <div className="block group bg-white dark:bg-dark-card rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col">
                      <div className="relative aspect-video"><img src={course.thumb} alt={course.title} className="w-full h-full object-cover"/></div>
                      <div className="p-5 flex flex-col flex-grow">
                        <h4 className="font-bold text-slate-800 dark:text-white flex-grow">{course.title}</h4>
                        <div className="mt-4">
                          <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 mb-1"><span>Progress</span><span>{course.progress}%</span></div>
                          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5"><div className="bg-primary h-2.5 rounded-full" style={{ width: `${course.progress}%` }}></div></div>
                        </div>
                        <Link to="#" className="mt-5 w-full bg-primary/10 dark:bg-primary/20 text-primary font-semibold py-2 rounded-lg flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary hover:text-white">View Course <FiArrowRight/></Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
            
            {/* --- 2. REDESIGNED "Enrolled Channel" GRID --- */}
            <section>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Enrolled Channels</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {user?.channels && user.channels.length > 0 ? (
                  user.channels.map((channel, idx) => (
                    <motion.div
                      key={channel.id || idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: idx * 0.1 }}
                      className="bg-white dark:bg-dark-card rounded-xl shadow-md hover:shadow-xl transition-all p-6 flex flex-col justify-between"
                    >
                      <div>
                        <h3 className="text-lg font-bold text-primary mb-2">{channel.name}</h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-4">{channel.description}</p>
                      </div>
                      <Link to={`/profile/channels/`} className="mt-2 inline-block bg-primary/10 dark:bg-primary/20 text-primary font-semibold py-2 px-4 rounded-lg hover:bg-primary hover:text-white transition-colors">
                        Go to Channel
                      </Link>
                    </motion.div>
                  ))
                ) : (
                  // If student is new or has no channels
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="col-span-full bg-gradient-to-r from-primary/10 via-blue-100/10 to-green-100/10 dark:from-primary/20 dark:via-blue-900/10 dark:to-green-900/10 rounded-xl shadow-lg p-8 flex flex-col items-center justify-center"
                  >
                    <h3 className="text-xl font-bold text-primary mb-2">No Channels Joined Yet</h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-4 text-center">
                      You haven't joined any learning channels yet. Explore our vibrant communities and start collaborating!
                    </p>
                    <Link to="/profile/channels/" className="bg-primary text-white font-semibold py-2 px-6 rounded-lg hover:bg-primary-focus transition-colors">
                      Join Channels
                    </Link>
                  </motion.div>
                )}
              </div>
            </section>
          </main>

          {/* --- Right Sidebar --- */}
          <aside className="lg:col-span-1">
            {/* --- 3. REDESIGNED "UPCOMING events" LIST --- */}
            <div className="bg-white dark:bg-dark-card p-6 rounded-xl shadow-lg sticky top-24">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">Upcoming Events</h2>
                <Link to="#" className="text-sm font-semibold text-primary hover:underline">View All</Link>
              </div>
              <div className="space-y-4">
                {upcomingDeadlines.map(deadline => (
                  <div key={deadline.id} className="flex items-center gap-4 p-4 bg-primary-light/50 dark:bg-slate-800/50 rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex flex-col items-center justify-center bg-white dark:bg-dark-card w-14 h-14 rounded-lg shadow-sm flex-shrink-0">
                      <span className="text-xs font-bold text-primary uppercase">{deadline.dueDate.toLocaleDateString('en-US', { month: 'short' })}</span>
                      <span className="text-2xl font-extrabold text-slate-800 dark:text-white">{deadline.dueDate.getDate()}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-white">{deadline.title}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{deadline.course}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
};

export default Profile;