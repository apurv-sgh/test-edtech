import React, { useState, useEffect, useContext } from "react";
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import { FaTrophy, FaCode, FaBrain, FaCalendarCheck, FaHourglassEnd, FaHistory, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { AuthContext } from '../context/AuthContext';
import { getCompetitions, createCompetition, updateCompetition, deleteCompetition } from '../api/competitions';
import { toast } from 'react-toastify';

// Countdown component (calculates time left from an end date)
const Countdown = ({ endDate }) => {
    const calculateTimeLeft = () => {
        const difference = +new Date(endDate) - +new Date();
        let timeLeft = {};
        if (difference > 0) {
            timeLeft = {
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }
        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => clearTimeout(timer);
    });

    const timerComponents = Object.keys(timeLeft).map(interval => {
        if (!timeLeft[interval] && timeLeft[interval] !== 0) {
            return null;
        }
        return String(timeLeft[interval]).padStart(2, '0');
    });

    return (
        <span className="font-mono bg-red-500/20 text-red-500 px-2 py-1 rounded">
            {timerComponents.length ? timerComponents.join(' : ') : "Time's up!"}
        </span>
    );
};

// Competition Form Modal (for teachers)
const CompetitionForm = ({ onSave, onCancel, competitionToEdit }) => {
    const [formData, setFormData] = useState({
        title: '', category: 'Coding', prize: '', startsOn: '', endsOn: ''
    });

    useEffect(() => {
        if (competitionToEdit) {
            setFormData({
                title: competitionToEdit.title,
                category: competitionToEdit.category,
                prize: competitionToEdit.prize,
                startsOn: new Date(competitionToEdit.startsOn).toISOString().slice(0, 16),
                endsOn: new Date(competitionToEdit.endsOn).toISOString().slice(0, 16),
            });
        }
    }, [competitionToEdit]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ ...formData, id: competitionToEdit?._id });
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-dark-card p-6 rounded-lg w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">{competitionToEdit ? 'Edit' : 'Create'} Competition</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input name="title" value={formData.title} onChange={handleChange} placeholder="Title" required className="w-full p-2 border rounded dark:bg-dark-bg dark:border-slate-700"/>
                    <select name="category" value={formData.category} onChange={handleChange} className="w-full p-2 border rounded dark:bg-dark-bg dark:border-slate-700">
                        <option value="Coding">Coding</option>
                        <option value="Quiz">Quiz</option>
                        <option value="Hackathon">Hackathon</option>
                    </select>
                    <input name="prize" value={formData.prize} onChange={handleChange} placeholder="Prize Pool (e.g., ₹50,000)" required className="w-full p-2 border rounded dark:bg-dark-bg dark:border-slate-700"/>
                    <div>
                        <label className="text-sm">Start Date</label>
                        <input name="startsOn" value={formData.startsOn} onChange={handleChange} type="datetime-local" required className="w-full p-2 border rounded dark:bg-dark-bg dark:border-slate-700"/>
                    </div>
                    <div>
                        <label className="text-sm">End Date</label>
                        <input name="endsOn" value={formData.endsOn} onChange={handleChange} type="datetime-local" required className="w-full p-2 border rounded dark:bg-dark-bg dark:border-slate-700"/>
                    </div>
                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-300 rounded">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-primary text-white rounded">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const CompetitionsPage = () => {
    const { user } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('live');
    const [allCompetitions, setAllCompetitions] = useState([]);
    const [loading, setLoading] = useState(true);

    // State for teacher's form
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [competitionToEdit, setCompetitionToEdit] = useState(null);

    const fetchCompetitions = async () => {
        setLoading(true);
        try {
            const res = await getCompetitions();
            console.log("Fetched competitions:", res); // Debug log
            setAllCompetitions(res);
        } catch (error) {
            toast.error("Failed to fetch competitions.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCompetitions();
    }, []);

    const handleSave = async (data) => {
    // ADD THIS CONSOLE.LOG
    console.log("Submitting competition data:", data); 

    try {
        if (data.id) {
            await updateCompetition(data.id, data);
            toast.success("Competition updated!");
        } else {
            await createCompetition(data);
            toast.success("Competition created!");
        }
        setIsFormVisible(false);
        setCompetitionToEdit(null);
        fetchCompetitions();
    } catch (error) {
        // Also log the error here for good measure
        console.error("Error saving competition:", error.response || error);
        toast.error(error.response?.data?.message || "An error occurred.");
    }
};

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this?")) {
            try {
                await deleteCompetition(id);
                toast.success("Competition deleted.");
                fetchCompetitions();
            } catch (error) {
                toast.error(error.response?.data?.message || "Failed to delete.");
            }
        }
    };

    const openEditForm = (comp) => {
        setCompetitionToEdit(comp);
        setIsFormVisible(true);
    };

    // Ensure each competition has a status field for filtering
    const competitionsWithStatus = (allCompetitions || []).map(c => {
        const now = new Date();
        const start = c.startsOn ? new Date(c.startsOn) : null;
        const end = c.endsOn ? new Date(c.endsOn) : null;
        let status = 'upcoming';
        if (start && end) {
            if (now < start) status = 'upcoming';
            else if (now >= start && now <= end) status = 'live';
            else if (now > end) status = 'past';
        }
        return { ...c, status };
    });
    const filteredCompetitions = competitionsWithStatus.filter(c => c.status === activeTab);

    // --- Main render ---
    return (
      <div className="bg-gradient-to-br from-blue-100 via-white to-primary-light dark:from-dark-bg dark:via-dark-card dark:to-blue-900 min-h-screen relative overflow-x-hidden">
        {isFormVisible && <CompetitionForm onSave={handleSave} onCancel={() => { setIsFormVisible(false); setCompetitionToEdit(null); }} competitionToEdit={competitionToEdit} />}
        
        {/* Decorative Icons */}
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
          {/* Tabs and Create Button */}
          <div className="flex justify-center items-center flex-wrap gap-4 mb-12">
            <div className="flex flex-grow justify-center max-w-md bg-slate-100 dark:bg-dark-card p-2 rounded-xl">
                {[ {key: 'live', label: 'Live', icon: <FaHourglassEnd/>}, {key: 'upcoming', label: 'Upcoming', icon: <FaCalendarCheck/>}, {key: 'past', label: 'Past', icon: <FaHistory/>} ].map(tab => (
                    <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`w-1/3 py-2.5 font-semibold rounded-lg text-base transition-all duration-300 flex items-center justify-center gap-2 ${activeTab === tab.key ? 'bg-primary text-white shadow-lg' : 'text-primary dark:text-primary-light hover:bg-primary/10'}`}>
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </div>
            {user?.role === 'teacher' && (
                <button onClick={() => setIsFormVisible(true)} className="bg-primary text-white px-4 py-2.5 rounded-lg flex items-center gap-2 shadow-lg hover:bg-primary-focus transition-transform hover:scale-105">
                    <FaPlus /> Create
                </button>
            )}
          </div>

          {/* Competition Cards Grid */}
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            <AnimatePresence>
              {loading ? <p className="col-span-full text-center">Loading...</p> : 
              filteredCompetitions.length > 0 ? (
                filteredCompetitions.map((comp) => (
                  <motion.div
                    key={comp._id}
                    layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}
                    className="relative group bg-white/80 dark:bg-dark-card/90 backdrop-blur-md rounded-3xl shadow-2xl flex flex-col border border-primary/10 dark:border-primary/20 hover:scale-[1.045] hover:shadow-[0_8px_32px_0_rgba(0,123,255,0.18)] hover:border-primary/40 dark:hover:border-primary/40 transition-all duration-200 overflow-hidden"
                    style={{ boxShadow: '0 2px 16px 0 rgba(80,120,255,0.10)' }}
                  >
                    {/* Teacher's Edit/Delete Buttons */}
                    {user?.role === 'teacher' && (user.teacherId === comp.teacher || user.userId === comp.teacher) && (
                        <div className="absolute top-2 right-2 z-20 space-x-1">
                            <button onClick={() => openEditForm(comp)} className="p-2 bg-blue-500 text-white rounded-full text-xs hover:bg-blue-600"><FaEdit /></button>
                            <button onClick={() => handleDelete(comp._id)} className="p-2 bg-red-500 text-white rounded-full text-xs hover:bg-red-600"><FaTrash /></button>
                        </div>
                    )}
                    
                    <div className="p-6 flex-grow flex flex-col gap-2">
                      <span className="text-xs bg-primary/10 text-primary dark:text-sky-400 font-semibold px-3 py-1 rounded-full w-fit mb-1 tracking-wide shadow-sm flex items-center gap-2">
                        {comp.category === 'Coding' ? <FaCode/> : <FaBrain/>} {comp.category}
                      </span>
                      <h3 className="text-xl font-bold mt-1 dark:text-slate-200 flex items-center gap-2"><FaTrophy className="text-lg text-amber-400/80" /> {comp.title || 'Untitled'}</h3>
                    </div>
                    
                    <div className="px-6 py-4 bg-primary-light/40 dark:bg-slate-800/30 border-t flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <FaTrophy className="text-amber-500"/>
                      <span className="font-semibold">Prize Pool:</span>
                      <span>{comp.prize}</span>
                      {activeTab === 'live' && <span className="ml-auto"><Countdown endDate={comp.endsOn} /></span>}
                      {activeTab === 'upcoming' && <span className="ml-auto text-xs text-blue-500 font-semibold">Starts: {new Date(comp.startsOn).toLocaleDateString()}</span>}
                      {activeTab === 'past' && <span className="ml-auto text-xs text-slate-400 font-semibold">Ended: {new Date(comp.endsOn).toLocaleDateString()}</span>}
                    </div>

                    <div className="p-4">
                        {!user && <Link to="/login" className="w-full text-center bg-gray-500 text-white font-bold py-2 rounded-lg hover:bg-gray-600 flex items-center justify-center gap-2">Login to Join</Link>}
                        {user?.role === 'student' && activeTab === 'live' && <button className="w-full bg-gradient-to-r from-primary via-blue-400 to-green-400 text-white font-bold py-2 rounded-lg hover:from-primary-focus hover:to-green-500">Participate Now</button>}
                        {user?.role === 'student' && activeTab === 'upcoming' && <button className="w-full bg-gradient-to-r from-green-500 via-blue-400 to-primary text-white font-bold py-2 rounded-lg hover:from-green-600 hover:to-primary-focus">Register Now</button>}
                        {user && activeTab === 'past' && <button className="w-full bg-slate-500/80 text-white font-bold py-2 rounded-lg cursor-not-allowed">View Results</button>}
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
        <style>{`@keyframes bounce-slow ...`}</style> {/* Styles remain the same */}
      </div>
    );
};

export default CompetitionsPage;