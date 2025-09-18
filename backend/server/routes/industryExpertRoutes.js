const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const industryExpertController = require('../controllers/industryExpertController');
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

// Auth
router.post('/register', industryExpertController.register);
router.post('/login', industryExpertController.login);

// Profile (industry expert must be logged in)
router.get('/me', authMiddleware('industry_expert'), industryExpertController.getMyProfile);
router.post('/profile', authMiddleware('industry_expert'), upload.fields([
  { name: 'profilePicture', maxCount: 1 },
  { name: 'documents', maxCount: 5 }]) ,industryExpertController.upsertProfile);

// Seminar management (industry expert must be logged in)
router.post('/seminars', authMiddleware('industry_expert'), industryExpertController.createSeminar);
router.get('/seminars', authMiddleware('industry_expert'), industryExpertController.getMySeminars);
router.put('/seminars/:seminarId', authMiddleware('industry_expert'), industryExpertController.updateSeminar);
router.delete('/seminars/:seminarId', authMiddleware('industry_expert'), industryExpertController.deleteSeminar);

// Admin verification
router.patch('/verify/:id', authMiddleware('admin'), industryExpertController.verifyProfile);

// Public: Get all verified industry expert profiles
router.get('/profiles', industryExpertController.getAllProfiles);
// Public: Get a single industry expert profile by ID
router.get('/profile/:id', industryExpertController.getProfileById);


// Public routes for webinar-Registration (no auth required)
router.get('/webinar/:webinarId/count', getWebinarRegistrationCount);
router.get('/webinar/:webinarId/details', getWebinarDetails);

// Student routes for webinar-Registeration (requires student auth)
router.post('/webinars/:webinarId/register', authMiddleware(), registerForWebinar);
router.get('/student/registrations', authMiddleware(), getStudentRegistrations);
router.put('/registration/:registrationId/cancel', authMiddleware(), cancelRegistration);

// Expert routes for webinar (requires expert auth)
router.get('/expert/analytics', authMiddleware(), getExpertAnalytics);
router.put('/registration/:registrationId/attendance', authMiddleware(), markAttendance);


module.exports = router; 