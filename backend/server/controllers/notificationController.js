const Notification = require('../models/Notification');
const WebinarRegistration = require('../models/WebinarRegistration');

// Get user's notifications
const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const userModel = req.user.role === 'student' ? 'Student' : 'User';
    const { page = 1, limit = 20, unreadOnly = false } = req.query;

    const query = {
      recipient: userId,
      recipientModel: userModel
    };

    if (unreadOnly === 'true') {
      query.read = false;
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('webinarId', 'seminars')
      .populate('expertId', 'name');

    const total = await Notification.countDocuments(query);

    res.json({
      success: true,
      data: {
        notifications,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      }
    });

  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get notifications'
    });
  }
};

// Mark notification as read
const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user.id;
    const userModel = req.user.role === 'student' ? 'Student' : 'User';

    const notification = await Notification.findOne({
      _id: notificationId,
      recipient: userId,
      recipientModel: userModel
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    await notification.markAsRead();

    res.json({
      success: true,
      message: 'Notification marked as read'
    });

  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark notification as read'
    });
  }
};

// Mark all notifications as read
const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const userModel = req.user.role === 'student' ? 'Student' : 'User';

    await Notification.markAllAsRead(userId, userModel);

    res.json({
      success: true,
      message: 'All notifications marked as read'
    });

  } catch (error) {
    console.error('Mark all as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark notifications as read'
    });
  }
};

// Get unread notification count
const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;
    const userModel = req.user.role === 'student' ? 'Student' : 'User';

    const count = await Notification.countDocuments({
      recipient: userId,
      recipientModel: userModel,
      read: false
    });

    res.json({
      success: true,
      count
    });

  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get unread count'
    });
  }
};

// Create webinar reminder notifications
const createWebinarReminders = async (req, res) => {
  try {
    const { webinarId } = req.params;
    const { reminderType } = req.body; // '24h', '1h', '15min'

    // Get all registrations for this webinar
    const registrations = await WebinarRegistration.find({
      webinarId,
      status: { $in: ['registered', 'attended'] }
    });

    const notifications = [];

    for (const registration of registrations) {
      const notification = await Notification.createWebinarReminder(
        registration._id,
        reminderType
      );
      
      if (notification) {
        notifications.push(notification);
      }
    }

    res.json({
      success: true,
      message: `${notifications.length} reminder notifications created`,
      count: notifications.length
    });

  } catch (error) {
    console.error('Create webinar reminders error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create reminder notifications'
    });
  }
};

// Process scheduled notifications (for cron job)
const sendScheduledNotifications = async () => {
  try {
    const now = new Date();
    const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000);

    // Get notifications scheduled to be processed within the next 5 minutes
    const scheduledNotifications = await Notification.find({
      scheduledFor: { $lte: fiveMinutesFromNow },
      read: false
    }).populate('recipient', 'email name');

    console.log(`Processing ${scheduledNotifications.length} scheduled notifications`);

    // For now, just log the notifications (email functionality removed)
    for (const notification of scheduledNotifications) {
      console.log(`Notification ready: ${notification.title} for ${notification.recipient.email}`);
    }

  } catch (error) {
    console.error('Process scheduled notifications error:', error);
  }
};

// Delete notification
const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user.id;
    const userModel = req.user.role === 'student' ? 'Student' : 'User';

    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      recipient: userId,
      recipientModel: userModel
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.json({
      success: true,
      message: 'Notification deleted successfully'
    });

  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete notification'
    });
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  createWebinarReminders,
  sendScheduledNotifications,
  deleteNotification
}; 