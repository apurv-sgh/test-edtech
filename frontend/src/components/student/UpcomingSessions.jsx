import React, { useState, useEffect } from 'react';
import { FaCalendar, FaClock, FaVideo, FaPhone, FaComments, FaExternalLinkAlt, FaUser, FaIdCard } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getStudentSessions } from '../../api/counsellors';
import SessionCountdown from '../common/SessionCountdown';

const UpcomingSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const response = await getStudentSessions();
      if (response.success) {
        setSessions(response.data.upcomingSessions);
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
      toast.error('Failed to fetch upcoming sessions');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getSessionTypeIcon = (sessionType) => {
    switch (sessionType) {
      case 'video':
        return <FaVideo className="text-blue-500" />;
      case 'phone':
        return <FaPhone className="text-green-500" />;
      case 'chat':
        return <FaComments className="text-purple-500" />;
      default:
        return <FaComments className="text-gray-500" />;
    }
  };

  const getSessionTypeName = (sessionType) => {
    switch (sessionType) {
      case 'video':
        return 'Video Call';
      case 'phone':
        return 'Phone Call';
      case 'chat':
        return 'Chat Session';
      default:
        return 'Session';
    }
  };

  const handleJoinSession = (session) => {
    if (session.meetingLink) {
      window.open(session.meetingLink, '_blank');
    } else {
      toast.error('Meeting link not available');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Upcoming Sessions
        </h2>
        <button
          onClick={fetchSessions}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          Refresh
        </button>
      </div>

      {sessions.length === 0 ? (
        <div className="text-center py-12">
          <FaCalendar className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No Upcoming Sessions
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            You don't have any scheduled sessions yet. Book a session with a counsellor to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sessions.map((session, index) => (
            <div
              key={`${session.date}-${session.slot}-${index}`}
              className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getSessionTypeIcon(session.sessionType)}
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {getSessionTypeName(session.sessionType)} with {session.counsellorName}
                    </h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      session.status === 'confirmed' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}>
                      {session.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                    <div className="flex items-center gap-1">
                      <FaCalendar className="w-4 h-4" />
                      <span>{formatDate(session.date)}</span>
                    </div>
                    {session.status === 'confirmed' && session.exactStartTime && session.exactEndTime ? (
                      <div className="flex items-center gap-1">
                        <FaClock className="w-4 h-4 text-green-500" />
                        <span className="text-green-600 dark:text-green-400 font-medium">
                          {session.exactStartTime} - {session.exactEndTime}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <FaClock className="w-4 h-4" />
                        <span>{session.slot}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <FaUser className="w-4 h-4" />
                      <span>{session.counsellorName}</span>
                    </div>
                  </div>

                  {/* Booking ID */}
                  <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mb-3">
                    <FaIdCard className="w-3 h-3" />
                                          <span>Session:</span>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Session #{index + 1}</span>
                  </div>

                  {session.status === 'confirmed' && session.exactStartTime && session.exactEndTime && (
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 mt-3">
                      <div className="flex items-center gap-2">
                        <span className="text-green-600 dark:text-green-400 text-lg">✅</span>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-green-800 dark:text-green-300">
                            Session Time Allocated: {session.exactStartTime} - {session.exactEndTime}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {session.message && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mt-3">
                      <div className="flex items-start gap-2">
                        <span className="text-blue-600 dark:text-blue-400 text-lg">💬</span>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">
                            Message from {session.counsellorName}:
                          </p>
                          <p className="text-sm text-blue-700 dark:text-blue-200 leading-relaxed">
                            {session.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  {session.status === 'confirmed' && session.meetingLink && (
                    <SessionCountdown
                      sessionDate={session.date}
                      sessionTime={session.slot}
                      exactStartTime={session.exactStartTime}
                      exactEndTime={session.exactEndTime}
                      meetingLink={session.meetingLink}
                      onSessionStart={() => {
                        toast.success('Session starting! Redirecting to meeting...');
                      }}
                    />
                  )}
                  
                  {session.status === 'pending' && (
                    <div className="text-sm text-gray-500 dark:text-gray-400 px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      Waiting for counsellor to allocate slot...
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Booked on {new Date(session.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UpcomingSessions;
