const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const socketIo = require('socket.io');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
});

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:4000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:4000',
    'http://192.168.31.180:5173',
  ],
  credentials: true
}));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/edtech_platform', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

// Import routes
const authRoutes = require('./routes/auth');
const teacherRoutes = require('./routes/teacher');
const courseRoutes = require('./routes/course');
const notesRoutes = require('./routes/notes');
const liveSessionRoutes = require('./routes/liveSession');
const groupChatRoutes = require('./routes/groupChat');

// Static file serving for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/live-sessions', liveSessionRoutes);
app.use('/api/group-chat', groupChatRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'EdTech Platform API is running',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'EdTech Platform API Server',
    version: '1.0.0',
    endpoints: {
        teachers: '/api/teachers',
        courses: '/api/courses',
        notes: '/api/notes',
        videos: '/api/videos',
        groupChat: '/api/group-chat',
        health: '/api/health'
      }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    success: false, 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});


// Socket.io connection handling
const activeUsers = new Map();
const activeSessions = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Handle user joining
  socket.on('join-user', (userData) => {
    activeUsers.set(socket.id, userData);
    socket.broadcast.emit('user-joined', userData);
  });

  // Handle joining a chat room
  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  // Handle group chat messages
  socket.on('send-message', (data) => {
    socket.to(data.roomId).emit('receive-message', {
      id: Date.now(),
      message: data.message,
      sender: data.sender,
      timestamp: new Date(),
      roomId: data.roomId
    });
  });

  // Handle WebRTC signaling for live sessions
  socket.on('join-live-session', (sessionId) => {
    socket.join(`session-${sessionId}`);
    socket.to(`session-${sessionId}`).emit('user-joined-session', socket.id);
  });

  socket.on('offer', (data) => {
    socket.to(`session-${data.sessionId}`).emit('offer', {
      offer: data.offer,
      senderId: socket.id
    });
  });

  socket.on('answer', (data) => {
    socket.to(`session-${data.sessionId}`).emit('answer', {
      answer: data.answer,
      senderId: socket.id
    });
  });

  socket.on('ice-candidate', (data) => {
    socket.to(`session-${data.sessionId}`).emit('ice-candidate', {
      candidate: data.candidate,
      senderId: socket.id
    });
  });

  // Handle screen sharing
  socket.on('start-screen-share', (sessionId) => {
    socket.to(`session-${sessionId}`).emit('screen-share-started', socket.id);
  });

  socket.on('stop-screen-share', (sessionId) => {
    socket.to(`session-${sessionId}`).emit('screen-share-stopped', socket.id);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    const userData = activeUsers.get(socket.id);
    if (userData) {
      socket.broadcast.emit('user-left', userData);
      activeUsers.delete(socket.id);
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, '127.0.0.1', () => {
  console.log(`Server running on port ${PORT}`);
});