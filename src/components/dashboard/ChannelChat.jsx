import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getChannelById, getChannelMessages, sendMessage } from '../../api/channels';
import { useAuth } from '../../context/AuthContext';
import { 
    FiArrowLeft, 
    FiSend, 
    FiPaperclip, 
    FiMoreVertical,
    FiHash
} from 'react-icons/fi';

const CommunityChat = () => {
    const { channelId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const messagesEndRef = useRef(null);
    const [channel, setChannel] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sendingMessage, setSendingMessage] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        total: 1,
        hasNext: false,
        hasPrev: false
    });

    useEffect(() => {
        fetchChannelData();
    }, [channelId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const fetchChannelData = async () => {
        try {
            setLoading(true);
            const [channelRes, messagesRes] = await Promise.all([
                getChannelById(channelId),
                getChannelMessages(channelId)
            ]);
            setChannel(channelRes.data);
            setMessages(messagesRes.data.messages || []);
            setPagination(messagesRes.data.pagination || {
                current: 1,
                total: 1,
                hasNext: false,
                hasPrev: false
            });
        } catch (error) {
            console.error('Error fetching channel data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim() || user?.userType !== 'Teacher') return;

        try {
            setSendingMessage(true);
            const response = await sendMessage(channelId, {
                content: newMessage.trim(),
                type: 'text'
            });

            // Add the new message to the messages list
            setMessages(prev => [...prev, response.data]);
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setSendingMessage(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const isMyMessage = (message) => {
        return message.sender?._id === user?._id;
    };

    const formatTime = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString();
        }
    };

    const shouldShowDate = (message, index) => {
        if (index === 0) return true;
        return formatDate(messages[index - 1]?.createdAt) !== formatDate(message?.createdAt);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!channel) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        Community Not Found
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-6">
                        The community you're looking for doesn't exist or you don't have access to it.
                    </p>
                    <button
                        onClick={() => navigate('/profile/channels')}
                        className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-focus transition-colors font-medium"
                    >
                        Back to Communities
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-900">
            {/* Header */}
            <div className="bg-white dark:bg-dark-card border-b border-slate-200 dark:border-slate-700 px-6 py-4">
                <div className="flex items-center space-x-3">
                    <button
                        onClick={() => navigate('/profile/channels')}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    >
                        <FiArrowLeft className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                    </button>
                    <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                        <FiHash className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
                            {channel.name}
                        </h2>
                        <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400">
                            <span>{channel.subject}</span>
                            <span>{channel.memberCount} members</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                channel.level === 'Beginner' ? 'bg-green-100 text-green-800' :
                                channel.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                                channel.level === 'Advanced' ? 'bg-red-100 text-red-800' :
                                'bg-blue-100 text-blue-800'
                            }`}>
                                {channel.level}
                            </span>
                        </div>
                    </div>
                    <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                        <FiMoreVertical className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                    </button>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-slate-50 dark:bg-slate-800">
                <div className="space-y-4">
                    {messages.map((message, index) => (
                        <div key={message._id}>
                            {shouldShowDate(message, index) && (
                                <div className="text-center my-4">
                                    <span className="bg-white dark:bg-dark-card px-3 py-1 rounded-full text-xs text-slate-500 dark:text-slate-400">
                                        {formatDate(message.createdAt)}
                                    </span>
                                </div>
                            )}
                            <div className={`flex ${isMyMessage(message) ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-xs lg:max-w-md ${isMyMessage(message) ? 'order-2' : 'order-1'}`}>
                                    {!isMyMessage(message) && (
                                        <div className="flex items-center space-x-2 mb-1">
                                            <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center">
                                                <span className="text-xs font-medium text-primary">
                                                    {message.sender?.name?.charAt(0)?.toUpperCase() || 'U'}
                                                </span>
                                            </div>
                                            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                                                {message.sender?.name || 'Unknown User'}
                                            </span>
                                        </div>
                                    )}
                                    <div className={`p-3 rounded-lg ${
                                        isMyMessage(message)
                                            ? 'bg-primary text-white'
                                            : 'bg-white dark:bg-dark-card text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700'
                                    }`}>
                                        <p className="text-sm">{message.content}</p>
                                        <p className={`text-xs mt-1 ${
                                            isMyMessage(message)
                                                ? 'text-white/70'
                                                : 'text-slate-500 dark:text-slate-400'
                                        }`}>
                                            {formatTime(message.createdAt)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Message Input - Only for Teachers */}
            {user?.userType === 'Teacher' && (
                <div className="bg-white dark:bg-dark-card border-t border-slate-200 dark:border-slate-700 p-4">
                    <div className="flex items-center space-x-3">
                        <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                            <FiPaperclip className="h-5 w-5" />
                        </button>
                        <div className="flex-1 relative">
                            <textarea
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Type an announcement..."
                                className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                                rows="1"
                                style={{ minHeight: '40px', maxHeight: '120px' }}
                            />
                        </div>
                        <button
                            onClick={handleSendMessage}
                            disabled={!newMessage.trim() || sendingMessage}
                            className={`p-2 rounded-lg transition-colors ${
                                newMessage.trim() && !sendingMessage
                                    ? 'bg-primary text-white hover:bg-primary-focus'
                                    : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                            }`}
                        >
                            {sendingMessage ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            ) : (
                                <FiSend className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                </div>
            )}
            
            {/* Read-only notice for students */}
            {user?.userType === 'Student' && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border-t border-blue-200 dark:border-blue-800 p-4">
                    <div className="flex items-center space-x-2 text-blue-700 dark:text-blue-300">
                        <span className="text-sm">📢 Read-only mode - Only teachers can post announcements</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CommunityChat; 