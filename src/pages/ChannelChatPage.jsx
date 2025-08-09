import React, { useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import LiveChatsTeacher from '../components/LiveChatsTeacher';
import { FiUpload, FiX, FiFileText, FiVideo } from 'react-icons/fi';
import { motion } from 'framer-motion';

// --- Reusable Modal for Uploading Files ---
const UploadModal = ({ isOpen, onClose, onUpload, uploadType }) => {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (file) {
      onUpload(file, description);
      onClose(); // Close the modal after upload
    } else {
      alert(`Please select a ${uploadType} file to upload.`);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="bg-white dark:bg-dark-card w-full max-w-lg p-6 rounded-xl shadow-lg relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"><FiX/></button>
        <h2 className="text-2xl font-bold mb-4">Upload {uploadType === 'note' ? 'New Note' : 'New Video'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Select File</label>
            <input type="file" onChange={handleFileChange} required className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"/>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description (Optional)</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows="2" className="w-full mt-1 p-2 bg-slate-100 dark:bg-slate-700 rounded-lg"></textarea>
          </div>
          <button type="submit" className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary-focus flex items-center justify-center gap-2">
            <FiUpload/> Upload and Share
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};


const ChannelChatPage = () => {
    const { user } = useContext(AuthContext);
    const { channelId } = useParams();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [uploadType, setUploadType] = useState('note'); // 'note' or 'video'

    // Unified state for all chat messages (text, notes, videos)
    const [messages, setMessages] = useState([
      { id: 1, type: 'text', author: 'Dr. Evelyn Reed', content: 'Welcome to the channel! I will be sharing notes and videos here.', time: '1h ago', role: 'teacher' },
    ]);

    const handleNewMessage = (content, type) => {
      let newMsg;
      if (type === 'text') {
        newMsg = {
          id: Date.now(),
          type: 'text',
          author: user?.name || 'Teacher',
          role: user?.role || 'teacher',
          time: 'Just now',
          content: content
        };
      } else if (type === 'note' || type === 'video') {
        newMsg = {
          id: Date.now(),
          type,
          author: user?.name || 'Teacher',
          role: user?.role || 'teacher',
          time: 'Just now',
          fileName: content.name,
          fileSize: type === 'note' ? `${(content.size / 1024).toFixed(1)} KB` : `${(content.size / 1024 / 1024).toFixed(1)} MB`,
          url: URL.createObjectURL(content)
        };
      }
      setMessages(prev => [...prev, newMsg]);
    };

    if (user?.role !== 'teacher') {
        return <div className="text-center py-20 min-h-screen"><h1 className="text-3xl font-bold">Access Denied</h1></div>;
    }

    return (
        <>
            <UploadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onUpload={handleNewMessage} uploadType={uploadType} />
            <div className="flex h-full bg-white dark:bg-dark-bg">
              {/* Sidebar placeholder (replace with your actual sidebar if needed) */}
              <div className="hidden md:block w-50 bg-slate-100 dark:bg-dark-card h-full"></div>
              {/* Main chat area */}
              <div className="flex-1 h-full">
                <LiveChatsTeacher messages={messages} onSendMessage={handleNewMessage} />
              </div>
            </div>
        </>
    );
};

export default ChannelChatPage;