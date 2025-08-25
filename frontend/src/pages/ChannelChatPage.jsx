import React, { useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import LiveChats from '../components/LiveChats'; // We will pass state to this component
import { FiUpload, FiX, FiFileText, FiVideo } from 'react-icons/fi';
import { motion } from 'framer-motion';

// Reusable Modal for Uploading Files (No changes needed)
const UploadModal = ({ isOpen, onClose, onUpload, uploadType }) => {
    const [file, setFile] = useState(null);
    if (!isOpen) return null;
    const handleSubmit = (e) => { e.preventDefault(); if (file) { onUpload(file, uploadType); onClose(); } else { alert(`Please select a ${uploadType} file.`); } };
    return ( <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"> <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="bg-white dark:bg-dark-card w-full max-w-lg p-6 rounded-xl relative"> <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-200"><FiX /></button> <h2 className="text-2xl font-bold mb-4">Upload {uploadType === 'note' ? 'New Note' : 'New Video'}</h2> <form onSubmit={handleSubmit} className="space-y-4"> <div><label>Select File</label><input type="file" onChange={(e) => setFile(e.target.files[0])} required className="w-full text-sm"/></div> <div><label>Description</label><textarea rows="2" className="w-full mt-1 p-2 bg-slate-100 rounded-lg"></textarea></div> <button type="submit" className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary-focus flex items-center justify-center gap-2"><FiUpload/> Upload and Share</button> </form> </motion.div> </motion.div> );
};

const ChannelChatPage = () => {
    const { user } = useContext(AuthContext);
    const { channelId } = useParams();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [uploadType, setUploadType] = useState('note');

    // --- THIS IS THE SINGLE SOURCE OF TRUTH ---
    // We start with an empty array to trigger the "first time visit" view.
    const [messages, setMessages] = useState([]);

    const handleNewMessage = (content, type) => {
      const newMsg = {
        id: Date.now(),
        type: type,
        author: user?.name || 'Teacher',
        role: user?.role || 'teacher',
        time: 'Just now',
        ...(type === 'text' && { content: content }),
        ...(type !== 'text' && { fileName: content.name, fileSize: `${(content.size / 1024 / 1024).toFixed(1)} MB` }),
      };
      setMessages(prev => [...prev, newMsg]);
    };

    const openUploadModal = (type) => {
      setUploadType(type);
      setIsModalOpen(true);
    };

    if (user?.role !== 'teacher') {
        return <div className="text-center py-20 min-h-screen"><h1 className="text-3xl font-bold">Access Denied</h1></div>;
    }

    return (
        <>
            <UploadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onUpload={handleNewMessage} uploadType={uploadType} />
            <div className="p-4 sm:p-6 lg:p-8 h-full flex flex-col">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Manage Community Channel</h1>
                    <p className="text-slate-500">Upload notes, videos, and chat with your students here.</p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-grow">
                    <div className="lg:col-span-2 h-[75vh]">
                        <LiveChats messages={messages} onSendMessage={handleNewMessage} />
                    </div>
                    <div className="lg:col-span-1">
                         <h2 className="text-xl font-bold mb-4">Content Management</h2>
                         <div className="bg-white dark:bg-dark-card p-6 rounded-xl shadow-md space-y-4">
                            <button onClick={() => openUploadModal('video')} className="w-full bg-primary/10 text-primary font-semibold py-3 rounded-lg flex items-center justify-center gap-3 hover:bg-primary/20">
                                <FiVideo/> Upload Video
                            </button>
                            <button onClick={() => openUploadModal('note')} className="w-full bg-primary/10 text-primary font-semibold py-3 rounded-lg flex items-center justify-center gap-3 hover:bg-primary/20">
                                <FiFileText/> Upload Notes
                            </button>
                         </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default ChannelChatPage;