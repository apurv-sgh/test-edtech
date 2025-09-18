// Payment API service
import api from './api';

// Use the same baseURL as axios client to avoid hitting Vite dev server by mistake
const API_BASE_URL = `${api.defaults.baseURL}/api/payments`;

// Initialize payment for a booking
export const initializePayment = async (bookingId, paymentMethod, amount) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user?.token || localStorage.getItem('token') || localStorage.getItem('teacherToken');
    
    const response = await fetch(`${API_BASE_URL}/initialize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        bookingId,
        paymentMethod,
        amount
      })
    });

    const contentType = response.headers.get('content-type') || '';
    const data = contentType.includes('application/json') ? await response.json() : { raw: await response.text() };
    if (!response.ok) {
      const message = (data && (data.error || data.message)) || data?.raw || `HTTP ${response.status}`;
      throw new Error(message);
    }

    return data;
  } catch (error) {
    console.error('Initialize payment error:', error);
    throw error;
  }
};

// Process payment (demo)
export const processPayment = async (paymentId, paymentDetails) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = user?.token || localStorage.getItem('token') || localStorage.getItem('teacherToken');
  const response = await fetch(`${API_BASE_URL}/process`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ paymentId, paymentDetails })
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data?.error || 'Payment failed');
  return data;
};

export const pollPaymentStatus = async (paymentId) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = user?.token || localStorage.getItem('token') || localStorage.getItem('teacherToken');
  const response = await fetch(`${API_BASE_URL}/${paymentId}/status`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data?.error || 'Status check failed');
  return data?.data || data;
};

// Cashfree helpers
export const createCashfreeOrder = async (bookingId, amount) => {
  const init = await initializePayment(bookingId, 'cashfree', amount);
  return init?.data?.order || init?.order || init?.data;
};
