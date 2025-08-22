const WebinarRegistration = require('../models/WebinarRegistration');
const IndustryExpertProfile = require('../models/IndustryExpertProfile');
const Student = require('../models/Student');
const User = require('../models/Counsellor'); // User model is exported from Counsellor.js

// Register for a webinar
const registerForWebinar = async (req, res) => {
  try {
    const { webinarId, expertId, name, email, phone, institution, yearOfStudy, expectations, questions } = req.body;
    const studentId = req.user.id; // From auth middleware

    // Check if webinar exists
    const webinar = await IndustryExpertProfile.findById(webinarId);
    if (!webinar) {
      return res.status(404).json({
        success: false,
        message: 'Webinar not found'
      });
    }

    // Check if already registered
    const existingRegistration = await WebinarRegistration.findOne({
      webinarId,
      studentId
    });

    if (existingRegistration) {
      return res.status(400).json({
        success: false,
        message: 'You are already registered for this webinar'
      });
    }

    // Create registration
    const registration = new WebinarRegistration({
      webinarId,
      expertId,
      studentId,
      name,
      email,
      phone,
      institution,
      yearOfStudy,
      expectations,
      questions,
      source: req.body.source || 'profile'
    });

    await registration.save();

    res.status(201).json({
      success: true,
      message: 'Registration successful!',
      data: registration
    });

  } catch (error) {
    console.error('Webinar registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed. Please try again.'
    });
  }
};

// Get registration count for a webinar
const getWebinarRegistrationCount = async (req, res) => {
  try {
    const { webinarId } = req.params;
    
    const count = await WebinarRegistration.getWebinarRegistrationCount(webinarId);
    
    res.json({
      success: true,
      count
    });
  } catch (error) {
    console.error('Get registration count error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get registration count'
    });
  }
};

// Get expert's webinar analytics
const getExpertAnalytics = async (req, res) => {
  try {
    const expertId = req.user.id;

    // Get registration stats
    const registrationStats = await WebinarRegistration.getExpertStats(expertId);

    // Get recent registrations
    const recentRegistrations = await WebinarRegistration.find({ expertId })
      .sort({ registeredAt: -1 })
      .limit(10)
      .populate('studentId', 'name email')
      .populate('webinarId', 'seminars');

    // Get upcoming webinars with registration counts
    const expertProfile = await IndustryExpertProfile.findOne({ expert: expertId });
    const upcomingWebinars = [];
    
    if (expertProfile && expertProfile.seminars) {
      for (const seminar of expertProfile.seminars) {
        const registrationCount = await WebinarRegistration.getWebinarRegistrationCount(seminar._id);
        upcomingWebinars.push({
          ...seminar.toObject(),
          registrationCount
        });
      }
    }

    res.json({
      success: true,
      data: {
        registrationStats,
        recentRegistrations,
        upcomingWebinars
      }
    });

  } catch (error) {
    console.error('Get expert analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get analytics'
    });
  }
};

// Get student's webinar registrations
const getStudentRegistrations = async (req, res) => {
  try {
    const studentId = req.user.id;

    const registrations = await WebinarRegistration.find({ studentId })
      .populate('webinarId', 'seminars')
      .populate('expertId', 'name')
      .sort({ registeredAt: -1 });

    res.json({
      success: true,
      data: registrations
    });

  } catch (error) {
    console.error('Get student registrations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get registrations'
    });
  }
};

// Cancel webinar registration
const cancelRegistration = async (req, res) => {
  try {
    const { registrationId } = req.params;
    const studentId = req.user.id;

    const registration = await WebinarRegistration.findOne({
      _id: registrationId,
      studentId
    });

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    registration.status = 'cancelled';
    await registration.save();

    res.json({
      success: true,
      message: 'Registration cancelled successfully'
    });

  } catch (error) {
    console.error('Cancel registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel registration'
    });
  }
};

// Mark attendance (for experts)
const markAttendance = async (req, res) => {
  try {
    const { registrationId } = req.params;
    const expertId = req.user.id;

    const registration = await WebinarRegistration.findOne({
      _id: registrationId,
      expertId
    });

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    await registration.markAsAttended();

    res.json({
      success: true,
      message: 'Attendance marked successfully'
    });

  } catch (error) {
    console.error('Mark attendance error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark attendance'
    });
  }
};

// Get webinar details with registration info
const getWebinarDetails = async (req, res) => {
  try {
    const { webinarId } = req.params;
    const studentId = req.user?.id;

    // Get webinar details
    const expertProfile = await IndustryExpertProfile.findOne({
      'seminars._id': webinarId
    }).populate('expert', 'name email');

    if (!expertProfile) {
      return res.status(404).json({
        success: false,
        message: 'Webinar not found'
      });
    }

    const webinar = expertProfile.seminars.find(s => s._id.toString() === webinarId);
    
    // Get registration count
    const registrationCount = await WebinarRegistration.getWebinarRegistrationCount(webinarId);
    
    // Check if student is registered
    let isRegistered = false;
    if (studentId) {
      const registration = await WebinarRegistration.findOne({
        webinarId,
        studentId
      });
      isRegistered = !!registration;
    }

    res.json({
      success: true,
      data: {
        webinar,
        expert: expertProfile.expert,
        registrationCount,
        isRegistered
      }
    });

  } catch (error) {
    console.error('Get webinar details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get webinar details'
    });
  }
};

module.exports = {
  registerForWebinar,
  getWebinarRegistrationCount,
  getExpertAnalytics,
  getStudentRegistrations,
  cancelRegistration,
  markAttendance,
  getWebinarDetails
}; 