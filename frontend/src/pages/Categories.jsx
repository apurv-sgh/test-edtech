import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCode, FaBrain, FaChartBar, FaPalette, FaBullhorn, FaBriefcase, FaLaptop, FaMobile, FaDatabase, FaCloud } from 'react-icons/fa';
import axios from 'axios';

const categoryData = [
  {
    id: 'web-development',
    name: 'Web Development',
    description: 'Learn to build modern websites and web applications',
    icon: FaCode,
    color: 'from-blue-500 to-cyan-500',
    courseCount: 15,
    students: 2500,
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
  },
  {
    id: 'data-science',
    name: 'Data Science',
    description: 'Master data analysis, machine learning, and AI',
    icon: FaDatabase,
    color: 'from-purple-500 to-pink-500',
    courseCount: 12,
    students: 1800,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
  },
  {
    id: 'business',
    name: 'Business & Management',
    description: 'Develop business skills and leadership abilities',
    icon: FaBriefcase,
    color: 'from-green-500 to-emerald-500',
    courseCount: 10,
    students: 1200,
    image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80'
  },
  {
    id: 'design',
    name: 'Design & Creative',
    description: 'Create beautiful designs and digital art',
    icon: FaPalette,
    color: 'from-orange-500 to-red-500',
    courseCount: 8,
    students: 900,
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
  },
  {
    id: 'marketing',
    name: 'Digital Marketing',
    description: 'Learn modern marketing strategies and techniques',
    icon: FaBullhorn,
    color: 'from-yellow-500 to-orange-500',
    courseCount: 6,
    students: 750,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2015&q=80'
  },
  {
    id: 'programming',
    name: 'Programming',
    description: 'Master coding languages and software development',
    icon: FaLaptop,
    color: 'from-indigo-500 to-purple-500',
    courseCount: 18,
    students: 3200,
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
  },
  {
    id: 'mobile-development',
    name: 'Mobile Development',
    description: 'Build iOS and Android applications',
    icon: FaMobile,
    color: 'from-teal-500 to-cyan-500',
    courseCount: 7,
    students: 600,
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
  },
  {
    id: 'cloud-computing',
    name: 'Cloud Computing',
    description: 'Learn AWS, Azure, and cloud infrastructure',
    icon: FaCloud,
    color: 'from-gray-500 to-slate-500',
    courseCount: 5,
    students: 450,
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80'
  }
];

const Categories = () => {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');

  // Filtering and sorting logic
  const filteredAndSortedCategories = categoryData
    .filter(category => {
      const matchesSearch = category.name.toLowerCase().includes(search.toLowerCase()) ||
        category.description.toLowerCase().includes(search.toLowerCase());
      return matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'courses':
          return b.courseCount - a.courseCount;
        case 'students':
          return b.students - a.students;
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-4">
            Course Categories
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Explore our comprehensive course categories designed to help you find the perfect learning path. 
            Each category offers multiple courses to help you master new skills.
          </p>
        </div>

        {/* Search and Sort Bar */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search categories..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full border border-slate-300 dark:border-slate-600 p-3 pl-10 rounded-lg bg-white dark:bg-slate-700 focus:ring-2 focus:ring-primary focus:border-transparent text-slate-800 dark:text-white"
              />
              <FaCode className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            </div>
            
            <select 
              value={sortBy} 
              onChange={e => setSortBy(e.target.value)} 
              className="border border-slate-300 dark:border-slate-600 p-3 rounded-lg bg-white dark:bg-slate-700 focus:ring-2 focus:ring-primary focus:border-transparent text-slate-800 dark:text-white"
            >
              <option value="name">Sort by Name</option>
              <option value="courses">Sort by Course Count</option>
              <option value="students">Sort by Students</option>
            </select>
            
            <button 
              onClick={() => { setSearch(''); setSortBy('name'); }}
              className="bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white px-4 py-3 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-slate-600 dark:text-slate-400">
            Showing {filteredAndSortedCategories.length} of {categoryData.length} categories
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAndSortedCategories.map((category) => {
            const IconComponent = category.icon;
            
            return (
              <div key={category.id} className="group bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-slate-200 dark:border-slate-700 overflow-hidden">
                {/* Category Image */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={category.image} 
                    alt={category.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 bg-gradient-to-r ${category.color} rounded-xl text-white`}>
                        <IconComponent size={24} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">
                          {category.name}
                        </h3>
                        <p className="text-white/80 text-sm">
                          {category.courseCount} courses
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Category Content */}
                <div className="p-6">
                  <p className="text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                    {category.description}
                  </p>

                  {/* Stats */}
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-center">
                      <p className="text-lg font-bold text-slate-800 dark:text-white">
                        {category.courseCount}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Courses</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-slate-800 dark:text-white">
                        {category.students.toLocaleString()}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Students</p>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Link 
                    to={`/courses?category=${category.name}`}
                    className={`block w-full bg-gradient-to-r ${category.color} text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 text-center hover:shadow-lg hover:scale-105`}
                  >
                    Explore Courses
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-primary to-purple-600 rounded-2xl p-8 mt-12 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">Can't Find What You're Looking For?</h3>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            We're constantly adding new courses and categories. Let us know what you'd like to learn, 
            and we'll make sure to add it to our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/courses"
              className="bg-white text-primary px-8 py-3 rounded-xl font-semibold hover:bg-slate-200 transition-colors"
            >
              Browse All Courses
            </Link>
            <Link 
              to="/contact"
              className="border-white text-white hover:bg-white hover:text-primary px-8 py-3 rounded-xl font-semibold transition-colors"
            >
              Suggest a Course
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories; 