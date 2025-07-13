import React, { useState } from 'react';
import { FaBook, FaBriefcase, FaAtom, FaBalanceScale, FaAngleRight } from 'react-icons/fa';

// --- ADD FRAMER MOTION IMPORTS ---
import { motion, AnimatePresence } from 'framer-motion';

const examCards = [
  { icon: <FaAtom />, name: 'Information Technology', description: 'This category includes Computer Science, Software Engineering, Information Systems, and related fields. ' },
  { icon: <FaBook />, name: 'Marketing', description: 'Marketing means promoting a product, service or an idea. On this type of course you study business with a focus on marketing techniques' },
  { icon: <FaBriefcase />, name: 'Finance', description: 'This category includes subjects like Business Administration, Accounting, Finance, and Human Resources. ' },
  { icon: <FaBalanceScale />, name: 'Science', description: 'This category includes subjects like Physics, Chemistry, Biology, Mathematics, and increasingly, Data Science.' },
  { icon: <FaAtom />, name: 'Arts & Humanities', description: 'This category covers a wide range of subjects including Literature, History, Languages, Philosophy, and Fine Arts. ' },
  { icon: <FaBook />, name: 'Economics', description: 'Economics is all about making choices when resources are limited. It helps us understand how people, businesses and governments decide what to do with their money, time and effort' },
  { icon: <FaBriefcase />, name: 'Health & Medicine', description: 'This category includes subjects like Nursing, Medicine, Biomedical Sciences, and Paramedical courses. ' },
  { icon: <FaBalanceScale />, name: 'Engineering', description: 'For probationary officer roles in public banks.' },
];

const ExploreCourses = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  // The logic for which cards to show remains the same
  const visibleCards = isExpanded ? examCards : examCards.slice(0, 4);

  return (
    <section className="bg-white dark:bg-dark-bg py-20">
      <div className="container mx-auto px-6">
        {/* Section Header (no changes here) */}
        <div className="flex justify-between items-baseline mb-8">
          <div className="text-left"></div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="font-semibold text-primary hover:text-primary-focus transition-colors text-right whitespace-nowrap"
          >
            {isExpanded ? 'View Less' : 'View All'}
          </button>
        </div>

        {/* --- ANIMATED Cards Grid --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence>
            {visibleCards.map((card, index) => (
              <motion.div
                key={card.name} // Use a unique key like name or id
                layout // This animates the layout change smoothly
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="group bg-primary-light/60 dark:bg-dark-card p-6 rounded-2xl border border-transparent hover:border-primary dark:hover:border-primary hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col"
              >
                {/* The inner content of the card remains the same */}
                <div className="flex items-start justify-between">
                  <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
                    <div className="text-primary text-2xl">{card.icon}</div>
                  </div>
                </div>
                <div className="mt-4 flex-grow">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{card.name}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">{card.description}</p>
                </div>
                <button className="mt-6 w-full bg-white dark:bg-slate-700 text-primary font-semibold py-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                  Explore Courses <FaAngleRight />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default ExploreCourses;