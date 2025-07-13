import React from 'react';
import { useParams, Link } from 'react-router-dom';

// A simple helper object to get the full title from the URL slug
const pageTitles = {
  'quizzes': 'Quizzes',
  'competition': 'Competitions',
  'test-series': 'Test Series',
  'live-sessions': 'Upcoming Live Sessions',
};

const OpportunityPage = () => {
  const { opportunitySlug } = useParams();
  
  // Look up the title, with a fallback
  const title = pageTitles[opportunitySlug] || 'Opportunity';

  return (
    <div className="bg-white dark:bg-dark-bg min-h-screen">
      <div className="bg-primary-light dark:bg-dark-card py-12 text-center">
        <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-800 dark:text-white">
          {title}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Explore all our {title.toLowerCase()} and test your skills.
        </p>
      </div>

      <div className="container mx-auto px-6 py-16 text-center">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Content Coming Soon!</h2>
        <p className="text-slate-600 dark:text-slate-400 mt-4 max-w-xl mx-auto">
          We are working hard to bring you the best content for our {title.toLowerCase()}. Please check back later.
        </p>
        <Link to="/" className="mt-8 inline-block bg-primary text-white font-semibold py-3 px-6 rounded-lg hover:bg-primary-focus transition-colors">
          ← Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default OpportunityPage;