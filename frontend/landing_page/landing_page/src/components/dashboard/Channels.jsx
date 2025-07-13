import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllChannels, getMyChannels, joinChannel, getSubjects, getTags } from '../../api/channels';
import { useAuth } from '../../context/AuthContext';
import { 
    FiSearch, 
    FiFilter, 
    FiHash, 
    FiUsers, 
    FiMessageSquare,
    FiPlus,
    FiChevronLeft,
    FiChevronRight,
    FiExternalLink
} from 'react-icons/fi';

const Channels = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [channels, setChannels] = useState([]);
    const [myChannels, setMyChannels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [joiningChannel, setJoiningChannel] = useState(null);
    const [selectedChannel, setSelectedChannel] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [sendingMessage, setSendingMessage] = useState(false);
    const [subjects, setSubjects] = useState([]);
    const [tags, setTags] = useState([]);
    const [filters, setFilters] = useState({
        subject: '',
        level: 'All Levels',
        search: '',
        tags: []
    });
    const [pagination, setPagination] = useState({
        current: 1,
        total: 1,
        hasNext: false,
        hasPrev: false
    });
    const [showFilters, setShowFilters] = useState(false);
    const [view, setView] = useState('all'); // 'all' or 'my'

    const levels = ['All Levels', 'Beginner', 'Intermediate', 'Advanced'];

    useEffect(() => {
        fetchInitialData();
    }, []);

    useEffect(() => {
        fetchChannels();
    }, [filters, pagination.current, view]);

    const fetchInitialData = async () => {
        try {
            const [subjectsRes, tagsRes, myChannelsRes] = await Promise.all([
                getSubjects(),
                getTags(),
                getMyChannels()
            ]);
            setSubjects(subjectsRes.data);
            setTags(tagsRes.data);
            setMyChannels(myChannelsRes.data);
        } catch (error) {
            console.error('Error fetching initial data:', error);
        }
    };

    const fetchChannels = async () => {
        try {
            setLoading(true);
            const params = {
                ...filters,
                page: pagination.current,
                limit: 20
            };

            if (filters.tags.length > 0) {
                params.tags = filters.tags.join(',');
            }

            const response = await getAllChannels(params);
            setChannels(response.data.channels);
            setPagination(response.data.pagination);
        } catch (error) {
            console.error('Error fetching channels:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleJoinChannel = async (channelId) => {
        try {
            setJoiningChannel(channelId);
            await joinChannel(channelId);
            
            // Refresh my channels
            const myChannelsRes = await getMyChannels();
            setMyChannels(myChannelsRes.data);
            
            // Update the channel in the list to show as joined
            setChannels(prev => prev.map(channel => 
                channel._id === channelId 
                    ? { ...channel, isMember: true }
                    : channel
            ));
        } catch (error) {
            console.error('Error joining channel:', error);
        } finally {
            setJoiningChannel(null);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPagination(prev => ({ ...prev, current: 1 }));
    };

    const handleTagToggle = (tag) => {
        setFilters(prev => ({
            ...prev,
            tags: prev.tags.includes(tag)
                ? prev.tags.filter(t => t !== tag)
                : [...prev.tags, tag]
        }));
        setPagination(prev => ({ ...prev, current: 1 }));
    };

    const clearFilters = () => {
        setFilters({
            subject: '',
            level: 'All Levels',
            search: '',
            tags: []
        });
        setPagination(prev => ({ ...prev, current: 1 }));
    };

    const isMember = (channelId) => {
        return myChannels.some(channel => channel._id === channelId);
    };

    const getLevelColor = (level) => {
        switch (level) {
            case 'Beginner': return 'bg-green-100 text-green-800';
            case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
            case 'Advanced': return 'bg-red-100 text-red-800';
            default: return 'bg-blue-100 text-blue-800';
        }
    };

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
            {/* Sidebar - Channel List */}
            <div className="w-1/3 border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-dark-card">
                {/* Header */}
                <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-slate-800 dark:text-white">
                            Channels
                        </h2>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setView('all')}
                                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                                    view === 'all'
                                        ? 'bg-primary text-white'
                                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                                }`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setView('my')}
                                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                                    view === 'my'
                                        ? 'bg-primary text-white'
                                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                                }`}
                            >
                                My Channels
                            </button>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="relative mb-4">
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                        <input
                            type="text"
                            placeholder="Search channels..."
                            value={filters.search}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    {/* Filter Toggle */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                    >
                        <FiFilter className="h-4 w-4" />
                        <span>Filters</span>
                    </button>
                </div>

                {/* Filters */}
                {showFilters && (
                    <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                        <div className="space-y-4">
                            {/* Subject Filter */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Subject
                                </label>
                                <select
                                    value={filters.subject}
                                    onChange={(e) => handleFilterChange('subject', e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="">All Subjects</option>
                                    {subjects.map(subject => (
                                        <option key={subject} value={subject}>{subject}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Level Filter */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Level
                                </label>
                                <select
                                    value={filters.level}
                                    onChange={(e) => handleFilterChange('level', e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    {levels.map(level => (
                                        <option key={level} value={level}>{level}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Tags Filter */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Tags
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {tags.slice(0, 10).map(tag => (
                                        <button
                                            key={tag}
                                            onClick={() => handleTagToggle(tag)}
                                            className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                                                filters.tags.includes(tag)
                                                    ? 'bg-primary text-white'
                                                    : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
                                            }`}
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Clear Filters */}
                            <button
                                onClick={clearFilters}
                                className="w-full px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                            >
                                Clear Filters
                            </button>
                        </div>
                    </div>
                )}

                {/* Channel List */}
                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {(view === 'all' ? channels : myChannels).map(channel => (
                                <div
                                    key={channel._id}
                                    onClick={() => setSelectedChannel(channel)}
                                    className={`p-4 cursor-pointer transition-colors ${
                                        selectedChannel?._id === channel._id
                                            ? 'bg-primary/10 border-r-2 border-primary'
                                            : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                                    }`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2 mb-1">
                                                <FiHash className="h-4 w-4 text-primary" />
                                                <h3 className="font-medium text-slate-800 dark:text-white">
                                                    {channel.name}
                                                </h3>
                                            </div>
                                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                                                {channel.description}
                                            </p>
                                            <div className="flex items-center space-x-3 text-xs text-slate-500 dark:text-slate-400">
                                                <span>{channel.subject}</span>
                                                <span className={`px-2 py-1 rounded-full font-medium ${getLevelColor(channel.level)}`}>
                                                    {channel.level}
                                                </span>
                                                <div className="flex items-center space-x-1">
                                                    <FiUsers className="h-3 w-3" />
                                                    <span>{channel.memberCount}</span>
                                                </div>
                                            </div>
                                        </div>
                                        {view === 'all' && !isMember(channel._id) && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleJoinChannel(channel._id);
                                                }}
                                                disabled={joiningChannel === channel._id}
                                                className="px-3 py-1 bg-primary text-white text-xs rounded-lg hover:bg-primary-focus transition-colors disabled:opacity-50"
                                            >
                                                {joiningChannel === channel._id ? 'Joining...' : 'Join'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {view === 'all' && pagination.total > 1 && (
                        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                            <div className="flex items-center justify-between">
                                <button
                                    onClick={() => setPagination(prev => ({ ...prev, current: prev.current - 1 }))}
                                    disabled={!pagination.hasPrev}
                                    className="flex items-center space-x-1 px-3 py-1 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <FiChevronLeft className="h-4 w-4" />
                                    <span>Previous</span>
                                </button>
                                <span className="text-sm text-slate-600 dark:text-slate-400">
                                    {pagination.current} of {pagination.total}
                                </span>
                                <button
                                    onClick={() => setPagination(prev => ({ ...prev, current: prev.current + 1 }))}
                                    disabled={!pagination.hasNext}
                                    className="flex items-center space-x-1 px-3 py-1 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span>Next</span>
                                    <FiChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content - Chat Area */}
            <div className="flex-1 flex flex-col">
                {selectedChannel ? (
                    <>
                        {/* Channel Header */}
                        <div className="bg-white dark:bg-dark-card border-b border-slate-200 dark:border-slate-700 px-6 py-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
                                        #{selectedChannel.name}
                                    </h2>
                                    <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400">
                                        <span>{selectedChannel.subject}</span>
                                        <span>{selectedChannel.memberCount} members</span>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(selectedChannel.level)}`}>
                                            {selectedChannel.level}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => navigate(`/profile/channels/${selectedChannel._id}`)}
                                    className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-focus transition-colors"
                                >
                                    <FiExternalLink className="h-4 w-4" />
                                    <span>Open Full Chat</span>
                                </button>
                            </div>
                        </div>

                        {/* Messages Preview */}
                        <div className="flex-1 overflow-y-auto p-4 bg-slate-50 dark:bg-slate-800">
                            <div className="text-center text-slate-500 dark:text-slate-400 py-8">
                                <FiMessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>Click "Open Full Chat" to view and send messages</p>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <FiHash className="h-16 w-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-slate-600 dark:text-slate-400 mb-2">
                                Select a Channel
                            </h3>
                            <p className="text-slate-500 dark:text-slate-500">
                                Choose a channel from the list to start chatting
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Channels; 