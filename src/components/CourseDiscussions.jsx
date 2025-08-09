import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCourseDiscussions, addComment, addReply, toggleLike } from '../api/discussions';
import { getCourse } from '../api/courses';
import { toast } from 'react-toastify';
import { FiArrowLeft, FiMessageSquare, FiHeart, FiSend, FiUser, FiTag, FiBookmark, FiClock } from 'react-icons/fi';

const CourseDiscussions = () => {
    const { courseId } = useParams();
    const [discussions, setDiscussions] = useState([]);
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [comment, setComment] = useState('');
    const [reply, setReply] = useState({});
    const [replyingTo, setReplyingTo] = useState(null);

    const fetchDiscussions = () => {
        setLoading(true);
        getCourseDiscussions(courseId)
            .then(res => setDiscussions(res.data))
            .catch(() => {
                setError('Failed to load discussions');
                toast.error('Failed to load discussions');
            })
            .finally(() => setLoading(false));
    };

    const fetchCourse = () => {
        getCourse(courseId)
            .then(res => setCourse(res.data))
            .catch(() => {
                setError('Failed to load course');
                toast.error('Failed to load course');
            });
    };

    useEffect(() => {
        fetchCourse();
        fetchDiscussions();
    }, [courseId]);

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

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
        
        if (diffInHours < 1) {
            return 'Just now';
        } else if (diffInHours < 24) {
            return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
        } else if (diffInHours < 48) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
            });
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-10">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Link 
                        to="/discussions" 
                        className="flex items-center space-x-2 text-slate-600 dark:text-slate-400 hover:text-primary transition-colors"
                    >
                        <FiArrowLeft className="h-5 w-5" />
                        <span className="hidden sm:inline">Back to Discussions</span>
                        <span className="sm:hidden">Back</span>
                    </Link>
                </div>
            </div>

            {/* Course Info */}
            {course && (
                <div className="bg-white dark:bg-dark-card p-4 sm:p-6 rounded-xl shadow-md">
                    <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white mb-2">
                        {course.title} - Discussions
                    </h1>
                    <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
                        Join the conversation with your classmates and instructors. Teachers create discussion topics, and students can participate by commenting and asking questions.
                    </p>
                </div>
            )}

            {/* Discussions List */}
            <div className="space-y-4">
                <h2 className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-white">
                    Course Discussions
                </h2>
                
                {discussions.length > 0 ? (
                    <div className="space-y-4">
                        {discussions.map((discussion) => (
                            <div key={discussion._id} className={`bg-white dark:bg-dark-card p-4 sm:p-6 rounded-xl shadow-md ${discussion.isPinned ? 'border-l-4 border-primary' : ''}`}>
                                {/* Discussion Header */}
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2 mb-2">
                                            {discussion.isPinned && (
                                                <FiBookmark className="h-4 w-4 text-primary flex-shrink-0" title="Pinned discussion" />
                                            )}
                                            <h3 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-white">
                                                {discussion.title}
                                            </h3>
                                        </div>
                                        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mb-3">
                                            {discussion.content}
                                        </p>
                                        
                                        {/* Tags */}
                                        {discussion.tags && discussion.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mb-3">
                                                {discussion.tags.map((tag, index) => (
                                                    <span 
                                                        key={index}
                                                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary"
                                                    >
                                                        <FiTag className="h-3 w-3 mr-1" />
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => handleLike(discussion._id)}
                                        className="flex items-center space-x-1 text-slate-500 hover:text-red-500 transition-colors mt-2 sm:mt-0 sm:ml-4"
                                    >
                                        <FiHeart className={`h-4 w-4 ${discussion.likes?.some(like => like.user === localStorage.getItem('userId')) ? 'fill-red-500 text-red-500' : ''}`} />
                                        <span className="text-sm">{discussion.likes?.length || 0}</span>
                                    </button>
                                </div>

                                {/* Discussion Meta */}
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-slate-500 dark:text-slate-400 mb-4 space-y-2 sm:space-y-0">
                                    <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4">
                                        <div className="flex items-center space-x-2">
                                            <FiUser className="h-4 w-4" />
                                            <span className="font-medium">{discussion.author?.name || 'Unknown'}</span>
                                            <span className={`px-2 py-1 rounded-full text-xs ${
                                                discussion.authorType === 'Teacher' 
                                                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                                                    : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                            }`}>
                                                {discussion.authorType}
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <FiClock className="h-4 w-4" />
                                            <span>{formatDate(discussion.createdAt)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Chat Section */}
                                <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                                    <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                                        Join the conversation
                                    </h4>
                                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mb-4">
                                        <input
                                            value={comment}
                                            onChange={e => setComment(e.target.value)}
                                            placeholder="Share your thoughts, ask questions, or discuss this topic..."
                                            className="flex-1 border border-slate-300 dark:border-slate-600 p-2 rounded-lg bg-white dark:bg-dark-card text-slate-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                                        />
                                        <button
                                            onClick={() => handleComment(discussion._id)}
                                            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-focus transition-colors text-sm"
                                        >
                                            <FiSend className="h-4 w-4" />
                                        </button>
                                    </div>

                                    {/* Comments List */}
                                    {discussion.comments && discussion.comments.length > 0 && (
                                        <div className="space-y-3">
                                            {discussion.comments.map((comment) => (
                                                <div key={comment._id} className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 space-y-1 sm:space-y-0">
                                                        <div className="flex items-center space-x-2">
                                                            <span className="font-medium text-sm text-slate-700 dark:text-slate-300">
                                                                {comment.author?.name || 'Unknown'}
                                                            </span>
                                                            <span className={`px-2 py-1 rounded-full text-xs ${
                                                                comment.authorType === 'Teacher' 
                                                                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                                                                    : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                            }`}>
                                                                {comment.authorType}
                                                            </span>
                                                        </div>
                                                        <button
                                                            onClick={() => setReplyingTo(comment._id)}
                                                            className="text-xs text-primary hover:text-primary-focus transition-colors self-start sm:self-auto"
                                                        >
                                                            Reply
                                                        </button>
                                                    </div>
                                                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                                                        {comment.content}
                                                    </p>

                                                    {/* Replies */}
                                                    {comment.replies && comment.replies.length > 0 && (
                                                        <div className="ml-2 sm:ml-4 space-y-2">
                                                            {comment.replies.map((reply) => (
                                                                <div key={reply._id} className="bg-white dark:bg-slate-700 p-2 rounded">
                                                                    <div className="flex items-center space-x-2 mb-1">
                                                                        <span className="font-medium text-xs text-slate-700 dark:text-slate-300">
                                                                            {reply.author?.name || 'Unknown'}
                                                                        </span>
                                                                        <span className={`px-1 py-0.5 rounded-full text-xs ${
                                                                            reply.authorType === 'Teacher' 
                                                                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                                                                                : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                                        }`}>
                                                                            {reply.authorType}
                                                                        </span>
                                                                    </div>
                                                                    <span className="text-xs text-slate-600 dark:text-slate-400">
                                                                        {reply.content}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {/* Reply Form */}
                                                    {replyingTo === comment._id && (
                                                        <div className="mt-2 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                                                            <input
                                                                value={reply[comment._id] || ''}
                                                                onChange={e => setReply({ ...reply, [comment._id]: e.target.value })}
                                                                placeholder="Write a reply..."
                                                                className="flex-1 border border-slate-300 dark:border-slate-600 p-1 rounded text-sm bg-white dark:bg-dark-card text-slate-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                                                            />
                                                            <button
                                                                onClick={() => handleReply(discussion._id, comment._id)}
                                                                className="bg-primary text-white px-3 py-1 rounded text-sm hover:bg-primary-focus transition-colors"
                                                            >
                                                                Send
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 sm:py-16 bg-white dark:bg-dark-card rounded-xl shadow-md">
                        <FiMessageSquare className="mx-auto h-16 w-16 sm:h-20 sm:w-20 text-slate-300 mb-6" />
                        <h2 className="text-xl sm:text-2xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            No discussions yet
                        </h2>
                        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mb-4 px-4">
                            Your course instructor hasn't created any discussion topics yet.
                        </p>
                        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 px-4">
                            Check back later or contact your instructor to start discussions.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CourseDiscussions; 