import React, { useState, useEffect } from 'react';
import CounsellorCard from './CounsellorCard';
import Navbar from '../Navbar';
import { getCounsellorProfiles } from '../../api/counsellors';

const Counsellors = () => {
  const [counsellors, setCounsellors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchCounsellors = async () => {
      try {
        setLoading(true);
        const response = await getCounsellorProfiles();
        setCounsellors(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching counsellors:', err);
        setError('Failed to load counsellors. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCounsellors();
  }, []);

  const filtered = counsellors.filter(c =>
    c.counsellor?.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.topics?.some(topic => topic.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) {
    return (
      <>
        <Navbar />
        <section className="py-20 bg-gradient-to-br from-primary-light via-purple-50 to-indigo-50 dark:from-slate-900/50 dark:via-slate-800 dark:to-slate-900 min-h-screen">
          <div className="container mx-auto px-6">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
                <span>All Counsellors</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 dark:text-white mb-4">
                Explore Our Industry Counsellors
              </h2>
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
              <p className="mt-4 text-slate-600 dark:text-slate-400">Loading counsellors...</p>
            </div>
          </div>
        </section>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <section className="py-20 bg-gradient-to-br from-primary-light via-purple-50 to-indigo-50 dark:from-slate-900/50 dark:via-slate-800 dark:to-slate-900 min-h-screen">
          <div className="container mx-auto px-6">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-red-100 text-red-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <span>Error</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 dark:text-white mb-4">
                Something went wrong
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-6">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <section className="py-20 bg-gradient-to-br from-primary-light via-purple-50 to-indigo-50 dark:from-slate-900/50 dark:via-slate-800 dark:to-slate-900 min-h-screen">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
              <span>All Counsellors</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 dark:text-white mb-4">
              Explore Our Industry Counsellors
            </h2>
            <p className="text-center text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Browse and connect with {counsellors.length}+ verified industry experts for career guidance, interview prep, and more.
            </p>
          </div>
          <div className="mb-8 flex justify-center">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or counselling topics..."
              className="w-full max-w-md px-4 py-2 border border-primary/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-slate-800 dark:border-slate-600 dark:text-white"
            />
          </div>
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-600 dark:text-slate-400 text-lg">
                {search ? `No counsellors found matching "${search}"` : 'No counsellors available at the moment.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {filtered.map(counsellor => (
                <CounsellorCard key={counsellor._id} counsellor={counsellor} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Counsellors; 