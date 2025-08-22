import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import Navbar from '../Navbar';
import { FiEdit, FiUser, FiFileText, FiCheckCircle, FiClock, FiBriefcase, FiBookOpen, FiTrendingUp, FiMail, FiPlus, FiTrash2, FiSettings, FiBarChart2, FiCalendar, FiMessageSquare, FiUsers, FiVideo, FiSearch, FiBell, FiHome, FiLogOut } from 'react-icons/fi';
import { DashboardProfilePicture } from '../common/ImageComponent';

const IndustryExpertDashboard = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [form, setForm] = useState({
    linkedinUrl: '',
    currentCompany: '',
    experience: '',
    availableTime: '',
    skills: '',
    bio: '',
    topics: '',
    sessionPrice: '',
    sessionDuration: '',
    bannerImage: '',
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [seminars, setSeminars] = useState([]);
  const [newSeminar, setNewSeminar] = useState({ title: '', description: '', date: '', time: '', fee: 0 });

    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await axios.get('/api/industry-experts/me', {
          headers: { Authorization: `Bearer ${user?.token}` },
        });
        setProfile(res.data);
        setForm({
          linkedinUrl: res.data?.linkedinUrl || '',
          currentCompany: res.data?.currentCompany || '',
          experience: res.data?.experience || '',
          availableTime: res.data?.availableTime || '',
          skills: (res.data?.skills || []).join(', '),
          bio: res.data?.bio || '',
          topics: (res.data?.topics || []).join(', '),
          sessionPrice: res.data?.sessionPrice || '',
          sessionDuration: res.data?.sessionDuration || '',
          bannerImage: res.data?.bannerImage || '',
        });
        setSeminars(res.data?.seminars || []);
      } catch {
        setProfile(null);
      }
      setLoading(false);
    };

  useEffect(() => {
    if (user?.token) fetchProfile();
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.name === 'profilePicture') {
      setProfilePicture(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });
      if (profilePicture) {
        formData.append('profilePicture', profilePicture);
      }
      const res = await axios.post('/api/industry-experts/profile', formData, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      // Update local state immediately without page reload
      setProfile(res.data);
      setProfilePicture(null);
      // Reset file input
      const fileInput = document.querySelector('input[name="profilePicture"]');
      if (fileInput) fileInput.value = '';
      alert('Profile updated successfully!');
    } catch (err) {
      alert('Failed to update profile');
    }
    setLoading(false);
  };

  const handleSeminarChange = e => {
    setNewSeminar({ ...newSeminar, [e.target.name]: e.target.value });
  };

  const handleAddSeminar = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/api/industry-experts/seminars', newSeminar, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      // Update local state immediately without page reload
      setSeminars([...seminars, res.data]);
      setNewSeminar({ title: '', description: '', date: '', time: '', fee: 0 });
      alert('Seminar added successfully!');
    } catch (err) {
      alert('Failed to add seminar');
    }
    setLoading(false);
  };

  if (!user || user.role !== 'industry_expert') {
    return <div className="p-8 text-center text-red-500">Access denied. Only industry experts can view this page.</div>;
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex pt-16">
        {/* Fixed Sidebar */}
        <div className="w-64 bg-gradient-to-b from-primary to-purple-600 text-white fixed h-full top-16">
        <div className="p-6">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <FiVideo className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Expert Portal</h1>
              <p className="text-xs text-purple-200">Industry Dashboard</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'overview' 
                  ? 'bg-white bg-opacity-20 text-white' 
                  : 'text-purple-100 hover:bg-white hover:bg-opacity-10'
              }`}
            >
              <FiBarChart2 className="w-5 h-5" />
              <span>Overview</span>
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'profile' 
                  ? 'bg-white bg-opacity-20 text-white' 
                  : 'text-purple-100 hover:bg-white hover:bg-opacity-10'
              }`}
            >
              <FiUser className="w-5 h-5" />
              <span>Profile</span>
            </button>
            <button
              onClick={() => setActiveTab('seminars')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'seminars' 
                  ? 'bg-white bg-opacity-20 text-white' 
                  : 'text-purple-100 hover:bg-white hover:bg-opacity-10'
              }`}
            >
              <FiVideo className="w-5 h-5" />
              <span>Seminars</span>
            </button>

            <button
              onClick={() => setActiveTab('messages')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'messages' 
                  ? 'bg-white bg-opacity-20 text-white' 
                  : 'text-purple-100 hover:bg-white hover:bg-opacity-10'
              }`}
            >
              <FiMessageSquare className="w-5 h-5" />
              <span>Messages</span>
            </button>
          </nav>

          {/* Logout */}
          <div className="absolute bottom-6 left-6 right-6">
            <button
              onClick={logout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-purple-100 hover:bg-white hover:bg-opacity-10 transition-colors"
            >
              <FiLogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <a href="/" className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-primary">
                <FiHome className="w-5 h-5" />
                <span>Back to Home</span>
              </a>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              
              {/* Notifications */}
              <button className="p-2 text-gray-600 dark:text-gray-300 hover:text-primary">
                <FiBell className="w-6 h-6" />
              </button>
              
              {/* User */}
              <div className="flex items-center space-x-3">
                <DashboardProfilePicture
                  src={profile?.profilePicture}
                  alt="Profile"
                  size="sm"
                />
            <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Hi, {user?.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Industry Expert</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Welcome Banner */}
              <div className="bg-gradient-to-r from-primary to-purple-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <h1 className="text-3xl font-bold mt-1">Welcome back, {user?.name}!</h1>
                    <p className="text-purple-100 mt-2">Share your expertise and inspire the next generation</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      <FiCheckCircle className={`w-5 h-5 ${profile?.status === 'verified' ? 'text-green-300' : 'text-yellow-300'}`} />
                      <span className="text-sm font-medium capitalize">{profile?.status || 'pending'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                            <FiVideo className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Seminars</p>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">{seminars.length}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                            <FiTrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Rating</p>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">4.9</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                            <FiUsers className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Students</p>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">89</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                            <FiMail className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Messages</p>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">12</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Profile Summary */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Profile Summary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Experience</p>
                        <p className="font-medium text-gray-900 dark:text-white">{profile?.experience || 0} years</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Company</p>
                        <p className="font-medium text-gray-900 dark:text-white">{profile?.currentCompany || 'Not specified'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Domain</p>
                        <p className="font-medium text-gray-900 dark:text-white">{profile?.domain || 'Not specified'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Skills</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {profile?.skills?.length > 0 ? profile.skills.slice(0, 3).join(', ') : 'Not specified'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Recent Seminars */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Seminars</h3>
                    {seminars.length > 0 ? (
                      <div className="space-y-4">
                        {seminars.slice(0, 3).map((seminar, index) => (
                          <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white">{seminar.title}</h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400">{seminar.date} at {seminar.time}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-gray-900 dark:text-white">₹{seminar.fee}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Fee</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600 dark:text-gray-400">No seminars scheduled yet.</p>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'profile' && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <FiEdit className="text-primary" />
                    Edit Your Profile
                  </h3>
                  <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
                    {/* Basic Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <FiUser className="text-primary" />
                        Basic Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">LinkedIn URL</label>
                          <input name="linkedinUrl" value={form.linkedinUrl} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent" />
            </div>
            <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current Company</label>
                          <input name="currentCompany" value={form.currentCompany} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent" />
            </div>
            <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Experience (years)</label>
                          <input name="experience" type="number" min="0" value={form.experience} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent" />
            </div>
            <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Available Time</label>
                          <input name="availableTime" value={form.availableTime} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent" />
            </div>
            <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Skills (comma separated)</label>
                          <input name="skills" value={form.skills} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent" />
            </div>
            <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Topics (comma separated)</label>
                          <input name="topics" value={form.topics} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent" />
            </div>
            <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Session Price (INR)</label>
                          <input name="sessionPrice" type="number" min="0" value={form.sessionPrice} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent" />
            </div>
            <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Session Duration</label>
                          <input name="sessionDuration" value={form.sessionDuration} onChange={handleChange} required placeholder="e.g. 60 minutes" className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent" />
            </div>
            <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Banner Image URL</label>
                          <input name="bannerImage" value={form.bannerImage} onChange={handleChange} placeholder="https://example.com/banner.jpg" className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent" />
            </div>
            <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Profile Picture</label>
                          <input name="profilePicture" type="file" accept="image/*" onChange={handleFileChange} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent" />
                        </div>
                      </div>
                    </div>

                    {/* Bio */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bio *</label>
                      <textarea name="bio" value={form.bio} onChange={handleChange} required rows="6" className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="Tell us about your expertise, experience, and what makes you unique as an industry expert..."></textarea>
            </div>

                    {/* Submit Button */}
                    <div className="flex gap-4 mt-6">
                      <button type="submit" disabled={loading} className="bg-primary text-white px-8 py-3 rounded-lg font-semibold disabled:bg-gray-400 hover:bg-primary-dark transition-colors">
                        {loading ? 'Saving...' : 'Save All Changes'}
                      </button>
            </div>
          </form>
        </div>
              )}

              {activeTab === 'seminars' && (
                <div className="space-y-6">
                  {/* Add New Seminar */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                      <FiPlus className="text-primary" />
                      Add New Seminar
                    </h3>
                    <form onSubmit={handleAddSeminar} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title</label>
                          <input name="title" value={newSeminar.title} onChange={handleSeminarChange} required className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent" />
            </div>
            <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Fee (INR)</label>
                          <input name="fee" type="number" min="0" value={newSeminar.fee} onChange={handleSeminarChange} required className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent" />
            </div>
            <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date</label>
                          <input name="date" type="date" value={newSeminar.date} onChange={handleSeminarChange} required className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent" />
            </div>
            <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Time</label>
                          <input name="time" type="time" value={newSeminar.time} onChange={handleSeminarChange} required className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent" />
                        </div>
            </div>
            <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                        <textarea name="description" value={newSeminar.description} onChange={handleSeminarChange} required rows="4" className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="Describe your seminar..."></textarea>
            </div>
                      <button type="submit" disabled={loading} className="bg-primary text-white px-6 py-3 rounded-lg font-semibold disabled:bg-gray-400 hover:bg-primary-dark transition-colors">
                        {loading ? 'Adding...' : 'Add Seminar'}
                      </button>
          </form>
                  </div>

                  {/* Existing Seminars */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Your Seminars</h3>
                    {seminars.length > 0 ? (
                      <div className="space-y-4">
                        {seminars.map((seminar, index) => (
                          <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white">{seminar.title}</h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400">{seminar.description}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">{seminar.date} at {seminar.time}</p>
            </div>
                            <div className="text-right">
                              <p className="font-medium text-gray-900 dark:text-white">₹{seminar.fee}</p>
                              <button className="text-red-500 hover:text-red-700 text-sm">Delete</button>
              </div>
            </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600 dark:text-gray-400">No seminars scheduled yet.</p>
                    )}
          </div>
                </div>
              )}



          {activeTab === 'messages' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Messages</h3>
              <p className="text-gray-600 dark:text-gray-400">Message center coming soon...</p>
            </div>
          )}
        </main>
        </div>
      </div>
    </>
  );
};

export default IndustryExpertDashboard; 