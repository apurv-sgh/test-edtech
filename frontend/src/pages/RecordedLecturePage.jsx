import React, { useState, useContext } from 'react';
import { FaFileAlt, FaDownload, FaPlay } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Alert from '../components/Alert';
import { AuthContext } from '../context/AuthContext';

// --- DUMMY DATA for a sample recorded lecture ---
const recordedLecture = {
    title: 'Introduction to SOLID Principles in Object-Oriented Design',
    teacher: 'Dr. Evelyn Reed',
    videoId: 'HnoPHq_sS-A', // The main video for this page
    notes: [
        { id: 1, title: 'SOLID Principles Cheatsheet', uploaded: '1 week ago' },
        { id: 2, title: 'Full Lecture Slides (PDF)', uploaded: '1 week ago' },
    ],
    // A list of other related videos from the same teacher/series
    relatedVideos: [
      { id: '1-M_4C3gXoY', title: 'Understanding Design Patterns', duration: '15:20' },
      { id: '8m4-K-n8g-w', title: 'API Design Best Practices', duration: '22:45' },
      { id: 'Ke90Tje7VS0', title: 'Advanced C++ for Professionals', duration: '45:10' },
    ]
};

// Reusable Carousel for related videos
const RelatedVideosCarousel = ({ videos, teacher }) => (
  <div className="mt-10">
    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">More from {teacher}</h3>
    <div className="flex gap-5 pb-4 -mx-1 px-1 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600 scrollbar-track-transparent">
      {videos.map(video => (
        <div key={video.id} className="w-64 flex-shrink-0">
          <Link to="#" className="block group">
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

const RecordedLecturePage = () => {
    // In a real app, you would use useParams() and useEffect to fetch lecture data
    const { user } = useContext(AuthContext);
    const [alert, setAlert] = useState({ show: false, message: '', type: '' });
    
    const lectureData = recordedLecture;

    const handleDownloadClick = () => {
        if (user) {
            setAlert({ show: true, message: 'Your download will begin shortly!', type: 'success' });
        } else {
            setAlert({ show: true, message: 'Please login to download this lecture.', type: 'login_required' });
        }
    };

    return (
        <div className="w-full px-4 mx-auto py-8 font-sans text-slate-800 dark:text-slate-200 min-h-screen flex flex-col bg-slate-50 dark:bg-dark-bg">
            <div className="mb-6">
                <h4 className="text-primary dark:text-sky-400 font-bold border-b-2 border-slate-200 dark:border-slate-700 pb-2 text-2xl">{lectureData.title}</h4>
            </div>

            {/* --- NEW TWO-COLUMN LAYOUT for recorded videos --- */}
            <div className="flex-grow grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* --- Left Column: Video Player & Related Videos --- */}
                <main className="lg:col-span-2">
                    <div className="bg-black rounded-xl shadow-lg aspect-video">
                        {/* YouTube Iframe for the main video */}
                        <iframe 
                            src={`https://www.youtube.com/embed/${lectureData.videoId}`} 
                            title={lectureData.title}
                            frameBorder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen
                            className="w-full h-full rounded-xl"
                        ></iframe>
                    </div>
                    <RelatedVideosCarousel videos={lectureData.relatedVideos} teacher={lectureData.teacher} />
                </main>

                {alert.show && (
                    <Alert 
                        message={alert.message}
                        type={alert.type}
                        inDismiss={() => setAlert({ show: false, message: '', type: '' })}
                    />
                )}

                {/* --- Right Column: Simplified Sidebar with ONLY Notes --- */}
                <aside className="lg:col-span-1 bg-white dark:bg-dark-card rounded-xl shadow-lg h-full max-h-[85vh] flex flex-col">
                    <div className="bg-primary text-white font-semibold text-lg px-6 py-4 flex-shrink-0 rounded-t-xl">
                        Lecture Notes
                    </div>
                    <div className="overflow-y-auto flex-grow p-2">
                        <div className="space-y-1">
                            {lectureData.notes.map(note => (
                                <div key={note.id} className="p-3 flex justify-between items-center rounded-lg hover:bg-primary-light/50 dark:hover:bg-slate-700/50">
                                    <div className="flex items-center gap-3">
                                        <FaFileAlt className="text-primary"/>
                                        <div>
                                            <div className="font-medium text-slate-800 dark:text-white">{note.title}</div>
                                            <div className="text-sm text-slate-500 dark:text-slate-400">{note.uploaded}</div>
                                        </div>
                                    </div>
                                    <button onClick={handleDownloadClick} className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors" title="Download Notes">
                                        <FaDownload/>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    )
};

export default RecordedLecturePage;