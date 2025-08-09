import React, { useEffect, useState } from 'react';
import { getChats, createChat, deleteChat, getCourseChats, sendMessage, markMessagesAsRead } from '../api/chat';
import { getCourses } from '../api/courses';
import { toast } from 'react-toastify';

const Chat = () => {
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [form, setForm] = useState({ sender: '', message: '' });
    const [submitting, setSubmitting] = useState(false);
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [chatId, setChatId] = useState('');
    const [message, setMessage] = useState('');

    const fetchChats = () => {
        setLoading(true);
        const fetch = selectedCourse ? getCourseChats(selectedCourse) : getChats();
        fetch
            .then(res => setChats(res.data))
            .catch(() => {
                setError('Failed to load chats');
                toast.error('Failed to load chats');
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        getCourses().then(res => setCourses(res.data));
    }, []);

    useEffect(() => {
        fetchChats();
        // eslint-disable-next-line
    }, [selectedCourse]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);
        createChat(form)
            .then(() => {
                toast.success('Message sent!');
                setForm({ sender: '', message: '' });
                fetchChats();
            })
            .catch(err => {
                toast.error(err.response?.data?.message || 'Failed to send message');
            })
            .finally(() => setSubmitting(false));
    };

    const handleDelete = (id) => {
        if (!window.confirm('Delete this message?')) return;
        deleteChat(id)
            .then(() => {
                toast.success('Message deleted!');
                setChats(chats.filter(c => c._id !== id));
            })
            .catch(() => toast.error('Delete failed'));
    };

    const handleCourseChange = (e) => {
        setSelectedCourse(e.target.value);
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!chatId || !message) return toast.error('Select chat and enter message');
        sendMessage(chatId, { message })
            .then(() => {
                toast.success('Message sent!');
                setMessage('');
                fetchChats();
            })
            .catch(() => toast.error('Failed to send message'));
    };

    const handleMarkRead = (id) => {
        markMessagesAsRead(id)
            .then(() => {
                toast.success('Marked as read!');
                fetchChats();
            })
            .catch(() => toast.error('Failed to mark as read'));
    };

    if (loading) return <div className="text-center py-10">Loading...</div>;
    if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

    return (
        <section className="py-20 bg-neutral-light">
            <div className="container mx-auto px-6">
                <div className="flex justify-between items-center mb-10">
                    <h2 className="text-3xl font-bold text-neutral-dark">Chat</h2>
                    <select value={selectedCourse} onChange={handleCourseChange} className="border p-2 rounded">
                        <option value="">All Courses</option>
                        {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
                    </select>
                </div>
                <form onSubmit={handleSendMessage} className="mb-4 flex gap-2 items-end">
                    <select value={chatId} onChange={e => setChatId(e.target.value)} className="border p-2 rounded">
                        <option value="">Select Chat</option>
                        {chats.map(c => <option key={c._id} value={c._id}>{c.sender}</option>)}
                    </select>
                    <input value={message} onChange={e => setMessage(e.target.value)} placeholder="Message" className="border p-2 rounded flex-1" />
                    <button type="submit" className="bg-primary text-white px-4 py-2 rounded">Send</button>
                </form>
                <div className="flex flex-col gap-4">
                    {chats.map((chat) => (
                        <div key={chat._id} className="relative group bg-white p-4 rounded-xl shadow-md flex justify-between items-center">
                            <div>
                                <span className="font-bold text-primary mr-2">{chat.sender}:</span>
                                <span>{chat.message}</span>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleMarkRead(chat._id)}
                                    className="bg-blue-500 text-white rounded px-2 py-1"
                                    title="Mark as Read"
                                >
                                    Mark as Read
                                </button>
                                <button
                                    onClick={() => handleDelete(chat._id)}
                                    className="bg-red-500 text-white rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition"
                                    title="Delete"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Chat; 