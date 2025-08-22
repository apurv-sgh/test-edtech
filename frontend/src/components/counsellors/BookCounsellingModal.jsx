import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FaTimes, FaCalendarAlt, FaClock, FaPhone, FaCheckCircle, FaStar, FaUsers, FaShieldAlt, FaCreditCard, FaComments as FaChat, FaVideo as FaVideoCall, FaPhone as FaPhoneCall, FaCalendarDay, FaClock as FaTime, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getCounsellorNext5DaysAvailability, getCounsellorAvailableSlotsForDate, bookSession } from '../../api/counsellors';
import PaymentModal from '../common/PaymentModal';

const BookCounsellingModal = ({ counsellor, selectedSessionType, onClose, onBookingSuccess }) => {
  const { user } = useAuth();
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Booking state
  const [availabilityData, setAvailabilityData] = useState(null);
  const [availableSlots, setAvailableSlots] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Payment state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [createdBooking, setCreatedBooking] = useState(null);

  // Use the selected session type passed from parent
  const sessionType = selectedSessionType;

  // Format date for display
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
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  // Get day name
  const getDayName = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  // Get day number
  const getDayNumber = (dateString) => {
    const date = new Date(dateString);
    return date.getDate();
  };

  // Fetch availability data
  const fetchAvailability = async () => {
    try {
      setLoading(true);
      const response = await getCounsellorNext5DaysAvailability(counsellor._id);
      if (response.success) {
        setAvailabilityData(response.data);
      }
    } catch (error) {
      console.error('Error fetching availability:', error);
      toast.error('Failed to fetch availability');
    } finally {
      setLoading(false);
    }
  };

  // Handle date selection
  const handleDateSelect = (day) => {
    if (!day.isAvailable) return; // Prevent selection of unavailable dates
    
    setSelectedDate(day.date);
    setSelectedSlot(null);
    
    // Always fetch slots for the selected date to ensure we have the latest data
    fetchAvailableSlots(day.date);
  };

  // Fetch available slots for a specific date
  const fetchAvailableSlots = async (date) => {
    try {
      const response = await getCounsellorAvailableSlotsForDate(counsellor._id, date);
      if (response.success) {
        // Show all slots that counsellor has marked as available
        // Counsellor will manage allocation through dashboard
        setAvailableSlots(prev => ({
          ...prev,
          [date]: response.data.availableSlots || []
        }));
      }
    } catch (error) {
      console.error('Error fetching available slots:', error);
      // Fallback: show default time slots if API fails
      const defaultSlots = [
        { slot: '9AM-12PM', available: true },
        { slot: '12PM-3PM', available: true },
        { slot: '3PM-6PM', available: true },
        { slot: '6PM-9PM', available: true }
      ];
      setAvailableSlots(prev => ({
        ...prev,
        [date]: defaultSlots
      }));
    }
  };



  // Handle booking submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!sessionType || !selectedDate || !selectedSlot) {
      toast.error('Please complete all booking details');
      return;
    }

    if (!phone.trim()) {
      toast.error('Please enter your phone number');
      return;
    }

    setSubmitting(true);
    
    try {
      // Map session type to the format expected by the backend
      const getSessionTypeValue = (sessionType) => {
        if (sessionType.type === 'call' || sessionType.id === 'call') return 'call';
        if (sessionType.type === 'chat' || sessionType.id === 'chat') return 'chat';
        if (sessionType.type === 'video' || sessionType.id === 'video') return 'video';
        return 'call'; // default fallback
      };

      const bookingData = {
        counsellorId: counsellor._id,
        date: selectedDate,
        slot: selectedSlot,
        sessionType: getSessionTypeValue(sessionType),
        phone: phone
      };

      const response = await bookSession(bookingData);
      
      if (response.success) {
        // Store the created booking for payment
        setCreatedBooking(response.data);
        
        // Show payment modal instead of closing
        setShowPaymentModal(true);
        
        // Don't close the modal yet, wait for payment completion
        // onClose();
      } else {
        toast.error(response.message || 'Failed to create booking');
      }
    } catch (error) {
      console.error('Booking error:', error);
      toast.error(error.message || 'Failed to create booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle click outside to close
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const originalPrice = sessionType?.price || counsellor?.sessionPrice || 99;

  useEffect(() => {
    fetchAvailability();
  }, [counsellor._id]);

  // Show loading state
  if (loading) {
    return (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 sm:p-4"
        onClick={handleBackdropClick}
      >
        <div className="bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-4xl xl:max-w-3xl 2xl:max-w-4xl max-h-[95vh] my-2 overflow-hidden relative">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center gap-3">
              <FaSpinner className="animate-spin text-primary text-2xl" />
              <span className="text-lg text-gray-600 dark:text-gray-300">Loading availability...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-300"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-4xl xl:max-w-3xl 2xl:max-w-4xl max-h-[95vh] my-2 overflow-hidden relative animate-in zoom-in-95 duration-300">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-2 sm:top-4 right-2 sm:right-4 z-10 p-1.5 sm:p-2 rounded-full bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
        >
          <FaTimes className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-300" />
        </button>

        <div className="flex flex-col lg:flex-row h-full">
          {/* Left Side - Booking Form */}
          <div className="flex-1 p-3 sm:p-4 lg:p-6 overflow-y-auto">
            <div className="max-w-lg lg:max-w-xl mx-auto pb-4 h-full flex flex-col">
              {/* Header */}
              <div className="text-center mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
                  Book Your Session
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  Select your preferred date and time slot
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 flex-1 flex flex-col">
                {/* Selected Session Type Display */}
                {sessionType && (
                  <div className="bg-slate-50 dark:bg-slate-700 rounded-lg sm:rounded-xl p-2 sm:p-3">
                    <h4 className="font-semibold text-slate-800 dark:text-white mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                      <FaVideoCall className="text-primary" />
                      Selected Session Type
                    </h4>
                    <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl border-2 border-primary bg-primary/10 dark:bg-primary/20">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className={`p-1.5 sm:p-2 rounded-lg bg-gradient-to-r ${sessionType.color} text-white`}>
                            {React.createElement(sessionType.icon, { className: "w-4 h-4 sm:w-5 sm:h-5" })}
                          </div>
                          <div className="text-left">
                            <div className="flex items-center gap-1 sm:gap-2">
                              <h5 className="font-semibold text-primary dark:text-primary-light text-sm sm:text-base">
                                {sessionType.name}
                              </h5>
                              {sessionType.popular && (
                                <span className="px-1.5 py-0.5 sm:px-2 sm:py-1 bg-primary text-white text-xs rounded-full font-medium">
                                  Popular
                                </span>
                              )}
                            </div>
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                              {sessionType.description}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-base sm:text-lg font-bold text-primary dark:text-primary-light">
                            ₹{sessionType.price}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {sessionType.duration}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Date and Time Selection - Combined */}
                {sessionType && availabilityData && (
                  <div className="bg-slate-50 dark:bg-slate-700 rounded-lg sm:rounded-xl p-2 sm:p-3">
                    <h4 className="font-semibold text-slate-800 dark:text-white mb-2 flex items-center gap-2 text-sm">
                      <FaCalendarDay className="text-primary" />
                      Select Date & Time
                    </h4>
                    
                    {/* Date Selection */}
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-1 sm:gap-1.5 mb-3">
                      {availabilityData.next5Days.map((day) => (
                        <button
                          key={day.date}
                          type="button"
                          onClick={() => handleDateSelect(day)}
                          disabled={!day.isAvailable}
                          className={`p-1.5 sm:p-2 rounded-lg border-2 transition-all duration-200 ${
                            !day.isAvailable
                              ? 'border-red-200 dark:border-red-600 bg-red-50 dark:bg-red-900/20 cursor-not-allowed opacity-60'
                              : selectedDate === day.date
                              ? 'border-primary bg-primary text-white shadow-lg'
                              : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700'
                          }`}
                        >
                          <div className={`text-xs font-medium ${
                            !day.isAvailable 
                              ? 'text-red-600 dark:text-red-400' 
                              : selectedDate === day.date 
                              ? 'text-white' 
                              : 'text-gray-600 dark:text-gray-300'
                          }`}>
                            {getDayName(day.date)}
                          </div>
                          <div className={`text-lg font-bold ${
                            !day.isAvailable 
                              ? 'text-red-700 dark:text-red-300' 
                              : selectedDate === day.date 
                              ? 'text-white' 
                              : 'text-gray-800 dark:text-white'
                          }`}>
                            {getDayNumber(day.date)}
                          </div>
                          {day.isToday && (
                            <div className={`text-xs ${
                              !day.isAvailable 
                                ? 'text-red-500 dark:text-red-400' 
                                : selectedDate === day.date 
                                ? 'text-white/80' 
                                : 'text-primary dark:text-primary-light'
                            }`}>
                              Today
                            </div>
                          )}
                          {day.isTomorrow && (
                            <div className={`text-xs ${
                              !day.isAvailable 
                                ? 'text-red-500 dark:text-red-400' 
                                : selectedDate === day.date 
                                ? 'text-white/80' 
                                : 'text-primary dark:text-primary-light'
                            }`}>
                              Tomorrow
                            </div>
                          )}
                          {!day.isAvailable && (
                            <div className="text-xs text-red-600 dark:text-red-400 font-medium">
                              Unavailable
                            </div>
                          )}
                        </button>
                      ))}
                    </div>

                    {/* Time Slots - Inline with selected date */}
                    {selectedDate && availableSlots[selectedDate] && availableSlots[selectedDate].length > 0 && (
                      <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
                        <div className="flex items-center gap-2 mb-2">
                          <FaTime className="text-primary text-sm" />
                          <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                            Available Slots for {selectedDate}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-1.5">
                          {availableSlots[selectedDate].map((slot) => (
                            <button
                              key={slot.slot}
                              type="button"
                              onClick={() => setSelectedSlot(slot.slot)}
                              className={`p-2 rounded border-2 transition-all duration-200 text-center ${
                                selectedSlot === slot.slot
                                  ? 'border-primary bg-primary text-white shadow-md'
                                  : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 hover:border-primary hover:bg-primary/10'
                              }`}
                            >
                              <span className={`text-xs font-medium ${
                                selectedSlot === slot.slot
                                  ? 'text-white'
                                  : 'text-gray-800 dark:text-white'
                              }`}>
                                {slot.slot}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* No slots available message */}
                    {selectedDate && (!availableSlots[selectedDate] || availableSlots[selectedDate].length === 0) && (
                      <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
                        <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-600 rounded">
                          <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                            <FaExclamationTriangle className="text-yellow-600" />
                            <span className="text-xs">No available time slots for this date. Please select another date.</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* No available dates message */}
                    {availabilityData.next5Days.filter(day => day.isAvailable).length === 0 && (
                      <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-600 rounded">
                        <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                          <FaExclamationTriangle className="text-yellow-600" />
                          <span className="text-xs">No available dates in the next 5 days. Please check back later.</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Contact Information */}
                <div className="bg-slate-50 dark:bg-slate-700 rounded-lg sm:rounded-xl p-2 sm:p-3">
                  <h4 className="font-semibold text-slate-800 dark:text-white mb-2 flex items-center gap-2 text-sm">
                    <FaPhone className="text-primary" />
                    Contact Information
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Enter your phone number"
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                        required
                      />
                    </div>
                  </div>
                </div>



                {/* Book Button */}
                <button
                  type="submit"
                  disabled={!sessionType || !selectedDate || !selectedSlot || submitting || !availabilityData?.next5Days?.some(day => day.isAvailable)}
                  className={`w-full py-2.5 sm:py-3 rounded-lg font-semibold transition-all duration-200 text-sm mt-auto ${
                    sessionType && selectedDate && selectedSlot && !submitting && availabilityData?.next5Days?.some(day => day.isAvailable)
                      ? 'bg-gradient-to-r from-primary to-purple-600 hover:from-primary-dark hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02]'
                      : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {submitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <FaSpinner className="animate-spin" />
                      Processing...
                    </div>
                  ) : (
                    `Book ${sessionType?.name || 'Session'} - ₹${originalPrice}`
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Right Side - Summary */}
          <div className="lg:w-64 xl:w-72 bg-gradient-to-br from-primary/10 to-purple-500/10 dark:from-primary/20 dark:to-purple-500/20 p-3 sm:p-4 lg:p-6 border-l border-gray-200 dark:border-gray-700">
            <div className="sticky top-0">
              <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 lg:mb-6">
                Booking Summary
              </h3>

                            {/* Counsellor Info */}
              <div className="bg-white dark:bg-slate-800 rounded-lg sm:rounded-xl p-2 sm:p-3 mb-3 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <img
                    src={counsellor?.profilePicture || '/default-avatar.png'}
                    alt={counsellor?.name}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                      {counsellor?.name}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Professional Counsellor
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                  <FaStar className="text-yellow-500" />
                  <span>4.8 (120 reviews)</span>
                </div>
              </div>

                            {/* Session Details */}
              {sessionType && (
                <div className="bg-white dark:bg-slate-800 rounded-lg sm:rounded-xl p-2 sm:p-3 mb-3 shadow-sm">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">
                    Session Details
                  </h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Type:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{sessionType.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{sessionType.duration}</span>
                    </div>
                    {selectedDate && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Date:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{formatDate(selectedDate)}</span>
                      </div>
                    )}
                    {selectedSlot && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Time:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{selectedSlot}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

                            {/* Pricing */}
              <div className="bg-white dark:bg-slate-800 rounded-lg sm:rounded-xl p-2 sm:p-3 mb-3 shadow-sm">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">
                  Pricing
                </h4>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Session Price:</span>
                    <span className="font-medium text-gray-900 dark:text-white">₹{originalPrice}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-600">
                    <span className="text-gray-800 dark:text-white font-semibold">Total:</span>
                    <span className="text-xl font-bold text-primary dark:text-primary-light">₹{originalPrice}</span>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                  <FaShieldAlt className="text-green-500" />
                  <span>Secure Payment</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                  <FaUsers className="text-blue-500" />
                  <span>Professional Support</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                  <FaCreditCard className="text-purple-500" />
                  <span>Multiple Payment Options</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && createdBooking && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
            setCreatedBooking(null);
            onClose(); // Close the booking modal after payment
          }}
          service={{
            bookingId: createdBooking._id,
            title: sessionType?.name || 'Career Counselling Session',
            duration: sessionType?.duration || '60 minutes',
            price: originalPrice,
            counsellorName: counsellor?.name,
            date: selectedDate,
            time: selectedSlot
          }}
          type="counsellor"
        />
      )}
    </div>
  );
};

export default BookCounsellingModal; 