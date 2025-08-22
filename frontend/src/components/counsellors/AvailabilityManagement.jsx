import React, { useState, useEffect } from 'react';
import { FaCalendar, FaClock, FaCheck, FaTimes, FaUser, FaPhone, FaComments, FaEye, FaEyeSlash, FaEnvelope, FaMobile } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getAvailabilityDashboard, setAvailability as setAvailabilityAPI, getPendingBookings, toggleBookingStatus } from '../../api/counsellorAvailability';

const AvailabilityManagement = () => {
  const [loading, setLoading] = useState(true);
  const [availability, setAvailability] = useState(null);
  const [next5Days, setNext5Days] = useState([]);
  const [pendingBookings, setPendingBookings] = useState([]);
  const [selectedDates, setSelectedDates] = useState([]);
  const [showPendingBookings, setShowPendingBookings] = useState(true);

  // Available time slots
  const timeSlots = [
    { id: '9AM-12PM', label: '9:00 AM - 12:00 PM', icon: '🌅' },
    { id: '12PM-3PM', label: '12:00 PM - 3:00 PM', icon: '☀️' },
    { id: '3PM-6PM', label: '3:00 PM - 6:00 PM', icon: '🌆' },
    { id: '6PM-9PM', label: '6:00 PM - 9:00 PM', icon: '🌙' }
  ];

  // Generate next 7 days
  const generateNext7Days = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      // Ensure consistent date format in YYYY-MM-DD
      const dateStr = date.toISOString().split('T')[0];
      days.push({
        date: dateStr,
        dayName: date.toLocaleDateString('en-US', { weekday: 'long' }),
        dayShort: date.toLocaleDateString('en-US', { weekday: 'short' }),
        isToday: i === 0,
        isTomorrow: i === 1
      });
    }
    return days;
  };

  const next7Days = generateNext7Days();

  // Fetch availability data
  const fetchAvailabilityData = async () => {
    try {
      setLoading(true);
      const response = await getAvailabilityDashboard();
      if (response.success) {
        setAvailability(response.data.availability);
        setNext5Days(response.data.next5Days);
        
        // Fetch pending bookings
        try {
          const pendingResponse = await getPendingBookings();
          if (pendingResponse.success) {
            setPendingBookings(pendingResponse.data.pendingBookings);
          }
        } catch (error) {
          console.error('Error fetching pending bookings:', error);
        }
        
        // Load existing availability data into selectedDates
        if (response.data.availability && response.data.availability.dailyAvailability) {
          console.log('Loading existing availability:', response.data.availability.dailyAvailability);
          const existingDates = response.data.availability.dailyAvailability.map(day => {
            // Handle date conversion properly to avoid timezone issues
            let dateStr;
            if (typeof day.date === 'string') {
              dateStr = day.date.split('T')[0];
            } else {
              // If it's a Date object, convert to local date string
              const date = new Date(day.date);
              dateStr = date.toISOString().split('T')[0];
            }
            return {
              date: dateStr,
              isAvailable: day.isAvailable,
              selectedSlots: day.availableSlots || []
            };
          });
          console.log('Converted existing dates:', existingDates);
          setSelectedDates(existingDates);
        }
      }
    } catch (error) {
      console.error('Error fetching availability data:', error);
      toast.error('Failed to fetch availability data');
    } finally {
      setLoading(false);
    }
  };



  // Set availability for selected dates
  const handleSetAvailability = async () => {
    console.log('=== HANDLE SET AVAILABILITY CALLED ===');
    console.log('Selected dates:', selectedDates);
    
    try {
      if (selectedDates.length === 0) {
        toast.error('Please select at least one date');
        return;
      }

      const datesData = selectedDates.map(dateData => ({
        date: dateData.date,
        isAvailable: dateData.isAvailable,
        availableSlots: dateData.isAvailable ? dateData.selectedSlots : []
      }));

      console.log('Sending availability data:', datesData);
      console.log('Selected dates before mapping:', selectedDates);
      
      // Validate the data before sending
      for (const dateData of datesData) {
        if (!dateData.date || typeof dateData.isAvailable !== 'boolean') {
          console.error('Invalid date data:', dateData);
          toast.error('Invalid data format. Please try again.');
          return;
        }
      }
      
      console.log('Data validation passed');
      console.log('About to call setAvailability API...');
      
      try {
        const result = await setAvailabilityAPI(datesData);
        
        if (result && result.success) {
          toast.success(result.message || 'Availability set successfully');
          await fetchAvailabilityData();
          setSelectedDates([]);
        } else {
          toast.error('Failed to set availability: Invalid response from server');
        }
      } catch (error) {
        console.error('Error setting availability:', error);
        toast.error(`Failed to set availability: ${error.message}`);
      }
    } catch (error) {
      console.error('Error setting availability:', error);
      toast.error('Failed to set availability');
    }
  };

  // Toggle date selection
  const toggleDateSelection = (date) => {
    setSelectedDates(prev => {
      const existing = prev.find(d => d.date === date.date);
      if (existing) {
        return prev.filter(d => d.date !== date.date);
      } else {
        return [...prev, { 
          date: date.date, 
          isAvailable: false, 
          selectedSlots: [] 
        }];
      }
    });
  };

  // Toggle availability for a date
  const toggleAvailability = (date) => {
    setSelectedDates(prev => 
      prev.map(d => 
        d.date === date 
          ? { ...d, isAvailable: !d.isAvailable, selectedSlots: !d.isAvailable ? [] : d.selectedSlots }
          : d
      )
    );
  };

  // Toggle slot selection
  const toggleSlotSelection = (date, slotId) => {
    setSelectedDates(prev => 
      prev.map(d => {
        if (d.date === date) {
          const selectedSlots = d.selectedSlots.includes(slotId)
            ? d.selectedSlots.filter(s => s !== slotId)
            : [...d.selectedSlots, slotId];
          return { ...d, selectedSlots };
        }
        return d;
      })
    );
  };

  // Get selected date data
  const getSelectedDateData = (date) => {
    return selectedDates.find(d => d.date === date) || null;
  };

  // Check if date is selected or has existing availability
  const isDateSelected = (date) => {
    return selectedDates.some(d => d.date === date);
  };

  // Check if date has existing availability
  const hasExistingAvailability = (date) => {
    return selectedDates.some(d => d.date === date && d.isAvailable);
  };

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





  // Handle toggle booking status
  const handleToggleBookingStatus = async () => {
    try {
      const newStatus = !availability?.stopTakingBookings;
      let reason = '';
      
      if (newStatus) {
        reason = prompt('Please provide a reason for stopping bookings (optional):') || '';
      }

      const response = await toggleBookingStatus(newStatus, reason);
      
      if (response.success) {
        toast.success(response.message);
        await fetchAvailabilityData(); // Refresh data
      } else {
        toast.error(response.error || 'Failed to toggle booking status');
      }
    } catch (error) {
      console.error('Error toggling booking status:', error);
      toast.error('Failed to toggle booking status');
    }
  };

  useEffect(() => {
    fetchAvailabilityData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Availability Management</h2>
          <div className="flex items-center gap-2">
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
              availability?.isActive 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}>
              {availability?.isActive ? 'Active' : 'Inactive'}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <FaCalendar className="text-blue-600 dark:text-blue-400" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Available Days</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {next5Days.filter(day => day.isAvailable).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <FaClock className="text-green-600 dark:text-green-400" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Available Slots</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {next5Days.reduce((total, day) => total + (day.availableSlots?.length || 0), 0)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <FaUser className="text-purple-600 dark:text-purple-400" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Upcoming Sessions</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {availability?.upcomingSessionsCount || 0}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <FaCheck className="text-orange-600 dark:text-orange-400" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Session Price</p>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  ₹{availability?.sessionPrice || 99}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <FaClock className="text-purple-600 dark:text-purple-400" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Session Duration</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {availability?.sessionDuration || 30}m
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <FaClock className="text-yellow-600 dark:text-yellow-400" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pending Bookings</p>
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {pendingBookings.length}
                </p>
              </div>
            </div>
          </div>
          
          <div className={`rounded-lg p-4 ${
            availability?.stopTakingBookings 
              ? 'bg-red-50 dark:bg-red-900/20' 
              : 'bg-green-50 dark:bg-green-900/20'
          }`}>
            <div className="flex items-center gap-3">
              <FaCheck className={`${
                availability?.stopTakingBookings 
                  ? 'text-red-600 dark:text-red-400' 
                  : 'text-green-600 dark:text-green-400'
              }`} />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Booking Status</p>
                <p className={`text-lg font-bold ${
                  availability?.stopTakingBookings 
                    ? 'text-red-600 dark:text-red-400' 
                    : 'text-green-600 dark:text-green-400'
                }`}>
                  {availability?.stopTakingBookings ? 'Stopped' : 'Active'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Status Toggle */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Booking Status
          </h3>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            availability?.stopTakingBookings 
              ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' 
              : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
          }`}>
            {availability?.stopTakingBookings ? 'Not Taking Bookings' : 'Taking Bookings'}
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white">
                {availability?.stopTakingBookings ? 'Resume Taking Bookings' : 'Stop Taking Bookings'}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {availability?.stopTakingBookings 
                  ? 'Allow students to book new sessions with you'
                  : 'Temporarily stop accepting new booking requests'
                }
              </p>
              {availability?.stopTakingBookings && availability?.stopBookingReason && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                  Reason: {availability.stopBookingReason}
                </p>
              )}
            </div>
            <button
              onClick={handleToggleBookingStatus}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                availability?.stopTakingBookings
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-red-500 hover:bg-red-600 text-white'
              }`}
            >
              {availability?.stopTakingBookings ? 'Resume' : 'Stop'}
            </button>
          </div>
        </div>
      </div>

      {/* Debug Section - Remove this later */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 mb-4">
        <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Debug Info</h4>
        <div className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
          <div>Selected Dates: {selectedDates.length}</div>
          <div>Available Days: {next5Days.filter(day => day.isAvailable).length}</div>
          <div>Daily Availability: {availability?.dailyAvailability?.length || 0} entries</div>
          <div>Pending Bookings: {pendingBookings.length}</div>
          <div>Session Duration: {availability?.sessionDuration || 30} minutes</div>
          <div>Stop Taking Bookings: {availability?.stopTakingBookings ? 'Yes' : 'No'}</div>
          <div>Stop Reason: {availability?.stopBookingReason || 'None'}</div>
          <div>Pending Bookings with Contact: {pendingBookings.map(b => `${b.studentName} (${b.studentEmail})`).join(', ')}</div>
          <div>Selected Dates Data: {JSON.stringify(selectedDates.map(d => ({ date: d.date, isAvailable: d.isAvailable, slots: d.selectedSlots.length })))}</div>
        </div>
      </div>

      {/* Set Availability */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Set Your Availability
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
          {next7Days.map((day) => {
            const existingData = getSelectedDateData(day.date);
            const hasAvailability = existingData && existingData.isAvailable;
            
            return (
              <div
                key={day.date}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                  isDateSelected(day.date)
                    ? hasAvailability 
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      : 'border-primary bg-primary/10 dark:bg-primary/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
                onClick={() => toggleDateSelection(day)}
              >
                <div className="text-center">
                  <div className={`text-sm font-medium ${
                    isDateSelected(day.date) 
                      ? hasAvailability ? 'text-green-600 dark:text-green-400' : 'text-primary dark:text-primary-light'
                      : 'text-gray-600 dark:text-gray-300'
                  }`}>
                    {day.dayShort}
                  </div>
                  <div className={`text-lg font-bold ${
                    isDateSelected(day.date) 
                      ? hasAvailability ? 'text-green-600 dark:text-green-400' : 'text-primary dark:text-primary-light'
                      : 'text-gray-800 dark:text-white'
                  }`}>
                    {day.dayName === 'Today' ? 'Today' : day.dayName === 'Tomorrow' ? 'Tomorrow' : new Date(day.date).getDate()}
                  </div>
                  {day.isToday && (
                    <div className="text-xs text-primary dark:text-primary-light">Today</div>
                  )}
                  {day.isTomorrow && (
                    <div className="text-xs text-primary dark:text-primary-light">Tomorrow</div>
                  )}
                  {hasAvailability && (
                    <div className="text-xs text-green-600 dark:text-green-400 font-medium">
                      {existingData.selectedSlots.length} slots
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Dates Configuration */}
        {selectedDates.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              Configure Selected Dates
            </h4>
            
            {selectedDates.map((dateData) => (
              <div key={dateData.date} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-semibold text-gray-900 dark:text-white">
                    {formatDate(dateData.date)}
                  </h5>
                  <button
                    onClick={() => toggleAvailability(dateData.date)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      dateData.isAvailable
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}
                  >
                    {dateData.isAvailable ? 'Available' : 'Not Available'}
                  </button>
                </div>
                
                {dateData.isAvailable && (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Select your available time slots:
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot.id}
                          onClick={() => toggleSlotSelection(dateData.date, slot.id)}
                          className={`p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                            dateData.selectedSlots.includes(slot.id)
                              ? 'border-primary bg-primary/10 dark:bg-primary/20'
                              : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{slot.icon}</span>
                            <span className={`text-sm font-medium ${
                              dateData.selectedSlots.includes(slot.id)
                                ? 'text-primary dark:text-primary-light'
                                : 'text-gray-700 dark:text-gray-300'
                            }`}>
                              {slot.label}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            <button
              onClick={() => {
                console.log('=== SET AVAILABILITY BUTTON CLICKED ===');
                handleSetAvailability();
              }}
              className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Set Availability
            </button>
          </div>
        )}
      </div>

      {/* Pending Bookings */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Pending Bookings
          </h3>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded-full text-sm font-medium">
              {pendingBookings.length} pending
            </span>
            <button
              onClick={() => setShowPendingBookings(!showPendingBookings)}
              className="flex items-center gap-2 text-primary dark:text-primary-light hover:text-primary-dark dark:hover:text-primary"
            >
              {showPendingBookings ? <FaEyeSlash /> : <FaEye />}
              {showPendingBookings ? 'Hide' : 'Show'} Pending
            </button>
          </div>
        </div>
        
        {showPendingBookings && (
          <div className="space-y-4">
            {pendingBookings.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                No pending bookings
              </p>
            ) : (
              pendingBookings.map((booking, index) => (
                <div key={index} className={`p-4 rounded-lg border ${
                  booking.status === 'confirmed' 
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700'
                    : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700'
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        booking.status === 'confirmed'
                          ? 'bg-green-100 dark:bg-green-800'
                          : 'bg-yellow-100 dark:bg-yellow-800'
                      }`}>
                        {booking.sessionType === 'chat' ? <FaComments className={booking.status === 'confirmed' ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'} /> : <FaPhone className={booking.status === 'confirmed' ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'} />}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {booking.studentName}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <FaEnvelope className="w-3 h-3" />
                          <span>{booking.studentEmail}</span>
                        </div>
                        {booking.studentMobile && booking.studentMobile !== 'N/A' && (
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <FaMobile className="w-3 h-3" />
                            <span>{booking.studentMobile}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {formatDate(booking.date)}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {booking.slot}
                      </p>
                      {booking.exactStartTime && booking.exactEndTime && (
                        <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                          {booking.exactStartTime} - {booking.exactEndTime}
                        </p>
                      )}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        booking.status === 'confirmed'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                  
                  {/* Show allocated details if confirmed */}
                  {booking.status === 'confirmed' && (
                    <div className="mb-3 p-3 bg-green-100 dark:bg-green-800/30 rounded-lg">
                      <div className="space-y-2">
                        {/* Contact Information */}
                        <div className="border-b border-green-200 dark:border-green-700 pb-2 mb-2">
                          <div className="flex items-center gap-2 mb-1">
                            <FaUser className="text-green-600 dark:text-green-400" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Contact Information:</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <FaEnvelope className="w-3 h-3" />
                            <span>{booking.studentEmail}</span>
                          </div>
                          {booking.studentMobile && booking.studentMobile !== 'N/A' && (
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <FaMobile className="w-3 h-3" />
                              <span>{booking.studentMobile}</span>
                            </div>
                          )}
                        </div>
                        
                        {booking.meetingLink && (
                          <div className="flex items-center gap-2">
                            <FaVideo className="text-green-600 dark:text-green-400" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">Meeting Link:</span>
                            <a 
                              href={booking.meetingLink} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm text-green-600 dark:text-green-400 hover:underline"
                            >
                              Join Meeting
                            </a>
                          </div>
                        )}
                        {booking.exactStartTime && booking.exactEndTime && (
                          <div className="flex items-center gap-2">
                            <FaClock className="text-green-600 dark:text-green-400" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              Allocated Time: {booking.exactStartTime} - {booking.exactEndTime}
                            </span>
                          </div>
                        )}
                        {booking.message && (
                          <div className="flex items-start gap-2">
                            <FaComments className="text-green-600 dark:text-green-400 mt-0.5" />
                            <div>
                              <span className="text-sm text-gray-700 dark:text-gray-300">Message:</span>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{booking.message}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between pt-3 border-t border-yellow-200 dark:border-yellow-700">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <p>Requested: {new Date(booking.createdAt).toLocaleDateString()}</p>
                      <p>Session Type: {booking.sessionType}</p>
                      {booking.status !== 'confirmed' && booking.message && (
                        <p className="text-green-600 dark:text-green-400 font-medium">
                          💬 Message: {booking.message}
                        </p>
                      )}
                      {booking.status !== 'confirmed' && (
                        <p className="text-yellow-600 dark:text-yellow-400 font-medium">
                          ⚠️ Multiple students can book the same slot - you decide allocation
                        </p>
                      )}
                    </div>

                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>


    </div>
  );
};

export default AvailabilityManagement;
