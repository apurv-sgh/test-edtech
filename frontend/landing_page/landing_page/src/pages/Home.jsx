import React from 'react';
import { Link } from 'react-router-dom';
import { FaCode, FaBrain, FaChartBar, FaTwitter, FaLinkedin } from 'react-icons/fa';
import TopCategories from '../components/TopCategories';
import AllDomains from '../components/AllDomains';
import Opportunities from '../components/Opportunities';


const featuredCourses = [
  { 
    icon: FaCode, 
    title: "Web Development", 
    desc: "Master HTML, CSS, JavaScript and modern frameworks.", 
    instructor: {
      name: "Mr. Alan Smith", 
      img: "https://placehold.co/40x40/E0E0E0/333333?text=A"
    }, 
    progress: 80,
    color: 'text-sky-500' 
  },
  { 
    icon: FaBrain, 
    title: "Cognitive Science", 
    desc: "Explore the science behind thinking & learning.", 
    instructor: {
      name: "Ms. Linda Lee", 
      img: "https://placehold.co/40x40/E0E0E0/333333?text=L"
    }, 
    progress: 65,
    color: 'text-rose-500' 
  },
  { 
    icon: FaChartBar, 
    title: "Business Analytics", 
    desc: "Learn data-driven decision making with hands-on lessons.", 
    instructor: {
      name: "Mr. John Roy", 
      img: "https://placehold.co/40x40/E0E0E0/333333?text=J"
    }, 
    progress: 95,
    color: 'text-teal-500' 
  },
];

const popularCourses = [
    { 
      title: "Modern Web Development", 
      description: "Master React, Node.js, and the entire MERN stack to build powerful web applications.", 
      price: "$49.99", 
      image: "https://placehold.co/600x400/9ca3af/FFFFFF?text=Web+Dev" 
    },
    { 
      title: "Data Science & ML", 
      description: "Unlock insights from data. Learn Python, Pandas, and Scikit-learn from scratch.", 
      price: "$59.99", 
      image: "https://placehold.co/600x400/a78bfa/FFFFFF?text=Data+Science"
    },
    { 
      title: "Business Analytics", 
      description: "Learn to make data-driven decisions. Master SQL, Tableau, and business intelligence.", 
      price: "$49.99", 
      image: "https://placehold.co/600x400/7dd3fc/FFFFFF?text=Analytics"
    },
];

const teachers = [
    { name: 'Mr. Alan Smith', role: 'Front-End Expert', img: 'https://placehold.co/128x128/FFC107/FFFFFF?text=AS' },
    { name: 'Ms. Linda Lee', role: 'Cognitive Specialist', img: 'https://placehold.co/128x128/4CAF50/FFFFFF?text=LL' },
    { name: 'Mr. John Roy', role: 'Business Analyst', img: 'https://placehold.co/128x128/2196F3/FFFFFF?text=JR' },
    { name: 'Mrs. Emma Jones', role: 'Data Scientist', img: 'https://placehold.co/128x128/F44336/FFFFFF?text=EJ' },
];

const courseBubbles = [
  'Physics', 'Chemistry', 'Maths', 'Biology', 'CBSE', 'ICSE', 'History', 'JEE', 'NEET', 'UPSC'
];

const Home = () => {
  return (
    <div className="text-slate-800 dark:text-slate-200">
      {/* Hero Section */}
      <section className="bg-primary-light dark:bg-dark-bg py-16 md:py-24">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight">
              Unlock <span className="text-primary">Knowledge</span> with Top Teachers & Video Lectures
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
              Browse thousands of video lectures from expert teachers. Track your learning and improve at your own pace.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link to="/signup" className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-focus transition-all">Get Started Free</Link>
              <Link to="#" className="bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 px-8 py-3 rounded-lg font-semibold hover:bg-slate-50 dark:hover:bg-slate-600 transition-all">Explore Courses</Link>
            </div>
            <div className="mt-10 flex justify-center md:justify-start space-x-8 text-center">
              <div><p className="text-2xl font-bold">30k+</p><p className="text-sm text-slate-500">Video Lectures</p></div>
              <div><p className="text-2xl font-bold">2k+</p><p className="text-sm text-slate-500">Expert Teachers</p></div>
              <div><p className="text-2xl font-bold">100k+</p><p className="text-sm text-slate-500">Active Students</p></div>
            </div>
          </div>
          <div>
            {/* Placeholder for Hero Illustration */}
            <img src="https://placehold.co/600x450/F5F3FF/6D28D9?text=Learning+Illustration" alt="Students learning online" className="w-full h-auto max-w-lg mx-auto rounded-lg" />
          </div>
        </div>
      </section>

      <TopCategories />
      <AllDomains />

      {/* Featured Courses Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 dark:text-white">Featured Courses</h2>
          <p className="text-center text-slate-500 dark:text-slate-400 mb-12">Get started with our most popular learning paths.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses.map((course) => {
              const IconComponent = course.icon;
              return (
                <div key={course.title} className="bg-white dark:bg-dark-card p-6 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-2 transition-all flex flex-col">
                  {/* Render the colorful react-icon with a background */}
                  <div className="mb-4 inline-block p-4 bg-primary-light dark:bg-dark-bg rounded-full self-start">
                    <IconComponent className={`w-8 h-8 ${course.color}`} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{course.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-4 h-12 flex-grow">{course.desc}</p>
                  <div className="flex items-center justify-between mt-4 border-t dark:border-slate-700 pt-4">
                    <div className="flex items-center gap-3">
                      <img src={course.instructor.img} alt={course.instructor.name} className="w-10 h-10 rounded-full" />
                      <span className="font-medium text-sm">{course.instructor.name}</span>
                    </div>
                    <span className="text-primary font-bold">{course.progress}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Meet Our Teachers Section */}
       <section className="bg-primary-light dark:bg-dark-bg py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
           <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 dark:text-white">Highly Recommended Teachers</h2>
          </div>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teachers.map(teacher => (
              <div key={teacher.name} className="bg-white dark:bg-dark-card p-6 rounded-lg shadow-lg text-center transform hover:scale-105 transition-transform">
                <img src={teacher.img} alt={teacher.name} className="w-28 h-28 rounded-full mx-auto mb-4 border-4 border-primary-light dark:border-slate-600"/>
                <h3 className="text-xl font-bold">{teacher.name}</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-4">{teacher.role}</p>
                <div className="flex justify-center space-x-3 text-slate-500 dark:text-slate-400">
                    <a href="#" className="hover:text-primary"><FaTwitter size={20}/></a>
                    <a href="#" className="hover:text-primary"><FaLinkedin size={20}/></a>
                </div>
              </div>
            ))}
           </div>
         </div>
       </section>
      
      <Opportunities/>

      {/* CTA Section */}
      <section className="bg-primary text-white">
        <div className="container mx-auto px-6 py-16 grid md:grid-cols-2 gap-8 items-center">
            <div className="text-center md:text-left">
                <h2 className="text-3xl font-bold mb-4">Ready to start learning?</h2>
                <p className="mb-8 opacity-90">Sign up now and unlock your potential with EdTech's expert teachers and rich video content.</p>
                <Link to="/signup" className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-slate-200 transition-colors">Get Started Free</Link>
            </div>
            <div>
                 {/* Placeholder for CTA Illustration */}
                <img src="https://placehold.co/400x300/F5F3FF/6D28D9?text=Join+Us" alt="Student with laptop" className="w-full h-auto max-w-sm mx-auto rounded-lg"/>
            </div>
        </div>
      </section>

    </div>
  );
};

export default Home;