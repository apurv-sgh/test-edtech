// Counsellor availability API function
import api from "./api"; 

// Helper function to get auth token
const getAuthToken = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.token;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

// Get availability dashboard for counsellor
export const getAvailabilityDashboard = async () => {
  try {
    const token = getAuthToken();
    const response = await fetch('http://localhost:5000/api/counsellor/availability/dashboard', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch availability dashboard');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching availability dashboard:', error);
    throw error;
  }
};

// Set availability for specific dates
export const setAvailability = async (dates) => {
  try {
    const token = getAuthToken();
    
    const response = await fetch('http://localhost:5000/api/counsellor/availability/set-availability', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ dates })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    return data;
    
  } catch (error) {
    console.error('Error setting availability:', error);
    throw error;
  }
};

// Get upcoming sessions for counsellor
export const getUpcomingSessions = async () => {
  try {
    const token = getAuthToken();
    
    const response = await fetch('http://localhost:5000/api/counsellor/availability/upcoming-sessions', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    console.log("API raw response:", response);
    
    if (!response.ok) {
      throw new Error('Failed to fetch upcoming sessions');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching upcoming sessions:', error);
    throw error;
  }
};

// Get next 5 days availability for public booking
export const getNext5DaysAvailability = async (counsellorId) => {
  try {
    const response = await fetch(`http://localhost:5000/api/counsellor/availability/next5days/${counsellorId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch availability');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching counsellor next 5 days availability:', error);
    throw error;
  }
};

// Get available slots for a specific date
export const getAvailableSlotsForDate = async (counsellorId, date) => {
  try {
    const response = await fetch(`http://localhost:5000/api/counsellor/availability/slots/${counsellorId}/${date}`);
    if (!response.ok) {
      throw new Error('Failed to fetch available slots');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching counsellor available slots:', error);
    throw error;
  }
};

// Book a session
export const bookSession = async (bookingData) => {
  try {
    const token = getAuthToken();
    
    const response = await fetch('http://localhost:5000/api/counsellor/availability/book-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(bookingData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to book session');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error booking session:', error);
    throw error;
  }
};

// Get pending bookings for counsellor
export const getPendingBookings = async () => {
  try {
    const token = getAuthToken();
    
    console.log('=== GET PENDING BOOKINGS API CALL ===');
    console.log('Token:', token ? 'Present' : 'Missing');
    
    // Try the authenticated endpoint first
    let response = await fetch('http://localhost:5000/api/counsellor/availability/pending-bookings', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);
    
    // If authentication fails, try the test endpoint
    if (!response.ok) {
      console.log('Authentication failed, trying test endpoint...');
      response = await fetch('http://localhost:5000/api/counsellor/availability/test-pending-bookings', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Test endpoint response status:', response.status);
    }
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Response error text:', errorText);
      throw new Error('Failed to fetch pending bookings');
    }
    
    const data = await response.json();
    console.log('Response data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching pending bookings:', error);
    throw error;
  }
};

// Update booking (slot, meeting link, status)
export const updateBooking = async (bookingData) => {
  try {
    const token = getAuthToken();
    
    const response = await fetch('http://localhost:5000/api/counsellor/availability/update-booking', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(bookingData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to update booking');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating booking:', error);
    throw error;
  }
};

// Confirm booking
export const confirmBooking = async (bookingId, meetingLink) => {
  try {
    const token = getAuthToken();
    
    const response = await fetch('http://localhost:5000/api/counsellor/availability/confirm-booking', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ bookingId, meetingLink })
    });
    
    if (!response.ok) {
      throw new Error('Failed to confirm booking');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error confirming booking:', error);
    throw error;
  }
};

// Toggle booking status (stop/resume taking bookings)
export const toggleBookingStatus = async (stopTakingBookings, reason = '') => {
  try {
    const token = getAuthToken();
    
    const response = await fetch('http://localhost:5000/api/counsellor/availability/toggle-booking-status', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ stopTakingBookings, reason })
    });
    
    if (!response.ok) {
      throw new Error('Failed to toggle booking status');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error toggling booking status:', error);
    throw error;
  }
};

// Allocate slot for a booking
export const allocateSlot = async (allocationData) => {
  try {
    const token = getAuthToken();
    
    console.log('=== ALLOCATE SLOT API CALL ===');
    console.log('Allocation data:', allocationData);
    console.log('Token:', token ? 'Present' : 'Missing');
    
    const response = await fetch('http://localhost:5000/api/counsellor/availability/allocate-slot', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(allocationData)
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.log('Error response:', errorData);
      throw new Error(errorData.error || 'Failed to allocate slot');
    }
    
    const data = await response.json();
    console.log('Success response:', data);
    return data;
  } catch (error) {
    console.error('Error allocating slot:', error);
    throw error;
  }
};
