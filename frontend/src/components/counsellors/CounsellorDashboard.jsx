import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { FiEdit, FiUser, FiFileText, FiCheckCircle, FiClock, FiBriefcase, FiBookOpen, FiTrendingUp, FiMail, FiPlus, FiTrash2, FiHeart, FiPhone, FiMapPin, FiGlobe, FiExternalLink, FiAward, FiSettings, FiBarChart2, FiCalendar, FiMessageSquare, FiUsers, FiSearch, FiBell, FiHome, FiLogOut } from 'react-icons/fi';
import { FaCertificate,FaAward,FaGraduationCap,FaHandshake,FaLightbulb} from 'react-icons/fa';
import Navbar from '../Navbar';
import { DashboardProfilePicture } from '../common/ImageComponent';
import AvailabilityManagement from './AvailabilityManagement';
import PendingBookings from './PendingBookings';
import UpcomingSessions from './UpcomingSessions';
import TodaySessions from './TodaySessions';


const CounsellorDashboard = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  console.log(user,logout)
  const [dashboardStats, setDashboardStats] = useState({
    totalSessions: 0,
    rating: 0,
    activeClients: 0,
    messages: 0,
    upcomingSessions: 0,
    pendingBookings: 0
  });
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
    // New comprehensive fields
    education: [],
    certifications: [],
    specializations: '',
    approach: '',
    successStories: [],
    memberships: '',
    publications: [],
    mediaAppearances: [],
    sessionTypes: '',
    languages: '',
    phone: '',
    email: '',
    location: '',
    website: '',
  });
  const [profilePicture, setProfilePicture] = useState(null);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/counsellors/me', {
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
        // New fields
        education: res.data?.education || [],
        certifications: res.data?.certifications || [],
        specializations: (res.data?.specializations || []).join(', '),
        approach: res.data?.approach || '',
        successStories: res.data?.successStories || [],
        memberships: (res.data?.memberships || []).join(', '),
        publications: res.data?.publications || [],
        mediaAppearances: res.data?.mediaAppearances || [],
        sessionTypes: (res.data?.sessionTypes || ['One-on-One', 'Group Sessions']).join(', '),
        languages: (res.data?.languages || ['English']).join(', '),
        phone: res.data?.phone || '',
        email: res.data?.email || '',
        location: res.data?.location || '',
        website: res.data?.website || '',
      });
    } catch {
      setProfile(null);
    }
    setLoading(false);
  };

  const fetchDashboardStats = async () => {
    try {
      // Fetch availability dashboard data which includes stats
      const availabilityRes = await axios.get('/api/counsellor/availability/dashboard', {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      
      if (availabilityRes.data.success) {
        const stats = availabilityRes.data.data.stats;
        setDashboardStats({
          totalSessions: stats.totalSessions || 0,
          rating: profile?.averageRating || 4.5,
          activeClients: stats.activeClients || 0,
          messages: stats.pendingBookings || 0, // Use pending bookings as messages count
          upcomingSessions: stats.upcomingSessions || 0,
          pendingBookings: stats.pendingBookings || 0
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Set default values if API fails
      setDashboardStats({
        totalSessions: 0,
        rating: profile?.averageRating || 4.5,
        activeClients: 0,
        messages: 0,
        upcomingSessions: 0,
        pendingBookings: 0
      });
    }
  };

  // Update stats when profile changes
  useEffect(() => {
    if (profile) {
      setDashboardStats(prev => ({
        ...prev,
        rating: profile.averageRating || 4.5
      }));
    }
  }, [profile]);

  useEffect(() => {
    if (user?.token) {
      fetchProfile();
      fetchDashboardStats();
    }
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
    if (!form.bio || !form.bio.trim()) {
      alert('Bio is required.');
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      });
      if (profilePicture) {
        formData.append('profilePicture', profilePicture);
      }
      const res = await axios.post('/api/counsellors/profile', formData, {
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

  // Helper functions for dynamic arrays
  const addEducation = () => {
    setForm({
      ...form,
      education: [...form.education, { degree: '', institution: '', year: '' }]
    });
  };

  const updateEducation = (index, field, value) => {
    const newEducation = [...form.education];
    newEducation[index] = { ...newEducation[index], [field]: value };
    setForm({ ...form, education: newEducation });
  };

  const removeEducation = (index) => {
    setForm({
      ...form,
      education: form.education.filter((_, i) => i !== index)
    });
  };

  const addCertification = () => {
    setForm({
      ...form,
      certifications: [...form.certifications, { name: '', organization: '', year: '' }]
    });
  };

  const updateCertification = (index, field, value) => {
    const newCertifications = [...form.certifications];
    newCertifications[index] = { ...newCertifications[index], [field]: value };
    setForm({ ...form, certifications: newCertifications });
  };

  const removeCertification = (index) => {
    setForm({
      ...form,
      certifications: form.certifications.filter((_, i) => i !== index)
    });
  };

  const addSuccessStory = () => {
    setForm({
      ...form,
      successStories: [...form.successStories, { testimonial: '', clientName: '' }]
    });
  };

  const updateSuccessStory = (index, field, value) => {
    const newStories = [...form.successStories];
    newStories[index] = { ...newStories[index], [field]: value };
    setForm({ ...form, successStories: newStories });
  };

  const removeSuccessStory = (index) => {
    setForm({
      ...form,
      successStories: form.successStories.filter((_, i) => i !== index)
    });
  };

  const addPublication = () => {
    setForm({
      ...form,
      publications: [...form.publications, { title: '', year: '' }]
    });
  };

  const updatePublication = (index, field, value) => {
    const newPublications = [...form.publications];
    newPublications[index] = { ...newPublications[index], [field]: value };
    setForm({ ...form, publications: newPublications });
  };

  const removePublication = (index) => {
    setForm({
      ...form,
      publications: form.publications.filter((_, i) => i !== index)
    });
  };

  const addMediaAppearance = () => {
    setForm({
      ...form,
      mediaAppearances: [...form.mediaAppearances, { title: '', outlet: '', year: '' }]
    });
  };

  const updateMediaAppearance = (index, field, value) => {
    const newMedia = [...form.mediaAppearances];
    newMedia[index] = { ...newMedia[index], [field]: value };
    setForm({ ...form, mediaAppearances: newMedia });
  };

  const removeMediaAppearance = (index) => {
    setForm({
      ...form,
      mediaAppearances: form.mediaAppearances.filter((_, i) => i !== index)
    });
  };

  console.log(user)
  if (!user || user.role !== 'counsellor') {
    return <div className="p-8 text-center text-red-500">Access denied. Only counsellors can view this page.</div>;
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
              <FiUser className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Counsellor Portal</h1>
              <p className="text-xs text-purple-200">Professional Dashboard</p>
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
              onClick={() => setActiveTab('availability')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'availability' 
                  ? 'bg-white bg-opacity-20 text-white' 
                  : 'text-purple-100 hover:bg-white hover:bg-opacity-10'
              }`}
            >
              <FiCalendar className="w-5 h-5" />
              <span>Availability</span>
            </button>

            <button
              onClick={() => setActiveTab('bookings')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'bookings' 
                  ? 'bg-white bg-opacity-20 text-white' 
                  : 'text-purple-100 hover:bg-white hover:bg-opacity-10'
              }`}
            >
              <FiCheckCircle className="w-5 h-5" />
              <span>Pending Bookings</span>
            </button>

            <button
              onClick={() => setActiveTab('upcoming')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'upcoming' 
                  ? 'bg-white bg-opacity-20 text-white' 
                  : 'text-purple-100 hover:bg-white hover:bg-opacity-10'
              }`}
            >
              <FiCalendar className="w-5 h-5" />
              <span>Upcoming Sessions</span>
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
                  <p className="text-xs text-gray-500 dark:text-gray-400">Counsellor</p>
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
                    <p className="text-purple-100 mt-2">Manage your counselling sessions and help students grow</p>
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
                        <FiCalendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Sessions</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{dashboardStats.totalSessions}</p>
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
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{dashboardStats.rating.toFixed(1)}</p>
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
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Clients</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{dashboardStats.activeClients}</p>
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
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{dashboardStats.messages}</p>
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
                    <p className="text-sm text-gray-500 dark:text-gray-400">Session Price</p>
                    <p className="font-medium text-gray-900 dark:text-white">₹{profile?.sessionPrice || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Topics</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {profile?.topics?.length > 0 ? profile.topics.slice(0, 3).join(', ') : 'Not specified'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Today's LineUp */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FiCalendar className="w-5 h-5 text-primary" />
                  Today's LineUp:
                </h3>
                <TodaySessions />
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
                  <textarea name="bio" value={form.bio} onChange={handleChange} required rows="6" className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="Tell us about your expertise, experience, and what makes you unique as a counsellor..."></textarea>
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

          {activeTab === 'availability' && (
            <AvailabilityManagement />
          )}

          {activeTab === 'bookings' && (
            <PendingBookings />
          )}

          {activeTab === 'upcoming' && (
            <UpcomingSessions />
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

export default CounsellorDashboard; 