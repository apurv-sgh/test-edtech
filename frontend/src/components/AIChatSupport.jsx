import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// Simple FAQ and fallback for AI chat (no API)
const getAIResponse = (userMessage) => {
  const msg = userMessage.toLowerCase();
  // FAQ examples
  if (msg.includes('course') && msg.includes('enroll')) {
    return 'To enroll in a course, go to the Courses section, select your desired course, and click the Enroll button.';
  }
  if (msg.includes('reset') && msg.includes('password')) {
    return 'To reset your password, click on the Login page and use the "Forgot Password" link.';
  }
  if (msg.includes('contact')) {
    return 'You can contact us at support@edtech.com or use this chat to request a team member.';
  }
  if (msg.includes('live class')) {
    return 'Live classes are listed under the Live Classes section. You can join any ongoing session from there.';
  }
  if (msg.includes('note') || msg.includes('notes')) {
    return 'You can find and download notes in the Notes section of your dashboard.';
  }
  if (msg.includes('quiz')) {
    return 'Quizzes are available after each course module. Check the Quizzes tab in your course.';
  }
  if (msg.includes('help')) {
    return 'I am here to help! Please describe your issue, or type "talk to human" to connect with our team.';
  }
  // Fallback
  return 'Sorry, I am not able to answer that right now. Please try rephrasing your question or ask to talk to a team member.';
};

// Detect if user wants to talk to a human
const wantsHuman = (msg) => {
  const triggers = [
    'human', 'real person', 'support', 'agent', 'team member', 'staff', 'talk to someone', 'talk to a person', 'representative', 'contact', 'help from human', 'live chat', 'connect me', 'speak to', 'talk with', 'customer service'
  ];
  const lower = msg.toLowerCase();
  return triggers.some((t) => lower.includes(t));
};


const AIChatSupport = () => {
  const { user } = useContext(AuthContext) || {};
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Hello! How can I help you today? If you want to talk to a team member, just let me know!' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [handoff, setHandoff] = useState(false);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = { sender: user ? user.name || 'You' : 'Guest', text: input };
    setMessages((msgs) => [...msgs, userMsg]);
    setInput('');

    // Check if user wants to talk to a human
    if (wantsHuman(input)) {
      setHandoff(true);
      setMessages((msgs) => [
        ...msgs,
        {
          sender: 'ai',
          text:
            'Sure! I will connect you with a team member. Please wait while I notify our support staff. Someone will join the chat soon. In the meantime, you can describe your issue here.'
        },
      ]);
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const aiText = getAIResponse(input);
      setMessages((msgs) => [...msgs, { sender: 'ai', text: aiText }]);
      setLoading(false);
    }, 700); // Simulate typing delay
  };

  return (
    <>
      {/* Chat Icon Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-blue-600 shadow-lg flex items-center justify-center z-50 hover:bg-blue-700 transition"
          aria-label="Open AI Chat"
        >
          {/* Chat bubble icon */}
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h8M8 14h4M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 01-4-.8L3 21l1.8-4A7.96 7.96 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
      )}

      {/* Chat Popup */}
      {open && (
        <div className="fixed bottom-6 right-6 w-80 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 flex flex-col">
          {/* Header with Close Button */}
          <div className="flex items-center px-4 py-3 border-b border-gray-100 bg-gray-50 rounded-t-xl">
            <span className="font-bold flex-1 text-blue-700">AI Chat Support</span>
            <button
              onClick={() => setOpen(false)}
              className="ml-2 text-gray-400 hover:text-gray-700 text-xl font-bold focus:outline-none"
              aria-label="Close chat"
            >
              ×
            </button>
          </div>
          {/* Messages */}
          <div className="max-h-72 overflow-y-auto px-4 py-2 flex-1 bg-white">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`mb-2 flex ${msg.sender === 'ai' ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`px-3 py-2 rounded-lg text-sm ${
                    msg.sender === 'ai'
                      ? 'bg-blue-50 text-blue-800'
                      : 'bg-blue-600 text-white'
                  }`}
                >
                  <span className="font-semibold">
                    {msg.sender === 'ai' ? 'AI' : msg.sender}:
                  </span>{' '}
                  <span>{msg.text}</span>
                </div>
              </div>
            ))}
            {loading && (
              <div className="text-gray-400 text-xs mb-2">AI is typing...</div>
            )}
            {handoff && (
              <div className="text-green-600 text-xs mb-2">A team member will join the chat soon.</div>
            )}
          </div>
          {/* Input */}
          <form
            onSubmit={handleSend}
            className="flex border-t border-gray-100 px-3 py-2 bg-gray-50 rounded-b-xl"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={handoff ? "You can continue typing, a team member will join soon..." : "Type your message..."}
              className="flex-1 border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="ml-2 px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default AIChatSupport;
