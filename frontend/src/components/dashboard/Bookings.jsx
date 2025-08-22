import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaClock, FaUser, FaVideo, FaComments, FaCheckCircle, FaTimes, FaMapMarkerAlt, FaExternalLinkAlt, FaChalkboardTeacher, FaIdCard, FaStar } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getStudentSessions, getStudentWebinarBookings } from '../../api/counsellors';
import SessionCountdown from '../common/SessionCountdown';

const Bookings = () => {
  const [counsellingSessions, setCounsellingSessions] = useState([]);
  const [webinarSessions, setWebinarSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [activeType, setActiveType] = useState('all'); // 'all', 'counselling', 'webinar'

  useEffect(() => {
    fetchAllBookings();
  }, []);

  const fetchAllBookings = async () => {
    try {
      setLoading(true);
      
      console.log('=== FETCHING BOOKINGS ===');
      
      // Fetch counselling sessions
      console.log('Fetching counselling sessions...');
      const counsellingResponse = await getStudentSessions();
      console.log('Counselling response:', counsellingResponse);
      
      if (counsellingResponse.success) {
        console.log('Counselling sessions:', counsellingResponse.data.upcomingSessions);
        setCounsellingSessions(counsellingResponse.data.upcomingSessions);
      } else {
        console.error('Counselling response not successful:', counsellingResponse);
      }

      // Fetch webinar/seminar bookings
      console.log('Fetching webinar sessions...');
      const webinarResponse = await getStudentWebinarBookings();
      console.log('Webinar response:', webinarResponse);
      
      if (webinarResponse.success) {
        console.log('Webinar sessions:', webinarResponse.data.webinarBookings);
        setWebinarSessions(webinarResponse.data.webinarBookings);
      }
      
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (timeString.includes(':')) {
      return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    }
    return timeString; // For slot formats like "6PM-9PM"
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming':
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'upcoming':
      case 'confirmed':
        return <FaCalendarAlt className="w-4 h-4" />;
      case 'completed':
        return <FaCheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <FaTimes className="w-4 h-4" />;
      case 'pending':
        return <FaClock className="w-4 h-4" />;
      default:
        return <FaCalendarAlt className="w-4 h-4" />;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'counselling':
      case 'chat':
      case 'phone':
      case 'video':
        return <FaComments className="w-6 h-6 text-primary" />;
      case 'webinar':
      case 'seminar':
        return <FaChalkboardTeacher className="w-6 h-6 text-primary" />;
      default:
        return <FaVideo className="w-6 h-6 text-primary" />;
    }
  };

  // Combine and filter all bookings
  const allBookings = [
    ...counsellingSessions.map(session => ({
      ...session,
      type: 'counselling',
      title: `${session.sessionType.charAt(0).toUpperCase() + session.sessionType.slice(1)} Session`,
      provider: session.counsellorName,
      date: session.date,
      time: session.slot,
      duration: '60 minutes',
      price: 99, // Default counselling price
      bookingId: session.bookingId,
      meetingLink: session.meetingLink,
      message: session.message,
      exactStartTime: session.exactStartTime,
      exactEndTime: session.exactEndTime
    })),
    ...webinarSessions
  ];

  const filteredBookings = allBookings.filter(booking => {
    // Filter by status
    const statusMatch = activeTab === 'upcoming' 
      ? ['upcoming', 'confirmed', 'pending'].includes(booking.status)
      : booking.status === 'completed';
    
    // Filter by type
    const typeMatch = activeType === 'all' || booking.type === activeType;
    
    return statusMatch && typeMatch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">My Bookings</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage your sessions and webinars</p>
        </div>
        <button
          onClick={fetchAllBookings}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* Type Filter */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
        <button
          onClick={() => setActiveType('all')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeType === 'all'
              ? 'bg-white dark:bg-gray-600 text-primary shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
          }`}
        >
          All ({allBookings.length})
        </button>
        <button
          onClick={() => setActiveType('counselling')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeType === 'counselling'
              ? 'bg-white dark:bg-gray-600 text-primary shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
          }`}
        >
          Counselling ({counsellingSessions.length})
        </button>
        <button
          onClick={() => setActiveType('webinar')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeType === 'webinar'
              ? 'bg-white dark:bg-gray-600 text-primary shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
          }`}
        >
          Webinars ({webinarSessions.length})
        </button>
      </div>

      {/* Status Tabs */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'upcoming'
              ? 'bg-white dark:bg-gray-600 text-primary shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
          }`}
        >
          Upcoming ({allBookings.filter(b => ['upcoming', 'confirmed', 'pending'].includes(b.status)).length})
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'completed'
              ? 'bg-white dark:bg-gray-600 text-primary shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
          }`}
        >
          Completed ({allBookings.filter(b => b.status === 'completed').length})
        </button>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaCalendarAlt className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              No {activeTab} {activeType === 'all' ? 'bookings' : activeType === 'counselling' ? 'sessions' : 'webinars'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {activeTab === 'upcoming' 
                ? `You don't have any upcoming ${activeType === 'all' ? 'sessions or webinars' : activeType === 'counselling' ? 'counselling sessions' : 'webinars'}.`
                : `You haven't completed any ${activeType === 'all' ? 'sessions or webinars' : activeType === 'counselling' ? 'counselling sessions' : 'webinars'} yet.`
              }
            </p>
          </div>
        ) : (
          filteredBookings.map((booking, index) => (
            <div
              key={`${booking.date}-${booking.slot}-${index}`}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Header with professional background */}
              <div className="bg-slate-800 dark:bg-slate-900 p-4 text-white border-b border-slate-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-700 dark:bg-slate-600 rounded-lg flex items-center justify-center">
                      {getTypeIcon(booking.type)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{booking.title}</h3>
                      <p className="text-slate-300 text-sm">with {booking.provider}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                      booking.status === 'confirmed' 
                        ? 'bg-green-600 text-white'
                        : booking.status === 'pending'
                        ? 'bg-amber-500 text-white'
                        : 'bg-blue-600 text-white'
                    }`}>
                      {getStatusIcon(booking.status)}
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                    <span className="text-lg font-bold text-emerald-400">
                      {formatPrice(booking.price)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {/* Session Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600">
                    <FaCalendarAlt className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Date</p>
                      <p className="text-sm text-slate-800 dark:text-slate-200 font-semibold">{formatDate(booking.date)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600">
                    <FaClock className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Time</p>
                      <p className="text-sm text-slate-800 dark:text-slate-200 font-semibold">
                        {booking.type === 'counselling' && booking.status === 'confirmed' && booking.exactStartTime && booking.exactEndTime 
                          ? `${booking.exactStartTime} - ${booking.exactEndTime}`
                          : formatTime(booking.time)
                        }
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600">
                    <FaClock className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Duration</p>
                      <p className="text-sm text-slate-800 dark:text-slate-200 font-semibold">{booking.duration}</p>
                    </div>
                  </div>
                </div>

                {/* Booking Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4 border border-slate-200 dark:border-slate-600">
                    <div className="flex items-center gap-2 mb-2">
                      <FaIdCard className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                                              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Session</p>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Session #{index + 1}</p>
                  </div>
                  {booking.meetingLink && (
                    <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4 border border-slate-200 dark:border-slate-600">
                      <div className="flex items-center gap-2 mb-2">
                        <FaExternalLinkAlt className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                        <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Meeting Link</p>
                      </div>
                      <a
                        href={booking.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-semibold break-all flex items-center gap-1 transition-colors"
                      >
                        <FaExternalLinkAlt className="w-3 h-3" />
                        Join Meeting
                      </a>
                    </div>
                  )}
                </div>

                {/* Countdown Timer for Confirmed Sessions and Upcoming Webinars */}
                {((booking.type === 'counselling' && booking.status === 'confirmed' && booking.meetingLink) || 
                  (booking.type === 'webinar' && ['upcoming', 'confirmed'].includes(booking.status) && booking.meetingLink)) && (
                  <div className="mb-6">
                    <SessionCountdown
                      sessionDate={booking.date}
                      sessionTime={booking.time}
                      exactStartTime={booking.exactStartTime}
                      exactEndTime={booking.exactEndTime}
                      meetingLink={booking.meetingLink}
                      sessionType={booking.type}
                      onSessionStart={() => {
                        toast.success(`${booking.type === 'counselling' ? 'Session' : 'Webinar'} starting! Redirecting to meeting...`);
                      }}
                    />
                  </div>
                )}

                {/* Allocated Time Display for Confirmed Sessions */}
                {booking.type === 'counselling' && booking.status === 'confirmed' && booking.exactStartTime && booking.exactEndTime && (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
                        <span className="text-green-600 dark:text-green-400 text-lg">✅</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-green-800 dark:text-green-300 mb-1">
                          Session Time Allocated
                        </p>
                        <p className="text-lg font-bold text-green-700 dark:text-green-200">
                          {booking.exactStartTime} - {booking.exactEndTime}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Counsellor Message Display */}
                {booking.type === 'counselling' && booking.message && (
                  <div className="bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg p-4 mb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-slate-200 dark:bg-slate-600 rounded-full flex items-center justify-center">
                        <span className="text-slate-600 dark:text-slate-400 text-lg">💬</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">
                          Message from {booking.provider}
                        </p>
                        <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-slate-200 dark:border-slate-600">
                          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                            {booking.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
                  {/* Show bottom button only for sessions without countdown timer */}
                  {['upcoming', 'confirmed', 'pending'].includes(booking.status) && 
                   !((booking.type === 'counselling' && booking.status === 'confirmed' && booking.meetingLink) || 
                     (booking.type === 'webinar' && ['upcoming', 'confirmed'].includes(booking.status) && booking.meetingLink)) && (
                    <button
                      onClick={() => {
                        if (booking.meetingLink) {
                          window.open(booking.meetingLink, '_blank');
                        } else {
                          toast.info('Meeting link will be available closer to the session time');
                        }
                      }}
                      className="w-full bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 dark:hover:bg-slate-600 text-white py-3 px-6 rounded-lg text-sm font-semibold transition-all duration-300 hover:shadow-lg flex items-center justify-center gap-2"
                    >
                      <FaExternalLinkAlt className="w-4 h-4" />
                      Join {booking.type === 'counselling' ? 'Session' : 'Webinar'}
                    </button>
                  )}
                  {booking.status === 'completed' && (
                    <button
                      onClick={() => toast.info('Review feature coming soon!')}
                      className="w-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 py-3 px-6 rounded-lg text-sm font-semibold transition-all duration-300 hover:shadow-lg border border-slate-300 dark:border-slate-600"
                    >
                      View Details
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Bookings; 