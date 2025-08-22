const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const { initializeCronJobs } = require('./utils/cronService');

// Load env variables
dotenv.config();

// Connect to Database
connectDB();

// Initialize cron jobs for notifications
initializeCronJobs();

const app = express();

// Middleware
const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set static folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Basic route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Import routes
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const noteRoutes = require('./routes/noteRoutes');
const testRoutes = require('./routes/testRoutes');
const quizRoutes = require('./routes/quizRoutes');
const liveSessionRoutes = require('./routes/liveSession');
const liveClassRoutes = require('./routes/liveClassRoutes');
const chatRoutes = require('./routes/chatRoutes');
const discussionRoutes = require('./routes/discussionRoutes');
const studyPlanRoutes = require('./routes/studyPlanRoutes');
const channelRoutes = require('./routes/channelRoutes');
const studetRoutes = require('./routes/studentRoutes');
const teacherRoutes = require('./routes/teacherRoutes')
const counsellorRoutes = require('./routes/counsellorRoutes');
const counsellorAvailabilityRoutes = require('./routes/counsellorAvailabilityRoutes');
const industryExpertRoutes = require('./routes/industryExpertRoutes');
const userRoutes = require('./routes/userRoutes');
const webinarRegistrationRoutes = require('./routes/webinarRegistrations');
const notificationRoutes = require('./routes/notifications');
const reviewRoutes = require('./routes/reviewRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

// Mount Routers
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/live-sessions', liveSessionRoutes);
app.use('/api/live-classes', liveClassRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/discussions', discussionRoutes);
app.use('/api/study-plans', studyPlanRoutes);
app.use('/api/channels', channelRoutes);
app.use('/api/students', studetRoutes);
app.use('/api/teachers', teacherRoutes)
app.use('/api/counsellors', counsellorRoutes);
app.use('/api/counsellor/availability', counsellorAvailabilityRoutes);
app.use('/api/industry-experts', industryExpertRoutes);
app.use('/api/users', userRoutes);
app.use('/api/webinar-registrations', webinarRegistrationRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api', reviewRoutes);

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: err.message || 'Server Error'
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`)
});