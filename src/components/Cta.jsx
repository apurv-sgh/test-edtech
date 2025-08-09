import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
// Importing a new set of relevant icons
import { 
  FaBookOpen, 
  FaUserTie, 
  FaVideo, 
  FaEye,
  FaTwitter,
  FaGithub,
  FaLinkedin,
  FaInstagram
} from 'react-icons/fa';

// --- NEW, SIMPLIFIED DATA STRUCTURE for the stats grid ---
const statsData = [
  { icon: <FaBookOpen />, value: '60+', label: 'Exam categories' },
  { icon: <FaUserTie />, value: '14k+', label: 'Educators' },
  { icon: <FaVideo />, value: '1.5k+', label: 'Daily live classes' },
  { icon: <FaEye />, value: '3.2B+', label: 'Mins. watched' },
];

// --- Animation Variants for Framer Motion ---
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
};

const Cta = () => {
  return (
    // Section background uses your website's established theme colors
    <section className="bg-primary-light/100 dark:bg-dark-bg py-20">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* --- Left Column: Call to Action --- */}
          <div className="text-center md:text-left">
            <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-800 dark:text-white mb-4 leading-tight">
              Start learning with <span className="text-primary">EdTech</span>
            </h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto md:mx-0">
              Get unlimited access to structured courses & doubt clearing sessions from the best educators.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-6">
              <Link
                to="/signup"
                className="w-full sm:w-auto bg-primary text-white font-semibold py-3 px-8 rounded-lg hover:bg-primary-focus transition-all duration-300 transform hover:scale-105"
              >
                Start Learning
              </Link>
              {/* Social Media Icons */}
              <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400">
                <a href="#" className="hover:text-primary transition-colors"><FaTwitter size={24} /></a>
                <a href="#" className="hover:text-primary transition-colors"><FaGithub size={24} /></a>
                <a href="#" className="hover:text-primary transition-colors"><FaLinkedin size={24} /></a>
                <a href="#" className="hover:text-primary transition-colors"><FaInstagram size={24} /></a>
              </div>
            </div>
          </div>

          {/* --- Right Column: Stats Grid --- */}
          <motion.div 
            className="grid grid-cols-2 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
          >
            {statsData.map((stat) => (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{stat.label}</p>
                    <h3 className="text-3xl lg:text-4xl font-extrabold text-slate-800 dark:text-white mt-1">{stat.value}</h3>
                  </div>
                  <div className="p-3 bg-primary-light dark:bg-slate-800 rounded-lg text-primary text-3xl">
                    {stat.icon}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Cta;