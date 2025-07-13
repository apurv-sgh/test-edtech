import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaAngleRight } from 'react-icons/fa';

// --- ALL DATA IS NOW HARDCODED INSIDE THIS COMPONENT ---
const pageData = {
  'jee': {
    name: 'JEE Preparation',
    description: 'Comprehensive preparation for the Joint Entrance Examination.',
    subjects: [
      { slug: 'jee-physics', name: 'Physics', channels: [{ slug: 'pw-channel', name: 'Physics Wallah', teacher: 'Alakh Pandey', avatar: 'https://placehold.co/100x100/A78BFA/FFFFFF?text=AP' }] },
      { slug: 'jee-chemistry', name: 'Chemistry', channels: [{ slug: 'vj-channel', name: 'Vedantu JEE', teacher: 'Pulkitt Jain', avatar: 'https://placehold.co/100x100/F97316/FFFFFF?text=PJ' }] },
      { slug: 'jee-maths', name: 'Maths', channels: [] },
    ]
  },
  'class-12th': {
    name: 'Class 12th',
    description: 'Master the core subjects for your board exams.',
    subjects: [
      { slug: 'c12-physics', name: 'Physics', channels: [{ slug: 'pw-channel', name: 'Physics Wallah', teacher: 'Alakh Pandey', avatar: 'https://placehold.co/100x100/A78BFA/FFFFFF?text=AP' }] },
      { slug: 'c12-chemistry', name: 'Chemistry', channels: [] },
    ]
  },
  'default': {
    name: 'Category Not Found',
    description: 'Content for this category is coming soon!',
    subjects: []
  }
};

const CourseHubPage = () => {
  const { categorySlug } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState(null);

  const data = pageData[categorySlug] || pageData['default'];

  useEffect(() => {
    // This logic is now safe. It runs on the hardcoded 'data' object.
    if (data && data.subjects.length > 0) {
      setSelectedSubject(data.subjects[0]);
    } else {
      setSelectedSubject(null);
    }
  }, [categorySlug]);

  const filteredSubjects = data.subjects.filter(subject =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white dark:bg-dark-bg min-h-screen">
      {/* Header Section with a working search bar */}
      <div className="bg-primary-light dark:bg-dark-card py-12 text-center">
        <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-800 dark:text-white">{data.name}</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-2xl mx-auto px-4">{data.description}</p>
        <div className="max-w-xl mx-auto mt-8 px-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-8 flex items-center pointer-events-none"><FaSearch className="text-slate-400" /></div>
            <input type="text" placeholder="Search subjects in this category..." className="w-full pl-14 pr-4 py-3 bg-white dark:bg-dark-bg border border-slate-300 dark:border-slate-600 rounded-full focus:ring-primary" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column: Scrollable Subject List */}
          <aside className="lg:col-span-1">
            <div className="bg-primary-light/50 dark:bg-dark-card p-4 rounded-lg sticky top-24">
              <h3 className="font-bold text-xl mb-4 px-2">Related Subjects</h3>
              <nav className="space-y-2 max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-primary">
                {filteredSubjects.length > 0 ? (
                  filteredSubjects.map(subject => (
                    <button key={subject.slug} onClick={() => setSelectedSubject(subject)} className={`w-full text-left p-3 rounded-lg font-semibold transition-colors ${selectedSubject?.slug === subject.slug ? 'bg-primary text-white shadow-md' : 'hover:bg-white'}`}>
                      {subject.name}
                    </button>
                  ))
                ) : ( <p className="text-sm text-slate-500 p-3">No subjects found.</p> )}
              </nav>
            </div>
          </aside>
          {/* Right Column: Dynamic Channel Cards */}
          <main className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div key={selectedSubject ? selectedSubject.slug : 'empty'} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                {selectedSubject && selectedSubject.channels.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {selectedSubject.channels.map(channel => (
                      <div key={channel.slug} className="bg-white dark:bg-dark-card rounded-2xl shadow-lg p-5 flex flex-col text-center items-center">
                        <img src={channel.avatar} alt={channel.teacher} className="w-20 h-20 rounded-full mb-4 border-4" />
                        <div className="flex-grow"><h4 className="font-bold text-lg">{channel.name}</h4><p className="text-sm text-slate-500 mb-2">by {channel.teacher}</p></div>
                       {/* --- THIS IS THE FIXED, WORKING LINK --- */}
                        <Link 
                          to={`/channel/${channel.slug}`} 
                          className="w-full mt-5 bg-primary/10 text-primary font-semibold py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-primary hover:text-white"
                        >
                          View Channel <FaAngleRight size={12}/>
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-primary-light/50 rounded-lg min-h-[40vh] flex flex-col justify-center">
                    <h3 className="text-xl font-bold">{selectedSubject ? `No Channels for ${selectedSubject.name}` : 'Select a Subject'}</h3>
                    <p className="text-slate-500 mt-2">Please select a subject from the left to see available channels.</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
};
export default CourseHubPage;