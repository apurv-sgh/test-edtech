import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiPlus, FiSearch, FiFileText, FiTrash, FiX, FiDownload } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

// --- DUMMY DATA for initial notes ---
const initialNotes = [
  { id: 1, title: 'Chapter 1: Kinematics Cheatsheet', category: 'Physics', fileName: 'kinematics_cheatsheet.pdf', fileSize: '2.3 MB' },
  { id: 2, title: 'Organic Chemistry Naming Conventions', category: 'Chemistry', fileName: 'organic_naming.docx', fileSize: '850 KB' },
  { id: 3, title: 'Calculus Formulas & Theorems', category: 'Maths', fileName: 'calculus_formulas.pptx', fileSize: '4.1 MB' },
];
const noteCategories = ['All', 'Physics', 'Chemistry', 'Maths', 'Biology'];

// --- Reusable Modal Component for the Upload Form ---
const NoteUploadModal = ({ isOpen, onClose, onUpload }) => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(noteCategories[1]);

  const handleFileChange = (e) => { if (e.target.files[0]) { setFile(e.target.files[0]); } };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file || !title) { alert('Please provide a title and select a file.'); return; }
    const newNote = { id: Date.now(), title, category, fileName: file.name, fileSize: `${(file.size / 1024 / 1024).toFixed(1)} MB` };
    onUpload(newNote);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="bg-white dark:bg-dark-card w-full max-w-lg p-6 rounded-xl shadow-lg relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"><FiX/></button>
        <h2 className="text-2xl font-bold mb-4">Upload New Note</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label>Note Title</label><input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full mt-1 p-2 bg-slate-100 dark:bg-slate-700 rounded-lg"/></div>
          <div><label>Category</label><select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full mt-1 p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">{noteCategories.slice(1).map(c => <option key={c}>{c}</option>)}</select></div>
          <div><label>File</label><input type="file" onChange={handleFileChange} required accept=".pdf,.doc,.docx,.ppt,.pptx" className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"/></div>
          <button type="submit" className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary-focus">Upload Note</button>
        </form>
      </motion.div>
    </motion.div>
  );
};


const UploadNotesPage = () => {
  const { user } = useContext(AuthContext);
  const [notes, setNotes] = useState(initialNotes);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const handleUploadNote = (newNote) => setNotes(prev => [newNote, ...prev]);
  const handleDeleteNote = (id) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      setNotes(notes.filter(n => n.id !== id));
    }
  };
  
  const filteredNotes = notes.filter(note => {
    const matchesCategory = activeCategory === 'All' || note.category === activeCategory;
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (user?.role !== 'teacher') {
    return ( <div className="text-center py-20 min-h-screen"><h1 className="text-3xl font-bold">Access Denied</h1><p className="mt-2 text-slate-500">Only teachers can manage notes.</p></div> );
  }

  return (
    <>
      <NoteUploadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onUpload={handleUploadNote} />
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Upload Notes</h1>
          <button onClick={() => setIsModalOpen(true)} className="bg-primary text-white font-semibold py-2 px-5 rounded-lg flex items-center gap-2 hover:bg-primary-focus">
            <FiPlus /> Upload New Note
          </button>
        </div>

        {/* Filters and Search */}
        <div className="mb-8 p-4 bg-white dark:bg-dark-card rounded-xl shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="text-sm font-medium">Search Notes</label>
              <div className="relative mt-1">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                <input type="text" placeholder="Search by title..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 p-2 bg-slate-100 dark:bg-slate-800/50 rounded-lg"/>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Filter by Category</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {noteCategories.map(cat => (
                  <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-3 py-1.5 text-sm font-semibold rounded-full ${activeCategory === cat ? 'bg-primary text-white' : 'bg-slate-200 dark:bg-slate-700'}`}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {notes.length === 0 ? (
          <div className="text-center py-20 bg-primary-light/50 rounded-xl">
            <FiFileText className="mx-auto h-16 w-16 text-slate-400" />
            <h2 className="mt-4 text-2xl font-semibold">No Notes Uploaded Yet</h2>
            <p className="text-slate-500 mt-2">Get started by uploading your first note for your students.</p>
            <button onClick={() => setIsModalOpen(true)} className="mt-6 bg-primary text-white font-semibold py-2 px-6 rounded-lg">Upload Your First Note</button>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {filteredNotes.map(note => (
                <motion.div
                  key={note.id} layout
                  initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -50 }}
                  className="bg-white dark:bg-dark-card p-4 rounded-xl shadow-md flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <FiFileText className="text-primary text-2xl flex-shrink-0"/>
                    <div>
                      <h3 className="font-bold text-lg">{note.title}</h3>
                      <p className="text-sm text-slate-500">{note.fileName} • {note.fileSize}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs bg-primary/10 text-primary font-semibold px-2 py-1 rounded-full">{note.category}</span>
                    <a href="#" className="p-2 hover:bg-primary/10 rounded-full" title="Download"><FiDownload/></a>
                    <button onClick={() => handleDeleteNote(note.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-full" title="Delete"><FiTrash/></button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {filteredNotes.length === 0 && <p className="text-center text-slate-500 py-10">No notes found matching your filters.</p>}
          </div>
        )}
      </div>
    </>
  );
};

export default UploadNotesPage;