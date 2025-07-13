import React, { useEffect, useState } from 'react';
import { getDiscussions, createDiscussion, deleteDiscussion, getCourseDiscussions, addComment, addReply, toggleLike } from '../api/discussions';
import { getCourses } from '../api/courses';
import { toast } from 'react-toastify';

const Discussions = ({ courseId }) => {
    const [discussions, setDiscussions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [form, setForm] = useState({ topic: '', content: '', author: '' });
    const [submitting, setSubmitting] = useState(false);
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(courseId || '');
    const [comment, setComment] = useState('');
    const [reply, setReply] = useState({});
    const [replyingTo, setReplyingTo] = useState(null);

    const fetchDiscussions = () => {
        setLoading(true);
        const fetch = selectedCourse ? getCourseDiscussions(selectedCourse) : getDiscussions();
        fetch
            .then(res => setDiscussions(res.data))
            .catch(() => {
                setError('Failed to load discussions');
                toast.error('Failed to load discussions');
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        getCourses().then(res => setCourses(res.data));
    }, []);

    useEffect(() => {
        if (courseId) {
            setSelectedCourse(courseId);
        }
    }, [courseId]);

    useEffect(() => {
        fetchDiscussions();
        // eslint-disable-next-line
    }, [selectedCourse]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);
        createDiscussion(form)
            .then(() => {
                toast.success('Discussion created!');
                setForm({ topic: '', content: '', author: '' });
                fetchDiscussions();
            })
            .catch(err => {
                toast.error(err.response?.data?.message || 'Failed to create discussion');
            })
            .finally(() => setSubmitting(false));
    };

    const handleDelete = (id) => {
        if (!window.confirm('Delete this discussion?')) return;
        deleteDiscussion(id)
            .then(() => {
                toast.success('Discussion deleted!');
                setDiscussions(discussions.filter(d => d._id !== id));
            })
            .catch(() => toast.error('Delete failed'));
    };

    const handleCourseChange = (e) => {
        setSelectedCourse(e.target.value);
    };

    const handleComment = (discussionId) => {
        if (!comment) return toast.error('Enter a comment');
        addComment(discussionId, { content: comment })
            .then(() => {
                toast.success('Comment added!');
                setComment('');
                fetchDiscussions();
            })
            .catch(() => toast.error('Failed to add comment'));
    };

    const handleReply = (discussionId, commentId) => {
        if (!reply[commentId]) return toast.error('Enter a reply');
        addReply(discussionId, commentId, { content: reply[commentId] })
            .then(() => {
                toast.success('Reply added!');
                setReply({ ...reply, [commentId]: '' });
                setReplyingTo(null);
                fetchDiscussions();
            })
            .catch(() => toast.error('Failed to add reply'));
    };

    const handleLike = (discussionId) => {
        toggleLike(discussionId)
            .then(() => {
                toast.success('Toggled like!');
                fetchDiscussions();
            })
            .catch(() => toast.error('Failed to like'));
    };

    if (loading) return <div className="text-center py-10">Loading...</div>;
    if (error && discussions.length === 0) return <div className="text-center py-10 text-red-500">{error}</div>;

    return (
        <section className="py-20 bg-neutral-light">
            <div className="container mx-auto px-6">
                <div className="flex justify-between items-center mb-10">
                    <h2 className="text-3xl font-bold text-neutral-dark">Discussions</h2>
                    {!courseId && (
                        <select value={selectedCourse} onChange={handleCourseChange} className="border p-2 rounded">
                            <option value="">All Courses</option>
                            {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
                        </select>
                    )}
                </div>
                <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded-xl shadow flex flex-col md:flex-row gap-4 items-end">
                    <input name="topic" value={form.topic} onChange={handleChange} placeholder="Topic" required className="border p-2 rounded flex-1" />
                    <input name="author" value={form.author} onChange={handleChange} placeholder="Author" required className="border p-2 rounded flex-1" />
                    <textarea name="content" value={form.content} onChange={handleChange} placeholder="Content" required className="border p-2 rounded flex-1" />
                    <button type="submit" disabled={submitting} className="bg-primary text-white px-4 py-2 rounded">{submitting ? 'Adding...' : 'Add Discussion'}</button>
                </form>
                {discussions.length === 0 ? (
                    <div className="text-center py-16 bg-white dark:bg-dark-card rounded-xl shadow-md">
                        <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">No discussions yet</h3>
                        <p className="text-slate-500 dark:text-slate-400 mb-4">There are no discussions for the selected course. Start a new discussion or select a different course.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {discussions.map((discussion) => (
                            <div key={discussion._id} className="relative group bg-white p-6 rounded-xl shadow-md">
                                <h3 className="text-xl font-bold mb-2">{discussion.topic}</h3>
                                <p className="text-gray-600 mb-4">{discussion.content}</p>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium text-gray-700">{discussion.author?.name || discussion.author || 'Unknown'}</span>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleLike(discussion._id)}
                                            className="bg-blue-500 text-white rounded px-2 py-1"
                                            title="Like"
                                        >
                                            Like
                                        </button>
                                        <button
                                            onClick={() => handleDelete(discussion._id)}
                                            className="bg-red-500 text-white rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition"
                                            title="Delete"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                                {/* Comments */}
                                <div className="mt-4">
                                    <input
                                        value={comment}
                                        onChange={e => setComment(e.target.value)}
                                        placeholder="Add a comment..."
                                        className="border p-2 rounded w-full mb-2"
                                    />
                                    <button onClick={() => handleComment(discussion._id)} className="bg-primary text-white px-2 py-1 rounded">Comment</button>
                                    {/* Render comments if present */}
                                    {discussion.comments && discussion.comments.map((c) => (
                                        <div key={c._id} className="mt-2 ml-4 p-2 bg-slate-100 rounded">
                                            <div className="flex justify-between items-center">
                                                <span className="font-semibold text-sm">{c.author?.name || c.author || 'Unknown'}</span>
                                                <button onClick={() => setReplyingTo(c._id)} className="text-xs text-primary ml-2">Reply</button>
                                            </div>
                                            <div className="text-sm">{c.content}</div>
                                            {/* Replies */}
                                            {c.replies && c.replies.map((r) => (
                                                <div key={r._id} className="ml-4 mt-1 p-1 bg-slate-200 rounded">
                                                    <span className="font-semibold text-xs">{r.author?.name || r.author || 'Unknown'}</span>: <span className="text-xs">{r.content}</span>
                                                </div>
                                            ))}
                                            {/* Reply form */}
                                            {replyingTo === c._id && (
                                                <div className="mt-2 flex gap-2">
                                                    <input
                                                        value={reply[c._id] || ''}
                                                        onChange={e => setReply({ ...reply, [c._id]: e.target.value })}
                                                        placeholder="Reply..."
                                                        className="border p-1 rounded flex-1"
                                                    />
                                                    <button onClick={() => handleReply(discussion._id, c._id)} className="bg-primary text-white px-2 py-1 rounded">Send</button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Discussions; 