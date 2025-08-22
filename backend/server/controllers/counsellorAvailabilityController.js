const asyncHandler = require('express-async-handler');
const CounsellorAvailability = require('../models/CounsellorAvailability');
const User = require('../models/Counsellor'); // This is actually the User model
const Counsellor = require('../models/Counsellor');
const Booking = require('../models/Booking');

// Add some debugging
console.log('CounsellorAvailability model loaded:', !!CounsellorAvailability);
console.log('User model loaded:', !!User);

// @desc    Get counsellor's own availability dashboard
// @route   GET /api/counsellor/availability/dashboard
// @access  Private (counsellor only)
const getAvailabilityDashboard = async (req, res) => {
  try {
    console.log('User object:', req.user);
    console.log('User ID:', req.user?._id || req.user?.id);
    console.log('User role:', req.user?.role);
    
    // Check if user is authenticated and is a counsellor
    if (!req.user) {
      console.log('No user found, using default counsellor ID');
      // For testing, use a default counsellor ID
      const defaultCounsellorId = '68835cc466843db23929ef75'; // From our database
      let availability = await CounsellorAvailability.findOne({ counsellor: defaultCounsellorId });
      
      if (!availability) {
        availability = new CounsellorAvailability({
          counsellor: defaultCounsellorId,
          dailyAvailability: []
        });
        await availability.save();
        console.log('Default availability created successfully');
      }
      
      // Get next 5 days availability
      const next5Days = await availability.getNext5DaysAvailability();
      
      // Get upcoming sessions
      const upcomingSessions = await availability.getUpcomingSessions();

      // Create a safe response
      const response = {
        success: true,
        data: {
          availability: availability || {},
          next5Days: next5Days || [],
          upcomingSessions: upcomingSessions || [],
          stats: {
            totalAvailableDays: next5Days?.filter(day => day.isAvailable).length || 0,
            totalAvailableSlots: next5Days?.reduce((total, day) => total + (day.availableSlots?.length || 0), 0) || 0,
            upcomingSessions: upcomingSessions?.length || 0
          }
        }
      };
      
      console.log('Sending test response:', response);
      return res.json(response);
    }
    
    if (req.user.role !== 'counsellor') {
      return res.status(403).json({
        success: false,
        error: 'Access denied. Only counsellors can access this endpoint.'
      });
    }
    
    // Get the correct user ID (either _id or id)
    const userId = req.user._id || req.user.id;
    console.log('Using user ID for availability lookup:', userId);
    
    let availability = await CounsellorAvailability.findOne({ counsellor: userId });
    
    if (!availability) {
      console.log('Creating default availability for counsellor:', userId);
      // Create default availability if none exists
      availability = new CounsellorAvailability({
        counsellor: userId,
        dailyAvailability: []
      });
      await availability.save();
      console.log('Default availability created successfully');
    }

    // Get next 5 days availability
    const next5Days = await availability.getNext5DaysAvailability();
    
    // Get upcoming sessions
    const upcomingSessions = await availability.getUpcomingSessions();

    // Calculate comprehensive stats
    const allBookings = availability.dailyAvailability.flatMap(day => day.bookedSlots);
    const confirmedBookings = allBookings.filter(booking => booking.status === 'confirmed');
    const pendingBookings = allBookings.filter(booking => booking.status === 'pending');
    const completedBookings = allBookings.filter(booking => booking.status === 'completed');
    
    // Get unique students (active clients)
    const uniqueStudents = new Set(allBookings.map(booking => booking.studentId?.toString())).size;

    console.log('Dashboard response data:', {
      availabilityId: availability._id,
      dailyAvailabilityCount: availability.dailyAvailability.length,
      dailyAvailability: availability.dailyAvailability,
      next5DaysCount: next5Days.length,
      next5Days: next5Days,
      upcomingSessionsCount: upcomingSessions.length,
      stopTakingBookings: availability.stopTakingBookings,
      stats: {
        totalSessions: allBookings.length,
        upcomingSessions: upcomingSessions.length,
        pendingBookings: pendingBookings.length,
        activeClients: uniqueStudents,
        completedSessions: completedBookings.length
      }
    });

    res.json({
      success: true,
      data: {
        availability,
        next5Days,
        upcomingSessions,
        stats: {
          totalAvailableDays: next5Days.filter(day => day.isAvailable).length,
          totalAvailableSlots: next5Days.reduce((total, day) => total + (day.availableSlots?.length || 0), 0),
          upcomingSessions: upcomingSessions.length,
          totalSessions: allBookings.length,
          pendingBookings: pendingBookings.length,
          activeClients: uniqueStudents,
          completedSessions: completedBookings.length
        }
      }
    });
  } catch (error) {
    console.error('Error in getAvailabilityDashboard:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error while fetching availability dashboard',
      details: error.message
    });
  }
};

// @desc    Set availability for specific dates
// @route   POST /api/counsellor/availability/set-availability
// @access  Private (counsellor only)
const setAvailability = asyncHandler(async (req, res) => {
  
  try {
    const { dates } = req.body; // Array of { date, isAvailable, availableSlots }
    
    if (!dates || !Array.isArray(dates)) {
      return res.status(400).json({
        success: false,
        error: 'Dates array is required'
      });
    }

    // Validate each date object
    for (const dateData of dates) {
      if (!dateData.date || typeof dateData.isAvailable !== 'boolean') {
        return res.status(400).json({
          success: false,
          error: 'Each date must have date and isAvailable properties'
        });
      }
    }

    // Check if user is authenticated and is a counsellor
    if (!req.user) {
      console.log('No user found, using default counsellor');
      req.user = { _id: '68835cc466843db23929ef75', role: 'counsellor' };
    }
    
    if (req.user.role !== 'counsellor') {
      return res.status(403).json({
        success: false,
        error: 'Access denied. Only counsellors can access this endpoint.'
      });
    }

    const userId = req.user._id || req.user.id;
    
    let availability = await CounsellorAvailability.findOne({ counsellor: userId });
    
    if (!availability) {
      availability = new CounsellorAvailability({
        counsellor: userId,
        dailyAvailability: []
      });
    }

    // Update availability for each date
    for (const dateData of dates) {
      const { date, isAvailable, availableSlots } = dateData;
      const dateObj = new Date(date);
      
      // Validate date
      if (isNaN(dateObj.getTime())) {
        return res.status(400).json({
          success: false,
          error: `Invalid date format: ${date}`
        });
      }
      
      // Find existing availability for this date - use more robust date comparison
      let dayAvailability = availability.dailyAvailability.find(day => {
        const dayDate = new Date(day.date);
        const dayDateStr = dayDate.toISOString().split('T')[0];
        const inputDateStr = dateObj.toISOString().split('T')[0];
        return dayDateStr === inputDateStr;
      });
      
      if (dayAvailability) {
        // Update existing
        dayAvailability.isAvailable = isAvailable;
        dayAvailability.availableSlots = isAvailable ? (availableSlots || []) : [];
      } else {
        // Create new - ensure date is stored in UTC to avoid timezone issues
        const utcDate = new Date(Date.UTC(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate()));
        availability.dailyAvailability.push({
          date: utcDate,
          isAvailable: isAvailable,
          availableSlots: isAvailable ? (availableSlots || []) : [],
          bookedSlots: []
        });
      }
    }

    await availability.save();

    res.json({
      success: true,
      data: availability.dailyAvailability,
      message: 'Availability set successfully'
    });
  } catch (error) {
    console.error('Error in setAvailability:', error);
    console.error('Error stack:', error.stack);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    
    res.status(500).json({
      success: false,
      error: 'Internal server error while setting availability',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// @desc    Get upcoming sessions for counsellor
// @route   GET /api/counsellor/availability/upcoming-sessions
// @access  Private (counsellor only)
const getUpcomingSessions = asyncHandler(async (req, res) => {
  try {
    // Check if user is authenticated and is a counsellor
    if (!req.user) {
      console.log('No user found, using default counsellor');
      req.user = { _id: '68835cc466843db23929ef75', role: 'counsellor' };
    }
    
    if (req.user.role !== 'counsellor') {
      return res.status(403).json({
        success: false,
        error: 'Access denied. Only counsellors can access this endpoint.'
      });
    }

    const userId = req.user._id || req.user.id;
    let availability = await CounsellorAvailability.findOne({ counsellor: userId });
    
    if (!availability) {
      return res.json({
        success: true,
        data: {
          upcomingSessions: []
        }
      });
    }

    const upcomingSessions = await availability.getUpcomingSessions();

    // Populate student details
    const sessionsWithStudentDetails = await Promise.all(
      upcomingSessions.map(async (session) => {
        const student = await User.findById(session.studentId).select('name email');
        return {
          ...session,
          student: student || { name: 'Unknown Student', email: 'N/A', phone: 'N/A' }
        };
      })
    );

    res.json({
      success: true,
      data: {
        upcomingSessions: sessionsWithStudentDetails
      }
    });
  } catch (error) {
    console.error('Error in getUpcomingSessions:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error while fetching upcoming sessions',
      details: error.message
    });
  }
});

// @desc    Get next 5 days availability for public booking
// @route   GET /api/counsellor/availability/next5days/:counsellorId
// @access  Public
const getNext5DaysAvailability = asyncHandler(async (req, res) => {
  try {
    const { counsellorId } = req.params;
    console.log('Looking for availability for counsellor:', counsellorId);

    // Validate ObjectId
    if (!counsellorId || !require('mongoose').Types.ObjectId.isValid(counsellorId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid counsellor ID format'
      });
    }

    let availability = await CounsellorAvailability.findOne({ counsellor: counsellorId });
    
    // If no availability exists, create default availability
    if (!availability) {
      console.log('No availability found, creating default for counsellor:', counsellorId);
      availability = new CounsellorAvailability({
        counsellor: counsellorId,
        dailyAvailability: []
      });
      await availability.save();
      console.log('Default availability created successfully');
    }

    // Ensure availability is active
    if (!availability.isActive) {
      availability.isActive = true;
      await availability.save();
    }

    // Check if counsellor has stopped taking bookings
    if (availability.stopTakingBookings) {
      return res.status(400).json({
        success: false,
        error: availability.stopBookingReason || 'Counsellor has temporarily stopped taking new bookings'
      });
    }

    const next5Days = await availability.getNext5DaysAvailability();

    res.json({
      success: true,
      data: {
        next5Days,
        sessionDuration: availability.sessionDuration,
        sessionPrice: availability.sessionPrice,
        timezone: availability.timezone
      }
    });
  } catch (error) {
    console.error('Error in getNext5DaysAvailability:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch availability',
      details: error.message
    });
  }
});

// @desc    Get available slots for a specific date (public)
// @route   GET /api/counsellor/availability/slots/:counsellorId/:date
// @access  Public
const getAvailableSlotsForDate = asyncHandler(async (req, res) => {
  try {
    const { counsellorId, date } = req.params;
    console.log('Looking for slots for counsellor:', counsellorId, 'on date:', date);

    // Validate ObjectId
    if (!counsellorId || !require('mongoose').Types.ObjectId.isValid(counsellorId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid counsellor ID format'
      });
    }

    let availability = await CounsellorAvailability.findOne({ counsellor: counsellorId });
    
    // If no availability exists, create default availability
    if (!availability) {
      console.log('No availability found, creating default for counsellor:', counsellorId);
      availability = new CounsellorAvailability({
        counsellor: counsellorId,
        dailyAvailability: []
      });
      await availability.save();
      console.log('Default availability created successfully');
    }

    // Ensure availability is active
    if (!availability.isActive) {
      availability.isActive = true;
      await availability.save();
    }

    // Check if counsellor has stopped taking bookings
    if (availability.stopTakingBookings) {
      return res.status(400).json({
        success: false,
        error: availability.stopBookingReason || 'Counsellor has temporarily stopped taking new bookings'
      });
    }

    const availableSlots = await availability.getAvailableSlotsForDate(date);

    res.json({
      success: true,
      data: {
        date,
        availableSlots,
        sessionDuration: availability.sessionDuration,
        sessionPrice: availability.sessionPrice,
        hasAvailability: availableSlots.length > 0
      }
    });
  } catch (error) {
    console.error('Error in getAvailableSlotsForDate:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch available slots',
      details: error.message
    });
  }
});

// @desc    Book a session (public)
// @route   POST /api/counsellor/availability/book-session
// @access  Public (requires student authentication)
const bookSession = asyncHandler(async (req, res) => {
  try {
    console.log('=== BOOK SESSION CONTROLLER STARTED ===');
    console.log('Request method:', req.method);
    console.log('Request URL:', req.url);
    console.log('Request headers:', req.headers);
    console.log('Request body:', req.body);
    console.log('User object:', req.user);
    
    const { counsellorId, date, slot, sessionType, phone } = req.body;
    const studentId = req.user._id; // Get student ID from authenticated user
    
    console.log('=== BOOK SESSION REQUEST ===');
    console.log('Request body:', req.body);
    console.log('User:', req.user);
    console.log('Student ID from auth:', studentId);
    console.log('Headers:', req.headers);

    if (!counsellorId || !date || !slot || !sessionType) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: counsellorId, date, slot, sessionType'
      });
    }

    // Validate ObjectId
    if (!require('mongoose').Types.ObjectId.isValid(counsellorId) || !require('mongoose').Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid ID format'
      });
    }

    // Validate session type
    const validSessionTypes = ['call', 'chat', 'video', 'phone'];
    if (!validSessionTypes.includes(sessionType)) {
      return res.status(400).json({
        success: false,
        error: `Invalid session type. Must be one of: ${validSessionTypes.join(', ')}`
      });
    }

    console.log('Looking for availability for counsellor:', counsellorId);
    let availability = await CounsellorAvailability.findOne({ counsellor: counsellorId });
    
    console.log('Availability found:', !!availability);
    if (availability) {
      console.log('Availability details:', {
        id: availability._id,
        counsellor: availability.counsellor,
        dailyAvailabilityCount: availability.dailyAvailability.length,
        stopTakingBookings: availability.stopTakingBookings
      });
    }
    
    if (!availability) {
      console.log('No availability found for counsellor:', counsellorId);
      return res.status(404).json({
        success: false,
        error: 'Counsellor availability not found'
      });
    }

    // Check if counsellor has stopped taking bookings
    if (availability.stopTakingBookings) {
      return res.status(400).json({
        success: false,
        error: availability.stopBookingReason || 'Counsellor has temporarily stopped taking new bookings'
      });
    }

    const dateObj = new Date(date);
    const dateString = dateObj.toISOString().split('T')[0];
    
    // Find availability for this date
    let dayAvailability = availability.dailyAvailability.find(day => 
      day.date.toISOString().split('T')[0] === dateString
    );
    
    if (!dayAvailability || !dayAvailability.isAvailable) {
      return res.status(400).json({
        success: false,
        error: 'Counsellor is not available on this date'
      });
    }

    // Check if slot is available
    if (!dayAvailability.availableSlots.includes(slot)) {
      return res.status(400).json({
        success: false,
        error: 'Selected slot is not available'
      });
    }

    // Allow multiple bookings per slot - counsellor will manage allocation
    // No need to check if slot is already booked

    // Meeting link will be generated by counsellor when confirming the booking

    // Add booking with pending status (counsellor needs to confirm)
    const bookingData = {
      slot: slot,
      studentId: studentId,
      sessionType: sessionType,
      phone: phone || null, // Include phone if provided
      status: 'pending',
      createdAt: new Date()
    };

    console.log('Adding booking data:', bookingData);
    dayAvailability.bookedSlots.push(bookingData);

    console.log('Saving availability...');
    await availability.save();
    console.log('Availability saved successfully');

    // Normalize session type (phone -> call)
    const normalizedSessionType = sessionType === 'phone' ? 'call' : sessionType;

    // Also create a record in the Booking model for payment processing
    const newBooking = await Booking.create({
      student: studentId,
      counsellor: counsellorId,
      sessionType: normalizedSessionType,
      scheduledDate: dateObj,
      scheduledTime: slot,
      phone: phone || null, // Include phone if provided
      duration: 60, // Default duration
      price: 99, // Default price - can be made dynamic
      status: 'pending',
      paymentStatus: 'pending'
    });

    console.log('Created booking in Booking model:', newBooking._id);

    console.log('=== BOOK SESSION SUCCESS ===');
    console.log('Created booking ID:', newBooking._id);
    
    const responseData = {
      success: true,
      data: {
        _id: newBooking._id, // Use the Booking model ID for payment
        bookingId: newBooking._id,
        date: date,
        slot: slot,
        sessionType: sessionType,
        status: 'pending'
      },
      message: 'Session booked successfully. Counsellor will confirm and provide meeting link.'
    };
    
    console.log('Sending response:', responseData);
    res.json(responseData);
  } catch (error) {
    console.error('=== BOOK SESSION ERROR ===');
    console.error('Error in bookSession:', error);
    console.error('Error stack:', error.stack);
    
    res.status(500).json({
      success: false,
      error: 'Failed to book session',
      details: error.message
    });
  }
});

// @desc    Get upcoming sessions for student
// @route   GET /api/counsellor/availability/student-sessions
// @access  Private (student only)
const getStudentSessions = asyncHandler(async (req, res) => {
  try {
    let studentId = req.user?._id || req.user?.id;
    
    // If no user is authenticated, use default student ID for testing
    if (!studentId) {
      console.log('No authenticated user found, using default student ID for testing');
      studentId = '688a40b678a5c9a534ba9df6'; // Default student ID from database
    }
    
    console.log('=== GET STUDENT SESSIONS ===');
    console.log('Student ID from request:', studentId);
    console.log('User object:', req.user);
    console.log('User _id:', req.user._id);
    console.log('User id:', req.user.id);
    
    // Find all availabilities that have bookings for this student
    let availabilities = await CounsellorAvailability.find({
      'dailyAvailability.bookedSlots.studentId': studentId
    });
    
    // If no availabilities found, try with the default student ID for testing
    if (availabilities.length === 0) {
      console.log('No availabilities found for student ID:', studentId);
      console.log('Trying with default student ID for testing...');
      availabilities = await CounsellorAvailability.find({
        'dailyAvailability.bookedSlots.studentId': '688a40b678a5c9a534ba9df6' // Default student ID from database
      });
      console.log('Found availabilities with default student ID:', availabilities.length);
    }
    
    console.log('Found availabilities:', availabilities.length);
    availabilities.forEach(av => {
      console.log('Availability ID:', av._id);
      console.log('Counsellor ID:', av.counsellor);
      av.dailyAvailability.forEach(day => {
        const studentBookings = day.bookedSlots.filter(b => b.studentId.toString() === studentId.toString());
        if (studentBookings.length > 0) {
          console.log(`Date ${day.date}: ${studentBookings.length} bookings for this student`);
          studentBookings.forEach(booking => {
            console.log('  Booking:', {
              id: booking._id,
              studentId: booking.studentId,
              status: booking.status,
              slot: booking.slot
            });
          });
        }
      });
    });

    const upcomingSessions = [];
    const today = new Date();

    // Get all unique counsellor IDs
    const counsellorIds = [...new Set(availabilities.map(av => av.counsellor.toString()))];

    // Fetch counsellor details
    const Counsellor = require('../models/Counsellor');
    const counsellors = await Counsellor.find({ _id: { $in: counsellorIds } }, 'name email');
    const counsellorMap = {};
    counsellors.forEach(c => {
      counsellorMap[c._id.toString()] = c;
    });

    availabilities.forEach(availability => {
      const counsellor = counsellorMap[availability.counsellor.toString()];
      
      availability.dailyAvailability.forEach(day => {
        day.bookedSlots.forEach(booking => {
          const bookingDate = new Date(day.date);
          const todayDate = new Date();
          todayDate.setHours(0, 0, 0, 0); // Reset time to start of day
          
          console.log('Comparing dates:', {
            bookingDate: bookingDate.toISOString(),
            todayDate: todayDate.toISOString(),
            isAfterToday: bookingDate >= todayDate,
            studentIdMatch: booking.studentId.toString() === studentId.toString(),
            status: booking.status
          });
          
          if (booking.studentId.toString() === studentId.toString() && 
              booking.status !== 'cancelled' &&
              bookingDate >= todayDate) {
            
            upcomingSessions.push({
              bookingId: booking._id,
              counsellorName: counsellor?.name || 'Unknown Counsellor',
              counsellorEmail: counsellor?.email || 'N/A',
              date: day.date,
              slot: booking.slot,
              sessionType: booking.sessionType,
              status: booking.status,
              meetingLink: booking.meetingLink || null,
              exactStartTime: booking.exactStartTime || null,
              exactEndTime: booking.exactEndTime || null,
              message: booking.message || null,
              createdAt: booking.createdAt
            });
          }
        });
      });
    });

    // Sort by date
    upcomingSessions.sort((a, b) => new Date(a.date) - new Date(b.date));

    res.json({
      success: true,
      data: {
        upcomingSessions
      }
    });
  } catch (error) {
    console.error('Error in getStudentSessions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch student sessions',
      details: error.message
    });
  }
});

// @desc    Get pending bookings for counsellor
// @route   GET /api/counsellor/availability/pending-bookings
// @access  Private (counsellor only)
const getPendingBookings = asyncHandler(async (req, res) => {
  try {
    let counsellorId = req.user?._id || req.user?.id;
    
    // If no user is authenticated, use default counsellor ID for testing
    if (!counsellorId) {
      console.log('No authenticated user found, using default counsellor ID for testing');
      counsellorId = '68835cc466843db23929ef75'; // Default counsellor ID from database
    }
    
    console.log('=== GET PENDING BOOKINGS ===');
    console.log('Counsellor ID:', counsellorId);
    console.log('User:', req.user);
    console.log('User _id:', req.user._id);
    console.log('User id:', req.user.id);
    
    // Find all availabilities that have pending bookings for this counsellor
    let availabilities = await CounsellorAvailability.find({
      counsellor: counsellorId,
      'dailyAvailability.bookedSlots.status': 'pending'
    });
    
    // If no availabilities found, try with the default counsellor ID for testing
    if (availabilities.length === 0) {
      console.log('No availabilities found for counsellor ID:', counsellorId);
      console.log('Trying with default counsellor ID for testing...');
      availabilities = await CounsellorAvailability.find({
        counsellor: '68835cc466843db23929ef75', // Default counsellor ID from database
        'dailyAvailability.bookedSlots.status': 'pending'
      });
      console.log('Found availabilities with default ID:', availabilities.length);
    }

    console.log('Found availabilities with pending bookings:', availabilities.length);
    availabilities.forEach(av => {
      console.log('Availability ID:', av._id);
      console.log('Daily availability count:', av.dailyAvailability.length);
      av.dailyAvailability.forEach(day => {
        const pendingCount = day.bookedSlots.filter(b => b.status === 'pending').length;
        if (pendingCount > 0) {
          console.log(`Date ${day.date}: ${pendingCount} pending bookings`);
        }
      });
    });

    const pendingBookings = [];
    const today = new Date();

    // Get all unique student IDs
    const studentIds = [...new Set(
      availabilities.flatMap(av => 
        av.dailyAvailability.flatMap(day => 
          day.bookedSlots
            .filter(booking => booking.status === 'pending')
            .map(booking => booking.studentId.toString())
        )
      )
    )];

    // Fetch student details
    const students = await User.find({ _id: { $in: studentIds } }, 'name email');
    const studentMap = {};
    students.forEach(s => {
      studentMap[s._id.toString()] = s;
    });

    availabilities.forEach(availability => {
      availability.dailyAvailability.forEach(day => {
        day.bookedSlots.forEach(booking => {
          const bookingDate = new Date(day.date);
          const todayDate = new Date();
          todayDate.setHours(0, 0, 0, 0); // Reset time to start of day
          
          if (booking.status === 'pending' && bookingDate >= todayDate) {
            const student = studentMap[booking.studentId.toString()];
            
            pendingBookings.push({
              bookingId: booking._id,
              studentId: booking.studentId,
              studentName: student?.name || 'Unknown Student',
              studentEmail: student?.email || 'N/A',
              studentMobile: student?.phone || 'N/A',
              date: day.date,
              slot: booking.slot,
              sessionType: booking.sessionType,
              status: booking.status,
              meetingLink: booking.meetingLink,
              message: booking.message || '',
              exactStartTime: booking.exactStartTime || '',
              exactEndTime: booking.exactEndTime || '',
              createdAt: booking.createdAt,
              availabilityId: availability._id,
              dayId: day._id
            });
          }
        });
      });
    });

    // Sort by date
    pendingBookings.sort((a, b) => new Date(a.date) - new Date(b.date));

    console.log('Total pending bookings found:', pendingBookings.length);
    console.log('Pending bookings:', pendingBookings);

    res.json({
      success: true,
      data: {
        pendingBookings
      }
    });
  } catch (error) {
    console.error('Error in getPendingBookings:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch pending bookings',
      details: error.message
    });
  }
});

// @desc    Update booking slot and meeting link
// @route   PUT /api/counsellor/availability/update-booking
// @access  Private (counsellor only)
const updateBooking = asyncHandler(async (req, res) => {
  try {
    const { bookingId, newSlot, meetingLink, status } = req.body;
    const counsellorId = req.user._id || req.user.id;

    if (!bookingId) {
      return res.status(400).json({
        success: false,
        error: 'Booking ID is required'
      });
    }

    // Find the availability document containing this booking
    const availability = await CounsellorAvailability.findOne({
      counsellor: counsellorId,
      'dailyAvailability.bookedSlots._id': bookingId
    });

    if (!availability) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    // Find the specific booking
    let bookingFound = false;
    availability.dailyAvailability.forEach(day => {
      day.bookedSlots.forEach(booking => {
        if (booking._id.toString() === bookingId) {
          bookingFound = true;
          
          // Update slot if provided
          if (newSlot) {
            booking.slot = newSlot;
          }
          
          // Update meeting link if provided
          if (meetingLink) {
            booking.meetingLink = meetingLink;
          }
          
          // Update status if provided
          if (status) {
            booking.status = status;
          }
          
          booking.updatedAt = new Date();
        }
      });
    });

    if (!bookingFound) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found in availability'
      });
    }

    await availability.save();

    res.json({
      success: true,
      message: 'Booking updated successfully',
      data: {
        bookingId,
        newSlot,
        meetingLink,
        status
      }
    });
  } catch (error) {
    console.error('Error in updateBooking:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update booking',
      details: error.message
    });
  }
});

// @desc    Confirm a booking (change status to confirmed)
// @route   PUT /api/counsellor/availability/confirm-booking
// @access  Private (counsellor only)
const confirmBooking = asyncHandler(async (req, res) => {
  try {
    const { bookingId, meetingLink } = req.body;
    const counsellorId = req.user._id || req.user.id;

    if (!bookingId) {
      return res.status(400).json({
        success: false,
        error: 'Booking ID is required'
      });
    }

    if (!meetingLink) {
      return res.status(400).json({
        success: false,
        error: 'Meeting link is required to confirm booking'
      });
    }

    // Find and update the booking
    const availability = await CounsellorAvailability.findOne({
      counsellor: counsellorId,
      'dailyAvailability.bookedSlots._id': bookingId
    });

    if (!availability) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    let bookingFound = false;
    availability.dailyAvailability.forEach(day => {
      day.bookedSlots.forEach(booking => {
        if (booking._id.toString() === bookingId) {
          bookingFound = true;
          booking.status = 'confirmed';
          booking.meetingLink = meetingLink;
          booking.confirmedAt = new Date();
          booking.updatedAt = new Date();
        }
      });
    });

    if (!bookingFound) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found in availability'
      });
    }

    await availability.save();

    res.json({
      success: true,
      message: 'Booking confirmed successfully',
      data: {
        bookingId,
        status: 'confirmed',
        meetingLink
      }
    });
  } catch (error) {
    console.error('Error in confirmBooking:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to confirm booking',
      details: error.message
    });
  }
});

// @desc    Allocate slot for a booking (assign slot and meeting link)
// @route   PUT /api/counsellor/availability/allocate-slot
// @access  Private (counsellor only)
const allocateSlot = asyncHandler(async (req, res) => {
  try {
    const { bookingId, allocatedSlot, exactStartTime, exactEndTime, meetingLink, message } = req.body;
    const counsellorId = req.user._id || req.user.id;

    console.log('=== ALLOCATE SLOT REQUEST ===');
    console.log('Request body:', req.body);
    console.log('Counsellor ID:', counsellorId);
    console.log('User object:', req.user);
    console.log('Headers:', req.headers);

    if (!bookingId) {
      return res.status(400).json({
        success: false,
        error: 'Booking ID is required'
      });
    }

    if (!allocatedSlot) {
      return res.status(400).json({
        success: false,
        error: 'Allocated slot is required'
      });
    }

    if (!exactStartTime || !exactEndTime) {
      return res.status(400).json({
        success: false,
        error: 'Exact start and end times are required'
      });
    }

    if (!meetingLink) {
      return res.status(400).json({
        success: false,
        error: 'Meeting link is required'
      });
    }

    // Find and update the booking
    console.log('Searching for availability with counsellor:', counsellorId, 'and bookingId:', bookingId);
    const availability = await CounsellorAvailability.findOne({
      counsellor: counsellorId,
      'dailyAvailability.bookedSlots._id': bookingId
    });

    console.log('Availability found:', !!availability);
    if (availability) {
      console.log('Availability ID:', availability._id);
      console.log('Daily availability count:', availability.dailyAvailability.length);
    }

    if (!availability) {
      console.log('No availability found for counsellor:', counsellorId, 'with booking:', bookingId);
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    let bookingFound = false;
    availability.dailyAvailability.forEach(day => {
      day.bookedSlots.forEach(booking => {
        if (booking._id.toString() === bookingId) {
          bookingFound = true;
          booking.status = 'confirmed';
          booking.slot = allocatedSlot; // Update the slot
          booking.meetingLink = meetingLink;
          booking.message = message || '';
          booking.exactStartTime = exactStartTime;
          booking.exactEndTime = exactEndTime;
          
          booking.allocatedAt = new Date();
          booking.updatedAt = new Date();
          
          console.log('Booking updated:', {
            bookingId: booking._id,
            status: booking.status,
            slot: booking.slot,
            exactTime: `${booking.exactStartTime}-${booking.exactEndTime}`,
            message: booking.message
          });
        }
      });
    });

    if (!bookingFound) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found in availability'
      });
    }

    await availability.save();

    res.json({
      success: true,
      message: 'Slot allocated successfully',
      data: {
        bookingId,
        status: 'confirmed',
        allocatedSlot,
        meetingLink
      }
    });
  } catch (error) {
    console.error('Error in allocateSlot:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to allocate slot',
      details: error.message
    });
  }
});

// @desc    Toggle stop taking bookings status
// @route   PUT /api/counsellor/availability/toggle-booking-status
// @access  Private (counsellor only)
const toggleBookingStatus = asyncHandler(async (req, res) => {
  try {
    const { stopTakingBookings, reason } = req.body;
    const counsellorId = req.user._id || req.user.id;

    if (typeof stopTakingBookings !== 'boolean') {
      return res.status(400).json({
        success: false,
        error: 'stopTakingBookings must be a boolean value'
      });
    }

    const availability = await CounsellorAvailability.findOne({ counsellor: counsellorId });

    if (!availability) {
      return res.status(404).json({
        success: false,
        error: 'Counsellor availability not found'
      });
    }

    availability.stopTakingBookings = stopTakingBookings;
    availability.stopBookingReason = reason || '';

    await availability.save();

    res.json({
      success: true,
      message: stopTakingBookings 
        ? 'Booking temporarily stopped' 
        : 'Booking resumed',
      data: {
        stopTakingBookings: availability.stopTakingBookings,
        stopBookingReason: availability.stopBookingReason
      }
    });
  } catch (error) {
    console.error('Error in toggleBookingStatus:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to toggle booking status',
      details: error.message
    });
  }
});

// @desc    Test endpoint to check current user
// @route   GET /api/counsellor/availability/test-user
// @access  Private
const testUser = asyncHandler(async (req, res) => {
  try {
    console.log('=== TEST USER ENDPOINT ===');
    console.log('User object:', req.user);
    console.log('User _id:', req.user?._id);
    console.log('User id:', req.user?.id);
    console.log('User role:', req.user?.role);
    console.log('User userType:', req.user?.userType);
    
    res.json({
      success: true,
      data: {
        user: req.user,
        userId: req.user?._id || req.user?.id,
        role: req.user?.role || req.user?.userType
      }
    });
  } catch (error) {
    console.error('Error in testUser:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to test user',
      details: error.message
    });
  }
});

module.exports = {
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
};
