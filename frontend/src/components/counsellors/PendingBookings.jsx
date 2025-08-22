import React, { useState, useEffect } from 'react';
import { FaCalendar, FaClock, FaUser, FaVideo, FaComments, FaPhone, FaCheckCircle, FaSpinner, FaLink } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { getPendingBookings, allocateSlot } from '../../api/counsellorAvailability';
import SlotAllocationModal from './SlotAllocationModal';

const PendingBookings = () => {
  const [pendingBookings, setPendingBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState({});
  const [showAllocationModal, setShowAllocationModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [allocatingSlot, setAllocatingSlot] = useState(false);
  const [allocationMessage, setAllocationMessage] = useState('');

  useEffect(() => {
    fetchPendingBookings();
  }, []);

  const fetchPendingBookings = async () => {
    try {
      setLoading(true);
      console.log('=== FETCHING PENDING BOOKINGS ===');
      const response = await getPendingBookings();
      console.log('Pending bookings response:', response);
      
      if (response.success) {
        console.log('Pending bookings data:', response.data.pendingBookings);
        setPendingBookings(response.data.pendingBookings);
      } else {
        console.error('Pending bookings response not successful:', response);
      }
    } catch (error) {
      console.error('Error fetching pending bookings:', error);
      toast.error('Failed to fetch pending bookings');
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



  // Handle slot allocation modal
  const handleAllocateSlot = (booking) => {
    setSelectedBooking(booking);
    setShowAllocationModal(true);
  };

  // Handle slot allocation submission
  const handleAllocationSubmit = async (allocationData) => {
    try {
      setAllocatingSlot(true);
             setAllocationMessage(`Allocating slot for ${allocationData.studentName}... Please wait, this may take a few moments.`);
      
      const response = await allocateSlot(allocationData);
      
      if (response.success) {
        setAllocationMessage('Slot allocated successfully! Updating your dashboard...');
        setTimeout(() => {
          toast.success('Slot allocated successfully');
          setShowAllocationModal(false);
          setSelectedBooking(null);
          setAllocatingSlot(false);
          setAllocationMessage('');
          fetchPendingBookings(); // Refresh data
        }, 1500);
      } else {
        setAllocationMessage('Failed to allocate slot. Please try again.');
        setTimeout(() => {
          setAllocatingSlot(false);
          setAllocationMessage('');
          toast.error(response.error || 'Failed to allocate slot');
        }, 2000);
      }
    } catch (error) {
      console.error('Error allocating slot:', error);
      setAllocationMessage('An error occurred while allocating the slot. Please try again.');
      setTimeout(() => {
        setAllocatingSlot(false);
        setAllocationMessage('');
        toast.error(error.message || 'Failed to allocate slot');
      }, 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <FaSpinner className="animate-spin w-8 h-8 text-primary" />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Pending Bookings
        </h2>
        <button
          onClick={fetchPendingBookings}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          Refresh
        </button>
      </div>

      {pendingBookings.length === 0 ? (
        <div className="text-center py-12">
          <FaCalendar className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No Pending Bookings
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            All bookings have been confirmed or there are no new bookings.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {pendingBookings.map((booking) => (
            <div
              key={`${booking.date}-${booking.slot}-${booking.studentId}`}
              className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getSessionTypeIcon(booking.sessionType)}
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                      {getSessionTypeName(booking.sessionType)}
                    </h3>
                  </div>
                  <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                    Pending
                  </span>
                </div>
                    
                    <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <FaCalendar className="w-3 h-3" />
                        <span>{formatDate(booking.date)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FaClock className="w-3 h-3" />
                        <span>{booking.slot}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FaUser className="w-3 h-3" />
                        <span className="font-medium">{booking.studentName}</span>
                      </div>
                    </div>

                    {/* Student Contact Information */}
                    <div className="bg-gray-50 dark:bg-gray-700 rounded p-2">
                      <h4 className="text-xs font-medium text-gray-900 dark:text-white mb-1">Contact Info:</h4>
                      <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <FaComments className="w-3 h-3" />
                          <span className="truncate">{booking.studentEmail}</span>
                        </div>
                        {booking.studentMobile && booking.studentMobile !== 'N/A' && (
                          <div className="flex items-center gap-1">
                            <FaPhone className="w-3 h-3" />
                            <span>{booking.studentMobile}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {booking.meetingLink && (
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        <FaLink className="inline w-3 h-3 mr-1" />
                        <a 
                          href={booking.meetingLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary-dark underline truncate block"
                        >
                          Meeting Link
                        </a>
                      </div>
                    )}

                    {/* Action Button */}
                    <div className="pt-2">
                      {booking.status !== 'confirmed' && (
                        <button
                          onClick={() => handleAllocateSlot(booking)}
                          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded text-sm font-medium hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
                        >
                          <FaCheckCircle className="w-3 h-3" />
                          Allocate Slot
                        </button>
                      )}
                    </div>
                </div>
              </div>
          ))}
        </div>
      )}

      {/* Slot Allocation Modal */}
      {showAllocationModal && selectedBooking && (
        <SlotAllocationModal
          booking={selectedBooking}
          onClose={() => {
            setShowAllocationModal(false);
            setSelectedBooking(null);
          }}
          onAllocate={handleAllocationSubmit}
          sessionDuration={60} // Default session duration
          isAllocating={allocatingSlot}
        />
      )}

      {/* Loading Overlay for Slot Allocation */}
      {allocatingSlot && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md mx-4 text-center shadow-xl">
            <FaSpinner className="animate-spin w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Allocating Slot
            </h3>
            {selectedBooking && (
                           <div className="mb-3 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
               <p className="text-xs text-gray-500 dark:text-gray-400">Session Details</p>
               <p className="font-medium text-blue-600 dark:text-blue-400 text-sm">
                 {selectedBooking.studentName} - {selectedBooking.slot}
               </p>
             </div>
            )}
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              {allocationMessage}
            </p>
            <div className="mt-4 flex justify-center">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingBookings;
