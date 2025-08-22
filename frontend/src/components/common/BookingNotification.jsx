import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaTimes, FaCalendarAlt, FaVideo, FaComments } from 'react-icons/fa';

const BookingNotification = ({ booking, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show notification after a short delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for animation to complete
  };

  if (!booking) return null;

  return (
    <div
      className={`fixed top-4 right-4 z-50 transform transition-all duration-300 ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-green-200 dark:border-green-800 max-w-sm w-full">
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0">
              <FaCheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-gray-800 dark:text-white mb-1">
                Booking Confirmed!
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                {booking.title} with {booking.provider}
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <FaCalendarAlt className="w-3 h-3" />
                <span>{new Date(booking.date).toLocaleDateString()}</span>
                <span>•</span>
                <span>{booking.time}</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs font-medium text-green-600 dark:text-green-400">
                  Session: {booking.studentName} - {booking.slot}
                </span>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingNotification; 