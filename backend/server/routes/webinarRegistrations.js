const express = require('express');
const router = express.Router();
const {
  registerForWebinar,
  getWebinarRegistrationCount,
  getExpertAnalytics,
  getStudentRegistrations,
  cancelRegistration,
  markAttendance,
  getWebinarDetails
} = require('../controllers/webinarRegistrationController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Public routes (no auth required)
router.get('/webinar/:webinarId/count', getWebinarRegistrationCount);
router.get('/webinar/:webinarId/details', getWebinarDetails);

// Student routes (requires student auth)
router.post('/webinar/:webinarId/register', authMiddleware(), registerForWebinar);
router.get('/student/registrations', authMiddleware(), getStudentRegistrations);
router.put('/registration/:registrationId/cancel', authMiddleware(), cancelRegistration);

// Expert routes (requires expert auth)
router.get('/expert/analytics', authMiddleware(), getExpertAnalytics);
router.put('/registration/:registrationId/attendance', authMiddleware(), markAttendance);

module.exports = router; 