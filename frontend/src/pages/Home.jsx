import React from 'react';
import { Link } from 'react-router-dom';
import { FaCode, FaBrain, FaChartBar, FaTwitter, FaLinkedin } from 'react-icons/fa';
import TopCategories from '../components/TopCategories';
import AllDomains from '../components/AllDomains';
import Opportunities from '../components/Opportunities';
import Cta from '../components/Cta';
// import FeatureCoursesSection from './FeatureCourseSection';
import FeaturedCourses from '../components/FeaturedCourses';
import HeroPage from './HeroPage';
import CounsellorsSection from '../components/counsellors/CounsellorsSection';
import Teachers from '../components/Teachers';
import IndustryExpertsSection from '../components/experts/IndustryExpertsSection';



const teachers = [
    { name: 'Mr. Alan Smith', role: 'Front-End Expert', img: 'https://placehold.co/128x128/FFC107/FFFFFF?text=AS' },
    { name: 'Ms. Linda Lee', role: 'Cognitive Specialist', img: 'https://placehold.co/128x128/4CAF50/FFFFFF?text=LL' },
    { name: 'Mr. John Roy', role: 'Business Analyst', img: 'https://placehold.co/128x128/2196F3/FFFFFF?text=JR' },
    { name: 'Mrs. Emma Jones', role: 'Data Scientist', img: 'https://placehold.co/128x128/F44336/FFFFFF?text=EJ' },
];

const Home = () => {
  return (
    <div className="text-slate-800 dark:text-slate-200">
      {/* Hero Section */}
      
      <HeroPage />
      <TopCategories />
      <AllDomains />

      {/* Featured Courses Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-6">
          <FeaturedCourses />
        </div>
      </section>

      {/* Creative divider above Opportunities */}
      <div className="w-full flex justify-center py-4">
        <div className="h-2 w-40 bg-gradient-to-r from-primary via-blue-400 to-green-400 rounded-full animate-accent-bar" />
      </div>
      <Opportunities/>

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

       {/* Counsellors Section */}
      <CounsellorsSection />

      {/* Industry Experts Section */}
      <IndustryExpertsSection />

      {/* Teachers Section */}
      <Teachers />
      

      

      {/* CTA Section with fade-in animation */}
      <section className="bg-primary text-white animate-fade-in-up">
        <Cta />
      </section>

      <style>{`
        @keyframes hero-underline {
          0%, 100% { opacity: 0.7; width: 66%; }
          50% { opacity: 1; width: 80%; }
        }
        .animate-hero-underline { animation: hero-underline 2.8s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default Home;

