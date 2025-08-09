import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCode, FaBrain, FaChartBar, FaStar, FaUsers, FaClock, FaArrowRight } from 'react-icons/fa';
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
  // Add more mappings as needed
};

const FeaturedCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [level, setLevel] = useState('');
  const { user } = useAuth();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

  // Filtering logic - only show top-rated courses for featured section
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !category || course.category === category;
    const matchesLevel = !level || course.level === level;
    const isTopRated = course.rating >= 4.5; // Only show courses with 4.5+ rating
    return matchesSearch && matchesCategory && matchesLevel && isTopRated;
  });

  // Show only top 6 featured courses
  const featuredCourses = filteredCourses.slice(0, 6);

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
        <p className="mt-4 text-slate-600 dark:text-slate-400">Loading featured courses...</p>
      </div>
    </div>
  );

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-white to-purple-50 dark:from-slate-900/50 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-6">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <FaStar className="text-yellow-500" />
            <span>Top-Rated Courses</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 dark:text-white mb-4">
            Featured Courses
          </h2>
          <p className="text-center text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Discover our most popular and highly-rated courses handpicked by our expert team. 
            These courses have helped thousands of students achieve their learning goals.
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          <div className="relative">
          <input
            type="text"
              placeholder="Search featured courses..."
            value={search}
            onChange={e => setSearch(e.target.value)}
              className="border border-slate-300 dark:border-slate-600 p-3 pl-10 rounded-lg min-w-[250px] bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-transparent text-slate-800 dark:text-white"
          />
            <FaStar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          </div>
          <select 
            value={category} 
            onChange={e => setCategory(e.target.value)} 
            className="border border-slate-300 dark:border-slate-600 p-3 rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-transparent text-slate-800 dark:text-white"
          >
            <option value="">All Categories</option>
            <option value="Web Development">Web Development</option>
            <option value="Data Science">Data Science</option>
            <option value="Business">Business</option>
            <option value="Design">Design</option>
            <option value="Programming">Programming</option>
          </select>
          <select 
            value={level} 
            onChange={e => setLevel(e.target.value)} 
            className="border border-slate-300 dark:border-slate-600 p-3 rounded-lg bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-transparent text-slate-800 dark:text-white"
          >
            <option value="">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        {/* Featured Courses Grid */}
        {featuredCourses.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredCourses.map((course) => {
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

                    {/* Enroll Button */}
                {user && (
                    <button
                        className={`w-full mt-4 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                          isEnrolled 
                            ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
                            : 'bg-primary hover:bg-primary-focus text-white'
                        }`}
                        onClick={() => isEnrolled ? handleUnenroll(course._id) : handleEnroll(course._id)}
                    >
                        {isEnrolled ? 'Unenroll' : 'Enroll Now'}
                    </button>
                )}
                  </div>
              </div>
            );
          })}
        </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">No featured courses found</h3>
            <p className="text-slate-600 dark:text-slate-400">Try adjusting your search criteria</p>
          </div>
        )}

        {/* Browse All Courses Section */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">
              Want to Explore More?
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-2xl mx-auto">
              We have hundreds of courses across various domains. Find the perfect course that matches your learning goals and career aspirations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/courses" onClick={scrollToTop} className="bg-primary hover:bg-primary-focus text-white px-8 py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2">
                Browse All Courses
                <FaArrowRight size={16} />
              </Link>
              <Link to="/categories" onClick={scrollToTop} className="border border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 rounded-xl font-semibold transition-colors">
                View Course Categories
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCourses;import React, { useState, useEffect } from 'react';
