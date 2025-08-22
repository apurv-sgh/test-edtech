import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiPlus, FiSearch, FiVideo, FiTrash, FiX, FiDownload } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

// --- DUMMY DATA for initial videos ---
const initialVideos = [
  { id: 1, title: 'Introduction to Quantum Mechanics', category: 'Physics', fileName: 'quantum_intro.mp4', fileSize: '152.3 MB' },
  { id: 2, title: 'Mastering Alkane Reactions', category: 'Chemistry', fileName: 'alkane_reactions.mp4', fileSize: '250.1 MB' },
  { id: 3, title: 'Solving Advanced Limits', category: 'Maths', fileName: 'advanced_limits.mov', fileSize: '98.5 MB' },
];
const videoCategories = ['All', 'Physics', 'Chemistry', 'Maths', 'Biology'];

// --- Reusable Modal Component for the Upload Form ---
const VideoUploadModal = ({ isOpen, onClose, onUpload }) => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(videoCategories[1]);
  const [description, setDescription] = useState('');

  const handleFileChange = (e) => { if (e.target.files[0]) { setFile(e.target.files[0]); } };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file || !title) { alert('Please provide a title and select a file.'); return; }
    const newVideo = { id: Date.now(), title, category, description, fileName: file.name, fileSize: `${(file.size / 1024 / 1024).toFixed(1)} MB` };
    onUpload(newVideo);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="bg-white dark:bg-dark-card w-full max-w-lg p-6 rounded-xl shadow-lg relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"><FiX/></button>
        <h2 className="text-2xl font-bold mb-4">Upload New Video</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label>Video Title</label><input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full mt-1 p-2 bg-slate-100 dark:bg-slate-700 rounded-lg"/></div>
          <div><label>Category</label><select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full mt-1 p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">{videoCategories.slice(1).map(c => <option key={c}>{c}</option>)}</select></div>
          <div><label>Description</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} rows="3" className="w-full mt-1 p-2 bg-slate-100 dark:bg-slate-700 rounded-lg" placeholder="A brief summary of the video..."></textarea></div>
          <div><label>Video File</label><input type="file" onChange={handleFileChange} required accept="video/mp4,video/x-m4v,video/*" className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"/></div>
          <button type="submit" className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary-focus">Upload Video</button>
        </form>
      </motion.div>
    </motion.div>
  );
};

const UploadVideosPage = () => {
  const { user } = useContext(AuthContext);
  const [videos, setVideos] = useState(initialVideos);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const handleUploadVideo = (newVideo) => setVideos(prev => [newVideo, ...prev]);
  const handleDeleteVideo = (id) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      setVideos(videos.filter(v => v.id !== id));
    }
  };
  
  const filteredVideos = videos.filter(video => {
    const matchesCategory = activeCategory === 'All' || video.category === activeCategory;
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (user?.role !== 'teacher') {
    return ( <div className="text-center py-20 min-h-screen"><h1 className="text-3xl font-bold">Access Denied</h1><p className="mt-2 text-slate-500">Only teachers can manage videos.</p></div> );
  }

  return (
    <>
      <VideoUploadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onUpload={handleUploadVideo} />
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Upload Videos</h1>
          <button onClick={() => setIsModalOpen(true)} className="bg-primary text-white font-semibold py-2 px-5 rounded-lg flex items-center gap-2 hover:bg-primary-focus">
            <FiPlus /> Upload New Video
          </button>
        </div>

        <div className="mb-8 p-4 bg-white dark:bg-dark-card rounded-xl shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="md:col-span-2">
              <label className="text-sm font-medium">Search Videos</label>
              <div className="relative mt-1"><FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/><input type="text" placeholder="Search by title..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 p-2 bg-slate-100 dark:bg-slate-800/50 rounded-lg"/></div>
            </div>
            <div>
              <label className="text-sm font-medium">Filter by Category</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {videoCategories.map(cat => ( <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-3 py-1.5 text-sm font-semibold rounded-full ${activeCategory === cat ? 'bg-primary text-white' : 'bg-slate-200 dark:bg-slate-700'}`}>{cat}</button>))}
              </div>
            </div>
          </div>
        </div>
        
        {videos.length === 0 ? (
          <div className="text-center py-20 bg-primary-light/50 rounded-xl">
            <FiVideo className="mx-auto h-16 w-16 text-slate-400" />
            <h2 className="mt-4 text-2xl font-semibold">No Videos Uploaded Yet</h2>
            <p className="text-slate-500 mt-2">Get started by uploading your first video for your students.</p>
            <button onClick={() => setIsModalOpen(true)} className="mt-6 bg-primary text-white font-semibold py-2 px-6 rounded-lg">Upload Your First Video</button>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {filteredVideos.map(video => (
                <motion.div
                  key={video.id} layout
                  initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -50 }}
                  className="bg-white dark:bg-dark-card p-4 rounded-xl shadow-md flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg bg-slate-200 dark:bg-slate-700 flex-shrink-0 flex items-center justify-center">
                      <FiVideo className="text-primary text-3xl"/>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{video.title}</h3>
                      <p className="text-sm text-slate-500">{video.fileName} • {video.fileSize}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs bg-primary/10 text-primary font-semibold px-2 py-1 rounded-full">{video.category}</span>
                    <button onClick={() => handleDeleteVideo(video.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-full" title="Delete"><FiTrash/></button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {filteredVideos.length === 0 && <p className="text-center text-slate-500 py-10">No videos found matching your filters.</p>}
          </div>
        )}
      </div>
    </>
  );
};

export default UploadVideosPage;