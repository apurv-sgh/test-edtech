import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCode, FaBrain, FaChartBar, FaStar, FaUsers, FaClock, FaSearch, FaFilter } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { enrollInCourse, unenrollFromCourse } from '../api/courses';
import { toast } from 'react-toastify';

const iconMap = {
  'Web Development': FaCode,
  'Cognitive Science': FaBrain,
  'Business Analytics': FaChartBar,
  'Data Science': FaChartBar,
  'Programming': FaCode,
  'Design': FaBrain,
  'Marketing': FaChartBar,
  'Business': FaChartBar,
};

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [level, setLevel] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const { user } = useAuth();

  useEffect(() => {
    axios.get('/api/courses')
      .then(res => {
        if (Array.isArray(res.data)) setCourses(res.data);
        else if (res.data && Array.isArray(res.data.courses)) setCourses(res.data.courses);
        else setCourses([]);
      })
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, []);

  // Filtering and sorting logic
  const filteredAndSortedCourses = courses
    .filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(search.toLowerCase()) ||
        course.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !category || course.category === category;
      const matchesLevel = !level || course.level === level;
      return matchesSearch && matchesCategory && matchesLevel;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'students':
          return (b.studentsEnrolled?.length || 0) - (a.studentsEnrolled?.length || 0);
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  const handleEnroll = (id) => {
    enrollInCourse(id)
      .then(() => {
        toast.success('Enrolled in course!');
        // Optionally update UI or refetch courses
      })
      .catch(() => toast.error('Failed to enroll'));
  };

  const handleUnenroll = (id) => {
    unenrollFromCourse(id)
      .then(() => {
        toast.success('Unenrolled from course!');
        // Optionally update UI or refetch courses
      })
      .catch(() => toast.error('Failed to unenroll'));
  };

  if (loading) return (
    <div className="py-20 bg-slate-50 dark:bg-slate-900/50">
      <div className="container mx-auto px-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-slate-600 dark:text-slate-400">Loading courses...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-4">
            All Courses
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Explore our comprehensive collection of courses designed to help you master new skills 
            and advance your career. All courses are completely free!
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search courses..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full border border-slate-300 dark:border-slate-600 p-3 pl-10 rounded-lg bg-white dark:bg-slate-700 focus:ring-2 focus:ring-primary focus:border-transparent text-slate-800 dark:text-white"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            </div>
            
            <select 
              value={category} 
              onChange={e => setCategory(e.target.value)} 
              className="border border-slate-300 dark:border-slate-600 p-3 rounded-lg bg-white dark:bg-slate-700 focus:ring-2 focus:ring-primary focus:border-transparent text-slate-800 dark:text-white"
            >
              <option value="">All Categories</option>
              <option value="Web Development">Web Development</option>
              <option value="Data Science">Data Science</option>
              <option value="Business">Business</option>
              <option value="Design">Design</option>
              <option value="Programming">Programming</option>
              <option value="Marketing">Marketing</option>
            </select>
            
            <select 
              value={level} 
              onChange={e => setLevel(e.target.value)} 
              className="border border-slate-300 dark:border-slate-600 p-3 rounded-lg bg-white dark:bg-slate-700 focus:ring-2 focus:ring-primary focus:border-transparent text-slate-800 dark:text-white"
            >
              <option value="">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
            
            <select 
              value={sortBy} 
              onChange={e => setSortBy(e.target.value)} 
              className="border border-slate-300 dark:border-slate-600 p-3 rounded-lg bg-white dark:bg-slate-700 focus:ring-2 focus:ring-primary focus:border-transparent text-slate-800 dark:text-white"
            >
              <option value="rating">Sort by Rating</option>
              <option value="students">Sort by Students</option>
              <option value="newest">Sort by Newest</option>
              <option value="title">Sort by Title</option>
            </select>
            
            <button 
              onClick={() => { setSearch(''); setCategory(''); setLevel(''); setSortBy('rating'); }}
              className="bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white px-4 py-3 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-slate-600 dark:text-slate-400">
            Showing {filteredAndSortedCourses.length} of {courses.length} courses
          </p>
        </div>

        {/* Courses Grid */}
        {filteredAndSortedCourses.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAndSortedCourses.map((course) => {
              const IconComponent = iconMap[course.category] || FaCode;
              const isEnrolled = user && course.studentsEnrolled && course.studentsEnrolled.includes(user._id);
              
              return (
                <div key={course._id} className="group bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-slate-200 dark:border-slate-700">
                  {/* Course Image */}
                  <div className="relative mb-6">
                    <img 
                      src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'} 
                      alt={course.title} 
                      className="w-full h-48 object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Free
                    </div>
                    <div className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                      <FaStar size={12} />
                      {course.rating?.toFixed(1) || '4.5'}
                    </div>
                  </div>

                  {/* Course Content */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-primary/10 rounded-full">
                        <IconComponent className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-white group-hover:text-primary transition-colors">
                          {course.title}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2">
                          {course.description}
                        </p>
                      </div>
                    </div>

                    {/* Course Meta */}
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full text-slate-800 dark:text-slate-200">{course.category}</span>
                      <span className="bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full capitalize text-slate-800 dark:text-slate-200">{course.level}</span>
                      <span className="bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full flex items-center gap-1 text-slate-800 dark:text-slate-200">
                        <FaClock size={10} />
                        {course.duration} weeks
                      </span>
                    </div>

                    {/* Instructor Info */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                      <div className="flex items-center gap-3">
                        <img 
                          src={course.teacher?.profilePicture || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'} 
                          alt={course.teacher?.name || 'Instructor'} 
                          className="w-10 h-10 rounded-full object-cover border-2 border-primary/20"
                        />
                        <div>
                          <p className="font-medium text-sm text-slate-800 dark:text-white">
                            {course.teacher?.name || 'Expert Instructor'}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {course.studentsEnrolled?.length || 0} students
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Link 
                        to={`/course/${course._id}`}
                        className="flex-1 bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white py-3 px-4 rounded-xl font-semibold transition-colors hover:bg-slate-200 dark:hover:bg-slate-600 text-center"
                      >
                        View Details
                      </Link>
                      {user && (
                        <button
                          className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                            isEnrolled 
                              ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
                              : 'bg-primary hover:bg-primary-focus text-white'
                          }`}
                          onClick={() => isEnrolled ? handleUnenroll(course._id) : handleEnroll(course._id)}
                        >
                          {isEnrolled ? 'Unenroll' : 'Enroll'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">No courses found</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">Try adjusting your search criteria</p>
            <button 
              onClick={() => { setSearch(''); setCategory(''); setLevel(''); setSortBy('rating'); }}
              className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-focus transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses; 