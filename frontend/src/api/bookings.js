import api from './api';

// Create a new booking
export const createBooking = async (bookingData) => {
  const response = await api.post(`${api.defaults.baseURL}/bookings`, bookingData);
  return response.data;
};

// Get all bookings for a student
export const getStudentBookings = async () => {
  const response = await api.get(`${api.defaults.baseURL}/bookings/student`);
  return response.data;
};

// Get all bookings for a counsellor
export const getCounsellorBookings = async () => {
  const response = await api.get(`${api.defaults.baseURL}/bookings/counsellor`);
  return response.data;
};

// Get booking by ID
export const getBookingById = async (bookingId) => {
  const response = await api.get(`${api.defaults.baseURL}/bookings/${bookingId}`);
  return response.data;
};

// Update booking status
export const updateBookingStatus = async (bookingId, statusData) => {
  const response = await api.put(`${api.defaults.baseURL}/bookings/${bookingId}/status`, statusData);
  return response.data;
};

// Cancel booking
export const cancelBooking = async (bookingId, cancellationReason) => {
  const response = await api.put(`${api.defaults.baseURL}/bookings/${bookingId}/cancel`, { cancellationReason });
  return response.data;
};

// Get counsellor availability
export const getCounsellorAvailability = async (counsellorId, date = null) => {
  const params = date ? { date } : {};
  const response = await api.get(`${api.defaults.baseURL}/bookings/availability/${counsellorId}`, { params });
  return response.data;
};

// Update counsellor availability
export const updateCounsellorAvailability = async (availabilityData) => {
  const response = await api.put(`${api.defaults.baseURL}/bookings/availability`, availabilityData);
  return response.data;
};
