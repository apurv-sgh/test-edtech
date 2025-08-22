import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar, FaRegCommentDots, FaBriefcase, FaLinkedin, FaShareAlt, FaCheckCircle, FaGlobe, FaCalendarAlt, FaClock, FaVideo, FaBookmark, FaPlay, FaUsers, FaArrowLeft, FaEllipsisH, FaInfoCircle, FaUser, FaGraduationCap, FaAward, FaCertificate, FaLanguage, FaHeart, FaLightbulb, FaHandshake, FaPhone, FaEnvelope, FaMapMarkerAlt, FaExternalLinkAlt, FaCalendar, FaTrophy, FaSmile, FaComments, FaThumbsUp, FaEdit, FaComments as FaChat, FaVideo as FaVideoCall, FaPhone as FaPhoneCall, FaCalendarDay, FaClock as FaTime } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Navbar from '../Navbar';
import { getCounsellorProfileById } from '../../api/counsellors';
import { BannerImage, ProfilePicture } from '../common/ImageComponent';
import { useAuth } from '../../context/AuthContext';
import ReviewCard from '../common/ReviewCard';
import BookCounsellingModal from './BookCounsellingModal';

const CounsellorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [counsellor, setCounsellor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('about');
  const [open, setOpen] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [showBookingModal, setShowBookingModal] = useState(false);
  
  // Booking state
  const [selectedSessionType, setSelectedSessionType] = useState(null);

  // Session types with enhanced data - Only Chat and Call options
  const sessionTypes = [
    {
      id: 'chat',
      name: 'Chat Session',
      icon: FaChat,
      description: 'Text-based guidance',
      price: counsellor?.sessionPrice || 79,
      duration: '45 min',
      popular: false,
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'phone',
      name: 'Phone Call',
      icon: FaPhoneCall,
      description: 'Audio consultation',
      price: counsellor?.sessionPrice || 99,
      duration: '30 min',
      popular: true,
      color: 'from-blue-500 to-blue-600'
    }
  ];





  // Handle session type selection
  const handleSessionTypeSelect = (type) => {
    setSelectedSessionType(type);
  };

  // Handle booking confirmation
  const handleBookingConfirm = () => {
    if (!user) {
      toast.error('Please login to book a session');
      return;
    }
    if (!selectedSessionType) {
      toast.error('Please select a session type');
      return;
    }
    setShowBookingModal(true);
  };

  // Handle booking success
  const handleBookingSuccess = (bookingData) => {
    toast.success('Booking created successfully!');
    // Reset booking state after successful booking
    setSelectedSessionType(null);
  };

  // Check if counsellor is taking bookings
  const isTakingBookings = !counsellor?.stopTakingBookings;

  useEffect(() => {
    setLoading(true);
    getCounsellorProfileById(id)
      .then((res) => {
        console.log('Counsellor profile data:', res.data);
        console.log('Counsellor ID structure:', {
          profileId: res.data._id,
          userId: res.data.counsellor?._id,
          counsellorField: res.data.counsellor
        });
        setCounsellor(res.data);
        // Fetch reviews for this counsellor using the profile ID
        fetchReviews(res.data._id);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const fetchReviews = async (counsellorId) => {
    try {
      console.log('Fetching reviews for counsellor ID:', counsellorId);
      const response = await fetch(`http://localhost:5000/api/counsellors/${counsellorId}/reviews`);
      if (!response.ok) {
        console.log('Reviews API response not ok:', response.status);
        setReviews([]);
        setAverageRating(0);
        setTotalReviews(0);
        return;
      }
      const data = await response.json();
      console.log('Reviews API response:', data);
      if (data.success) {
        console.log('Setting reviews:', data.data.reviews);
        console.log('Setting average rating:', data.data.averageRating);
        console.log('Setting total reviews:', data.data.totalReviews);
        setReviews(data.data.reviews || []);
        setAverageRating(data.data.averageRating || 0);
        setTotalReviews(data.data.totalReviews || 0);
      } else {
        console.log('Reviews API returned success: false');
        setReviews([]);
        setAverageRating(0);
        setTotalReviews(0);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      // Set default values on error
      setReviews([]);
      setAverageRating(0);
      setTotalReviews(0);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!counsellor || !counsellor._id) {
      toast.error('Counsellor data not available');
      return;
    }
    if (!newReview.comment.trim()) {
      toast.error('Please write a review comment');
      return;
    }
    if (newReview.comment.trim().length < 10) {
      toast.error('Review comment must be at least 10 characters long');
      return;
    }

    try {
      console.log('Submitting review for counsellor ID:', counsellor._id);
      console.log('Review data:', newReview);
      console.log('User token:', user?.token ? 'Available' : 'Not available');
      
      const response = await fetch(`http://localhost:5000/api/counsellors/${counsellor._id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify(newReview)
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || 'Review submission failed. Please try again.');
        return;
      }

      const data = await response.json();
      if (data.success) {
        setNewReview({ rating: 5, comment: '' });
        setShowReviewForm(false);
        // Refresh reviews
        fetchReviews(counsellor._id);
        toast.success('Review submitted successfully!');
      } else {
        toast.error(data.message || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Review submission is not available yet. Please try again later.');
    }
  };

  if (loading) return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading counsellor profile...</p>
        </div>
      </div>
    </>
  );
  
  if (!counsellor) return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Counsellor Not Found</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-4">The counsellor you're looking for doesn't exist or has been removed.</p>
          <button 
            onClick={() => navigate('/counsellors')}
            className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg font-semibold transition-colors"
          >
            Browse All Counsellors
          </button>
        </div>
      </div>
    </>
  );

  // Use fallback/defaults for missing fields
  const profile = {
    name: counsellor.counsellor?.name || 'N/A',
    company: counsellor.currentCompany || 'N/A',
    companyLogo: counsellor.companyLogo || '',
    experience: counsellor.experience || 0,
    status: counsellor.status || 'Available',
    languages: counsellor.languages || ['English'],
    skills: counsellor.skills || [],
    rating: counsellor.counsellor?.rating || 4.5,
    image: counsellor.profilePicture || counsellor.image || '',
    linkedin: counsellor.linkedinUrl || counsellor.linkedin || '',
    feedback: counsellor.counsellor?.feedback || 0,
    feedbackList: counsellor.feedbackList || [],
    expertise: counsellor.expertise || '',
    about: counsellor.bio || counsellor.about || '',
    topics: counsellor.topics || [],
    sessions: counsellor.sessions || 0,
    students: counsellor.students || 0,
    availability: counsellor.availableTime || counsellor.availability || '',
    sessionPrice: counsellor.sessionPrice || 0,
    sessionDuration: counsellor.sessionDuration || '',
    bannerImage: counsellor.bannerImage || '',
    // New fields for comprehensive profile
    education: counsellor.education || [],
    certifications: counsellor.certifications || [],
    specializations: counsellor.specializations || [],
    approach: counsellor.approach || '',
    successStories: counsellor.successStories || [],
    memberships: counsellor.memberships || [],
    publications: counsellor.publications || [],
    mediaAppearances: counsellor.mediaAppearances || [],
    sessionTypes: counsellor.sessionTypes || ['One-on-One', 'Group Sessions'],
    phone: counsellor.phone || '',
    email: counsellor.email || '',
    location: counsellor.location || '',
    website: counsellor.website || '',
  };

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/counsellors');
    }
  };

  const tabs = [
    { id: 'about', label: 'About', icon: FaUser },
    { id: 'credentials', label: 'Credentials', icon: FaAward },
    { id: 'expertise', label: 'Expertise', icon: FaLightbulb },
    { id: 'approach', label: 'Approach', icon: FaHandshake },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        {/* Banner */}
        <BannerImage 
          src={profile.bannerImage} 
          alt="Banner"
          height="h-64 md:h-80"
        >
          {/* Back Button */}
          <button 
            className="absolute top-6 left-6 z-10 text-white hover:text-gray-200 transition-colors"
            onClick={handleBack}
          >
            <FaArrowLeft size={24} />
          </button>

          {/* Banner Content */}
          <div className="relative z-10 h-full flex items-end">
            <div className="container mx-auto px-6 pb-8">
              <div className="flex flex-col md:flex-row items-end gap-6">
                {/* Profile Image */}
                <div className="relative">
                  <ProfilePicture
                    src={profile.image} 
                    alt={profile.name} 
                    size="xl"
                    showStatus={true}
                    status={profile.status}
                    className="border-4 border-white shadow-2xl"
                  />
                </div>

                {/* Profile Info */}
                <div className="flex-1 text-white">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl md:text-4xl font-bold">{profile.name}</h1>
                    <FaCheckCircle className="text-green-400" />
                  </div>
                  <p className="text-lg md:text-xl text-gray-200 mb-2">{profile.company}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1">
                      <FaStar className="text-yellow-400" />
                      {profile.rating}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaUsers />
                      {profile.students}+ students helped
                    </span>
                    <span className="flex items-center gap-1">
                      <FaVideo />
                      {profile.sessions}+ sessions conducted
                    </span>
                    <span className="flex items-center gap-1">
                      <FaBriefcase />
                      {profile.experience}+ years experience
                    </span>
                  </div>
              </div>
              </div>
            </div>
          </div>
        </BannerImage>

        {/* Main Content */}
        <div className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Info */}
            <div className="lg:col-span-2">
              {/* Tabs */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 mb-6">
                <div className="flex flex-wrap border-b border-gray-200 dark:border-gray-700 mb-6">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        className={`px-4 py-2 font-semibold border-b-2 transition-colors flex items-center gap-2 ${
                          activeTab === tab.id
                            ? 'border-primary text-primary'
                            : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                        }`}
                        onClick={() => setActiveTab(tab.id)}
                      >
                        <Icon className="text-sm" />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                {/* Tab Content */}
                {activeTab === 'about' && (
                  <div>
                    <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">About {profile.name}</h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                      {profile.about || 'No bio available.'}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                          <FaBriefcase className="text-primary" />
                          Experience
                        </h4>
                        <p className="text-gray-600 dark:text-gray-300">{profile.experience} years</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                          <FaClock className="text-primary" />
                          Availability
                        </h4>
                        <p className="text-gray-600 dark:text-gray-300">{profile.availability}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                          <FaLanguage className="text-primary" />
                          Languages
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {(profile.languages || []).map((lang, index) => (
                            <span key={index} className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded text-xs">
                              {lang}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                          <FaVideo className="text-primary" />
                          Session Types
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {(profile.sessionTypes || []).map((type, index) => (
                            <span key={index} className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                              {type}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'credentials' && (
                  <div>
                    <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Professional Credentials</h3>
                    
                    {/* Education */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                        <FaGraduationCap className="text-primary" />
                        Education
                      </h4>
                      {profile.education.length > 0 ? (
                        <div className="space-y-3">
                          {profile.education.map((edu, index) => (
                            <div key={index} className="border-l-4 border-primary pl-4">
                              <p className="font-medium text-gray-800 dark:text-white">{edu.degree}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-300">{edu.institution} • {edu.year}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 dark:text-gray-400">Education details not available.</p>
                      )}
                    </div>

                    {/* Certifications */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                        <FaCertificate className="text-primary" />
                        Certifications
                      </h4>
                      {profile.certifications.length > 0 ? (
                        <div className="space-y-3">
                          {profile.certifications.map((cert, index) => (
                            <div key={index} className="border-l-4 border-green-500 pl-4">
                              <p className="font-medium text-gray-800 dark:text-white">{cert.name}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-300">{cert.issuer} • {cert.year}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 dark:text-gray-400">Certification details not available.</p>
                      )}
                    </div>

                    {/* Professional Memberships */}
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                        <FaAward className="text-primary" />
                        Professional Memberships
                      </h4>
                      {profile.memberships.length > 0 ? (
                        <div className="space-y-2">
                          {profile.memberships.map((membership, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <FaCheckCircle className="text-green-500 text-sm" />
                              <span className="text-gray-700 dark:text-gray-300">{membership}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 dark:text-gray-400">Membership details not available.</p>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'expertise' && (
                  <div>
                    <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Areas of Expertise</h3>
                    
                    {/* Specializations */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                        <FaLightbulb className="text-primary" />
                        Specializations
                      </h4>
                      {profile.specializations.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {profile.specializations.map((spec, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                            >
                              {spec}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 dark:text-gray-400">Specialization details not available.</p>
                      )}
                    </div>

                    {/* Skills */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                        <FaBriefcase className="text-primary" />
                        Skills
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {(profile.skills || []).map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full text-sm font-medium"
                          >
                    {skill}
                  </span>
                ))}
              </div>
                    </div>

                    {/* Topics Covered */}
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                        <FaBookmark className="text-primary" />
                        Topics Covered
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {(profile.topics || []).map((topic, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium"
                          >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
              </div>
                )}

                {activeTab === 'approach' && (
                  <div>
                    <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">My Approach</h3>
                    
                    <div className="mb-6">
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        {profile.approach || 'Approach details not available.'}
                </p>
              </div>

                    {/* Success Stories */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                        <FaHeart className="text-primary" />
                        Success Stories
                      </h4>
                      {profile.successStories.length > 0 ? (
                        <div className="space-y-4">
                          {profile.successStories.map((story, index) => (
                            <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                              <p className="text-gray-600 dark:text-gray-300 italic">"{story.testimonial}"</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">- {story.clientName}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 dark:text-gray-400">Success stories not available.</p>
                      )}
                    </div>

                    {/* Publications & Media */}
                    {((profile.publications && profile.publications.length > 0) || (profile.mediaAppearances && profile.mediaAppearances.length > 0)) && (
                      <div>
                        <h4 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                          <FaExternalLinkAlt className="text-primary" />
                          Publications & Media
                        </h4>
                        {(profile.publications && profile.publications.length > 0) && (
                          <div className="mb-4">
                            <h5 className="font-medium text-gray-800 dark:text-white mb-2">Publications</h5>
                            <div className="space-y-2">
                              {profile.publications.map((pub, index) => (
                                <div key={index} className="text-sm text-gray-600 dark:text-gray-300">
                                  • {pub.title} ({pub.year})
                                </div>
                              ))}
            </div>
          </div>
                        )}
                        {(profile.mediaAppearances && profile.mediaAppearances.length > 0) && (
                          <div>
                            <h5 className="font-medium text-gray-800 dark:text-white mb-2">Media Appearances</h5>
                            <div className="space-y-2">
                              {profile.mediaAppearances.map((media, index) => (
                                <div key={index} className="text-sm text-gray-600 dark:text-gray-300">
                                  • {media.title} - {media.outlet} ({media.year})
                                </div>
                              ))}
                            </div>
              </div>
                        )}
              </div>
                    )}
            </div>
                )}

                {/* Remove tab content rendering for 'reviews' and 'contact' (do not render those sections) */}
              </div>
            </div>

            {/* Right Column - Enhanced Booking Section */}
            <div className="space-y-6">
              {/* Professional Booking Card */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 sticky top-6 transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">Book a Session</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <FaStar className="text-yellow-400" />
                    <span>{profile.rating}</span>
                    <span>•</span>
                    <span>{profile.sessions}+ sessions</span>
                  </div>
                </div>

                {/* Booking Status Indicator */}
                {!isTakingBookings && (
                  <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
                    <div className="flex items-center gap-2">
                      <FaInfoCircle className="text-red-500 dark:text-red-400" />
                      <div>
                        <p className="font-semibold text-red-800 dark:text-red-200">
                          Temporarily Not Taking Bookings
                        </p>
                        <p className="text-sm text-red-600 dark:text-red-300">
                          {counsellor?.stopBookingReason || 'Due to high demand, this counsellor has temporarily stopped accepting new bookings.'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Session Type Selection */}
                <div className={`mb-6 ${!isTakingBookings ? 'opacity-50 pointer-events-none' : ''}`}>
                  <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                    <FaVideo className="text-primary" />
                    Choose Session Type
                  </h4>
                  <div className="space-y-3">
                    {sessionTypes.map((type) => {
                      const Icon = type.icon;
                      return (
                        <button
                          key={type.id}
                          onClick={() => handleSessionTypeSelect(type)}
                          className={`w-full p-4 rounded-xl border-2 transition-all duration-200 ${
                            selectedSessionType?.id === type.id
                              ? 'border-primary bg-primary/10 dark:bg-primary/20 shadow-lg scale-[1.02]'
                              : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-slate-800'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg bg-gradient-to-r ${type.color} text-white`}>
                                <Icon className="w-5 h-5" />
                              </div>
                              <div className="text-left">
                                <div className="flex items-center gap-2">
                                  <h5 className={`font-semibold ${selectedSessionType?.id === type.id ? 'text-primary dark:text-primary-light' : 'text-gray-800 dark:text-white'}`}>
                                    {type.name}
                                  </h5>
                                  {type.popular && (
                                    <span className="px-2 py-1 bg-primary text-white text-xs rounded-full font-medium">
                                      Popular
                                    </span>
                                  )}
                                </div>
                                <p className={`text-sm ${selectedSessionType?.id === type.id ? 'text-gray-600 dark:text-gray-300' : 'text-gray-600 dark:text-gray-400'}`}>
                                  {type.description}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className={`text-lg font-bold ${selectedSessionType?.id === type.id ? 'text-primary dark:text-primary-light' : 'text-primary dark:text-primary-light'}`}>
                                ₹{type.price}
                              </div>
                              <div className={`text-xs ${selectedSessionType?.id === type.id ? 'text-gray-500 dark:text-gray-400' : 'text-gray-500 dark:text-gray-400'}`}>
                                {type.duration}
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Book Button */}
                <button
                  onClick={handleBookingConfirm}
                  disabled={!selectedSessionType || !isTakingBookings}
                  className={`w-full py-4 rounded-xl font-semibold transition-all duration-200 ${
                    selectedSessionType && isTakingBookings
                      ? 'bg-gradient-to-r from-primary to-purple-600 hover:from-primary-dark hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02]'
                      : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {!isTakingBookings
                    ? 'Not Taking Bookings'
                    : selectedSessionType
                      ? `Book ${selectedSessionType.name} - ₹${selectedSessionType.price}`
                      : 'Select a session type'
                  }
                </button>

                {/* Trust Indicators */}
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                  <div className="flex items-center justify-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <FaCheckCircle className="text-green-500" />
                      <span>Secure Payment</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FaClock className="text-blue-500" />
                      <span>Instant Confirmation</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Full Width Reviews & Ratings Section */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 mt-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                <FaStar className="text-primary text-sm" />
                Reviews & Ratings
              </h3>
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="text-xs bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5"
              >
                <FaEdit className="w-3 h-3" />
                Add Review
              </button>
            </div>

            {/* Average Rating Display */}
            <div className="flex items-center gap-4 mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{(averageRating || 0).toFixed(1)}</div>
                <div className="flex items-center gap-1 mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className={`w-4 h-4 ${star <= (averageRating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {totalReviews} reviews
                </div>
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Based on {totalReviews} student reviews
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Real feedback from students who have worked with this counsellor
                </div>
              </div>
            </div>

            {/* Add Review Form */}
            {showReviewForm && (
              <div className="mb-6 p-6 border border-gray-200 dark:border-gray-700 rounded-xl">
                <h4 className="font-semibold text-gray-800 dark:text-white mb-4 text-lg">Write a Review</h4>
                <form onSubmit={handleSubmitReview}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Rating
                    </label>
                    <div className="flex items-center gap-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewReview({ ...newReview, rating: star })}
                          className="focus:outline-none hover:scale-110 transition-transform"
                        >
                          <FaStar
                            className={`w-8 h-8 ${star <= newReview.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Your Review
                    </label>
                    <textarea
                      value={newReview.comment}
                      onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                      className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                      rows="4"
                      placeholder="Share your experience with this counsellor... (minimum 10 characters)"
                      required
                    />
                    <div className={`text-sm mt-1 ${newReview.comment.length < 10 ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
                      {newReview.comment.length}/1000 characters (minimum 10 required)
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={newReview.comment.trim().length < 10}
                      className={`px-6 py-3 rounded-lg transition-colors font-medium ${
                        newReview.comment.trim().length < 10
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-primary hover:bg-primary-dark text-white'
                      }`}
                    >
                      Submit Review
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowReviewForm(false)}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-3 rounded-lg transition-colors font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

                        {/* Reviews List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reviews && reviews.length > 0 ? (
                reviews.map((review, index) => (
                  <ReviewCard key={index} review={review} type="counsellor" />
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <FaStar className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">No reviews yet</p>
                  <p className="text-gray-400 dark:text-gray-500 text-xs">Be the first to review this counsellor</p>
                </div>
              )}
            </div>


          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <BookCounsellingModal
          counsellor={{
            _id: counsellor.counsellor._id, // Use the user ID, not profile ID
            name: counsellor.name || counsellor.counsellor?.name,
            image: counsellor.profilePicture,
            profilePicture: counsellor.profilePicture,
            company: counsellor.currentCompany,
            currentCompany: counsellor.currentCompany,
            experience: counsellor.experience,
            rating: counsellor.averageRating,
            feedback: totalReviews,
            students: counsellor.students || 0,
            sessions: counsellor.sessions || 0,
            sessionPrice: counsellor.sessionPrice,
            sessionDuration: counsellor.sessionDuration,
            availability: true
          }}
          selectedSessionType={selectedSessionType}
          onClose={() => setShowBookingModal(false)}
          onBookingSuccess={handleBookingSuccess}
        />
      )}
    </>
  );
};

export default CounsellorProfile; 