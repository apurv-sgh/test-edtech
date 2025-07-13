import React, { useState, useContext } from 'react';
// import { NotifyContext } from '../App';
import { FaPaperPlane, FaUserTie, FaUserGraduate } from 'react-icons/fa';

const GroupDiscussion = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      author: 'Teacher',
      content: 'What are your thoughts on Bitcoin as a future currency?',
      time: '2 hours ago',
      role: 'teacher'
    },
    {
      id: 2,
      author: 'Student A',
      content: 'I think it has potential!',
      time: '1 hour ago',
      role: 'student'
    },
    {
      id: 3,
      author: 'Student B',
      content: 'It is too volatile for now.',
      time: '30 minutes ago',
      role: 'student'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  // const notify = useContext(NotifyContext);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const newMsg = {
        id: messages.length + 1,
        author: 'You',
        content: newMessage,
        time: 'Just now',
        role: 'student'
      };
      setMessages([...messages, newMsg]);
      setNewMessage('');
      notify('Message sent', 'success');
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <div key={message.id} className={`max-w-xs lg:max-w-md ${
            message.role === 'teacher' ? 'mr-auto' : 'ml-auto'
          }`}>
            <div className={`px-4 py-2 rounded-lg ${
              message.role === 'teacher' 
                ? 'bg-blue-50 text-blue-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              <div className="flex items-center mb-1 text-xs">
                {message.role === 'teacher' ? 
                  <FaUserTie className="mr-1 text-blue-600" /> : 
                  <FaUserGraduate className="mr-1 text-gray-600" />}
                <span className="font-medium mr-2">{message.author}</span>
                <span className="text-gray-500">{message.time}</span>
              </div>
              <div className="text-sm">{message.content}</div>
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type your reply..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <button 
            type="submit" 
            className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
          >
            <FaPaperPlane />
          </button>
        </div>
      </form>
    </div>
  );
};

export default GroupDiscussion;