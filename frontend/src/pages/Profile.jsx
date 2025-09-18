import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { FiBook, FiCalendar, FiFileText, FiArrowRight, FiPlus, FiClock } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useNavigate } from "react-router-dom";
import { useDashboard } from '../context/DashboardContext';


// Dynamic data will be fetched from context and APIs

const quickActions = [
  { title: 'Browse Courses', description: 'Find your next challenge.', icon: <FiBook/>, link: '/profile/courses', color: 'text-sky-500 bg-sky-500/10' },
  { title: 'Study Plan', description: 'Organize your schedule.', icon: <FiCalendar/>, link: '/profile/studyplan', color: 'text-emerald-500 bg-emerald-500/10' },
  { title: 'My Notes', description: 'Review your essentials.', icon: <FiFileText/>, link: '/profile/notes', color: 'text-amber-500 bg-amber-500/10' },
];


const Profile = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { courses, loading, error } = useDashboard();
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  // Redirect counsellors and industry experts to their dashboards
  React.useEffect(() => {
    if (user && user.role === 'counsellor') {
      navigate('/counsellor/dashboard', { replace: true });
    } else if (user && user.role === 'industry_expert') {
      navigate('/industry-experts/dashboard', { replace: true });
    }
  }, [user, navigate]);


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
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : courses && courses.length > 0 ? (
                <div className="flex gap-6 pb-4 -mx-6 px-6 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
                  {courses.slice(0, 3).map((course, index) => (
                    <motion.div key={course._id || course.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }} className="w-72 flex-shrink-0">
                      <div className="block group bg-white dark:bg-dark-card rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col">
                        <div className="relative aspect-video">
                          <img 
                            src={course.thumbnail || course.image || `https://placehold.co/600x400/A78BFA/ffffff?text=${course.title?.charAt(0) || 'C'}`} 
                            alt={course.title} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-5 flex flex-col flex-grow">
                          <h4 className="font-bold text-slate-800 dark:text-white flex-grow">{course.title}</h4>
                          <div className="mt-4">
                            <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 mb-1">
                              <span>Progress</span>
                              <span>{course.progress || 0}%</span>
                            </div>
                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                              <div className="bg-primary h-2.5 rounded-full" style={{ width: `${course.progress || 0}%` }}></div>
                            </div>
                          </div>
                          <Link to={`/courses/${course._id || course.id}`} className="mt-5 w-full bg-primary/10 dark:bg-primary/20 text-primary font-semibold py-2 rounded-lg flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary hover:text-white">
                            View Course <FiArrowRight/>
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-gradient-to-r from-primary/10 via-blue-100/10 to-green-100/10 dark:from-primary/20 dark:via-blue-900/10 dark:to-green-900/10 rounded-xl shadow-lg p-8 flex flex-col items-center justify-center"
                >
                  <FiBook className="text-6xl text-primary mb-4" />
                  <h3 className="text-xl font-bold text-primary mb-2">No Courses Enrolled Yet</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-6 text-center max-w-md">
                    You haven't enrolled in any courses yet. Explore our amazing courses and start your learning journey!
                  </p>
                  <Link to="/courses" className="bg-primary text-white font-semibold py-3 px-6 rounded-lg hover:bg-primary-focus transition-colors flex items-center gap-2">
                    <FiPlus className="text-lg" />
                    Browse Courses
                  </Link>
                </motion.div>
              )}
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
                <Link to="/profile/activity" className="text-sm font-semibold text-primary hover:underline">View All</Link>
              </div>
              {upcomingEvents && upcomingEvents.length > 0 ? (
                <div className="space-y-4">
                  {upcomingEvents.slice(0, 3).map(event => (
                    <div key={event.id} className="flex items-center gap-4 p-4 bg-primary-light/50 dark:bg-slate-800/50 rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex flex-col items-center justify-center bg-white dark:bg-dark-card w-14 h-14 rounded-lg shadow-sm flex-shrink-0">
                        <span className="text-xs font-bold text-primary uppercase">
                          {new Date(event.date || event.dueDate).toLocaleDateString('en-US', { month: 'short' })}
                        </span>
                        <span className="text-2xl font-extrabold text-slate-800 dark:text-white">
                          {new Date(event.date || event.dueDate).getDate()}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-white">{event.title}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{event.course || event.type}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-center py-8"
                >
                  <FiClock className="text-4xl text-slate-400 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-400 mb-2">No Upcoming Events</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-500 mb-4">
                    You don't have any upcoming events or deadlines.
                  </p>
                  <Link to="/courses" className="text-primary text-sm font-semibold hover:underline">
                    Browse Courses
                  </Link>
                </motion.div>
              )}
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
};

export default Profile;