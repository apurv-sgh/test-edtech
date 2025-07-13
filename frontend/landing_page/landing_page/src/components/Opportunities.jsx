import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaClipboardList, FaTrophy, FaBook, FaCalendarAlt } from 'react-icons/fa';

const opportunitiesData = [
  { slug: 'quizzes', title: 'Quizzes', icon: <FaClipboardList /> },
  { slug: 'competition', title: 'Competition', icon: <FaTrophy /> },
  { slug: 'test-series', title: 'Test Series', icon: <FaBook /> },
  // This card now has a special 'isLive' flag
  { slug: 'live-sessions', title: 'Live Session', icon: <FaCalendarAlt />, isLive: true },
];

const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
const cardVariants = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } } };

const Opportunities = () => {
  return (
    <section className="bg-primary-light/60 dark:bg-dark-bg py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 dark:text-white">Pick The Right Opportunity!</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Explore opportunities that best suit your skills and interests.</p>
        </div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {opportunitiesData.map((op) => (
            <motion.div key={op.slug} variants={cardVariants}>
              {/* --- CONDITIONAL LINK WRAPPER --- */}
              {/* If it's the live session card, it links to /live-classes. */}
              {/* Otherwise, it links to the generic opportunity page. */}
              <Link
                to={op.isLive ? '/live-classes' : `/opportunity/${op.slug}`}
                className="group block relative rounded-2xl p-6 overflow-hidden h-72 flex flex-col justify-between transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-2 bg-white dark:bg-dark-card"
              >
                <div>
                  <div className="inline-block p-3 rounded-xl mb-4 bg-primary-light/70 dark:bg-slate-800">
                    <div className="text-3xl text-primary">{op.icon}</div>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{op.title}</h3>
                </div>
                <div className="absolute -bottom-5 -right-5 w-24 h-24 bg-primary/10 dark:bg-primary/20 rounded-lg"></div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Opportunities;