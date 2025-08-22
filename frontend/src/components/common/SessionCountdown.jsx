import React, { useState, useEffect } from 'react';
import { FaClock, FaVideo } from 'react-icons/fa';

const SessionCountdown = ({ sessionDate, sessionTime, exactStartTime, exactEndTime, meetingLink, onSessionStart, sessionType = 'session' }) => {
  const [timeLeft, setTimeLeft] = useState(null);
  const [canJoin, setCanJoin] = useState(false);
  const [isSessionTime, setIsSessionTime] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const sessionDateTime = new Date(sessionDate);
      
      // Use exact allocated time if available, otherwise parse the time slot
      if (exactStartTime) {
        // Parse exact time (e.g., "18:00" -> 18 hours, 0 minutes)
        const [hours, minutes] = exactStartTime.split(':').map(Number);
        sessionDateTime.setHours(hours, minutes, 0, 0);
      } else {
        // Parse the time slot (e.g., "12PM-3PM" -> extract start time)
        const timeSlot = sessionTime;
        let startHour = 0;
        
        if (timeSlot.includes('9AM-12PM')) {
          startHour = 9;
        } else if (timeSlot.includes('12PM-3PM')) {
          startHour = 12;
        } else if (timeSlot.includes('3PM-6PM')) {
          startHour = 15;
        } else if (timeSlot.includes('6PM-9PM')) {
          startHour = 18;
        }
        
        sessionDateTime.setHours(startHour, 0, 0, 0);
      }
      
      const difference = sessionDateTime - now;
      
      if (difference > 0) {
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        const hours = Math.floor(difference / (1000 * 60 * 60));
        
        setTimeLeft({ hours, minutes, seconds });
        
        // Enable join button 5 minutes before session
        if (difference <= 5 * 60 * 1000) {
          setCanJoin(true);
        }
        
        // Session has started
        if (difference <= 0) {
          setIsSessionTime(true);
          setCanJoin(true);
        }
      } else {
        setIsSessionTime(true);
        setCanJoin(true);
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      }
    };

    // Calculate immediately
    calculateTimeLeft();
    
    // Set up interval for updates
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [sessionDate, sessionTime, exactStartTime]);

  const formatTime = (time) => {
    return time < 10 ? `0${time}` : time;
  };

  const handleJoinSession = () => {
    if (meetingLink && canJoin) {
      window.open(meetingLink, '_blank');
      if (onSessionStart) {
        onSessionStart();
      }
    }
  };

  if (!timeLeft) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <FaClock className="text-slate-600 dark:text-slate-400" />
          <span className="font-semibold text-slate-800 dark:text-white">
            {isSessionTime ? 'Session Time!' : 'Session Starting In'}
          </span>
        </div>
        <span className="text-sm text-slate-600 dark:text-slate-400">
          {exactStartTime && exactEndTime ? `${exactStartTime} - ${exactEndTime}` : sessionTime}
        </span>
      </div>
      
      <div className="flex items-center justify-center mb-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-slate-100 dark:bg-slate-600 rounded-lg p-3">
            <div className="text-2xl font-bold text-slate-800 dark:text-white">
              {formatTime(timeLeft.hours)}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400">Hours</div>
          </div>
          <div className="bg-slate-100 dark:bg-slate-600 rounded-lg p-3">
            <div className="text-2xl font-bold text-slate-800 dark:text-white">
              {formatTime(timeLeft.minutes)}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400">Minutes</div>
          </div>
          <div className="bg-slate-100 dark:bg-slate-600 rounded-lg p-3">
            <div className="text-2xl font-bold text-slate-800 dark:text-white">
              {formatTime(timeLeft.seconds)}
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400">Seconds</div>
          </div>
        </div>
      </div>
      
      <button
        onClick={handleJoinSession}
        disabled={!canJoin || !meetingLink}
        className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
          canJoin && meetingLink
            ? 'bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 dark:hover:bg-slate-600 text-white shadow-lg hover:shadow-xl'
            : 'bg-slate-300 dark:bg-slate-600 text-slate-500 dark:text-slate-400 cursor-not-allowed'
        }`}
      >
        <FaVideo />
        {!meetingLink 
          ? 'Meeting Link Not Available' 
          : !canJoin 
            ? 'Join Available 5 Min Before' 
            : 'Join'
        }
      </button>
      

    </div>
  );
};

export default SessionCountdown;
