import React, { useState, useEffect } from 'react';
import { FaPhone, FaComments, FaCalendar, FaClock, FaUser, FaEnvelope, FaMobile, FaVideo, FaExternalLinkAlt, FaBell } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getUpcomingSessions } from '../../api/counsellorAvailability';

const UpcomingSessions = () => {
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sessionReminders, setSessionReminders] = useState({});

  useEffect(() => {
    fetchUpcomingSessions();
  }, []);

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      // Force re-render to update countdown timers
      setUpcomingSessions(prev => [...prev]);
      
      // Check for sessions starting soon and show reminders
      upcomingSessions.forEach(session => {
        const timeUntil = getTimeUntilSession(session.date, session.exactStartTime);
        
        if (timeUntil && timeUntil <= 5 * 60 * 1000 && timeUntil > 0) {
          // Session starting within 5 minutes
          if (!sessionReminders[session.studentId]) {
            toast.info(`Session with ${session.student?.name || 'student'} starting in ${formatCountdown(timeUntil)}!`, {
              autoClose: false,
              closeOnClick: false,
              draggable: false
            });
            setSessionReminders(prev => ({
              ...prev,
              [session.studentId]: true
            }));
          }
        }
      });
    }, 1000); // Update every second

    return () => clearInterval(timer);
  }, [upcomingSessions, sessionReminders]);

  const fetchUpcomingSessions = async () => {
    try {
      setLoading(true);
      const response = await getUpcomingSessions();
      if (response.success) {
        setUpcomingSessions(response.data.upcomingSessions);
      }
    } catch (error) {
      console.error('Error fetching upcoming sessions:', error);
      toast.error('Failed to fetch upcoming sessions');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'short', 
        day: 'numeric' 
      });
    }
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

  // Calculate time until session starts
  const getTimeUntilSession = (sessionDate, exactStartTime) => {
    const now = new Date();
    let sessionStartTime;
    
    if (exactStartTime) {
      // Parse exact time (e.g., "15:30" -> today's date + time)
      const [hours, minutes] = exactStartTime.split(':');
      sessionStartTime = new Date(sessionDate);
      sessionStartTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    } else {
      // Use slot time (e.g., "3PM-6PM" -> use start time)
      const slotStart = sessionDate.slot?.split('-')[0];
      if (slotStart) {
        const timeMatch = slotStart.match(/(\d+)(AM|PM)/);
        if (timeMatch) {
          let hours = parseInt(timeMatch[1]);
          if (timeMatch[2] === 'PM' && hours !== 12) hours += 12;
          if (timeMatch[2] === 'AM' && hours === 12) hours = 0;
          
          sessionStartTime = new Date(sessionDate);
          sessionStartTime.setHours(hours, 0, 0, 0);
        }
      }
    }
    
    if (!sessionStartTime) return null;
    
    const timeDiff = sessionStartTime.getTime() - now.getTime();
    return timeDiff > 0 ? timeDiff : 0;
  };

  // Format countdown display
  const formatCountdown = (milliseconds) => {
    if (milliseconds <= 0) return 'Session starting now!';
    
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  // Check if session is starting soon (within 5 minutes)
  const isSessionStartingSoon = (sessionDate, exactStartTime) => {
    const timeUntil = getTimeUntilSession(sessionDate, exactStartTime);
    return timeUntil && timeUntil <= 5 * 60 * 1000 && timeUntil > 0;
  };

  // Check if session can be joined (within 5 minutes before start)
  const canJoinSession = (sessionDate, exactStartTime) => {
    const timeUntil = getTimeUntilSession(sessionDate, exactStartTime);
    return timeUntil && timeUntil <= 5 * 60 * 1000;
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-3 text-slate-600 dark:text-slate-400">Loading upcoming sessions...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Upcoming Sessions
          </h2>
          <div className="flex items-center gap-4">
            <button
              onClick={fetchUpcomingSessions}
              className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium transition-colors"
            >
              <FaCalendar className="w-4 h-4" />
              Refresh
            </button>
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <FaCalendar className="w-5 h-5" />
              <span className="text-sm font-medium">
                {upcomingSessions.length} {upcomingSessions.length === 1 ? 'Session' : 'Sessions'}
              </span>
            </div>
          </div>
        </div>
        
        <p className="text-slate-600 dark:text-slate-400">
          View and manage your confirmed upcoming counselling sessions
        </p>
      </div>

      {/* Sessions List */}
      {upcomingSessions.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaCalendar className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              No Upcoming Sessions
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              You don't have any confirmed sessions scheduled yet.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {upcomingSessions.map((session, index) => (
            <div key={index} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 hover:shadow-md transition-shadow">
              <div className="space-y-3">
                {/* Header with Icon and Session Type */}
                <div className="flex items-center justify-between">
                  <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-lg">
                    {session.sessionType === 'chat' ? (
                      <FaComments className="w-5 h-5 text-primary" />
                    ) : (
                      <FaPhone className="w-5 h-5 text-primary" />
                    )}
                  </div>
                  <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full text-xs font-medium">
                    {session.sessionType === 'chat' ? 'Chat' : 'Phone'}
                  </span>
                </div>
                
                {/* Student Info */}
                <div className="space-y-1">
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white truncate">
                    {session.student?.name || 'Unknown Student'}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1 truncate">
                    <FaEnvelope className="w-3 h-3" />
                    {session.student?.email || 'N/A'}
                  </p>
                  {session.student?.mobile && (
                    <p className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1">
                      <FaMobile className="w-3 h-3" />
                      {session.student.mobile}
                    </p>
                  )}
                </div>

                {/* Session Details */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        {formatDate(session.date)}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1">
                        <FaClock className="w-3 h-3" />
                        {session.exactStartTime && session.exactEndTime 
                          ? `${session.exactStartTime} - ${session.exactEndTime}`
                          : formatTime(session.slot)
                        }
                      </p>
                    </div>
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-full text-xs font-medium">
                      Confirmed
                    </span>
                  </div>

                  {/* Countdown Timer */}
                  {(() => {
                    const timeUntil = getTimeUntilSession(session.date, session.exactStartTime);
                    const isStartingSoon = isSessionStartingSoon(session.date, session.exactStartTime);
                    
                    return timeUntil ? (
                      <div className={`px-2 py-1 rounded text-xs font-medium ${
                        isStartingSoon 
                          ? 'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400' 
                          : 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                      }`}>
                        <div className="flex items-center gap-1">
                          <FaBell className="w-3 h-3" />
                          <span>
                            {isStartingSoon ? 'Starting soon: ' : 'Starts in: '}
                            {formatCountdown(timeUntil)}
                          </span>
                        </div>
                      </div>
                    ) : null;
                  })()}

                  {/* Action Button */}
                  <div className="pt-2">
                    {session.meetingLink ? (
                      <button
                        onClick={() => {
                          window.open(session.meetingLink, '_blank');
                          toast.success('Joining session...');
                        }}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        <FaVideo className="w-4 h-4" />
                        Join Session
                      </button>
                    ) : (
                      <button
                        disabled
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 rounded-lg text-sm font-medium cursor-not-allowed"
                      >
                        <FaVideo className="w-4 h-4" />
                        Join Available 5 Min Before
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Counsellor Message */}
              {session.message && (
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded text-xs">
                    <p className="text-blue-800 dark:text-blue-300">
                      <strong>Message:</strong> {session.message}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UpcomingSessions;
