import React, {useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import { FaTrophy, FaCode, FaBrain, FaCalendarCheck, FaHourglassEnd, FaHistory } from "react-icons/fa";

// Dummy Data
const allCompetitions = [
  { id: 1, title: 'CodeMasters Challenge 2025', category: 'Coding', prize: '₹50,000', status: 'live', endsIn: 72 * 3600 }, // 72 hours
  { id: 2, title: 'Quantum Quiz-a-thon', category: 'Quiz', prize: '₹10,000', status: 'live', endsIn: 4 * 3600 }, // 4 hours
  { id: 3, title: 'The Ultimate Hackathon', category: 'Hackathon', prize: '₹1,00,000', status: 'upcoming', startsOn: '2025-08-01' },
  { id: 4, title: 'NEET Scholars Battle', category: 'Quiz', prize: '₹25,000', status: 'upcoming', startsOn: '2025-08-15' },
  { id: 5, title: 'CodeSprint 2024', category: 'Coding', prize: '₹40,000', status: 'past', endedOn: '2024-06-20' },
  { id: 6, title: 'History Olympiad', category: 'Quiz', prize: '₹5,000', status: 'past', endedOn: '2024-05-10' },
];

const Countdown = ({ second }) => {
    const [timeLeft, setTimeLeft] = useState(second);
    useEffect(() => {
      if (timeLeft <= 0) {
        return;
      }
      const intervalId = setInterval(() => { setTimeLeft(timeLeft - 1); }, 1000);
    
      return () => {
        clearInterval(intervalId);
      }
    }, [timeLeft]);

    const hours = Math.floor(timeLeft /3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = timeLeft % 60;

    return <span className="font-mono bg-red-500/20 text-red-500 px-2 py-1 rounded">
        {`${String(hours).padStart(2, '0')} : ${String(minutes).padStart(2, '0')} : ${String(seconds).padStart(2, '0')}`}
    </span>
};

const CompetitionsPage = () => {
    const [activeTab, setActiveTab] = useState('live');
    const filteredCompetitions = allCompetitions.filter(c => c.status === activeTab);

    return (
      <div className="bg-gradient-to-br from-blue-100 via-white to-primary-light dark:from-dark-bg dark:via-dark-card dark:to-blue-900 min-h-screen relative overflow-x-hidden">
        {/* Decorative floating trophy and code icons */}
        <FaTrophy className="hidden md:block absolute left-10 top-24 text-amber-400/10 dark:text-amber-400/20 text-[8rem] animate-float-slow z-0" />
        <FaCode className="hidden md:block absolute right-10 bottom-24 text-blue-400/10 dark:text-blue-700/20 text-[7rem] animate-float-slow2 z-0" />

        {/* Page Header */}
        <div className="py-12 text-center rounded-b-3xl">
          <h1 className="text-4xl lg:text-5xl font-extrabold text-primary dark:text-white drop-shadow flex items-center justify-center gap-3">
            <FaTrophy className="text-4xl text-amber-400" /> Competitions
          </h1>
          <p className="text-slate-600 dark:text-slate-300 mt-2 max-w-2xl mx-auto px-4">
            Showcase your skills, compete with the best, and win exciting prizes.
          </p>
        </div>

        <div className="container mx-auto px-4 md:px-8 py-12 relative z-10">
          {/* Tab Navigation */}
          <div className="flex justify-center flex-wrap gap-3 mb-12 bg-slate-100 dark:bg-dark-card p-2 rounded-xl max-w-md mx-auto">
            {[ {key: 'live', label: 'Live', icon: <FaHourglassEnd/>}, {key: 'upcoming', label: 'Upcoming', icon: <FaCalendarCheck/>}, {key: 'past', label: 'Past', icon: <FaHistory/>} ].map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`w-1/3 py-2.5 font-semibold rounded-lg text-base transition-all duration-300 flex items-center justify-center gap-2 ${activeTab === tab.key ? 'bg-primary text-white shadow-lg' : 'text-primary dark:text-primary-light hover:bg-primary/10'}`}>
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* Competition Cards Grid */}
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            <AnimatePresence>
              {filteredCompetitions.length > 0 ? (
                filteredCompetitions.map((comp, idx) => (
                  <motion.div
                    key={comp.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="relative group bg-white/80 dark:bg-dark-card/90 backdrop-blur-md rounded-3xl shadow-2xl flex flex-col border border-primary/10 dark:border-primary/20 hover:scale-[1.045] hover:shadow-[0_8px_32px_0_rgba(0,123,255,0.18)] hover:border-primary/40 dark:hover:border-primary/40 transition-all duration-200 overflow-hidden cursor-pointer"
                    style={{ boxShadow: '0 2px 16px 0 rgba(80,120,255,0.10)' }}
                  >
                    {/* Animated left bar */}
                    <div className="absolute left-0 top-0 h-full w-2 bg-gradient-to-b from-primary via-blue-400 to-green-400 dark:from-primary dark:via-blue-700 dark:to-green-700 animate-pulse rounded-l-3xl" />
                    {/* Floating badge for live competitions */}
                    {activeTab === 'live' && idx === 0 && (
                      <span className="absolute right-4 top-4 z-10 bg-gradient-to-r from-green-400 via-blue-400 to-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-md animate-bounce-slow">LIVE</span>
                    )}
                    {/* Floating badge for upcoming competitions */}
                    {activeTab === 'upcoming' && idx === 0 && (
                      <span className="absolute right-4 top-4 z-10 bg-gradient-to-r from-green-400 via-blue-400 to-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-md animate-bounce-slow">NEW</span>
                    )}
                    {/* Floating badge for past competitions */}
                    {activeTab === 'past' && idx === 0 && (
                      <span className="absolute right-4 top-4 z-10 bg-gradient-to-r from-slate-400 via-blue-400 to-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-md animate-bounce-slow">PAST</span>
                    )}
                    <div className="p-6 flex-grow flex flex-col gap-2">
                      <span className="text-xs bg-primary/10 text-primary dark:text-sky-400 font-semibold px-3 py-1 rounded-full w-fit mb-1 tracking-wide shadow-sm flex items-center gap-2">
                        {comp.category === 'Coding' ? <FaCode/> : <FaBrain/>} {comp.category}
                      </span>
                      <h3 className="text-xl font-bold mt-1 dark:text-slate-200 flex items-center gap-2"><FaTrophy className="text-lg text-amber-400/80" /> {comp.title}</h3>
                    </div>
                    <div className="px-6 py-4 bg-primary-light/40 dark:bg-slate-800/30 border-t flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <FaTrophy className="text-amber-500"/>
                      <span className="font-semibold">Prize Pool:</span>
                      <span>{comp.prize}</span>
                      {activeTab === 'live' && <span className="ml-auto"><Countdown second={comp.endsIn} /></span>}
                      {activeTab === 'upcoming' && <span className="ml-auto text-xs text-blue-500 font-semibold">Starts: {comp.startsOn}</span>}
                      {activeTab === 'past' && <span className="ml-auto text-xs text-slate-400 font-semibold">Ended: {comp.endedOn}</span>}
                    </div>
                    <div className="p-4">
                      {activeTab === 'live' && <button className="w-full bg-gradient-to-r from-primary via-blue-400 to-green-400 text-white font-bold py-2 rounded-lg hover:from-primary-focus hover:to-green-500 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-150 scale-100 group-hover:scale-105">Participate Now</button>}
                      {activeTab === 'upcoming' && <button className="w-full bg-gradient-to-r from-green-500 via-blue-400 to-primary text-white font-bold py-2 rounded-lg hover:from-green-600 hover:to-primary-focus flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-150 scale-100 group-hover:scale-105">Register Now</button>}
                      {activeTab === 'past' && <button className="w-full bg-slate-500/80 text-white font-bold py-2 rounded-lg cursor-not-allowed flex items-center justify-center gap-2">View Results</button>}
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="col-span-full text-center text-slate-500 dark:text-slate-400 py-10">
                  No {activeTab} competitions right now. Check back soon!
                </p>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Floating animation keyframes for badges and icons */}
        <style>{`
          @keyframes bounce-slow {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
          }
          .animate-bounce-slow { animation: bounce-slow 2.2s infinite; }
          @keyframes float-slow {
            0% { transform: translateY(0px) rotate(-6deg); }
            50% { transform: translateY(-18px) rotate(6deg); }
            100% { transform: translateY(0px) rotate(-6deg); }
          }
          .animate-float-slow { animation: float-slow 7s ease-in-out infinite; }
          @keyframes float-slow2 {
            0% { transform: translateY(0px) rotate(8deg); }
            50% { transform: translateY(16px) rotate(-8deg); }
            100% { transform: translateY(0px) rotate(8deg); }
          }
          .animate-float-slow2 { animation: float-slow2 8s ease-in-out infinite; }
        `}</style>
      </div>
    );
};

export default CompetitionsPage;