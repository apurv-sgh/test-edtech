import React, { useState } from 'react';
import { FaTimes, FaUser, FaEnvelope, FaMobile, FaClock, FaVideo, FaComments } from 'react-icons/fa';

const SlotAllocationModal = ({ booking, onClose, onAllocate, sessionDuration = 30, isAllocating = false }) => {
  const [selectedSlot, setSelectedSlot] = useState('');
  const [meetingLink, setMeetingLink] = useState('');
  const [message, setMessage] = useState('');

  // Generate time fragments based on session duration
  const generateTimeFragments = () => {
    const fragments = [];
    const slotTimes = {
      '9AM-12PM': { start: 9, end: 12 },
      '12PM-3PM': { start: 12, end: 15 },
      '3PM-6PM': { start: 15, end: 18 },
      '6PM-9PM': { start: 18, end: 21 }
    };

    Object.entries(slotTimes).forEach(([slot, time]) => {
      let currentHour = time.start;
      let currentMinute = 0;
      
      while (currentHour < time.end) {
        const startTime = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
        
        // Calculate end time
        const endMinute = currentMinute + sessionDuration;
        const endHour = currentHour + Math.floor(endMinute / 60);
        const finalEndMinute = endMinute % 60;
        const endTime = `${endHour.toString().padStart(2, '0')}:${finalEndMinute.toString().padStart(2, '0')}`;
        
        // Check if this fragment fits within the slot
        if (endHour <= time.end) {
          fragments.push({
            id: `${startTime}-${endTime}`,
            label: `${startTime} - ${endTime}`,
            slot: slot,
            startTime: startTime,
            endTime: endTime
          });
        }
        
        // Move to next fragment
        currentMinute += sessionDuration;
        if (currentMinute >= 60) {
          currentHour += Math.floor(currentMinute / 60);
          currentMinute = currentMinute % 60;
        }
      }
    });
    
    return fragments;
  };

  const timeFragments = generateTimeFragments();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedSlot || !meetingLink) {
      alert('Please select a time slot and provide a meeting link');
      return;
    }

    const fragment = timeFragments.find(f => f.id === selectedSlot);
    if (!fragment) {
      alert('Please select a valid time slot');
      return;
    }

    onAllocate({
      bookingId: booking.bookingId,
      allocatedSlot: fragment.slot,
      exactStartTime: fragment.startTime,
      exactEndTime: fragment.endTime,
      meetingLink: meetingLink,
      message: message
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl shadow-xl border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Allocate Slot for {booking.studentName}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Session: <span className="font-medium text-blue-600 dark:text-blue-400">{booking.studentName} - {booking.slot}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isAllocating}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Student Information */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6 border border-gray-200 dark:border-gray-600">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <FaUser className="text-blue-500" />
            Student Information
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <FaUser className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className="font-medium text-gray-900 dark:text-white">{booking.studentName}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <FaEnvelope className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className="text-gray-700 dark:text-gray-300">{booking.studentEmail}</span>
            </div>
            {booking.studentMobile && booking.studentMobile !== 'N/A' && (
              <div className="flex items-center gap-3 text-sm">
                <FaMobile className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <span className="text-gray-700 dark:text-gray-300">{booking.studentMobile}</span>
              </div>
            )}
            <div className="flex items-center gap-3 text-sm">
              <FaClock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className="text-gray-700 dark:text-gray-300">Session Type: {booking.sessionType}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <FaClock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className="text-gray-700 dark:text-gray-300">Requested Date: {new Date(booking.date).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Allocation Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Time Slot Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <FaClock className="inline w-4 h-4 mr-1" />
              Time Slot
            </label>
            <select
              value={selectedSlot}
              onChange={(e) => setSelectedSlot(e.target.value)}
              disabled={isAllocating}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              required
            >
              <option value="">Select a time slot</option>
              {timeFragments.map((fragment) => (
                <option key={fragment.id} value={fragment.id}>
                  {fragment.label} ({fragment.slot})
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Session Duration: {sessionDuration} minutes
            </p>
          </div>

          {/* Meeting Link */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <FaVideo className="inline w-4 h-4 mr-1" />
              Meeting Link
            </label>
            <input
              type="url"
              value={meetingLink}
              onChange={(e) => setMeetingLink(e.target.value)}
              placeholder="https://meet.google.com/..."
              disabled={isAllocating}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              required
            />
          </div>

          {/* Optional Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <FaComments className="inline w-4 h-4 mr-1" />
              Optional Message (for student)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a personal message for the student..."
              rows="3"
              disabled={isAllocating}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isAllocating}
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isAllocating}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAllocating ? 'Allocating...' : 'Allocate Slot'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SlotAllocationModal;
