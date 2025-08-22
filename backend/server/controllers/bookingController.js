const asyncHandler = require('express-async-handler');
const Booking = require('../models/Booking');
const CounsellorAvailability = require('../models/CounsellorAvailability');
const CounsellorProfile = require('../models/CounsellorProfile');

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = asyncHandler(async (req, res) => {
  const { counsellorId, sessionType, scheduledDate, scheduledTime, duration, price } = req.body;

  // Check if counsellor exists and is verified
  const counsellorProfile = await CounsellorProfile.findOne({ counsellor: counsellorId });
  if (!counsellorProfile || counsellorProfile.status !== 'verified') {
    res.status(404);
    throw new Error('Counsellor not found or not verified');
  }

  // Check availability
  const availability = await CounsellorAvailability.findOne({ counsellor: counsellorId });
  if (!availability || !availability.isActive) {
    res.status(400);
    throw new Error('Counsellor is not available for bookings');
  }

  // Check if the requested time slot is available
  const requestedDate = new Date(scheduledDate);
  const dayOfWeek = requestedDate.toLocaleDateString('en-US', { weekday: 'lowercase' });
  
  const daySchedule = availability.weeklySchedule.find(schedule => schedule.day === dayOfWeek);
  if (!daySchedule) {
    res.status(400);
    throw new Error('Counsellor is not available on this day');
  }

  // Check if the time slot is within available hours
  const isTimeSlotAvailable = daySchedule.slots.some(slot => 
    slot.isAvailable && 
    scheduledTime >= slot.startTime && 
    scheduledTime < slot.endTime
  );

  if (!isTimeSlotAvailable) {
    res.status(400);
    throw new Error('Requested time slot is not available');
  }

  // Check for existing bookings at the same time
  const existingBooking = await Booking.findOne({
    counsellor: counsellorId,
    scheduledDate: requestedDate,
    scheduledTime,
    status: { $in: ['pending', 'confirmed'] }
  });

  if (existingBooking) {
    res.status(400);
    throw new Error('This time slot is already booked');
  }

  // Create the booking
  const booking = await Booking.create({
    student: req.user._id,
    counsellor: counsellorId,
    sessionType,
    scheduledDate: requestedDate,
    scheduledTime,
    duration: duration || 60,
    price
  });

  const populatedBooking = await Booking.findById(booking._id)
    .populate('student', 'name email')
    .populate('counsellor', 'name email');

  res.status(201).json({
    success: true,
    data: populatedBooking
  });
});

// @desc    Get all bookings for a student
// @route   GET /api/bookings/student
// @access  Private
const getStudentBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ student: req.user._id })
    .populate('counsellor', 'name email')
    .populate('counsellorProfile', 'currentCompany experience sessionPrice sessionDuration')
    .sort({ scheduledDate: -1 });

  res.json({
    success: true,
    data: bookings
  });
});

// @desc    Get all bookings for a counsellor
// @route   GET /api/bookings/counsellor
// @access  Private
const getCounsellorBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ counsellor: req.user._id })
    .populate('student', 'name email')
    .sort({ scheduledDate: -1 });

  res.json({
    success: true,
    data: bookings
  });
});

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate('student', 'name email')
    .populate('counsellor', 'name email');

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  // Check if user has access to this booking
  if (booking.student._id.toString() !== req.user._id.toString() && 
      booking.counsellor._id.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to view this booking');
  }

  res.json({
    success: true,
    data: booking
  });
});

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private
const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status, notes, meetingLink } = req.body;
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  // Check if user has permission to update this booking
  if (booking.counsellor.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this booking');
  }

  booking.status = status;
  if (notes) booking.notes.counsellorNotes = notes;
  if (meetingLink) booking.meetingLink = meetingLink;

  await booking.save();

  const updatedBooking = await Booking.findById(booking._id)
    .populate('student', 'name email')
    .populate('counsellor', 'name email');

  res.json({
    success: true,
    data: updatedBooking
  });
});

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
const cancelBooking = asyncHandler(async (req, res) => {
  const { cancellationReason } = req.body;
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  // Check if user has permission to cancel this booking
  if (booking.student.toString() !== req.user._id.toString() && 
      booking.counsellor.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to cancel this booking');
  }

  booking.status = 'cancelled';
  booking.cancellationReason = cancellationReason;
  booking.cancelledBy = booking.student.toString() === req.user._id.toString() ? 'student' : 'counsellor';

  await booking.save();

  res.json({
    success: true,
    message: 'Booking cancelled successfully'
  });
});

// @desc    Get counsellor availability
// @route   GET /api/bookings/availability/:counsellorId
// @access  Public
const getCounsellorAvailability = asyncHandler(async (req, res) => {
  const { counsellorId } = req.params;
  const { date } = req.query;

  const availability = await CounsellorAvailability.findOne({ counsellor: counsellorId });
  
  if (!availability || !availability.isActive) {
    res.status(404);
    throw new Error('Counsellor availability not found');
  }

  // If date is provided, get available slots for that specific date
  if (date) {
    const requestedDate = new Date(date);
    const dayOfWeek = requestedDate.toLocaleDateString('en-US', { weekday: 'lowercase' });
    
    const daySchedule = availability.weeklySchedule.find(schedule => schedule.day === dayOfWeek);
    
    if (!daySchedule) {
      return res.json({
        success: true,
        data: {
          available: false,
          message: 'Counsellor is not available on this day'
        }
      });
    }

    // Get existing bookings for this date
    const existingBookings = await Booking.find({
      counsellor: counsellorId,
      scheduledDate: requestedDate,
      status: { $in: ['pending', 'confirmed'] }
    });

    const bookedTimes = existingBookings.map(booking => booking.scheduledTime);

    // Filter available slots
    const availableSlots = daySchedule.slots
      .filter(slot => slot.isAvailable && !bookedTimes.includes(slot.startTime))
      .map(slot => ({
        startTime: slot.startTime,
        endTime: slot.endTime
      }));

    return res.json({
      success: true,
      data: {
        available: availableSlots.length > 0,
        slots: availableSlots,
        sessionDuration: availability.sessionDuration,
        bufferTime: availability.bufferTime
      }
    });
  }

  // Return weekly schedule
  res.json({
    success: true,
    data: {
      weeklySchedule: availability.weeklySchedule,
      sessionDuration: availability.sessionDuration,
      bufferTime: availability.bufferTime,
      maxSessionsPerDay: availability.maxSessionsPerDay,
      timezone: availability.timezone
    }
  });
});

// @desc    Update counsellor availability
// @route   PUT /api/bookings/availability
// @access  Private
const updateCounsellorAvailability = asyncHandler(async (req, res) => {
  const { weeklySchedule, timezone, sessionDuration, bufferTime, maxSessionsPerDay, isActive } = req.body;

  let availability = await CounsellorAvailability.findOne({ counsellor: req.user._id });

  if (!availability) {
    availability = new CounsellorAvailability({
      counsellor: req.user._id,
      weeklySchedule: weeklySchedule || [],
      timezone: timezone || 'Asia/Kolkata',
      sessionDuration: sessionDuration || 60,
      bufferTime: bufferTime || 15,
      maxSessionsPerDay: maxSessionsPerDay || 8,
      isActive: isActive !== undefined ? isActive : true
    });
  } else {
    if (weeklySchedule) availability.weeklySchedule = weeklySchedule;
    if (timezone) availability.timezone = timezone;
    if (sessionDuration) availability.sessionDuration = sessionDuration;
    if (bufferTime) availability.bufferTime = bufferTime;
    if (maxSessionsPerDay) availability.maxSessionsPerDay = maxSessionsPerDay;
    if (isActive !== undefined) availability.isActive = isActive;
  }

  await availability.save();

  res.json({
    success: true,
    data: availability
  });
});

module.exports = {
  createBooking,
  getStudentBookings,
  getCounsellorBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
  getCounsellorAvailability,
  updateCounsellorAvailability
};
