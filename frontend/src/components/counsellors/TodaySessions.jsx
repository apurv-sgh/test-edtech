import React, { useState, useEffect } from 'react';
import { FaPhone, FaComments, FaClock, FaUser, FaEnvelope, FaMobile, FaVideo, FaExternalLinkAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getUpcomingSessions } from '../../api/counsellorAvailability';

const TodaySessions = () => {
  const [todaySessions, setTodaySessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodaySessions();
  }, []);

  const fetchTodaySessions = async () => {
    try {
      setLoading(true);
      const response = await getUpcomingSessions();
      if (response.success) {
        // Filter for today's sessions only
        const today = new Date();
        const todayString = today.toISOString().split('T')[0];
        
        const todayOnly = response.data.upcomingSessions.filter(session => {
          const sessionDate = new Date(session.date);
          const sessionDateString = sessionDate.toISOString().split('T')[0];
          return sessionDateString === todayString && session.status === 'confirmed';
        });
        
        setTodaySessions(todayOnly);
      }
    } catch (error) {
      console.error('Error fetching today\'s sessions:', error);
      toast.error('Failed to fetch today\'s sessions');
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        <span className="ml-2 text-slate-600 dark:text-slate-400 text-sm">Loading today's sessions...</span>
      </div>
    );
  }

  if (todaySessions.length === 0) {
    return (
      <div className="text-center py-6">
        <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-3">
          <FaClock className="w-6 h-6 text-slate-400" />
        </div>
        <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-1">
          No Sessions Today
        </h4>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          You have a free day! Check your upcoming sessions tab for future appointments.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {todaySessions.length} {todaySessions.length === 1 ? 'session' : 'sessions'} scheduled for today
        </p>
      </div>
      
      {todaySessions.map((session, index) => (
        <div key={index} className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600">
          <div className="flex items-center justify-between">
            {/* Left Section - Student Info */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-lg">
                {session.sessionType === 'chat' ? (
                  <FaComments className="w-4 h-4 text-primary" />
                ) : (
                  <FaPhone className="w-4 h-4 text-primary" />
                )}
              </div>
              
              <div>
                <h4 className="font-medium text-slate-900 dark:text-white text-sm">
                  {session.student?.name || 'Unknown Student'}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1">
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
            </div>

            {/* Right Section - Time and Actions */}
            <div className="text-right space-y-2">
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  {session.exactStartTime && session.exactEndTime 
                    ? `${session.exactStartTime} - ${session.exactEndTime}`
                    : formatTime(session.slot)
                  }
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {session.sessionType === 'chat' ? 'Chat Session' : 'Phone Call'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {session.meetingLink && (
                  <button
                    onClick={() => window.open(session.meetingLink, '_blank')}
                    className="flex items-center gap-1 px-3 py-1 bg-primary hover:bg-primary-dark text-white rounded text-xs font-medium transition-colors"
                  >
                    <FaVideo className="w-3 h-3" />
                    Join
                  </button>
                )}
                <button
                  onClick={() => {
                    if (session.meetingLink) {
                      navigator.clipboard.writeText(session.meetingLink);
                      toast.success('Meeting link copied!');
                    }
                  }}
                  className="flex items-center gap-1 px-3 py-1 bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-300 rounded text-xs font-medium transition-colors"
                >
                  <FaExternalLinkAlt className="w-3 h-3" />
                  Copy
                </button>
              </div>
            </div>
          </div>

          {/* Session Message */}
          {session.message && (
            <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-600">
              <p className="text-xs text-blue-700 dark:text-blue-300">
                <strong>Message:</strong> {session.message}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TodaySessions;
