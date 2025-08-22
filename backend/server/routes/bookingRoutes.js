const express = require('express');
const router = express.Router();
const {
  createBooking,
  getStudentBookings,
  getCounsellorBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
  getCounsellorAvailability,
  updateCounsellorAvailability
} = require('../controllers/bookingController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Public routes
router.get('/availability/:counsellorId', getCounsellorAvailability);

// Protected routes
router.use(authMiddleware());

// Booking management
router.post('/', createBooking);
router.get('/student', getStudentBookings);
router.get('/counsellor', getCounsellorBookings);
router.get('/:id', getBookingById);
router.put('/:id/status', updateBookingStatus);
router.put('/:id/cancel', cancelBooking);

// Availability management (counsellors only)
router.put('/availability', updateCounsellorAvailability);

module.exports = router;
