import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaPlayCircle } from 'react-icons/fa';
import { fetchCategoryBySlug } from '../api/categories';

// --- FULLY COMPLETED DUMMY DATA ---
// All 8 slugs from the AllDomains component now have a corresponding entry here.
const pageData = {
  'information-technology': {
    name: 'Information Technology',
    courses: ['Computer Science', 'Software Engineering', 'Cybersecurity', 'Data Structures', 'Web Development'],
    videos: [{ title: 'The MERN Stack Full Course', channel: 'Code Pro', thumb: 'https://placehold.co/600x400/3498db/ffffff?text=MERN' }, { title: 'Introduction to AWS', channel: 'Cloud Gurus', thumb: 'https://placehold.co/600x400/f1c40f/ffffff?text=AWS' }],
  },
  'marketing': {
    name: 'Marketing',
    courses: ['Digital Marketing', 'Brand Management', 'SEO Fundamentals', 'Social Media Marketing'],
    videos: [{ title: 'SEO for Beginners: A Complete Guide', channel: 'Marketing Hub', thumb: 'https://placehold.co/600x400/2ecc71/ffffff?text=SEO' }],
  },
  'finance': {
    name: 'Finance',
    courses: ['Accounting Principles', 'Investment Banking', 'Corporate Finance', 'Stock Market Analysis'],
    videos: [{ title: 'Stock Market Investing for Beginners', channel: 'Finance Geeks', thumb: 'https://placehold.co/600x400/1abc9c/ffffff?text=Stocks' }],
  },
  'science': {
    name: 'Science',
    courses: ['Physics: Mechanics', 'Chemistry: Organic', 'Biology: Genetics', 'Advanced Mathematics'],
    videos: [{ title: 'Physics in One Shot', channel: 'Science Simplified', thumb: 'https://placehold.co/600x400/e67e22/ffffff?text=Physics' }, { title: 'Organic Chemistry Basics', channel: 'Chem Lab', thumb: 'https://placehold.co/600x400/ecf0f1/2c3e50?text=Chemistry' }],
  },
  'arts-humanities': {
    name: 'Arts & Humanities',
    courses: ['World History', 'Literary Analysis', 'Introduction to Philosophy', 'Creative Writing'],
    videos: [{ title: 'The Complete History of the World', channel: 'History Buffs', thumb: 'https://placehold.co/600x400/95a5a6/ffffff?text=History' }],
  },
  'economics': {
    name: 'Economics',
    courses: ['Microeconomics', 'Macroeconomics', 'Behavioral Economics', 'International Trade'],
    videos: [{ title: 'Microeconomics Principles', channel: 'Econ Today', thumb: 'https://placehold.co/600x400/27ae60/ffffff?text=Econ' }],
  },
  'health-medicine': {
    name: 'Health & Medicine',
    courses: ['Anatomy & Physiology', 'Introduction to Nursing', 'Medical Terminology', 'Public Health'],
    videos: [{ title: 'Anatomy 101 for Students', channel: 'Med School Simplified', thumb: 'https://placehold.co/600x400/c0392b/ffffff?text=Health' }],
  },
  'engineering': {
    name: 'Engineering',
    courses: ['Mechanical Engineering', 'Civil Engineering', 'Electrical Engineering', 'Thermodynamics'],
    videos: [{ title: 'Intro to Mechanical Engineering', channel: 'Enginerd', thumb: 'https://placehold.co/600x400/8e44ad/ffffff?text=Eng' }],
  },
  'default': {
    name: 'Domain Not Found',
    courses: ['No courses available'],
    videos: [],
  }
};
// --- END DUMMY DATA ---

const DomainDetailsPage = () => {
  const { domainSlug } = useParams();
  const [data, setData] = useState(pageData['default']);

  useEffect(() => {
    let isMounted = true;
    console.log('[DomainDetailsPage] fetching category by slug:', domainSlug);
    fetchCategoryBySlug(domainSlug)
      .then((category) => {
        if (!isMounted) return;
        console.log('[DomainDetailsPage] category data:', category);
        if (category) setData(category);
      })
      .catch((err) => {
        console.error('[DomainDetailsPage] fetch error:', err);
      });
    return () => { isMounted = false; };
  }, [domainSlug]);

  return (
    <div className="bg-white dark:bg-dark-bg min-h-screen">
      <div className="bg-primary-light dark:bg-dark-card py-12 text-center">
        <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-800 dark:text-white">{data.name}</h1>
      </div>

      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          <aside className="lg:col-span-1">
            <div className="bg-primary-light/50 dark:bg-dark-card p-4 rounded-lg sticky top-24">
              <h3 className="font-bold text-xl mb-4 px-2 text-slate-800 dark:text-white">Related Courses</h3>
              <nav className="space-y-2">
                {data.courses.map(course => (
                  <Link key={course} to="#" className="block p-3 rounded-lg font-medium text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700/50 hover:text-primary transition-colors">
                    {course}
                  </Link>
                ))}
              </nav>
            </div>
          </aside>
          
          <main className="lg:col-span-3">
            <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white">Most Watched Videos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {data.videos.length > 0 ? data.videos.map(video => (
                <Link to="/recorded-lecture" key={video.title} className="group rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
                  <div className="relative">
                    <img src={video.thumb} alt={video.title} className="w-full h-auto" />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <FaPlayCircle className="text-white text-5xl" />
                    </div>
                  </div>
                  <div className="p-3 bg-primary-light/50 dark:bg-dark-card">
                    <h4 className="font-bold text-base text-slate-800 dark:text-white truncate">{video.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">By {video.channel}</p>
                  </div>
                </Link>
              )) : <p className="col-span-full text-slate-500 dark:text-slate-400">No videos found for this domain.</p>}
            </div>
          </main>

        </div>
      </div>
    </div>
  );
};

export default DomainDetailsPage;