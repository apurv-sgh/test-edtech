const asyncHandler = require('express-async-handler');
const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const CounsellorAvailability = require('../models/CounsellorAvailability');
const User = require('../models/Counsellor'); // User model
const crypto = require('crypto');

// @desc    Initialize payment for a booking
// @route   POST /api/payments/initialize
// @access  Private
const initializePayment = asyncHandler(async (req, res) => {
  console.log('=== INITIALIZE PAYMENT CONTROLLER ===');
  console.log('Request body:', req.body);
  console.log('User from request:', req.user);
  console.log('User ID:', req.user?._id);
  
  const { bookingId, paymentMethod, amount } = req.body;

  try {
    // Find the booking
    const booking = await Booking.findById(bookingId)
      .populate('student', 'name email')
      .populate('counsellor', 'name email');

    console.log('Found booking:', booking);

    if (!booking) {
      res.status(404);
      throw new Error('Booking not found');
    }

    // Check if payment already exists
    const existingPayment = await Payment.findOne({ booking: bookingId });
    if (existingPayment) {
      res.status(400);
      throw new Error('Payment already exists for this booking');
    }

    // Create payment record
    const payment = await Payment.create({
      booking: bookingId,
      student: booking.student._id,
      counsellor: booking.counsellor._id,
      amount: amount || booking.price,
      paymentMethod,
      paymentStatus: 'pending'
    });

    // Cashfree order init
    if (paymentMethod === 'cashfree') {
      const orderId = payment.transactionId; // reuse internal txn id
      const orderAmount = payment.amount;
      const orderCurrency = payment.currency || 'INR';

      const cashfreePayload = {
        order_id: orderId,
        order_amount: orderAmount,
        order_currency: orderCurrency,
        customer_details: {
          customer_id: String(booking.student._id),
          customer_email: booking.student.email || 'customer@example.com',
          customer_phone: booking.student.phone || '9999999999'
        },
        order_meta: {
          return_url: process.env.PAYMENT_SUCCESS_URL || 'http://localhost:5173/payment/success'
        }
      };

      // We do not call Cashfree server here to avoid new deps; let frontend use JS SDK with provided order info
      return res.json({
        success: true,
        data: {
          gateway: 'cashfree',
          order: cashfreePayload,
          paymentId: payment._id,
          transactionId: payment.transactionId
        }
      });
    }

    // For now, simulate payment gateway integration for other methods
    const paymentData = {
      paymentId: payment._id,
      transactionId: payment.transactionId,
      amount: payment.amount,
      currency: payment.currency,
      paymentMethod,
      bookingDetails: {
        bookingId: booking._id,
        sessionType: booking.sessionType,
        scheduledDate: booking.scheduledDate,
        scheduledTime: booking.scheduledTime,
        counsellorName: booking.counsellor.name,
        studentName: booking.student.name
      }
    };

    res.json({
      success: true,
      data: paymentData,
      message: 'Payment initialized successfully'
    });

  } catch (error) {
    console.error('Payment initialization error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to initialize payment',
      details: error.message
    });
  }
});

// @desc    Cashfree webhook
// @route   POST /api/payments/cashfree/webhook
// @access  Public (validate via signature)
const cashfreeWebhook = asyncHandler(async (req, res) => {
  try {
    const signature = req.headers['x-webhook-signature'] || req.headers['x-cashfree-signature'];
    const secret = process.env.CASHFREE_WEBHOOK_SECRET;
    if (!secret) {
      console.warn('CASHFREE_WEBHOOK_SECRET not set');
    }

    // Verify HMAC if possible
    if (signature && secret) {
      const payload = JSON.stringify(req.body);
      const computed = crypto.createHmac('sha256', secret).update(payload).digest('base64');
      if (computed !== signature) {
        console.warn('Invalid Cashfree signature');
        return res.status(400).json({ success: false });
      }
    }

    const { data } = req.body || {};
    const orderId = data?.order?.order_id;
    const status = data?.order?.status || data?.payment?.payment_status;
    const gatewayTxn = data?.payment?.cf_payment_id || data?.payment?.payment_id || data?.order?.cf_order_id;

    if (!orderId) {
      return res.status(400).json({ success: false, error: 'Missing order_id' });
    }

    const payment = await Payment.findOne({ transactionId: orderId });
    if (!payment) {
      return res.status(404).json({ success: false, error: 'Payment not found' });
    }

    if (status && ['PAID', 'SUCCESS', 'COMPLETED'].includes(String(status).toUpperCase())) {
      payment.paymentStatus = 'completed';
    } else if (status && ['FAILED'].includes(String(status).toUpperCase())) {
      payment.paymentStatus = 'failed';
    } else {
      payment.paymentStatus = 'processing';
    }

    payment.gatewayTransactionId = gatewayTxn || payment.gatewayTransactionId;
    payment.gatewayResponse = req.body;
    await payment.save();

    if (payment.paymentStatus === 'completed') {
      await updateCounsellorAvailability(payment.booking);
    }

    return res.json({ success: true });
  } catch (err) {
    console.error('Cashfree webhook error:', err);
    return res.status(500).json({ success: false });
  }
});

// @desc    Process payment (simulate payment gateway)
// @route   POST /api/payments/process
// @access  Private
const processPayment = asyncHandler(async (req, res) => {
  const { paymentId, paymentDetails } = req.body;

  try {
    const payment = await Payment.findById(paymentId)
      .populate('booking')
      .populate('student', 'name email')
      .populate('counsellor', 'name email');

    if (!payment) {
      res.status(404);
      throw new Error('Payment not found');
    }

    if (payment.paymentStatus !== 'pending') {
      res.status(400);
      throw new Error('Payment is not in pending status');
    }

    // DEMO MODE: Immediately complete payment without delay
    payment.paymentStatus = 'completed';
    payment.gatewayTransactionId = `GW_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    payment.gatewayResponse = {
      status: 'success',
      message: 'Payment processed successfully (demo)',
      timestamp: new Date()
    };
    if (paymentDetails) {
      payment.paymentDetails = {
        cardLast4: paymentDetails.cardNumber?.slice(-4),
        cardBrand: paymentDetails.cardBrand || 'Visa',
        upiId: paymentDetails.upiId,
        bankName: paymentDetails.bankName
      };
    }
    await payment.save();

    // Update booking status
    const booking = await Booking.findById(payment.booking);
    if (booking) {
      booking.paymentStatus = 'completed';
      booking.paymentId = payment.transactionId;
      await booking.save();
    }

    // Update counsellor availability
    await updateCounsellorAvailability(payment.booking);

    res.json({
      success: true,
      data: {
        paymentId: payment._id,
        transactionId: payment.transactionId,
        status: 'completed',
        message: 'Payment completed (demo)'
      }
    });

  } catch (error) {
    console.error('Payment processing error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process payment',
      details: error.message
    });
  }
});

// @desc    Get payment status
// @route   GET /api/payments/:paymentId/status
// @access  Private
const getPaymentStatus = asyncHandler(async (req, res) => {
  const { paymentId } = req.params;

  try {
    const payment = await Payment.findById(paymentId)
      .populate('booking')
      .populate('student', 'name email')
      .populate('counsellor', 'name email');

    if (!payment) {
      res.status(404);
      throw new Error('Payment not found');
    }

    res.json({
      success: true,
      data: {
        paymentId: payment._id,
        transactionId: payment.transactionId,
        status: payment.paymentStatus,
        amount: payment.amount,
        currency: payment.currency,
        paymentMethod: payment.paymentMethod,
        createdAt: payment.createdAt,
        updatedAt: payment.updatedAt,
        booking: payment.booking,
        student: payment.student,
        counsellor: payment.counsellor
      }
    });

  } catch (error) {
    console.error('Get payment status error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get payment status',
      details: error.message
    });
  }
});

// @desc    Get payment history for user
// @route   GET /api/payments/history
// @access  Private
const getPaymentHistory = asyncHandler(async (req, res) => {
  const userId = req.user._id || req.user.id;
  const userRole = req.user.role;

  try {
    let query = {};
    
    if (userRole === 'student') {
      query.student = userId;
    } else if (userRole === 'counsellor') {
      query.counsellor = userId;
    }

    const payments = await Payment.find(query)
      .populate('booking')
      .populate('student', 'name email')
      .populate('counsellor', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: payments
    });

  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get payment history',
      details: error.message
    });
  }
});

// Helper function to update counsellor availability after successful payment
const updateCounsellorAvailability = async (bookingId) => {
  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) return;

    const availability = await CounsellorAvailability.findOne({ counsellor: booking.counsellor });
    if (!availability) return;

    // Find the day and add the booking to bookedSlots
    const bookingDate = new Date(booking.scheduledDate);
    const dateString = bookingDate.toISOString().split('T')[0];

    let dayAvailability = availability.dailyAvailability.find(day => 
      new Date(day.date).toISOString().split('T')[0] === dateString
    );

    if (!dayAvailability) {
      // Create new day availability
      dayAvailability = {
        date: bookingDate,
        isAvailable: true,
        availableSlots: ['9AM-12PM', '12PM-3PM', '3PM-6PM', '6PM-9PM'],
        bookedSlots: []
      };
      availability.dailyAvailability.push(dayAvailability);
    }

    // Add booking to bookedSlots
    dayAvailability.bookedSlots.push({
      slot: booking.scheduledTime,
      studentId: booking.student,
      sessionType: booking.sessionType,
      status: 'confirmed',
      meetingLink: `https://meet.google.com/${Math.random().toString(36).substr(2, 9)}`,
      message: 'Session confirmed after payment',
      exactStartTime: booking.scheduledTime,
      exactEndTime: addMinutesToTime(booking.scheduledTime, booking.duration),
      createdAt: new Date()
    });

    await availability.save();

  } catch (error) {
    console.error('Error updating counsellor availability:', error);
  }
};

// Helper function to add minutes to time string
const addMinutesToTime = (timeString, minutes) => {
  const [hours, mins] = timeString.split(':').map(Number);
  const totalMinutes = hours * 60 + mins + minutes;
  const newHours = Math.floor(totalMinutes / 60);
  const newMins = totalMinutes % 60;
  return `${newHours.toString().padStart(2, '0')}:${newMins.toString().padStart(2, '0')}`;
};

module.exports = {
  initializePayment,
  processPayment,
  getPaymentStatus,
  getPaymentHistory,
  cashfreeWebhook
};
