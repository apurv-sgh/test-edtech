import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar, FaBriefcase, FaLinkedin, FaCheckCircle, FaGlobe, FaCalendarAlt, FaClock, FaVideo, FaBookmark, FaUsers, FaArrowLeft, FaUser, FaGraduationCap, FaAward, FaCertificate, FaLanguage, FaLightbulb, FaHandshake, FaEdit, FaCalendar } from 'react-icons/fa';
import Navbar from '../Navbar';
import WebinarRegistrationModal from './WebinarRegistrationModal';
import { toast } from 'react-toastify';
import WebinarCard from './WebinarCard';
import { useAuth } from '../../context/AuthContext';
import { BannerImage, ProfilePicture } from '../common/ImageComponent';
import { getIndustryExpertProfileById, getExpertReviews, postExpertReview } from '../../api/industryExperts';
import ReviewCard from '../common/ReviewCard';
import PaymentModal from '../common/PaymentModal';

const IndustryExpertProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expert, setExpert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('about');
  const [registerModal, setRegisterModal] = useState({ open: false, seminar: null });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedWebinar, setSelectedWebinar] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    setLoading(true);
    getIndustryExpertProfileById(id)
      .then((res) => {
        console.log('Expert profile data:', res.data);
        setExpert(res.data);
        // Fetch reviews for this expert using the profile ID
        fetchReviews(res.data._id);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const fetchReviews = async (expertId) => {
    try {
      console.log('Fetching reviews for expert ID:', expertId);
      const response = await getExpertReviews(expertId);
      console.log('Expert reviews API response:', response.data);
      if (response.data.success) {
        setReviews(response.data.data.reviews || []);
        setAverageRating(response.data.data.averageRating || 0);
        setTotalReviews(response.data.data.totalReviews || 0);
      } else {
        console.log('Expert reviews API returned success: false');
        setReviews([]);
        setAverageRating(0);
        setTotalReviews(0);
      }
    } catch (error) {
      console.error('Error fetching expert reviews:', error);
      // Set default values on error
      setReviews([]);
      setAverageRating(0);
      setTotalReviews(0);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!expert || !expert._id) {
      toast.error('Expert data not available');
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
      console.log('Submitting review for expert ID:', expert._id);
      console.log('Review data:', newReview);
      console.log('User token:', user?.token ? 'Available' : 'Not available');
      
      const response = await postExpertReview(expert._id, newReview);

      if (response.data.success) {
        setNewReview({ rating: 5, comment: '' });
        setShowReviewForm(false);
        // Refresh reviews
        fetchReviews(expert._id);
        toast.success('Review submitted successfully!');
      } else {
        toast.error(response.data.message || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Review submission failed. Please try again.');
      }
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!expert) return <div className="p-8 text-center">Industry Expert not found.</div>;

  // Use fallback/defaults for missing fields
  const profile = {
    name: expert.expert?.name || expert.name || 'N/A',
    company: expert.company || 'N/A',
    experience: expert.experience || 0,
    domain: expert.domain || 'N/A',
    status: expert.status || 'Available',
    languages: expert.languages || ['English'],
    skills: expert.skills || [],
    rating: expert.rating || 4.5,
    image: expert.profilePicture || expert.image || '',
    linkedin: expert.linkedinUrl || expert.linkedin || '',
    about: expert.bio || expert.about || '',
    topics: expert.topics || [],
    students: expert.students || 0,
    sessions: expert.sessions || 0,
    bannerImage: expert.bannerImage || '',
    education: expert.education || [],
    certifications: expert.certifications || [],
    specializations: expert.specializations || [],
    approach: expert.approach || '',
    memberships: expert.memberships || [],
    publications: expert.publications || [],
    mediaAppearances: expert.mediaAppearances || [],
    sessionTypes: expert.sessionTypes || ['Webinar', 'Seminar'],
    seminars: expert.seminars || [],
  };

  const tabs = [
    { id: 'about', label: 'About', icon: FaUser },
    { id: 'credentials', label: 'Credentials', icon: FaAward },
    { id: 'expertise', label: 'Expertise', icon: FaLightbulb },
    { id: 'webinars', label: 'Webinars', icon: FaVideo },
  ];

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/industry-experts');
    }
  };

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
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-white">
                    {profile.image ? (
                      <img 
                        src={profile.image} 
            alt={profile.name}
            className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className={`w-full h-full flex items-center justify-center text-slate-400 ${profile.image ? 'hidden' : 'flex'}`}>
                      <FaUser className="w-16 h-16 md:w-20 md:h-20" />
                    </div>
                  </div>
                  <span className={`absolute -top-2 -right-2 px-3 py-1 rounded-full text-xs font-bold ${
                    profile.status === 'Available' ? 'bg-green-500 text-white' : 'bg-yellow-400 text-white'
                  } shadow-lg`}>
                    {profile.status}
                  </span>
                </div>
                {/* Profile Info */}
                <div className="flex-1 text-white">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl md:text-4xl font-bold">{profile.name}</h1>
                    <FaCheckCircle className="text-green-400" />
      </div>
                  <p className="text-lg md:text-xl text-gray-200 mb-2">{profile.company} • {profile.domain}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1">
                      <FaStar className="text-yellow-400" />
                      {profile.rating}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaUsers />
                      {profile.students}+ students inspired
                    </span>
                    <span className="flex items-center gap-1">
                      <FaVideo />
                      {profile.seminars?.length || 0}+ webinars conducted
                    </span>
                    <span className="flex items-center gap-1">
                      <FaBriefcase />
                      {profile.experience}+ years expertise
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
                          {profile.languages.map((lang, index) => (
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
                          {profile.sessionTypes.map((type, index) => (
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
                        {profile.skills.map((skill, index) => (
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
                        {profile.topics.map((topic, index) => (
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

                {activeTab === 'webinars' && (
                  <div>
                    <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Upcoming Webinars & Seminars</h3>
                    {profile.seminars && profile.seminars.length > 0 ? (
                      <div className="flex gap-6 overflow-x-auto pb-4 hide-scrollbar">
                        {profile.seminars.map((seminar, index) => (
                          <WebinarCard
                            key={index}
                            seminar={seminar}
                            onRegister={() => {
                              if (!user) {
                                navigate('/login');
                              } else {
                                setRegisterModal({ open: true, seminar });
                              }
                            }}
                          />
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400">No webinars or seminars scheduled yet.</p>
                    )}
                    {/* Register Modal */}
                    <WebinarRegistrationModal
                      isOpen={registerModal.open}
                      webinar={registerModal.seminar}
                      onClose={() => setRegisterModal({ open: false, seminar: null })}
                      onSuccess={() => {
                        setRegisterModal({ open: false, seminar: null });
                        toast.success('You are registered! We’ll notify you before the event.');
                      }}
                      user={user}
                    />
                  </div>
                )}
              </div>
            </div>
            {/* Right Column - Upcoming Webinars */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
                  <FaVideo className="text-primary" />
                  Upcoming Webinars
                </h3>
                <div className="space-y-4">
                  {profile.seminars && profile.seminars.length > 0 ? (
                    profile.seminars.slice(0, 3).map((seminar, index) => (
                      <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-gray-800 dark:text-white text-sm line-clamp-2">{seminar.title}</h4>
                          <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-full ml-2 flex-shrink-0">
                            {seminar.fee > 0 ? `₹${seminar.fee}` : 'Free'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 mb-3">
                          <FaCalendar className="text-primary" />
                          <span>{seminar.date} • {seminar.time}</span>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                          {seminar.description}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {seminar.registeredStudents || 0}+ registered
                          </span>
                          <button 
                            onClick={() => {
                              if (!user) {
                                navigate('/login');
                              } else {
                                setSelectedWebinar(seminar);
                                setShowPaymentModal(true);
                              }
                            }}
                            className="text-xs bg-primary hover:bg-primary-dark text-white px-3 py-1 rounded-lg transition-colors"
                          >
                            Register Now
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6">
                      <FaVideo className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500 dark:text-gray-400 text-sm">No upcoming webinars</p>
                      <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">Check back soon for new events</p>
                    </div>
                  )}
                </div>
                {profile.seminars && profile.seminars.length > 3 && (
                  <button 
                    onClick={() => setActiveTab('webinars')}
                    className="w-full mt-4 text-primary hover:text-primary-dark text-sm font-medium transition-colors"
                  >
                    View All Webinars →
                  </button>
                )}
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
                  Real feedback from students who have attended webinars with this expert
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
                      placeholder="Share your experience with this expert... (minimum 10 characters)"
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
                  <ReviewCard key={index} review={review} type="expert" />
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <FaStar className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">No reviews yet</p>
                  <p className="text-gray-400 dark:text-gray-500 text-xs">Be the first to review this expert</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => {
          setShowPaymentModal(false);
          setSelectedWebinar(null);
        }}
        service={{
          ...selectedWebinar,
          expertName: profile.name
        }}
        type="expert"
      />
    </>
  );
};

export default IndustryExpertProfile; 