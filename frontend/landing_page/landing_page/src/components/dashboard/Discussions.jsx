import React from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { Link } from 'react-router-dom';
import { FiMessageSquare, FiUsers, FiClock, FiBook, FiHash } from 'react-icons/fi';

const Discussions = () => {
  const { courses, loading, error } = useDashboard();

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Course Discussions</h1>
        <div className="flex space-x-3">
          <Link 
            to="/profile/channels" 
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-focus transition-colors flex items-center space-x-2"
          >
            <FiHash className="h-4 w-4" />
            <span>Browse Channels</span>
          </Link>
          <Link 
            to="/discussions" 
            className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
          >
            View All Discussions
          </Link>
        </div>
      </div>

      {/* Channels Quick Access */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 rounded-xl border border-primary/20">
        <div className="flex items-center space-x-3 mb-4">
          <FiHash className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-semibold text-slate-800 dark:text-white">Subject Channels</h2>
        </div>
        <p className="text-slate-600 dark:text-slate-300 mb-4">
          Join subject-specific channels to discuss with students and instructors from different courses. 
          Find channels for Physics, Chemistry, Mathematics, and more!
        </p>
        <Link 
          to="/profile/channels"
          className="inline-flex items-center space-x-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-focus transition-colors font-medium"
        >
          <FiHash className="h-4 w-4" />
          <span>Explore Channels</span>
        </Link>
      </div>

      {courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course._id} className="bg-white dark:bg-dark-card p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center space-x-3 mb-4">
                <FiBook className="h-6 w-6 text-primary" />
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
                  {course.title}
                </h3>
              </div>
              
              <p className="text-slate-600 dark:text-slate-300 text-sm mb-4">
                Join discussions created by your instructor and participate in conversations with your classmates about {course.title.toLowerCase()}.
              </p>

              <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 mb-4">
                <div className="flex items-center space-x-2">
                  <FiUsers className="h-4 w-4" />
                  <span>{course.studentsEnrolled?.length || 0} students</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FiMessageSquare className="h-4 w-4" />
                  <span>Active discussions</span>
                </div>
              </div>

              <Link 
                to={`/discussions/course/${course._id}`}
                className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-focus transition-colors text-center font-medium block"
              >
                Join Discussion
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-dark-card rounded-xl shadow-md">
          <FiMessageSquare className="mx-auto h-20 w-20 text-slate-300 mb-6" />
          <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
            No discussions yet
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
            Your course instructor hasn't created any discussion topics yet. Check back later or contact your instructor to start discussions.
          </p>
          <div className="flex justify-center space-x-3">
            <Link 
              to="/profile/channels" 
              className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-focus transition-colors font-medium"
            >
              Browse Channels
            </Link>
            <Link 
              to="/courses" 
              className="inline-block bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-6 py-3 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors font-medium"
            >
              Browse Courses
            </Link>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-white">Recent Discussion Activity</h2>
        <div className="bg-white dark:bg-dark-card p-6 rounded-xl shadow-md">
          <div className="text-center py-8">
            <FiClock className="mx-auto h-12 w-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
              No recent activity
            </h3>
            <p className="text-slate-500 dark:text-slate-400">
              Start participating in discussions to see your activity here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Discussions; 