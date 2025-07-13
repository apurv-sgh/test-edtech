import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useDashboard } from '../context/DashboardContext';
import { Link } from 'react-router-dom';
import { FiBook, FiCalendar, FiClock, FiUsers, FiFileText, FiTrendingUp, FiBookOpen } from 'react-icons/fi';

const Profile = () => {
  const { user } = useAuth();
  const { courses, studyPlans, notes, loading, error } = useDashboard();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  // Get upcoming study plans
  const upcomingPlans = studyPlans
    .filter(plan => new Date(plan.startDate) >= new Date())
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
    .slice(0, 3);

  // Get recent notes
  const recentNotes = notes
    .sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative bg-gradient-to-r from-primary to-primary-light text-white p-8 rounded-2xl shadow-lg overflow-hidden">
        <div className="relative z-10">
          <p className="text-sm opacity-90">{new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</p>
          <h1 className="text-4xl font-bold mt-2">Welcome back, {user?.name || 'Student'}!</h1>
          <p className="mt-1 opacity-90">Always stay updated in your student portal</p>
        </div>
        <div className="absolute right-0 bottom-0 w-48 h-auto opacity-20">
          <FiBook className="w-full h-full" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-dark-card p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Enrolled Courses</p>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">{courses.length}</p>
            </div>
            <div className="bg-primary/10 p-3 rounded-lg">
              <FiBookOpen className="h-6 w-6 text-primary" />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-dark-card p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Study Plans</p>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">{studyPlans.length}</p>
            </div>
            <div className="bg-primary/10 p-3 rounded-lg">
              <FiCalendar className="h-6 w-6 text-primary" />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-dark-card p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Notes</p>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">{notes.length}</p>
            </div>
            <div className="bg-primary/10 p-3 rounded-lg">
              <FiFileText className="h-6 w-6 text-primary" />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-dark-card p-6 rounded-xl shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Discussions</p>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">Active</p>
            </div>
            <div className="bg-primary/10 p-3 rounded-lg">
              <FiUsers className="h-6 w-6 text-primary" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          
          {/* Enrolled Courses Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-800 dark:text-white">Enrolled Courses</h2>
              <Link to="/profile/courses" className="text-primary hover:underline text-sm">View All</Link>
            </div>
            {courses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {courses.slice(0, 4).map((course) => (
                  <div key={course._id} className="bg-white dark:bg-dark-card p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-lg text-slate-800 dark:text-white">{course.title}</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{course.category}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        course.level === 'beginner' ? 'bg-green-100 text-green-800' :
                        course.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {course.level}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 line-clamp-2">
                      {course.description}
                    </p>
                    <Link 
                      to={`/course/${course._id}`} 
                      className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-focus transition-colors text-sm font-medium"
                    >
                      Continue Learning
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-white dark:bg-dark-card rounded-xl shadow-md">
                <FiBook className="mx-auto h-16 w-16 text-slate-300" />
                <h3 className="mt-4 text-xl font-semibold text-slate-700 dark:text-slate-300">No courses enrolled yet</h3>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Start your learning journey by enrolling in a course</p>
                <Link to="/courses" className="mt-4 inline-block bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-focus transition-colors">
                  Browse Courses
                </Link>
              </div>
            )}
          </section>

          {/* Upcoming Study Plans */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-800 dark:text-white">Upcoming Study Plans</h2>
              <Link to="/profile/studyplan" className="text-primary hover:underline text-sm">View All</Link>
            </div>
            <div className="bg-white dark:bg-dark-card p-6 rounded-xl shadow-md">
              {upcomingPlans.length > 0 ? (
                <div className="space-y-4">
                  {upcomingPlans.map((plan) => (
                    <div key={plan._id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-dark-bg rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FiCalendar className="h-5 w-5 text-primary" />
                        <div>
                          <h3 className="font-semibold text-slate-800 dark:text-white">{plan.title}</h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {new Date(plan.startDate).toLocaleDateString('en-US', { 
                              weekday: 'short', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        plan.priority === 'high' ? 'bg-red-100 text-red-800' :
                        plan.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {plan.priority}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FiCalendar className="mx-auto h-12 w-12 text-slate-300" />
                  <h3 className="mt-2 text-lg font-semibold text-slate-700 dark:text-slate-300">No upcoming plans</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">Create a study plan to stay organized</p>
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          {/* Recent Notes */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-800 dark:text-white">Recent Notes</h2>
              <Link to="/profile/notes" className="text-primary hover:underline text-sm">View All</Link>
            </div>
            <div className="bg-white dark:bg-dark-card p-4 rounded-xl shadow-md">
              {recentNotes.length > 0 ? (
                <div className="space-y-3">
                  {recentNotes.map((note) => (
                    <div key={note._id} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-dark-bg transition-colors">
                      <div className="flex items-center space-x-3">
                        <FiFileText className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium text-sm text-slate-800 dark:text-white">{note.title}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {new Date(note.uploadDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Link 
                        to={`/profile/notes/${note._id}`}
                        className="text-primary hover:text-primary-focus text-sm"
                      >
                        View
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <FiFileText className="mx-auto h-12 w-12 text-slate-300" />
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">No notes available</p>
                </div>
              )}
            </div>
          </section>

          {/* Quick Actions */}
          <section>
            <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-white">Quick Actions</h2>
            <div className="bg-white dark:bg-dark-card p-4 rounded-xl shadow-md space-y-3">
              <Link 
                to="/profile/courses" 
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-dark-bg transition-colors"
              >
                <FiBook className="h-5 w-5 text-primary" />
                <span className="text-slate-800 dark:text-white">Browse Courses</span>
              </Link>
              <Link 
                to="/profile/studyplan" 
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-dark-bg transition-colors"
              >
                <FiCalendar className="h-5 w-5 text-primary" />
                <span className="text-slate-800 dark:text-white">Create Study Plan</span>
              </Link>
              <Link 
                to="/profile/notes" 
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-dark-bg transition-colors"
              >
                <FiFileText className="h-5 w-5 text-primary" />
                <span className="text-slate-800 dark:text-white">View Notes</span>
              </Link>
              <Link 
                to="/discussions" 
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-dark-bg transition-colors"
              >
                <FiUsers className="h-5 w-5 text-primary" />
                <span className="text-slate-800 dark:text-white">Join Discussions</span>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Profile; 