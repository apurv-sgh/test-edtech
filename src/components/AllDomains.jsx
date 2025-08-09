import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCog, FaBullhorn, FaBriefcase, FaFlask, FaPalette, FaChartLine, FaHeartbeat, FaGavel } from 'react-icons/fa';

// --- DATA for the 8 cards shown in the image ---
const allDomainData = [
  { slug: 'information-technology', icon: <FaCog />, name: 'Information Technology', description: 'This category includes Computer Science, Software Engineering, Information Systems, and related fields.' },
  { slug: 'marketing', icon: <FaBullhorn />, name: 'Marketing', description: 'Marketing means promoting a product, service or an idea. On this type of course you study business with a focus on marketing techniques.' },
  { slug: 'finance', icon: <FaBriefcase />, name: 'Finance', description: 'This category includes subjects like Business Administration, Accounting, Finance, and Human Resources.' },
  { slug: 'science', icon: <FaFlask />, name: 'Science', description: 'This category includes subjects like Physics, Chemistry, Biology, Mathematics, and increasingly, Data Science.' },
  { slug: 'arts-humanities', icon: <FaPalette />, name: 'Arts & Humanities', description: 'This category covers a wide range of subjects including Literature, History, Languages, Philosophy, and Fine Arts.' },
  { slug: 'economics', icon: <FaChartLine />, name: 'Economics', description: 'Economics is all about making choices when resources are limited. It helps us understand how people, businesses and governments decide what to do with their money, time and effort.' },
  { slug: 'health-medicine', icon: <FaHeartbeat />, name: 'Health & Medicine', description: 'This category includes subjects like Nursing, Medicine, Biomedical Sciences, and Paramedical courses.' },
  { slug: 'engineering', icon: <FaGavel />, name: 'Engineering', description: 'For probationary officer roles in public banks.' }, 
];

const AllDomains = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  // This logic is guaranteed to work for showing/hiding cards
  const visibleCards = isExpanded ? allDomainData : allDomainData.slice(0, 4);

  return (
    <section className="bg-white dark:bg-dark-bg py-20">
      <div className="container mx-auto px-6">
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="font-semibold text-primary hover:text-primary-focus transition-colors"
          >
            {isExpanded ? 'View Less' : 'View All'}
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {visibleCards.map((domain) => (
            // Each card is a Link that navigates to the new page
            <Link 
              to={`/domain-details/${domain.slug}`} 
              key={domain.slug} 
              className="group bg-primary-light/60 dark:bg-dark-card p-8 rounded-2xl transition-all duration-300 flex flex-col hover:shadow-xl hover:-translate-y-2"
            >
              <div className="mb-6">
                <div className="inline-block p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
                  <div className="text-primary text-3xl">{domain.icon}</div>
                </div>
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{domain.name}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm">{domain.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AllDomains;