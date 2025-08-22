import React, { useState, useContext, useRef, useEffect } from 'react';
import { FaPaperPlane, FaUserTie, FaUserGraduate, FaFilePdf, FaVideo } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';


// Reusable Message Component (refactored for file messages)
const ChatMessage = ({ msg }) => {
  const isYou = msg.author === 'You';
  const isTeacher = msg.role === 'teacher';
  const alignmentClass = isYou ? 'justify-end' : 'justify-start';
  const bubbleColor = isYou 
    ? 'bg-primary text-white rounded-br-none' 
    : isTeacher 
      ? 'bg-slate-200 dark:bg-dark-card rounded-bl-none' 
      : 'bg-white dark:bg-slate-700 rounded-bl-none';
  const authorColor = isTeacher ? 'text-primary dark:text-sky-400' : 'text-slate-600 dark:text-slate-300';

  // File message rendering
  if (msg.type === 'note' || msg.type === 'video') {
    const isVideo = msg.type === 'video';
    const icon = isVideo ? <FaVideo className="text-sky-500 text-3xl flex-shrink-0" /> : <FaFilePdf className="text-red-500 text-3xl flex-shrink-0" />;
    const label = isVideo ? 'Video' : 'Notes';
    const shortName = msg.fileName && msg.fileName.length > 18 ? msg.fileName.slice(0, 8) + '...' + msg.fileName.slice(-8) : msg.fileName;
    return (
      <div className={`flex items-end gap-2 ${alignmentClass}`}>
        <div className="max-w-xs lg:max-w-md">
          <div className={`px-4 py-2 rounded-xl ${bubbleColor} shadow-sm`}>
            <div className="flex items-center mb-1 text-xs">
              {isTeacher ? <FaUserTie className={`mr-1.5 ${authorColor}`} /> : <FaUserGraduate className={`mr-1.5 ${isYou ? 'text-white/70' : 'text-slate-500'}`} />}
              <span className={`font-bold mr-2 ${isYou ? 'text-white' : authorColor}`}>{msg.author}</span>
              <span className={`${isYou ? 'text-white/70' : 'text-slate-500 dark:text-slate-400'}`}>{msg.time}</span>
            </div>
            <div className="flex items-center gap-3 p-2 bg-white/50 dark:bg-slate-600/50 rounded-lg mt-1">
              {icon}
              <div>
                <p className="font-semibold text-sm">{shortName}</p>
                {msg.fileSize && <p className="text-xs opacity-80">{msg.fileSize}</p>}
              </div>
              <a href={msg.url || '#'} target="_blank" rel="noopener noreferrer" className="ml-auto bg-primary/20 text-primary text-xs font-bold px-2 py-1 rounded-md">
                {isVideo ? 'Watch' : 'View'}
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default: text message
  return (
    <div className={`flex items-end gap-2 ${alignmentClass}`}>
      <div className="max-w-xs lg:max-w-md">
        <div className={`px-4 py-2 rounded-xl ${bubbleColor} shadow-sm`}>
          <div className="flex items-center mb-1 text-xs">
            {isTeacher ? <FaUserTie className={`mr-1.5 ${authorColor}`} /> : <FaUserGraduate className={`mr-1.5 ${isYou ? 'text-white/70' : 'text-slate-500'}`} />}
            <span className={`font-bold mr-2 ${isYou ? 'text-white' : authorColor}`}>{msg.author}</span>
            <span className={`${isYou ? 'text-white/70' : 'text-slate-500 dark:text-slate-400'}`}>{msg.time}</span>
          </div>
          <p className="text-sm break-words">{msg.content}</p>
        </div>
      </div>
    </div>
  );
};


const LiveChats = ({ uploadedMessages = [] }) => {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([
    { id: 1, author: 'Dr. Evelyn Reed', content: 'Welcome everyone! What are your initial thoughts on quantum mechanics?', time: '2h ago', role: 'teacher' },
    { id: 2, author: 'Alex Sims', content: 'It feels both confusing and fascinating!', time: '1h ago', role: 'student' },
    { id: 3, author: 'You', content: 'The double-slit experiment is mind-bending.', time: '30m ago', role: 'student' },
    { id: 4, author: 'Luna Zhu', content: 'I agree, especially how observation changes the outcome.', time: '25m ago', role: 'student' },
    { id: 5, author: 'Dr. Evelyn Reed', content: "Exactly! That's the core of the measurement problem we'll discuss today.", time: '15m ago', role: 'teacher' },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const chatEndRef = useRef(null);

  // Merge uploaded file messages with chat messages (uploaded files should appear in chat at correct time)
  // If uploadedMessages have a timestamp, merge and sort; else, append as new messages
  const allMessages = [...messages, ...uploadedMessages]
    .sort((a, b) => {
      // Prefer id or timestamp for sorting; fallback to order
      if (a.id && b.id) return a.id - b.id;
      return 0;
    });

  // Removed auto-scroll effect to prevent page from auto-scrolling down on new messages

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!user || !newMessage.trim()) return;
    const newMsg = {
      id: Date.now(), author: user.name, content: newMessage, time: 'Just now', role: user.role, isUser: true
    };
    setMessages([...messages, newMsg]);
    setNewMessage('');
  };

  return (
    <div className="flex flex-col h-[60vh] bg-white dark:bg-dark-card rounded-xl shadow-lg overflow-hidden">
      <div className="flex-grow overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-primary/50 scrollbar-track-transparent pr-2">
        {allMessages.map(message => (
          <ChatMessage key={message.id} msg={message} />
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* This is the conditional rendering */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex-shrink-0">
        {user ? (
          <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200 dark:border-slate-700 flex-shrink-0">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
              >
                <FaPaperPlane />
              </button>
            </div>
          </form>
        ) : (
          // View for guests users (Not Logged In)
          <div className="text-center">
            <p className="text-slate-500 dark:text-slate-400 mb-3">Please log in to participate in the chat.</p>
            <Link to='/login' className="bg-primary text-white font-semibold py-2 px-6 rounded-lg hover:bg-primary-focus transition-colors">
              Login to Chat
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveChats;
