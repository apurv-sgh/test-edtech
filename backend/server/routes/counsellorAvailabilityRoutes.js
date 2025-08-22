const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const {
  getAvailabilityDashboard,
  setAvailability,
  getUpcomingSessions,
  getNext5DaysAvailability,
  getAvailableSlotsForDate,
  bookSession,
  getStudentSessions,
  getPendingBookings,
  updateBooking,
  confirmBooking,
  allocateSlot,
  toggleBookingStatus,
  testUser
} = require('../controllers/counsellorAvailabilityController');

// Test endpoint
router.get('/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Counsellor availability routes are working',
    timestamp: new Date().toISOString(),
    user: req.user ? { id: req.user._id, role: req.user.role } : 'No user'
  });
});

// Test user endpoint
router.get('/test-user', authMiddleware(), testUser);



// Public routes for students to check availability
router.get('/next5days/:counsellorId', getNext5DaysAvailability);
router.get('/slots/:counsellorId/:date', getAvailableSlotsForDate);

// Route for booking sessions (requires student authentication)
router.post('/book-session', authMiddleware('student'), bookSession);

// Get student's upcoming sessions
router.get('/student-sessions', authMiddleware('student'), getStudentSessions);

// Test student sessions without authentication (for debugging)
router.get('/test-student-sessions', getStudentSessions);

// Test pending bookings without authentication (for debugging)
router.get('/test-pending-bookings', getPendingBookings);

// Protected routes for counsellors to manage their availability
router.use(authMiddleware('counsellor'));

// Dashboard and overview
router.get('/dashboard', getAvailabilityDashboard);

// Set availability for specific dates
router.post('/set-availability', setAvailability);

// Get upcoming sessions
router.get('/upcoming-sessions', getUpcomingSessions);

// Get pending bookings for counsellor
router.get('/pending-bookings', getPendingBookings);

// Update booking (slot, meeting link, status)
router.put('/update-booking', updateBooking);

// Confirm booking
router.put('/confirm-booking', confirmBooking);

// Allocate slot for booking
router.put('/allocate-slot', allocateSlot);

// Toggle booking status (stop/resume taking bookings)
router.put('/toggle-booking-status', toggleBookingStatus);



module.exports = router;
