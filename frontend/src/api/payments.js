// Payment API service
const API_BASE_URL = '/api/payments';

// Initialize payment for a booking
export const initializePayment = async (bookingId, paymentMethod, amount) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user?.token;
    
    console.log('=== INITIALIZE PAYMENT API CALL ===');
    console.log('User from localStorage:', user);
    console.log('Token:', token ? 'Present' : 'Missing');
    console.log('Booking ID:', bookingId);
    console.log('Payment Method:', paymentMethod);
    console.log('Amount:', amount);
    
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

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Payment initialization failed:', data);
      throw new Error(data.error || 'Failed to initialize payment');
    }

    console.log('Payment initialization successful:', data);
    return data;
  } catch (error) {
    console.error('Initialize payment error:', error);
    throw error;
  }
};

// Process payment
export const processPayment = async (paymentId, paymentDetails) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user?.token;
    
    console.log('=== PROCESS PAYMENT API CALL ===');
    console.log('Payment ID:', paymentId);
    console.log('Payment Details:', paymentDetails);
    
    const response = await fetch(`${API_BASE_URL}/process`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        paymentId,
        paymentDetails
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Payment processing failed:', data);
      throw new Error(data.error || 'Failed to process payment');
    }

    console.log('Payment processing successful:', data);
    return data;
  } catch (error) {
    console.error('Process payment error:', error);
    throw error;
  }
};

// Get payment status
export const getPaymentStatus = async (paymentId) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user?.token;
    
    const response = await fetch(`${API_BASE_URL}/${paymentId}/status`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to get payment status');
    }

    return data;
  } catch (error) {
    console.error('Get payment status error:', error);
    throw error;
  }
};

// Get payment history
export const getPaymentHistory = async () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user?.token;
    
    const response = await fetch(`${API_BASE_URL}/history`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to get payment history');
    }

    return data;
  } catch (error) {
    console.error('Get payment history error:', error);
    throw error;
  }
};

// Poll payment status (for real-time updates)
export const pollPaymentStatus = async (paymentId, maxAttempts = 30, interval = 2000) => {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    
    const poll = async () => {
      try {
        attempts++;
        const response = await getPaymentStatus(paymentId);
        
        if (response.data.status === 'completed') {
          resolve(response.data);
        } else if (response.data.status === 'failed') {
          reject(new Error('Payment failed'));
        } else if (attempts >= maxAttempts) {
          reject(new Error('Payment status polling timeout'));
        } else {
          setTimeout(poll, interval);
        }
      } catch (error) {
        reject(error);
      }
    };
    
    poll();
  });
};
