const mongoose = require('mongoose');

// Simplified 3-hour slot schema
const dayAvailabilitySchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  isAvailable: {
    type: Boolean,
    default: false
  },
  availableSlots: {
    type: [String],
    enum: ['9AM-12PM', '12PM-3PM', '3PM-6PM', '6PM-9PM'],
    default: []
  },
  bookedSlots: [{
    slot: {
      type: String,
      enum: ['9AM-12PM', '12PM-3PM', '3PM-6PM', '6PM-9PM']
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student'
    },
    sessionType: {
      type: String,
      enum: ['chat', 'phone'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending'
    },
    meetingLink: {
      type: String,
      default: ''
    },
    message: {
      type: String,
      default: ''
    },
    exactStartTime: {
      type: String,
      default: ''
    },
    exactEndTime: {
      type: String,
      default: ''
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
});

const counsellorAvailabilitySchema = new mongoose.Schema({
  counsellor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // This references the User model (counsellors)
    required: true,
    unique: true
  },
  // Store availability for next 30 days
  dailyAvailability: [dayAvailabilitySchema],
  sessionDuration: {
    type: Number, // in minutes
    default: 60,
    min: 15,
    max: 180
  },
  sessionPrice: {
    type: Number,
    default: 99,
    min: 50,
    max: 1000
  },
  isActive: {
    type: Boolean,
    default: true
  },
  stopTakingBookings: {
    type: Boolean,
    default: false
  },
  stopBookingReason: {
    type: String,
    default: ''
  },
  timezone: {
    type: String,
    default: 'Asia/Kolkata'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save middleware to update timestamp
counsellorAvailabilitySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Method to get next 5 days availability for public booking
counsellorAvailabilitySchema.methods.getNext5DaysAvailability = async function() {
  try {
    const availability = [];
    
    for (let i = 0; i < 5; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const dateString = date.toISOString().split('T')[0];
      
      // Find availability for this date - use more robust date comparison
      const dayAvailability = this.dailyAvailability.find(day => {
        const dayDate = new Date(day.date);
        const dayDateString = dayDate.toISOString().split('T')[0];
        return dayDateString === dateString;
      });
      
      if (dayAvailability && dayAvailability.isAvailable) {
        // Filter out booked slots
        const availableSlots = dayAvailability.availableSlots.filter(slot => 
          !dayAvailability.bookedSlots.some(booked => 
            booked.slot === slot && booked.status !== 'cancelled'
          )
        );
        
        availability.push({
          date: dateString,
          dayName: date.toLocaleDateString('en-US', { weekday: 'long' }),
          dayShort: date.toLocaleDateString('en-US', { weekday: 'short' }),
          isToday: i === 0,
          isTomorrow: i === 1,
          isAvailable: availableSlots.length > 0, // Only available if there are slots
          availableSlots: availableSlots,
          hasAvailability: availableSlots.length > 0
        });
      } else {
        availability.push({
          date: dateString,
          dayName: date.toLocaleDateString('en-US', { weekday: 'long' }),
          dayShort: date.toLocaleDateString('en-US', { weekday: 'short' }),
          isToday: i === 0,
          isTomorrow: i === 1,
          isAvailable: false,
          availableSlots: [],
          hasAvailability: false
        });
      }
    }
    
    return availability;
  } catch (error) {
    console.error('Error in getNext5DaysAvailability:', error);
    return [];
  }
};

// Method to get available slots for a specific date
counsellorAvailabilitySchema.methods.getAvailableSlotsForDate = async function(date) {
  try {
    const dateString = new Date(date).toISOString().split('T')[0];
    
    // Find availability for this date - use more robust date comparison
    const dayAvailability = this.dailyAvailability.find(day => {
      const dayDate = new Date(day.date);
      return dayDate.toISOString().split('T')[0] === dateString;
    });
    
    if (!dayAvailability || !dayAvailability.isAvailable) {
      return [];
    }
    
    // Filter out booked slots
    const availableSlots = dayAvailability.availableSlots.filter(slot => 
      !dayAvailability.bookedSlots.some(booked => 
        booked.slot === slot && booked.status !== 'cancelled'
      )
    );
    
    return availableSlots.map(slot => ({
      slot: slot,
      availableBookings: 1,
      isBooked: false
    }));
  } catch (error) {
    console.error('Error in getAvailableSlotsForDate:', error);
    return [];
  }
};

// Method to get upcoming sessions for counsellor
counsellorAvailabilitySchema.methods.getUpcomingSessions = async function() {
  try {
    const upcomingSessions = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day for comparison
    
    // Get all future dates with bookings
    for (const dayAvailability of this.dailyAvailability) {
      const dayDate = new Date(dayAvailability.date);
      dayDate.setHours(0, 0, 0, 0);
      
      if (dayDate >= today && dayAvailability.bookedSlots.length > 0) {
        for (const booking of dayAvailability.bookedSlots) {
          if (booking.status === 'confirmed') {
            upcomingSessions.push({
              date: dayAvailability.date,
              slot: booking.slot,
              sessionType: booking.sessionType,
              status: booking.status,
              studentId: booking.studentId,
              meetingLink: booking.meetingLink,
              message: booking.message,
              exactStartTime: booking.exactStartTime,
              exactEndTime: booking.exactEndTime,
              createdAt: booking.createdAt
            });
          }
        }
      }
    }
    
    // Sort by date and time (ascending order)
    return upcomingSessions.sort((a, b) => {
      if (a.date.getTime() !== b.date.getTime()) {
        return a.date.getTime() - b.date.getTime();
      }
      
      // Sort by slot time
      const slotOrder = { '9AM-12PM': 1, '12PM-3PM': 2, '3PM-6PM': 3, '6PM-9PM': 4 };
      return slotOrder[a.slot] - slotOrder[b.slot];
    });
  } catch (error) {
    console.error('Error in getUpcomingSessions:', error);
    return [];
  }
};

module.exports = mongoose.model('CounsellorAvailability', counsellorAvailabilitySchema, 'counselloravailabilities');
