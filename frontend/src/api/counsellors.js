// Counsellor profile API functions only. Authentication is handled by the shared auth API.
import api from './api';

// Fetch all counsellor profiles
export const getCounsellorProfiles = () => api.get('/api/counsellors/profiles');

// Fetch a single counsellor profile by id
export const getCounsellorProfileById = (id) => api.get(`/api/counsellors/profile/${id}`); 

// Get counsellor availability for next 5 days
export const getCounsellorNext5DaysAvailability = async (counsellorId) => {
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
export const getCounsellorAvailableSlotsForDate = async (counsellorId, date) => {
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

// Get counsellor availability (legacy - keeping for backward compatibility)
export const getCounsellorAvailability = async (counsellorId, date = null) => {
  try {
    if (date) {
      // Use new endpoint for specific date
      return await getCounsellorAvailableSlotsForDate(counsellorId, date);
    } else {
      // Use new endpoint for next 5 days
      return await getCounsellorNext5DaysAvailability(counsellorId);
    }
  } catch (error) {
    console.error('Error fetching counsellor availability:', error);
    throw error;
  }
};

// Book a session
export const bookSession = async (bookingData) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user?.token;
    
    console.log('=== BOOK SESSION API CALL ===');
    console.log('Booking data:', bookingData);
    console.log('Token:', token ? 'Present' : 'Missing');
    
    const response = await fetch('http://localhost:5000/api/counsellor/availability/book-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(bookingData)
    });
    
    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);
    
    if (!response.ok) {
      let errorMessage = 'Failed to book session';
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch (jsonError) {
        // If JSON parsing fails, try to get text response
        try {
          const errorText = await response.text();
          console.error('Response error text:', errorText);
          errorMessage = errorText || errorMessage;
        } catch (textError) {
          console.error('Could not read response:', textError);
        }
      }
      throw new Error(errorMessage);
    }
    
    let data;
    try {
      data = await response.json();
    } catch (jsonError) {
      console.error('Failed to parse JSON response:', jsonError);
      throw new Error('Invalid response from server');
    }
    
    console.log('Response data:', data);
    return data;
  } catch (error) {
    console.error('Error booking session:', error);
    throw error;
  }
};

// Get counsellor session types and pricing
export const getCounsellorSessionTypes = async (counsellorId) => {
  try {
    const response = await fetch(`http://localhost:5000/api/counsellors/profile/${counsellorId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch counsellor session types');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching counsellor session types:', error);
    throw error;
  }
};

// Get student's upcoming sessions
export const getStudentSessions = async () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user?.token;
    
    console.log('=== GET STUDENT SESSIONS API CALL ===');
    console.log('User from localStorage:', user);
    console.log('Token:', token ? 'Present' : 'Missing');
    
    // Try the authenticated endpoint first
    let response = await fetch('http://localhost:5000/api/counsellor/availability/student-sessions', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    console.log(response.data);
    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);
    
    // If authentication fails, try the test endpoint
    if (!response.ok) {
      console.log('Authentication failed, trying test endpoint...');
      response = await fetch('/http://localhost:5000api/counsellor/availability/test-student-sessions', {
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
      throw new Error('Failed to fetch student sessions');
    }
    
    const data = await response.json();
    console.log('Response data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching student sessions:', error);
    throw error;
  }
};

// Get student's webinar bookings
export const getStudentWebinarBookings = async () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user?.token;
    
    // For now, return mock data since we don't have a webinar booking API yet
    // TODO: Replace with actual API call when webinar booking system is implemented
    return {
      success: true,
      data: {
        webinarBookings: [
          {
            id: 'web1',
            type: 'webinar',
            title: 'AI & Machine Learning for Business Growth',
            provider: 'John Carter',
            date: '2025-07-31',
            time: '12:30',
            duration: '90 minutes',
            status: 'upcoming',
            price: 499,
            bookingId: 'WEB-001',
            meetingLink: 'https://meet.google.com/abc123',
            domain: 'Data Science'
          },
          {
            id: 'web2',
            type: 'webinar',
            title: 'Digital Marketing Mastery 2026',
            provider: 'John Carter',
            date: '2025-08-01',
            time: '08:30',
            duration: '120 minutes',
            status: 'upcoming',
            price: 999,
            bookingId: 'WEB-002',
            meetingLink: 'https://meet.google.com/def456',
            domain: 'Digital Marketing'
          }
        ]
      }
    };
  } catch (error) {
    console.error('Error fetching webinar bookings:', error);
    throw error;
  }
}; 