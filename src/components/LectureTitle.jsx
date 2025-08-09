import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LiveChats from './LiveChats'; 
import { FaUsers, FaFileAlt, FaDownload, FaExpand, FaCompress, FaVideo, FaPlay } from 'react-icons/fa';

// --- UPDATED DUMMY DATA with richer content for the new layout ---
const currentLecture = {
    title: 'Quantum Mechanics - The Double-Slit Experiment Explained',
    teacher: 'Dr. Evelyn Reed',
    notes: [
        { id: 1, title: 'Lecture 1: Introduction to Quantum States', uploaded: '2 days ago' },
        { id: 2, title: 'Lecture 2: Wave-Particle Duality', uploaded: '1 day ago' },
    ],
    participants: [
        { id: 1, name: 'Dr. Evelyn Reed', role: 'Professor', online: true, avatar: 'https://placehold.co/100x100/A78BFA/FFFFFF?text=ER' },
        { id: 2, name: 'Alex Sims', role: 'TA', online: true, avatar: 'https://placehold.co/100x100/FBBF24/FFFFFF?text=AS' },
        { id: 3, name: 'Luna Zhu', role: 'Student', online: true, avatar: 'https://placehold.co/100x100/4ADE80/FFFFFF?text=LZ' },
        { id: 4, name: 'John Doe', role: 'Student', online: false, avatar: 'https://placehold.co/100x100/F472B6/FFFFFF?text=JD' },
    ],
    // Added a list of recent videos from the same teacher
    recentVideos: [
      { id: 'HnoPHq_sS-A', title: 'The History of AI and Machine Learning', duration: '10:10' },
      { id: '1-M_4C3gXoY', title: 'C Language Tutorial for Beginners', duration: '10:03:19' },
      { id: '8m4-K-n8g-w', title: 'Python Tutorial For Beginners in Hindi', duration: '10:53:55' },
    ]
};

// --- A New, Reusable Component for the Recent Videos Carousel ---
const RecentVideosCarousel = ({ videos, teacher }) => (
  <div className="mt-10">
    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">More from {teacher}</h3>
    <div className="flex gap-5 pb-4 -mx-1 px-1 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600 scrollbar-track-transparent">
      {videos.map(video => (
        <div key={video.id} className="w-64 flex-shrink-0">
          <Link to="/recorded-lecture" className="block group">
            <div className="relative aspect-video rounded-xl overflow-hidden shadow-md">
              <img src={`https://i3.ytimg.com/vi/${video.id}/mqdefault.jpg`} alt={video.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"/>
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><FaPlay className="text-white text-4xl"/></div>
              <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded-md font-semibold">{video.duration}</div>
            </div>
            <div className="pt-2">
              <h4 className="font-semibold text-slate-700 dark:text-white text-sm truncate">{video.title}</h4>
            </div>
          </Link>
        </div>
      ))}
    </div>
  </div>
);


const LectureTitle = () => {
    const [sidebarTab, setSidebarTab] = useState('chat'); // Default to 'chat' for engagement
    const [isFullscreen, setIsFullscreen] = useState(false);
    const videoPlayerRef = useRef(null);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement && videoPlayerRef.current) {
            videoPlayerRef.current.requestFullscreen().catch(err => alert(`Error: ${err.message}`));
        } else {
            document.exitFullscreen();
        }
    };

    useEffect(() => {
        const onFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener('fullscreenchange', onFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
    }, []);

    return (
        <div className="w-full px-4 mx-auto py-8 font-sans text-slate-800 dark:text-slate-200 min-h-screen flex flex-col bg-slate-50 dark:bg-dark-bg">
            <div className="mb-6">
                <h4 className="text-primary dark:text-sky-400 font-bold border-b-2 border-slate-200 dark:border-slate-700 pb-2 text-2xl">{currentLecture.title}</h4>
            </div>

            {/* --- NEW TWO-COLUMN LAYOUT --- */}
            <div className="flex-grow grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* --- Left Column: Video Player & Recent Videos --- */}
                <main className="lg:col-span-2">
                    <div ref={videoPlayerRef} className="bg-black rounded-xl shadow-lg h-[60vh] flex flex-col justify-center items-center relative">
                        <div className="absolute top-4 right-4"><button className="text-white p-2 rounded-full bg-black/30 hover:bg-black/50" onClick={toggleFullscreen} title="Toggle Fullscreen">{isFullscreen ? <FaCompress /> : <FaExpand />}</button></div>
                        <div className="text-center text-white"><FaVideo className="text-6xl text-slate-500 mb-4"/><h3 className="text-2xl font-bold">Live Stream Offline</h3><p className="mt-2 text-slate-400">The lecture will begin at the scheduled time.</p></div>
                    </div>
                    <RecentVideosCarousel videos={currentLecture.recentVideos} teacher={currentLecture.teacher} />
                </main>

                {/* --- Right Column: Sidebar with Tabs --- */}
                <aside className="lg:col-span-1 bg-white dark:bg-dark-card rounded-xl shadow-lg h-full max-h-[70vh] flex flex-col">
                    <div className="p-2 bg-primary-light/60 dark:bg-slate-800 rounded-t-xl flex-shrink-0">
                        <div className="bg-slate-200 dark:bg-slate-900 p-1 rounded-lg flex justify-around">
                            <button onClick={() => setSidebarTab('chat')} className={`w-1/3 py-2 rounded-md font-semibold ${sidebarTab === 'chat' ? 'bg-primary text-white' : 'text-slate-600'}`}>Chat</button>
                            <button onClick={() => setSidebarTab('participants')} className={`w-1/3 py-2 rounded-md font-semibold ${sidebarTab === 'participants' ? 'bg-primary text-white' : 'text-slate-600'}`}>Participants</button>
                            <button onClick={() => setSidebarTab('notes')} className={`w-1/3 py-2 rounded-md font-semibold ${sidebarTab === 'notes' ? 'bg-primary text-white' : 'text-slate-600'}`}>Notes</button>
                        </div>
                    </div>
                    <div className="overflow-y-auto flex-grow">
                        {sidebarTab === 'chat' && <LiveChats />}
                        {sidebarTab === 'participants' && (
                            <div className="space-y-1 p-2">
                                {currentLecture.participants.map(p => (
                                    <div key={p.id} className="p-3 flex items-center gap-3 rounded-lg hover:bg-primary-light/50 dark:hover:bg-slate-700/50">
                                        <img src={p.avatar} alt={p.name} className="w-8 h-8 rounded-full" />
                                        <div>
                                            <div className="font-medium text-slate-800 dark:text-white">{p.name}</div>
                                            <div className="text-sm text-slate-500 dark:text-slate-400">{p.role}</div>
                                        </div>
                                        <span className={`w-2 h-2 rounded-full ml-auto ${p.online ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                                    </div>
                                ))}
                            </div>
                        )}
                        {sidebarTab === 'notes' && (
                             <div className="space-y-1 p-2">
                                {currentLecture.notes.map(n => (
                                    <div key={n.id} className="p-3 flex justify-between items-center rounded-lg hover:bg-primary-light/50 dark:hover:bg-slate-700/50">
                                        <div className="flex items-center gap-3"><FaFileAlt className="text-primary"/><div><div className="font-medium text-slate-800 dark:text-white">{n.title}</div><div className="text-sm text-slate-500 dark:text-slate-400">{n.uploaded}</div></div></div>
                                        <button className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20"><FaDownload/></button>
                                    </div>
                                ))}
                             </div>
                        )}
                    </div>
                </aside>
            </div>
        </div>
    );
};
export default LectureTitle;