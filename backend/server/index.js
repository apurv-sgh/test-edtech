const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const { initializeCronJobs } = require('./utils/cronService');

// Load env variables
dotenv.config();

const app = express();
// const __dirname = path.resolve();

// Middleware
const allowedOrigins = [
    'https://zegnite-frontend.onrender.com',
    'http://localhost:5174',
    'http://localhost:5173'  // Added for local development
];

const corsOptions = {
    origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps, curl, etc.)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        } else {
            return callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check route
app.get('/', (req, res) => {
    res.send('✅ API is running...');
});

// Import routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/notes', require('./routes/noteRoutes'));
app.use('/api/tests', require('./routes/testRoutes'));
app.use('/api/quizzes', require('./routes/quizRoutes'));
app.use('/api/live-sessions', require('./routes/liveSession'));
app.use('/api/live-classes', require('./routes/liveClassRoutes'));
app.use('/api/chats', require('./routes/chatRoutes'));
app.use('/api/discussions', require('./routes/discussionRoutes'));
app.use('/api/study-plans', require('./routes/studyPlanRoutes'));
app.use('/api/channels', require('./routes/channelRoutes'));
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/teachers', require('./routes/teacherRoutes'));
app.use('/api/counsellors', require('./routes/counsellorRoutes'));
app.use('/api/counsellor/availability', require('./routes/counsellorAvailabilityRoutes'));
app.use('/api/industry-experts', require('./routes/industryExpertRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/webinar-registrations', require('./routes/webinarRegistrations'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api', require('./routes/reviewRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));

// Serve static files from React app (only in production)
if (process.env.NODE_ENV === 'production') {
    app.use(
        express.static(path.join(__dirname, "dist"), {
            setHeaders: (res, filePath) => {
                if (filePath.endsWith(".css")) {
                    res.setHeader("Content-Type", "text/css");
                }
            },
        })
    );

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
}

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    const status = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
    res.status(status).json({
        success: false,
        error: err.message || 'Server Error'
    });
});

// Start Server only after DB connection
const startServer = async () => {
    try {
        await connectDB(); // Wait until DB is connected
        initializeCronJobs(); 

        const PORT = process.env.PORT;
        app.listen(PORT, () => {
            console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
        });
    } catch (err) {
        console.error("❌ Failed to connect DB:", err.message);
        
    }
};

startServer();
