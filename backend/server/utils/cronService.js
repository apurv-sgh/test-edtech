const cron = require('node-cron');
const { sendScheduledNotifications } = require('../controllers/notificationController');
const Notification = require('../models/Notification');
const WebinarRegistration = require('../models/WebinarRegistration');

// Initialize cron jobs
const initializeCronJobs = () => {
  console.log('Initializing cron jobs...');

  // Process scheduled notifications every 5 minutes
  cron.schedule('*/5 * * * *', async () => {
    console.log('Running scheduled notifications job...');
    try {
      await sendScheduledNotifications();
    } catch (error) {
      console.error('Scheduled notifications job failed:', error);
    }
  });

  // Create webinar reminders daily at 9 AM
  cron.schedule('0 9 * * *', async () => {
    console.log('Running webinar reminder creation job...');
    try {
      await createWebinarReminders();
    } catch (error) {
      console.error('Webinar reminder creation job failed:', error);
    }
  });

  // Clean up old notifications weekly (keep last 30 days)
  cron.schedule('0 2 * * 0', async () => {
    console.log('Running notification cleanup job...');
    try {
      await cleanupOldNotifications();
    } catch (error) {
      console.error('Notification cleanup job failed:', error);
    }
  });

  console.log('Cron jobs initialized successfully');
};

// Create webinar reminders for upcoming webinars
const createWebinarReminders = async () => {
  try {
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const dayAfterTomorrow = new Date(now.getTime() + 48 * 60 * 60 * 1000);

    // Get registrations for webinars happening tomorrow (24h reminder)
    const registrations24h = await WebinarRegistration.find({
      status: { $in: ['registered', 'attended'] }
    }).populate('webinarId', 'seminars');

    for (const registration of registrations24h) {
      const webinar = registration.webinarId.seminars.find(s => 
        s._id.toString() === registration.webinarId.toString()
      );
      
      if (webinar) {
        const webinarDate = new Date(webinar.date + 'T' + webinar.time);
        const timeDiff = webinarDate.getTime() - now.getTime();
        const hoursDiff = timeDiff / (1000 * 60 * 60);

        // Create 24h reminder if webinar is between 24-48 hours away
        if (hoursDiff >= 24 && hoursDiff <= 48) {
          await Notification.createWebinarReminder(registration._id, '24h');
        }
      }
    }

    console.log('Webinar reminders created successfully');

  } catch (error) {
    console.error('Error creating webinar reminders:', error);
  }
};

// Clean up old notifications
const cleanupOldNotifications = async () => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const result = await Notification.deleteMany({
      createdAt: { $lt: thirtyDaysAgo },
      read: true
    });

    console.log(`Cleaned up ${result.deletedCount} old notifications`);

  } catch (error) {
    console.error('Error cleaning up old notifications:', error);
  }
};

// Manual function to create reminders for a specific webinar
const createRemindersForWebinar = async (webinarId, reminderType) => {
  try {
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

    console.log(`Created ${notifications.length} ${reminderType} reminders for webinar ${webinarId}`);
    return notifications;

  } catch (error) {
    console.error('Error creating reminders for webinar:', error);
    throw error;
  }
};

// Manual function to process immediate notifications
const sendImmediateNotifications = async () => {
  try {
    const pendingNotifications = await Notification.find({
      read: false,
      scheduledFor: { $lte: new Date() }
    }).populate('recipient', 'email name');

    console.log(`Found ${pendingNotifications.length} pending notifications`);

    // For now, just log the notifications (email functionality removed)
    for (const notification of pendingNotifications) {
      console.log(`Notification ready: ${notification.title} for ${notification.recipient.email}`);
    }

    return pendingNotifications.length;

  } catch (error) {
    console.error('Error processing immediate notifications:', error);
    throw error;
  }
};

module.exports = {
  initializeCronJobs,
  createWebinarReminders,
  cleanupOldNotifications,
  createRemindersForWebinar,
  sendImmediateNotifications
}; 