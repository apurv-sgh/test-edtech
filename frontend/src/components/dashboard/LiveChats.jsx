import React, { useState, useRef, useEffect } from 'react';
import { FaPaperPlane, FaUserTie, FaUserGraduate } from 'react-icons/fa';

// --- Reusable Message Component ---
const ChatMessage = ({ msg }) => {
  // We'll assume the current logged-in user is 'You' for this simulation
  const isYou = msg.author === 'You';
  const isTeacher = msg.role === 'teacher';

  const alignmentClass = isYou ? 'justify-end' : 'justify-start';
  const bubbleColor = isYou 
    ? 'bg-primary text-white rounded-br-none' 
    : isTeacher 
      ? 'bg-slate-200 dark:bg-dark-card rounded-bl-none' 
      : 'bg-white dark:bg-slate-700 rounded-bl-none';

  return (
    <div className={`flex items-end gap-2 ${alignmentClass}`}>
      <div className="max-w-xs lg:max-w-md">
        <div className={`px-4 py-2 rounded-xl ${bubbleColor} shadow-sm`}>
          <div className="flex items-center mb-1 text-xs">
            {isTeacher ? <FaUserTie className="mr-1.5 text-primary" /> : <FaUserGraduate className="mr-1.5 text-slate-500" />}
            <span className={`font-bold mr-2 ${isYou ? 'text-white' : 'text-slate-800 dark:text-white'}`}>{msg.author}</span>
            <span className={`${isYou ? 'text-white/70' : 'text-slate-500 dark:text-slate-400'}`}>{msg.time}</span>
          </div>
          <p className="text-sm break-words">{msg.content}</p>
        </div>
      </div>
    </div>
  );
};


const LiveChats = () => {
  const [messages, setMessages] = useState([
    { id: 1, author: 'Dr. Evelyn Reed', content: 'Welcome everyone! Feel free to ask any questions.', time: '2h ago', role: 'teacher' },
    { id: 2, author: 'Alex Sims', content: 'This is great, thank you!', time: '1h ago', role: 'student' },
    { id: 3, author: 'Luna Zhu', content: 'Will these slides be available later?', time: '30m ago', role: 'student' },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const chatEndRef = useRef(null);

  // This effect automatically scrolls to the bottom whenever the messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    // preventDefault stops the page from reloading on form submission
    e.preventDefault(); 
    if (newMessage.trim()) {
      const newMsg = {
        id: Date.now(),
        author: 'You', // In a real app, this would come from your AuthContext
        content: newMessage,
        time: 'Just now',
        role: 'student', // This would also come from the logged-in user
      };
      setMessages([...messages, newMsg]);
      setNewMessage('');
    }
  };

  return (
    // The main container fills the height of its parent
    <div className="flex flex-col h-full bg-primary-light/50 dark:bg-dark-bg rounded-xl shadow-inner">
      <div className="flex-grow overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-primary/50 scrollbar-track-transparent pr-3">
        {messages.map(message => (
          <ChatMessage key={message.id} msg={message} />
        ))}
        {/* This empty div is the target for our auto-scroll */}
        <div ref={chatEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-dark-card/50 rounded-b-xl">
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
    </div>
  );
};

export default LiveChats;