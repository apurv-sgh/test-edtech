import React from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { Link } from 'react-router-dom';
import { FiBook, FiClock, FiUsers, FiStar, FiPlay } from 'react-icons/fi';

const Courses = () => {
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
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">My Enrolled Courses</h1>
        <Link
          to="/courses"
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-focus transition-colors"
        >
          Browse More Courses
        </Link>
      </div>

      {courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course._id} className="bg-white dark:bg-dark-card rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              {/* Course Image */}
              <div className="h-48 bg-gradient-to-br from-primary to-primary-light relative">
                {course.thumbnail ? (
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <FiBook className="h-16 w-16 text-white opacity-50" />
                  </div>
                )}
                <div className="absolute top-4 right-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${course.level === 'beginner' ? 'bg-green-100 text-green-800' :
                      course.level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                    }`}>
                    {course.level}
                  </span>
                </div>
              </div>

              {/* Course Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
                  {course.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 line-clamp-2">
                  {course.description}
                </p>

                {/* Course Stats */}
                <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <FiClock className="h-4 w-4" />
                      <span>{course.duration} weeks</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FiUsers className="h-4 w-4" />
                      <span>{course.studentsEnrolled?.length || 0} students</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <FiStar className="h-4 w-4 text-yellow-500" />
                    <span>{course.rating && typeof course.rating.average === 'number'
                      ? course.rating.average.toFixed(1)
                      : 'N/A'}</span>
                  </div>
                </div>

                {/* Course Category */}
                <div className="mb-4">
                  <span className="inline-block bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-full text-xs font-medium">
                    {course.category}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <Link
                    to={`/course/${course._id}`}
                    className="flex-1 bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-focus transition-colors text-center font-medium flex items-center justify-center space-x-2"
                  >
                    <FiPlay className="h-4 w-4" />
                    <span>Continue Learning</span>
                  </Link>
                  <Link
                    to={`/profile/notes?course=${course._id}`}
                    className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 py-2 px-4 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-center font-medium"
                  >
                    Notes
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-dark-card rounded-xl shadow-md">
          <FiBook className="mx-auto h-20 w-20 text-slate-300 mb-6" />
          <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
            No courses enrolled yet
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
            Start your learning journey by enrolling in courses. Explore our catalog and find the perfect courses for your goals.
          </p>
          <Link
            to="/courses"
            className="inline-block bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary-focus transition-colors font-medium"
          >
            Browse Courses
          </Link>
        </div>
      )}
    </div>
  );
};

export default Courses; 