// Counsellor profile API functions only. Authentication is handled by the shared auth API.
import api from './api';

// Fetch all counsellor profiles
export const getCounsellorProfiles = () => api.get('/api/counsellors/profiles');

// Fetch a single counsellor profile by id
export const getCounsellorProfileById = (id) => api.get(`/api/counsellors/profile/${id}`); 

// Get counsellor availability for next 5 days
export const getCounsellorNext5DaysAvailability = async (counsellorId) => {
  try {
    const response = await fetch(`${api.defaults.baseURL}/api/counsellor/availability/next5days/${counsellorId}`);
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
    const response = await fetch(`${api.defaults.baseURL}/api/counsellor/availability/slots/${counsellorId}/${date}`);
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
    
    const response = await fetch(`${api.defaults.baseURL}/api/counsellor/availability/book-session`, {
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
    const response = await fetch(`${api.defaults.baseURL}/api/counsellors/profile/${counsellorId}`);
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
    let response = await fetch(`${api.defaults.baseURL}/api/counsellor/availability/student-sessions`, {
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
      response = await fetch(`${api.defaults.baseURL}/api/counsellor/availability/test-student-sessions`, {
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
    const token = user?.token || localStorage.getItem('token');

    // 1) Get student's webinar registrations
    const regsRes = await fetch(`${api.defaults.baseURL}/api/webinar-registrations/student/registrations`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    const regsContentType = regsRes.headers.get('content-type') || '';
    const regsData = regsContentType.includes('application/json') ? await regsRes.json() : { success: false };
    if (!regsRes.ok || !regsData.success) {
      throw new Error(regsData.message || 'Failed to fetch webinar registrations');
    }

    const registrations = Array.isArray(regsData.data) ? regsData.data : regsData.data?.registrations || [];

    // 2) For each registration, fetch webinar details to resolve seminar title/date/time
    const bookings = [];
    for (const reg of registrations) {
      const webinarId = reg.webinarId; // seminar subdocument id or profile id
      try {
        const detRes = await fetch(`${api.defaults.baseURL}/api/webinar-registrations/webinar/${webinarId}/details`, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const detCT = detRes.headers.get('content-type') || '';
        const detData = detCT.includes('application/json') ? await detRes.json() : { success: false };
        if (!detRes.ok || !detData.success) {
          // fallback minimal card using registration only
          bookings.push({
            id: reg._id,
            type: 'webinar',
            title: 'Webinar',
            provider: reg.expertName || 'Industry Expert',
            date: new Date().toISOString().split('T')[0],
            time: '—',
            duration: '90 minutes',
            status: reg.status || 'upcoming',
            price: reg.fee || 0,
            bookingId: reg._id,
            meetingLink: reg.meetingLink || ''
          });
        } else {
          const w = detData.data?.webinar || {};
          const expert = detData.data?.expert || {};
          bookings.push({
            id: reg._id,
            type: 'webinar',
            title: w.title || 'Webinar',
            provider: expert.name || 'Industry Expert',
            date: (w.date ? new Date(w.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]),
            time: w.time || '—',
            duration: `${w.duration || 90} minutes`,
            status: reg.status || 'upcoming',
            price: w.fee ?? 0,
            bookingId: reg._id,
            meetingLink: reg.meetingLink || ''
          });
        }
      } catch (e) {
        // network or parse error, push minimal card
        bookings.push({
          id: reg._id,
          type: 'webinar',
          title: 'Webinar',
          provider: 'Industry Expert',
          date: new Date().toISOString().split('T')[0],
          time: '—',
          duration: '90 minutes',
          status: reg.status || 'upcoming',
          price: reg.fee || 0,
          bookingId: reg._id,
          meetingLink: ''
        });
      }
    }

    return { success: true, data: { webinarBookings: bookings } };
  } catch (error) {
    console.error('Error fetching webinar bookings:', error);
    throw error;
  }
}; 