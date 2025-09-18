import React, { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { fetchTopCategories } from '../api/categories';

const MotionLink = motion(Link);

// Fallback list in case API fails
const fallbackBubbles = [
  'Information Technology',
  'Marketing',
  'Finance',
  'Science',
  'Arts & Humanities',
  'Economics',
  'Health & Medicine',
  'Engineering'
];

const TopCategories = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [bubbles, setBubbles] = useState(fallbackBubbles);
  const [serverItems, setServerItems] = useState([]);

  useEffect(() => {
    let isMounted = true;
    fetchTopCategories()
      .then((items) => {
        if (!isMounted) return;
        console.log('[TopCategories] items from API:', items);
        setServerItems(items);
        const names = items.map((c) => c.name || c.title).filter(Boolean);
        if (names.length) setBubbles(names);
      })
      .catch(() => {})
      .finally(() => {});
    return () => { isMounted = false; };
  }, []);

  const filteredBubbles = bubbles.filter(bubble =>
    bubble.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="bg-white dark:bg-dark-bg py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 dark:text-white">Explore Our Top Categories</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Find your passion from a wide range of subjects.</p>
        </div>
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FaSearch className="text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search for categories like 'Chemistry' or 'JEE'..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-dark-card border border-slate-300 dark:border-slate-700 rounded-full focus:ring-2 focus:ring-primary focus:outline-none transition-shadow"
            />
          </div>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-3 md:gap-4 min-h-[5rem]">
          <AnimatePresence>
            {filteredBubbles.map((bubble) => {
              // Try to find matching slug from server items; fall back to generated slug
              const match = serverItems.find((c) => (c.name || '').toLowerCase() === bubble.toLowerCase());
              const categorySlug = match?.slug || bubble.toLowerCase().replace(/ /g, '-');
              return (
                <MotionLink
                  key={bubble}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  // Link to domain details page
                  to={`/domain-details/${categorySlug}`}
                  className="block bg-primary-light dark:bg-dark-card text-slate-700 dark:text-slate-200 rounded-full px-6 py-3 font-semibold shadow-md cursor-pointer transition-colors duration-300 hover:bg-primary hover:text-white dark:hover:bg-primary hover:shadow-lg hover:scale-105"
                >
                  {bubble}
                </MotionLink>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
export default TopCategories;