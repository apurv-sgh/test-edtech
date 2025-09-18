import React, { useState, useEffect, useContext } from 'react';
import { FaVideo, FaCommentDots, FaStar, FaBook, FaCalendar, FaFileAlt } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import { useDashboard } from '../context/DashboardContext';
import { Link } from 'react-router-dom';

const categories = [
  { key: 'courses', label: 'Courses', icon: <FaBook /> },
  { key: 'notes', label: 'Notes', icon: <FaFileAlt /> },
  { key: 'discussions', label: 'Discussions', icon: <FaCommentDots /> },
  { key: 'activity', label: 'Recent Activity', icon: <FaCalendar /> },
];

const gradientBg = "bg-gradient-to-br from-primary/10 via-blue-100/10 to-green-100/10 dark:from-primary/20 dark:via-blue-900/10 dark:to-green-900/10";

const Activity = () => {
  const { user } = useContext(AuthContext);
  const { courses, notes, discussions, loading } = useDashboard();
  const [activeCategory, setActiveCategory] = useState('courses');

  return (
    <div className="bg-primary-light/60 dark:bg-dark-bg min-h-screen p-6 flex items-center justify-center">
      <div className="max-w-5xl w-full mx-auto">
        <div className={`rounded-3xl shadow-2xl p-8 ${gradientBg} relative overflow-hidden`}>
          {/* Decorative floating shapes */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/30 rounded-full blur-2xl opacity-40 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-green-400/20 rounded-full blur-2xl opacity-30 pointer-events-none"></div>
          <h1 className="text-4xl font-extrabold text-slate-800 dark:text-white mb-10 text-center drop-shadow-lg">
            Your Activity
          </h1>
          <div className="flex justify-center gap-6 mb-10">
            {categories.map(cat => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-lg shadow transition-all duration-200
                  ${activeCategory === cat.key
                    ? 'bg-primary text-white scale-105 shadow-lg'
                    : 'bg-white dark:bg-dark-card text-primary hover:bg-primary/10 hover:scale-105'
                  }`}
              >
                <span className="text-2xl">{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left: Category Content */}
            <div className="bg-white/90 dark:bg-dark-card/90 rounded-2xl shadow-lg p-8 flex flex-col justify-center">
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <>
                  {activeCategory === 'courses' && (
                    <>
                      <h2 className="text-2xl font-bold mb-6 text-primary">Enrolled Courses</h2>
                      {courses && courses.length > 0 ? (
                        <ul className="space-y-6">
                          {courses.map(course => (
                            <li key={course._id || course.id} className="bg-primary/5 dark:bg-primary/10 rounded-xl p-5 flex flex-col gap-2 shadow hover:shadow-xl transition-all">
                              <div className="flex items-center gap-3">
                                <FaBook className="text-primary text-xl" />
                                <p className="font-semibold text-lg">{course.title}</p>
                              </div>
                              <span className="text-xs text-slate-500">
                                Progress: {course.progress || 0}% • 
                                {course.createdAt ? new Date(course.createdAt).toLocaleDateString() : 'Recently enrolled'}
                              </span>
                              <Link to={`/courses/${course._id || course.id}`} className="text-primary text-sm font-semibold hover:underline">
                                View Course →
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="text-center py-8">
                          <FaBook className="text-4xl text-slate-400 mx-auto mb-3" />
                          <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-400 mb-2">No Courses Enrolled</h3>
                          <p className="text-sm text-slate-500 dark:text-slate-500 mb-4">
                            You haven't enrolled in any courses yet.
                          </p>
                          <Link to="/courses" className="text-primary text-sm font-semibold hover:underline">
                            Browse Courses
                          </Link>
                        </div>
                      )}
                    </>
                  )}
                  
                  {activeCategory === 'notes' && (
                    <>
                      <h2 className="text-2xl font-bold mb-6 text-primary">Your Notes</h2>
                      {notes && notes.length > 0 ? (
                        <ul className="space-y-6">
                          {notes.map(note => (
                            <li key={note._id || note.id} className="bg-blue-100/40 dark:bg-blue-900/20 rounded-xl p-5 shadow flex flex-col gap-2 hover:shadow-xl transition-all">
                              <div className="flex items-center gap-3">
                                <FaFileAlt className="text-blue-500 text-xl" />
                                <span className="font-semibold text-lg">{note.title}</span>
                              </div>
                              <span className="text-xs text-slate-500">
                                {note.createdAt ? new Date(note.createdAt).toLocaleDateString() : 'Recently created'}
                              </span>
                              <Link to={`/notes/${note._id || note.id}`} className="text-primary text-sm font-semibold hover:underline">
                                View Note →
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="text-center py-8">
                          <FaFileAlt className="text-4xl text-slate-400 mx-auto mb-3" />
                          <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-400 mb-2">No Notes Created</h3>
                          <p className="text-sm text-slate-500 dark:text-slate-500 mb-4">
                            You haven't created any notes yet.
                          </p>
                          <Link to="/notes" className="text-primary text-sm font-semibold hover:underline">
                            Create Notes
                          </Link>
                        </div>
                      )}
                    </>
                  )}
                  
                  {activeCategory === 'discussions' && (
                    <>
                      <h2 className="text-2xl font-bold mb-6 text-primary">Discussion Participation</h2>
                      {discussions && discussions.length > 0 ? (
                        <ul className="space-y-6">
                          {discussions.map(discussion => (
                            <li key={discussion._id || discussion.id} className="bg-green-100/40 dark:bg-green-900/20 rounded-xl p-5 shadow flex flex-col gap-2 hover:shadow-xl transition-all">
                              <div className="flex items-center gap-3">
                                <FaCommentDots className="text-green-500 text-xl" />
                                <span className="font-semibold text-lg">{discussion.title}</span>
                              </div>
                              <span className="text-xs text-slate-500">
                                {discussion.createdAt ? new Date(discussion.createdAt).toLocaleDateString() : 'Recently participated'}
                              </span>
                              <Link to={`/discussions/${discussion._id || discussion.id}`} className="text-primary text-sm font-semibold hover:underline">
                                View Discussion →
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="text-center py-8">
                          <FaCommentDots className="text-4xl text-slate-400 mx-auto mb-3" />
                          <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-400 mb-2">No Discussions</h3>
                          <p className="text-sm text-slate-500 dark:text-slate-500 mb-4">
                            You haven't participated in any discussions yet.
                          </p>
                          <Link to="/discussions" className="text-primary text-sm font-semibold hover:underline">
                            Join Discussions
                          </Link>
                        </div>
                      )}
                    </>
                  )}
                  
                  {activeCategory === 'activity' && (
                    <>
                      <h2 className="text-2xl font-bold mb-6 text-primary">Recent Activity</h2>
                      <div className="text-center py-8">
                        <FaCalendar className="text-4xl text-slate-400 mx-auto mb-3" />
                        <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-400 mb-2">Activity Summary</h3>
                        <div className="grid grid-cols-2 gap-4 mt-6">
                          <div className="bg-primary/10 rounded-lg p-4">
                            <div className="text-2xl font-bold text-primary">{courses?.length || 0}</div>
                            <div className="text-sm text-slate-600 dark:text-slate-400">Courses</div>
                          </div>
                          <div className="bg-blue-500/10 rounded-lg p-4">
                            <div className="text-2xl font-bold text-blue-500">{notes?.length || 0}</div>
                            <div className="text-sm text-slate-600 dark:text-slate-400">Notes</div>
                          </div>
                          <div className="bg-green-500/10 rounded-lg p-4">
                            <div className="text-2xl font-bold text-green-500">{discussions?.length || 0}</div>
                            <div className="text-sm text-slate-600 dark:text-slate-400">Discussions</div>
                          </div>
                          <div className="bg-yellow-500/10 rounded-lg p-4">
                            <div className="text-2xl font-bold text-yellow-500">0</div>
                            <div className="text-sm text-slate-600 dark:text-slate-400">Achievements</div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
            {/* Right: Summary Card */}
            <div className="flex flex-col justify-center items-center bg-gradient-to-br from-primary/20 via-blue-100/20 to-green-100/20 dark:from-primary/30 dark:via-blue-900/20 dark:to-green-900/20 rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-primary mb-4">Quick Summary</h3>
              <div className="space-y-4 w-full">
                <div className="flex items-center justify-between bg-white dark:bg-dark-card rounded-lg p-4 shadow">
                  <span className="flex items-center gap-2 text-primary font-semibold"><FaBook /> Courses</span>
                  <span className="font-bold">{courses?.length || 0}</span>
                </div>
                <div className="flex items-center justify-between bg-white dark:bg-dark-card rounded-lg p-4 shadow">
                  <span className="flex items-center gap-2 text-blue-500 font-semibold"><FaFileAlt /> Notes</span>
                  <span className="font-bold">{notes?.length || 0}</span>
                </div>
                <div className="flex items-center justify-between bg-white dark:bg-dark-card rounded-lg p-4 shadow">
                  <span className="flex items-center gap-2 text-green-500 font-semibold"><FaCommentDots /> Discussions</span>
                  <span className="font-bold">{discussions?.length || 0}</span>
                </div>
                <div className="flex items-center justify-between bg-white dark:bg-dark-card rounded-lg p-4 shadow">
                  <span className="flex items-center gap-2 text-yellow-500 font-semibold"><FaStar /> Achievements</span>
                  <span className="font-bold">0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Activity;