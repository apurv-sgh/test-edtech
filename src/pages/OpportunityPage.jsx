import React from 'react';
import { useParams, Link } from 'react-router-dom';
import LearningIllustration from '../assets/LearningIllustration.jpg';

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
    <div className="bg-gradient-to-br from-blue-100 via-white to-primary-light dark:from-dark-bg dark:via-dark-card dark:to-blue-900 min-h-screen flex flex-col items-center justify-center relative overflow-x-hidden">
      {/* Floating icons for creativity */}
      <div className="absolute left-8 top-24 hidden md:block z-10 animate-float-slow">
        <span className="inline-block bg-gradient-to-br from-green-300 via-blue-300 to-primary text-white rounded-full p-3 shadow-lg text-2xl rotate-12">🌟</span>
      </div>
      <div className="absolute right-8 top-40 hidden md:block z-10 animate-float-medium">
        <span className="inline-block bg-gradient-to-br from-pink-300 via-yellow-200 to-primary text-white rounded-full p-2 shadow-lg text-xl -rotate-12">🎓</span>
      </div>
      {/* Large top illustration with accent bar */}
      <div className="w-full flex flex-col items-center pt-12 pb-2 relative">
        <div className="h-2 w-32 bg-gradient-to-r from-primary via-blue-400 to-green-400 rounded-full mb-4 animate-accent-bar" />
        <img src={LearningIllustration} alt="Learning illustration" className="w-60 md:w-80 drop-shadow-xl rounded-2xl border-2 border-primary/20 bg-white/80 dark:bg-dark-card/80" />
      </div>
      <div className="w-full max-w-2xl mx-auto px-4 flex flex-col items-center justify-center">
        <div className="relative w-full">
          {/* Animated gradient border */}
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-primary via-blue-400 to-green-400 opacity-60 blur-lg animate-border-glow z-0" />
          <div className="bg-white/90 dark:bg-dark-card/90 backdrop-blur-md rounded-3xl shadow-2xl border border-primary/10 dark:border-primary/20 p-10 flex flex-col items-center text-center relative z-10 -mt-8 animate-float-card">
            {/* Playful badge */}
            <span className="inline-block px-4 py-1 mb-3 rounded-full bg-gradient-to-r from-green-200 via-blue-200 to-primary text-primary dark:text-primary-light font-bold text-xs tracking-widest shadow animate-badge-pop uppercase">Special Opportunity</span>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-primary dark:text-primary-light mb-2 drop-shadow animate-cta-heading tracking-tight">
              <span className="bg-gradient-to-r from-primary via-blue-400 to-green-400 bg-clip-text text-transparent animate-gradient-text">{title}</span>
            </h1>
            <p className="text-slate-600 dark:text-slate-300 mb-6 text-lg">Explore all our <span className="font-bold text-primary dark:text-primary-light">{title.toLowerCase()}</span> and test your skills.</p>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2 animate-pulse">🚧 Content Coming Soon!</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-xl mx-auto">We are working hard to bring you the best content for our <span className="font-semibold text-primary dark:text-primary-light">{title.toLowerCase()}</span>. Please check back later.</p>
            <Link to="/" className="mt-4 inline-block bg-gradient-to-r from-primary via-blue-400 to-green-400 text-white font-semibold py-3 px-8 rounded-lg hover:from-primary-focus hover:to-green-500 shadow-lg transition-all text-lg animate-bounce">← Go Back Home</Link>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes cta-heading {
          0% { letter-spacing: 0.01em; color: #312e81; }
          50% { letter-spacing: 0.08em; color: #4f46e5; }
          100% { letter-spacing: 0.01em; color: #312e81; }
        }
        .animate-cta-heading { animation: cta-heading 3.5s ease-in-out infinite; }
        @keyframes float-card {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        .animate-float-card { animation: float-card 5s ease-in-out infinite; }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-18px); }
        }
        .animate-float-slow { animation: float-slow 7s ease-in-out infinite; }
        @keyframes float-medium {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float-medium { animation: float-medium 4.5s ease-in-out infinite; }
        @keyframes accent-bar {
          0%, 100% { width: 8rem; }
          50% { width: 10rem; }
        }
        .animate-accent-bar { animation: accent-bar 3s ease-in-out infinite; }
        @keyframes border-glow {
          0%, 100% { opacity: 0.6; filter: blur(8px); }
          50% { opacity: 1; filter: blur(16px); }
        }
        .animate-border-glow { animation: border-glow 4s ease-in-out infinite; }
        @keyframes badge-pop {
          0% { transform: scale(0.9); }
          50% { transform: scale(1.08); }
          100% { transform: scale(0.9); }
        }
        .animate-badge-pop { animation: badge-pop 2.5s cubic-bezier(.68,-0.55,.27,1.55) infinite; }
        @keyframes gradient-text {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-text {
          background-size: 200% 200%;
          animation: gradient-text 3.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default OpportunityPage;