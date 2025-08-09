import React, { useState, useEffect, useRef } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { useAuth } from '../../context/AuthContext';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  FiMessageSquare,
  FiUsers,
  FiClock,
  FiBook,
  FiHash,
  FiSend,
  FiFilter,
  FiHelpCircle,
  FiCheckCircle,
  FiHeart,
  FiCornerUpLeft,
  FiArrowLeft
} from 'react-icons/fi';
import {
  getCourseDiscussions,
  getDiscussionById,
  getDiscussionMessages,
  sendMessage,
  replyToMessage,
  toggleMessageLike,
  resolveDoubt,
  markMessagesAsRead as apiMarkMessagesAsRead
} from '../../api/discussions';

const Discussions = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { courses, loading, error } = useDashboard();

  const [discussions, setDiscussions] = useState([]);
  const [selectedDiscussion, setSelectedDiscussion] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [isDoubt, setIsDoubt] = useState(false);
  const [doubtType, setDoubtType] = useState('general');
  const [filter, setFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [statistics, setStatistics] = useState({
    totalMessages: 0,
    totalDoubts: 0,
    resolvedDoubts: 0,
    participants: 0
  });

  const messagesEndRef = useRef(null);

  const doubtTypes = [
    { value: 'general', label: 'General Question' },
    { value: 'concept', label: 'Concept Clarification' },
    { value: 'problem', label: 'Problem Solving' },
    { value: 'clarification', label: 'Need Clarification' }
  ];

  const filters = [
    { value: 'all', label: 'All Messages' },
    { value: 'doubts', label: 'All Doubts' },
    { value: 'unresolved', label: 'Unresolved Doubts' },
    { value: 'resolved', label: 'Resolved Doubts' }
  ];

  useEffect(() => {
    if (courseId) {
      fetchDiscussions();
    }
  }, [courseId]);

  useEffect(() => {
    if (selectedDiscussion) {
      fetchMessages();
      markMessagesAsRead();
    }
  }, [selectedDiscussion, filter]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchDiscussions = async () => {
    try {
      const response = await getCourseDiscussions(courseId);
      setDiscussions(response.data);
    } catch (error) {
      console.error('Error fetching discussions:', error);
    }
  };

  const fetchMessages = async () => {
    if (!selectedDiscussion) return;

    try {
      setLoadingMessages(true);
      const response = await getDiscussionMessages(selectedDiscussion._id, {
        page: 1,
        limit: 50,
        filter
      });
      setMessages(response.data.messages);
      setStatistics(response.data.statistics);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoadingMessages(false);
    }
  };

  const markMessagesAsRead = async () => {
    if (!selectedDiscussion) return;

    try {
      await apiMarkMessagesAsRead(selectedDiscussion._id);
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!selectedDiscussion || !newMessage.trim()) return;

    try {
      setSendingMessage(true);

      const messageData = {
        content: newMessage.trim(),
        messageType: 'text',
        attachments: [],
        isDoubt,
        doubtType: isDoubt ? doubtType : undefined
      };

      await sendMessage(selectedDiscussion._id, messageData);

      setNewMessage('');
      setIsDoubt(false);
      setDoubtType('general');

      // Refresh messages
      await fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSendingMessage(false);
    }
  };

  const handleReply = async (messageId) => {
    if (!replyContent.trim()) return;

    try {
      await replyToMessage(selectedDiscussion._id, messageId, {
        content: replyContent.trim(),
        messageType: 'text'
      });

      setReplyContent('');
      setReplyingTo(null);

      // Refresh messages
      await fetchMessages();
    } catch (error) {
      console.error('Error sending reply:', error);
    }
  };

  const handleLike = async (messageId) => {
    try {
      await toggleMessageLike(selectedDiscussion._id, messageId);
      await fetchMessages();
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleResolveDoubt = async (messageId) => {
    try {
      await resolveDoubt(selectedDiscussion._id, messageId);
      await fetchMessages();
    } catch (error) {
      console.error('Error resolving doubt:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const formatMessageTime = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const getDoubtColor = (type) => {
    switch (type) {
      case 'concept': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'problem': return 'bg-red-100 text-red-800 border-red-200';
      case 'clarification': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-orange-100 text-orange-800 border-orange-200';
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

  // If no courseId is provided, show course selection
  if (!courseId) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Course Discussions</h1>
          <div className="flex space-x-3">
            <Link
              to="/profile/channels"
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-focus transition-colors flex items-center space-x-2"
            >
              <FiHash className="h-4 w-4" />
              <span>Browse Communities</span>
            </Link>
          </div>
        </div>

        {courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
            {courses.map((course) => (
              <div key={course._id} className="bg-white dark:bg-dark-card p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow flex flex-col">
                <div className="flex-grow">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 bg-primary-light dark:bg-slate-800 rounded-lg text-primary text-xl">
                      <FiBook />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
                      {course.title}
                    </h3>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-sm mb-4">
                    {course.description}
                  </p>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mb-4 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                  <div className="flex items-center space-x-2">
                    <FiUsers className="h-4 w-4" />
                    <span className="flex items-center gap-1.5"><FiUsers /> {course.participantCount || 0} Participants</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FiMessageSquare className="h-4 w-4" />
                    <span>{course.participantCount || 0} Messages</span>
                  </div>
                </div>

                <Link
                  to={`/profile/discussions/course/${course._id}`}
                  className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-focus transition-colors text-center font-medium block"
                >
                  Join Discussion
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-dark-card rounded-xl shadow-md">
            <FiMessageSquare className="mx-auto h-20 w-20 text-slate-300 mb-6" />
            <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
              No courses available
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
              You haven't enrolled in any courses yet. Enroll in courses to participate in discussions.
            </p>
            <div className="flex justify-center space-x-3">
              <Link
                to="/profile/channels"
                className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-focus transition-colors font-medium"
              >
                Browse Communities
              </Link>
              <Link
                to="/profile/courses"
                className="inline-block bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-6 py-3 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors font-medium"
              >
                Browse Courses
              </Link>
            </div>
          </div>
        )}

      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
      {/* Sidebar - Discussion List */}
      <div className="w-1/3 border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-dark-card">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate('/profile/discussions')}
              className="flex items-center space-x-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            >
              <FiArrowLeft className="h-4 w-4" />
              <span>Back to Courses</span>
            </button>
          </div>
          <h2 className="text-xl font-semibold text-slate-800 dark:text-white">
            Course Discussions
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {courses.find(c => c._id === courseId)?.title || 'Course'}
          </p>
        </div>



        {/* Discussion List */}
        <div className="flex-1 overflow-y-auto">
          {discussions.length > 0 ? (
            <div className="space-y-1">
              {discussions.map(discussion => (
                <div
                  key={discussion._id}
                  onClick={() => setSelectedDiscussion(discussion)}
                  className={`p-4 cursor-pointer transition-colors ${selectedDiscussion?._id === discussion._id
                      ? 'bg-primary/10 border-r-2 border-primary'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-slate-800 dark:text-white mb-1">
                        {discussion.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                        {discussion.content.substring(0, 60)}...
                      </p>
                      <div className="flex items-center space-x-3 text-xs text-slate-500 dark:text-slate-400">
                        <span>{discussion.messageCount} messages</span>
                        <span>{discussion.doubtCount} doubts</span>
                        <span>{discussion.participantCount} participants</span>
                      </div>
                    </div>
                    {discussion.isPinned && (
                      <FiBook className="h-4 w-4 text-primary" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-slate-500 dark:text-slate-400">
              <FiMessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No discussions yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Content - Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedDiscussion ? (
          <>
            {/* Discussion Header */}
            <div className="bg-white dark:bg-dark-card border-b border-slate-200 dark:border-slate-700 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
                    {selectedDiscussion.title}
                  </h2>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center space-x-2 px-3 py-1 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                  >
                    <FiFilter className="h-4 w-4" />
                    <span>Filter</span>
                  </button>
                </div>
              </div>

              {/* Filters */}
              {showFilters && (
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex flex-wrap gap-2">
                    {filters.map(filterOption => (
                      <button
                        key={filterOption.value}
                        onClick={() => setFilter(filterOption.value)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${filter === filterOption.value
                            ? 'bg-primary text-white'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                          }`}
                      >
                        {filterOption.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Messages Area */}
            <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-800">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4">
                {loadingMessages ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  </div>
                ) : messages.length > 0 ? (
                  <div className="space-y-4">
                    {messages.map((message, index) => (
                      <div key={message._id} className="flex space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {message.sender?.name?.charAt(0) || 'U'}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-slate-800 dark:text-white">
                              {message.sender?.name || 'Unknown User'}
                            </span>
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                              {formatMessageTime(message.createdAt)}
                            </span>
                            {message.senderType === 'Teacher' && (
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                Teacher
                              </span>
                            )}
                            {message.isDoubt && (
                              <span className={`text-xs px-2 py-1 rounded-full border ${getDoubtColor(message.doubtType)}`}>
                                <FiHelpCircle className="h-3 w-3 inline mr-1" />
                                {message.doubtType}
                              </span>
                            )}
                            {message.isResolved && (
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                <FiCheckCircle className="h-3 w-3 inline mr-1" />
                                Resolved
                              </span>
                            )}
                          </div>
                          <div className={`rounded-lg p-3 shadow-sm ${message.isDoubt
                              ? 'bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800'
                              : 'bg-white dark:bg-slate-700'
                            }`}>
                            <p className="text-slate-700 dark:text-slate-300 mb-2">
                              {message.content}
                            </p>

                            {/* Message Actions */}
                            <div className="flex items-center space-x-4 text-xs text-slate-500 dark:text-slate-400">
                              <button
                                onClick={() => handleLike(message._id)}
                                className="flex items-center space-x-1 hover:text-primary"
                              >
                                <FiHeart className={`h-3 w-3 ${message.likes?.some(like => like.user === user?._id) ? 'text-red-500 fill-current' : ''}`} />
                                <span>{message.likes?.length || 0}</span>
                              </button>
                              <button
                                onClick={() => setReplyingTo(replyingTo === message._id ? null : message._id)}
                                className="flex items-center space-x-1 hover:text-primary"
                              >
                                <FiCornerUpLeft className="h-3 w-3" />
                                <span>Reply</span>
                              </button>
                              {user?.userType === 'Teacher' && message.isDoubt && !message.isResolved && (
                                <button
                                  onClick={() => handleResolveDoubt(message._id)}
                                  className="flex items-center space-x-1 hover:text-green-600"
                                >
                                  <FiCheckCircle className="h-3 w-3" />
                                  <span>Resolve</span>
                                </button>
                              )}
                            </div>

                            {/* Reply Input */}
                            {replyingTo === message._id && (
                              <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-600 rounded">
                                <textarea
                                  value={replyContent}
                                  onChange={(e) => setReplyContent(e.target.value)}
                                  placeholder="Type your reply..."
                                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                                  rows="2"
                                />
                                <div className="flex items-center justify-end space-x-2 mt-2">
                                  <button
                                    onClick={() => setReplyingTo(null)}
                                    className="px-3 py-1 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={() => handleReply(message._id)}
                                    disabled={!replyContent.trim()}
                                    className="px-3 py-1 text-sm bg-primary text-white rounded hover:bg-primary-focus transition-colors disabled:opacity-50"
                                  >
                                    Reply
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* Replies */}
                            {message.replies && message.replies.length > 0 && (
                              <div className="mt-3 space-y-2">
                                {message.replies.map((reply, idx) => (
                                  <div key={idx} className="ml-4 p-2 bg-slate-50 dark:bg-slate-600 rounded">
                                    <div className="flex items-center space-x-2 mb-1">
                                      <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                                        {reply.sender?.name || 'Unknown User'}
                                      </span>
                                      <span className="text-xs text-slate-500 dark:text-slate-400">
                                        {formatMessageTime(reply.createdAt)}
                                      </span>
                                    </div>
                                    <p className="text-sm text-slate-700 dark:text-slate-300">
                                      {reply.content}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                ) : (
                  <div className="text-center text-slate-500 dark:text-slate-400 py-8">
                    <FiMessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                )}
              </div>

              {/* Message Input */}
              <div className="border-t border-slate-200 dark:border-slate-700 p-4 bg-white dark:bg-dark-card">
                {/* Doubt Toggle */}
                <div className="flex items-center space-x-4 mb-3">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={isDoubt}
                      onChange={(e) => setIsDoubt(e.target.checked)}
                      className="rounded border-slate-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-slate-700 dark:text-slate-300">
                      Mark as doubt
                    </span>
                  </label>
                  {isDoubt && (
                    <select
                      value={doubtType}
                      onChange={(e) => setDoubtType(e.target.value)}
                      className="text-sm border border-slate-200 dark:border-slate-700 rounded px-2 py-1 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                    >
                      {doubtTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Input Area */}
                <div className="flex space-x-3">
                  <div className="flex-1 relative">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                      placeholder="Type your message..."
                      className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                      rows="1"
                      style={{ minHeight: '40px', maxHeight: '120px' }}
                    />
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || sendingMessage}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-focus transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    <FiSend className="h-4 w-4" />
                    <span>{sendingMessage ? 'Sending...' : 'Send'}</span>
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <FiMessageSquare className="h-16 w-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-600 dark:text-slate-400 mb-2">
                Select a Discussion
              </h3>
              <p className="text-slate-500 dark:text-slate-500">
                Choose a discussion from the list to start chatting
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Discussions; 