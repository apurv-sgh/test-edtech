import React, { useState, useContext, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaChalkboardTeacher, FaCalendarAlt, FaClock, FaEdit, FaTrash, FaPlus, FaExclamationTriangle } from 'react-icons/fa';
import { getLiveSessions, createLiveSession, updateLiveSession, deleteLiveSession } from '../api/liveSessionApi';
import { toast } from 'react-toastify';

// ScheduleForm component needs to be updated to use 'title' instead of 'subject' in its state
const ScheduleForm = ({ onSave, classToEdit, onCancelEdit }) => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    title: '', // CHANGED from 'subject' to 'title'
    description: '',
    date: '',
    time: ''
  });

  useEffect(() => {
    if (classToEdit) {
      setFormData({
        title: classToEdit.title, // CHANGED from 'subject' to 'title'
        description: classToEdit.description,
        date: classToEdit.date,
        time: classToEdit.time
      });
    } else {
      setFormData({ title: '', description: '', date: '', time: '' });
    }
  }, [classToEdit]);

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.date || !formData.time) { // CHANGED from 'subject' to 'title'
      toast.warn('Please fill out Title, Date, and Time.');
      return;
    }
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-dark-card dark:text-slate-300 p-6 rounded-xl shadow-lg space-y-4 sticky top-24">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">{classToEdit ? 'Edit Session' : 'Create a New Session'}</h2>
      {/* UPDATED form field name from 'subject' to 'title' */}
      <div><label className="block text-sm font-medium">Title</label><input type="text" name="title" value={formData.title} onChange={handleInputChange} required className="w-full mt-1 p-2 bg-slate-100 dark:bg-slate-700 rounded-lg" /></div>
      <div><label className="block text-sm font-medium">Description</label><textarea name="description" value={formData.description} onChange={handleInputChange} rows="2" className="w-full mt-1 p-2 bg-slate-100 dark:bg-slate-700 rounded-lg"></textarea></div>
      <div className="flex gap-4"><div className="w-1/2"><label>Date</label><input type="date" name="date" value={formData.date} onChange={handleInputChange} required className="w-full mt-1 p-2 bg-slate-100 dark:bg-slate-700 rounded-lg" /></div><div className="w-1/2"><label>Time</label><input type="time" name="time" value={formData.time} onChange={handleInputChange} required className="w-full mt-1 p-2 bg-slate-100 dark:bg-slate-700 rounded-lg" /></div></div>
      <button type="submit" className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary-focus flex items-center justify-center gap-2">
        {classToEdit ? <><FaEdit /> Update Class</> : <><FaPlus /> Schedule Class</>}
      </button>
      {classToEdit && <button type="button" onClick={onCancelEdit} className="w-full bg-slate-200 dark:bg-slate-600 font-bold py-2 rounded-lg mt-2">Cancel Edit</button>}
    </form>
  );
};


const LiveClassesPage = () => {
  const { user } = useContext(AuthContext);
  const [classes, setClasses] = useState([]);
  const [classToEdit, setClassToEdit] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- Data Transformation Helpers ---
  const transformSessionForFrontend = (session) => {
    const schedule = new Date(session.scheduledTime);
    if (isNaN(schedule.getTime())) {
        console.error("Invalid scheduledTime from backend:", session.scheduledTime);
        return null;
    }

    const year = schedule.getFullYear();
    const month = String(schedule.getMonth() + 1).padStart(2, '0');
    const day = String(schedule.getDate()).padStart(2, '0');
    const hours = String(schedule.getHours()).padStart(2, '0');
    const minutes = String(schedule.getMinutes()).padStart(2, '0');

    return {
      id: session._id,
      title: session.title, // CHANGED from 'subject' to 'title'
      teacher: session.instructorName,
      description: session.description || '',
      date: `${year}-${month}-${day}`,
      time: `${hours}:${minutes}`
    };
  };

  const transformDataForBackend = (formData) => {
    if (!formData.date || !formData.time) throw new Error("Date and Time are required.");
    const combinedDateTime = `${formData.date}T${formData.time}`;
    const dateObject = new Date(combinedDateTime);
    if (isNaN(dateObject.getTime())) throw new Error("Invalid date or time.");
    
    return {
      title: formData.title, // CHANGED from 'subject' to 'title'
      description: formData.description,
      scheduledTime: dateObject.toISOString(),
    };
  };

  // --- API Interaction ---
   const fetchLiveSessions = async () => {
    try {
      setLoading(true);
      const res = await getLiveSessions();
      // ADDED more robust check for data structure
      if (res.data && Array.isArray(res.data.sessions)) {
        const formattedSessions = res.data.sessions.map(transformSessionForFrontend).filter(Boolean);
        setClasses(formattedSessions);
      } else {
         throw new Error("Invalid data structure received from server.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not fetch live sessions.");
      console.error("Error fetching sessions:", error.response || error);
      setClasses([]);
    } finally {
      setLoading(false);
    }
  };

 useEffect(() => {
    if (user) { fetchLiveSessions(); }
  }, [user]);

  const handleSaveClass = async (formData) => {
    try {
      const backendPayload = transformDataForBackend(formData);

      if (classToEdit) {
        await updateLiveSession(classToEdit.id, backendPayload);
        toast.success('Session updated successfully!');
      } else {
        // Generate a URL-friendly roomId
        backendPayload.roomId = `${formData.title.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
        await createLiveSession(backendPayload);
        toast.success('Session created successfully!');
      }
      fetchLiveSessions();
      setClassToEdit(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save session.');
      console.error("Save Session Error:", error.response || error);
    }
  };
  
  const handleDeleteClass = async (id) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      try {
        await deleteLiveSession(id);
        toast.success('Live session deleted successfully!');
        fetchLiveSessions();
        if (classToEdit && classToEdit.id === id) {
          setClassToEdit(null);
        }
      } catch (error){
        toast.error('Failed to delete session.');
      }
    }
  };
  
  const handleEditClick = (cls) => {
    setClassToEdit(cls);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-200px)] dark:text-slate-200 flex flex-col items-center justify-center text-center px-6">
        <FaExclamationTriangle className="text-5xl text-amber-500 mb-4" />
        <h1 className="text-3xl font-bold">Access Denied</h1>
        <p className="mt-2 text-slate-500">You must be logged in to view live classes.</p>
        <Link to="/login" className="mt-6 bg-primary text-white font-semibold py-2 px-6 rounded-lg hover:bg-primary-focus">Go to Login</Link>
      </div>
    );
  }

  // FIX: REMOVED the frontend filter. The component now simply displays whatever the backend sends.
  const visibleClasses = classes;

  return (
    <div className="bg-gradient-to-br from-blue-100 via-white to-primary-light dark:from-dark-bg dark:via-dark-card dark:to-blue-900 min-h-screen relative overflow-x-hidden">
      {/* ... The rest of the component JSX is unchanged and correct ... */}
       <FaCalendarAlt className="hidden md:block absolute left-10 top-24 text-primary/10 dark:text-primary/20 text-[8rem] animate-float-slow z-0" />
      <FaChalkboardTeacher className="hidden md:block absolute right-10 bottom-24 text-blue-400/10 dark:text-blue-700/20 text-[7rem] animate-float-slow2 z-0" />
      <div className="py-12 text-center rounded-b-3xl">
        <h1 className="text-4xl lg:text-5xl font-extrabold text-primary dark:text-white drop-shadow flex items-center justify-center gap-3">
          <FaChalkboardTeacher className="text-4xl" /> Live Classes
        </h1>
        <p className="text-slate-600 dark:text-slate-300 mt-2 max-w-2xl mx-auto px-4">
          {user.role === 'teacher' ? 'Create and manage your live sessions.' : 'Join upcoming live classes from top educators.'}
        </p>
      </div>
      <div className="container mx-auto px-4 md:px-8 py-12 relative z-10">
        <div className={user.role === 'teacher' ? "grid grid-cols-1 lg:grid-cols-3 gap-12" : ""}>
          {user.role === 'teacher' && (
            <div className="lg:col-span-1">
              <ScheduleForm onSave={handleSaveClass} classToEdit={classToEdit} onCancelEdit={() => setClassToEdit(null)} />
            </div>
          )}
          <div className={user.role === 'teacher' ? 'lg:col-span-2' : 'w-full'}>
            <h2 className="text-2xl font-bold mb-6 text-primary dark:text-primary-light tracking-tight flex items-center gap-2">
              <FaChalkboardTeacher className="text-2xl" /> 
              {user.role === 'teacher' ? 'Your Live Sessions' : 'Upcoming Live Sessions'}
            </h2>
            {loading ? (
                <div className="text-center text-slate-500 py-12">Loading sessions...</div>
            ) : visibleClasses.length === 0 ? (
              <div className="text-center text-slate-400 dark:text-slate-500 py-12">
                <FaExclamationTriangle className="mx-auto text-4xl mb-2" />
                {user.role === 'teacher' ? "You haven't scheduled any classes yet." : "No live classes are scheduled yet."}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {visibleClasses.map((cls, idx) => {
                  const today = new Date().toISOString().slice(0, 10);
                  const isToday = cls.date === today;
                  return (
                    <div
                      key={cls.id}
                      className="relative group bg-white/80 dark:bg-dark-card/90 backdrop-blur-md rounded-3xl shadow-2xl flex flex-col border border-primary/10 dark:border-primary/20 hover:scale-[1.045] hover:shadow-[0_8px_32px_0_rgba(0,123,255,0.18)] hover:border-primary/40 dark:hover:border-primary/40 transition-all duration-200 overflow-hidden cursor-pointer"
                      style={{ boxShadow: '0 2px 16px 0 rgba(80,120,255,0.10)' }}
                    >
                       <div className="absolute left-0 top-0 h-full w-2 bg-gradient-to-b from-primary via-blue-400 to-green-400 dark:from-primary dark:via-blue-700 dark:to-green-700 animate-pulse rounded-l-3xl" />
                      <div className="absolute -top-6 left-4 z-10 text-blue-300 dark:text-blue-700/60 text-5xl opacity-30 pointer-events-none animate-float-calendar"><FaCalendarAlt /></div>
                      {isToday && (
                        <span className="absolute -top-3 left-20 bg-gradient-to-r from-green-500 via-green-400 to-green-300 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg animate-bounce z-20 border-2 border-white dark:border-dark-card">Today</span>
                      )}
                      {idx === 0 && (
                        <span className="absolute right-4 top-4 z-10 bg-gradient-to-r from-green-400 via-blue-400 to-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-md animate-bounce-slow">NEW</span>
                      )}
                      <div className="p-6 flex-grow flex flex-col gap-2">
                        <span className="text-xs bg-primary/10 text-primary dark:text-sky-400 font-semibold px-3 py-1 rounded-full w-fit mb-1 tracking-wide shadow-sm">{cls.subject}</span>
                        <h3 className="text-xl font-bold mt-1 dark:text-slate-200 flex items-center gap-2"><FaChalkboardTeacher className="text-lg text-primary/60 dark:text-primary-light/70" /> {cls.subject}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2"><span className="font-semibold text-slate-700 dark:text-slate-200">{cls.teacher}</span></p>
                        <div className="flex items-center gap-6 mt-2 text-sm">
                          <span className="flex items-center gap-1.5 text-blue-700 dark:text-blue-200"><FaCalendarAlt /> {cls.date}</span>
                          <span className="flex items-center gap-1.5 text-green-700 dark:text-green-200"><FaClock /> {cls.time}</span>
                        </div>
                      </div>
                      <div className="p-4">
                        {user.role === 'teacher' ? (
                          <div className="flex gap-2">
                            <button onClick={() => handleEditClick(cls)} className="w-full bg-primary/10 text-primary font-semibold py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-primary/30 hover:text-primary-focus transition-all duration-150 shadow-sm" title="Edit"><FaEdit /> Edit</button>
                            <button onClick={() => handleDeleteClass(cls.id)} className="w-full bg-red-500/10 text-red-500 font-semibold py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-red-500/30 hover:text-red-600 transition-all duration-150 shadow-sm" title="Delete"><FaTrash /> Delete</button>
                          </div>
                        ) : (
                          <NavLink to='/lecture' className="w-full bg-gradient-to-r from-primary via-blue-400 to-green-400 text-white font-bold py-2 rounded-lg hover:from-primary-focus hover:to-green-500 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-150 scale-100 group-hover:scale-105 border-2 border-transparent hover:border-primary/40"> <FaChalkboardTeacher /> Join Now</NavLink>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-bounce-slow { animation: bounce-slow 2.2s infinite; }
        @keyframes float-calendar {
          0%, 100% { transform: translateY(0) rotate(-6deg); }
          50% { transform: translateY(-10px) rotate(6deg); }
        }
        .animate-float-calendar { animation: float-calendar 6s ease-in-out infinite; }
        @keyframes float-slow {
          0% { transform: translateY(0px) rotate(-6deg); }
          50% { transform: translateY(-18px) rotate(6deg); }
          100% { translateY(0px) rotate(-6deg); }
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
export default LiveClassesPage;