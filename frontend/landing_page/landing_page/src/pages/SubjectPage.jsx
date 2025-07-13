import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { categories, subjects, channels } from '../data/courseData';

const SubjectPage = () => {
  const { categoryId } = useParams();
  const category = categories[categoryId] || { name: 'Not Found', subjects: [] };

  return (
    <div className="bg-white dark:bg-dark-bg min-h-screen">
      <div className="bg-primary-light dark:bg-dark-card py-12 text-center">
        <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-800 dark:text-white">{category.name}</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-2xl mx-auto px-4">{category.description}</p>
      </div>
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Related Subjects</h2>
        </div>
        <div className="flex flex-wrap justify-center gap-5">
          {category.subjects.map(subjectId => {
            const subject = subjects[subjectId];
            if (!subject) return null;
            
            // This assumes a subject has only one primary channel for simplicity.
            const primaryChannelId = subject.channels[0]; 
            if (!primaryChannelId) return null;

            const channel = channels[primaryChannelId];
            if(!channel) return null;

            return (
              // The link now points directly to the channel page.
              <Link key={subjectId} to={`/channel/${primaryChannelId}`} className="group w-full sm:w-1/3 md:w-1/4 lg:w-1/5">
                <div className="rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 bg-primary-light/50 dark:bg-dark-card">
                  <div className="aspect-w-16 aspect-h-10">
                    <img src={subject.illustration} alt={subject.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-3 text-center">
                    <h3 className="text-base font-bold text-slate-800 dark:text-white truncate">{subject.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">by {channel.name}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default SubjectPage;