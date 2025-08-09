import React, { useState, useContext, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPaperPlane, FaUserTie, FaUserGraduate, FaPaperclip, FaImage, FaCamera, 
  FaFileAlt, FaUser, FaPoll, FaPaintBrush, FaSmile 
} from 'react-icons/fa';

// --- Reusable Message Component (No changes needed) ---
const ChatMessage = ({ msg }) => {
  const isTeacher = msg.role === 'teacher';
  return (
    <div className={`flex ${isTeacher ? 'justify-end' : 'justify-start'} w-full`}>
      <div className={`max-w-[70%] px-4 py-2 rounded-2xl shadow-md mb-2 ${isTeacher ? 'bg-primary text-white rounded-br-none' : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-bl-none'}`}>
        <div className="flex items-center gap-2 mb-1">
          <span className="font-bold text-sm">{msg.author}</span>
          <span className="text-xs opacity-60">{msg.time}</span>
        </div>
        {msg.type === 'text' && <div className="whitespace-pre-line text-base">{msg.content}</div>}
        {msg.type === 'note' && (
          <div className="flex flex-col gap-1">
            <a href={msg.url} target="_blank" rel="noopener noreferrer" className="text-primary underline font-semibold flex items-center gap-2">
              <FaFileAlt className="inline" /> {msg.fileName}
            </a>
            <span className="text-xs text-slate-400">{msg.fileSize}</span>
          </div>
        )}
        {msg.type === 'video' && (
          <video src={msg.url} controls className="rounded-lg mt-2 max-h-48 w-full" />
        )}
      </div>
    </div>
  );
};

// --- NEW Data for the Attachment Menu ---

// We'll use refs to trigger file input clicks
const attachmentOptions = [
  { icon: <FaImage />, label: 'Photos & videos', accept: 'image/*,video/*', type: 'media' },
  { icon: <FaFileAlt />, label: 'Document', accept: '.pdf,.doc,.docx,.ppt,.pptx,.txt', type: 'doc' },
];


const LiveChatsTeacher = ({ messages: propMessages, onSendMessage }) => {
  const { user } = useContext(AuthContext);
  // If messages are provided as prop, use them; else, use local state (for fallback/demo)
  const [localMessages, setLocalMessages] = useState([
    { id: 1, author: 'Dr. Evelyn Reed', content: 'Welcome everyone!', time: '2h ago', role: 'teacher' },
    { id: 2, author: 'Alex Sims', content: 'Excited for this class!', time: '1h ago', role: 'student' },
  ]);
  const messages = propMessages || localMessages;
  const [newMessage, setNewMessage] = useState('');
  const [isAttachmentMenuOpen, setAttachmentMenuOpen] = useState(false);
  const chatEndRef = useRef(null);
  // File input refs
  const mediaInputRef = useRef();
  const docInputRef = useRef();

  // Handle file selection
  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    // Fallbacks for user.name and user.role
    const author = user.name || user.username || 'Teacher';
    const role = user.role || 'teacher';
    let msgType = 'note';
    if (type === 'media') {
      // If video, use 'video', else 'note' for images
      if (file.type.startsWith('video/')) msgType = 'video';
      else msgType = 'note';
    }
    // For docs, always 'note'
    const newMsg = {
      id: Date.now(),
      author,
      role,
      time: 'Just now',
      type: msgType,
      fileName: file.name,
      fileSize: file.size > 1024 * 1024
        ? `${(file.size / 1024 / 1024).toFixed(1)} MB`
        : `${(file.size / 1024).toFixed(1)} KB`,
      url: URL.createObjectURL(file),
    };
    setLocalMessages(prev => [...prev, newMsg]); // Always update local state for instant feedback
    if (onSendMessage) {
      onSendMessage(file, msgType);
    }
    setAttachmentMenuOpen(false);
    // Reset input value so same file can be uploaded again
    e.target.value = '';
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!user || !newMessage.trim()) return;
    const author = user.name || user.username || 'Teacher';
    const role = user.role || 'teacher';
    const newMsg = { id: Date.now(), author, content: newMessage, time: 'Just now', role, type: 'text' };
    setLocalMessages(prev => [...prev, newMsg]); // Always update local state for instant feedback
    if (onSendMessage) {
      onSendMessage(newMessage, 'text');
    }
    setNewMessage('');
  };

  return (
    <div className="flex h-full min-h-0 w-full bg-gradient-to-br from-primary/10 via-white to-slate-100 dark:from-dark-bg dark:via-dark-card dark:to-dark-bg rounded-2xl shadow-2xl overflow-hidden">
      {/* Optional Sidebar for future features (participants, info, etc.) */}
      {/* <aside className="hidden md:block w-64 bg-white/80 dark:bg-dark-card/80 border-r border-slate-200 dark:border-slate-700 p-6">
        <h3 className="font-bold text-lg mb-4">Class Info</h3>
        ...
      </aside> */}
      <div className="flex-1 flex flex-col h-full min-h-0 w-full">
        {/* Sticky Header */}
        <header className="sticky top-0 z-10 bg-primary text-white font-semibold text-lg px-8 py-5 rounded-t-2xl shadow-md flex items-center gap-3">
          <FaUserTie className="w-6 h-6" /> Live Group Chat
        </header>
        {/* Chat Messages Area */}
        <main className="flex-1 overflow-y-auto px-6 py-6 space-y-3 scrollbar-hide bg-transparent">
          {messages.map(message => (<ChatMessage key={message.id} msg={message} />))}
          <div ref={chatEndRef} />
        </main>
        {/* Chat Input Area */}
        <footer className="sticky bottom-0 z-10 bg-white/90 dark:bg-dark-card/90 border-t border-slate-200 dark:border-slate-700 px-6 py-4 flex-shrink-0 flex items-center gap-2 rounded-b-2xl shadow-md">
          {user ? (
            <form onSubmit={handleSendMessage} className="flex items-center gap-2 w-full">
              {/* Attachment Button for Teachers */}
              {user.role === 'teacher' && (
                <div className="relative">
                  <button 
                    type="button" 
                    onClick={() => setAttachmentMenuOpen(!isAttachmentMenuOpen)}
                    className="p-3 rounded-full text-slate-500 dark:text-slate-400 hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    <FaPaperclip className="w-5 h-5" />
                  </button>
                  <AnimatePresence>
                    {isAttachmentMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="absolute bottom-full mb-2 w-64 bg-white/90 dark:bg-dark-card/90 backdrop-blur-md border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl p-2"
                      >
                        {attachmentOptions.map(opt => (
                          <button
                            key={opt.label}
                            type="button"
                            className="w-full flex items-center gap-4 text-left p-2.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-primary/10 hover:text-primary"
                            onClick={() => {
                              if (opt.type === 'media') mediaInputRef.current.click();
                              if (opt.type === 'doc') docInputRef.current.click();
                            }}
                          >
                            <div className="text-xl">{opt.icon}</div>
                            <span className="font-semibold">{opt.label}</span>
                          </button>
                        ))}
                        {/* Hidden file inputs for upload */}
                        <input
                          ref={mediaInputRef}
                          type="file"
                          accept={attachmentOptions[0].accept}
                          style={{ display: 'none' }}
                          onChange={e => handleFileChange(e, 'media')}
                        />
                        <input
                          ref={docInputRef}
                          type="file"
                          accept={attachmentOptions[1].accept}
                          style={{ display: 'none' }}
                          onChange={e => handleFileChange(e, 'doc')}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
              {/* Emoji Button for Students (or all users) */}
              {user.role !== 'teacher' && (
                <button type="button" className="p-3 rounded-full text-slate-500 dark:text-slate-400 hover:bg-primary/10 hover:text-primary"><FaSmile className="w-5 h-5"/></button>
              )}
              <input 
                type="text" 
                placeholder="Type a message" 
                value={newMessage} 
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-800 dark:text-white focus:outline-none border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary"
              />
              <button 
                type="submit" 
                className="px-5 py-2 bg-primary text-white rounded-full hover:bg-primary-focus transition-colors font-bold shadow-md"
              >
                <FaPaperPlane />
              </button>
            </form>
          ) : (
            <div className="text-center py-3 w-full">
              <Link to="/login" className="font-semibold text-primary hover:underline">
                Login to join the chat
              </Link>
            </div>
          )}
        </footer>
      </div>
    </div>
  );
};

export default LiveChatsTeacher;