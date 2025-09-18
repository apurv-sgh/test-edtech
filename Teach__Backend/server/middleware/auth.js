const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticateToken = async (req, res, next) => {
  try {
    console.log('[Teach][Auth] Incoming Authorization:', req.header('Authorization'));
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('[Teach][Auth] Decoded JWT:', decoded);

    // Always attach decoded claims so downstream routes have identifiers
    req.user = { ...decoded };

    // Best-effort fetch of user for enrichment; do not block if DB is unavailable
    try {
      if (decoded.userId) {
        const userDoc = await User.findById(decoded.userId).select('-password');
        if (userDoc) {
          req.user = { ...req.user, ...userDoc.toObject() };
        }
      } else if (decoded.teacherId) {
        const Teacher = require('../models/Teacher');
        const teacherDoc = await Teacher.findById(decoded.teacherId).select('-password');
        if (teacherDoc) {
          req.user = { ...req.user, ...teacherDoc.toObject() };
        }
      }
    } catch (dbErr) {
      // Log and proceed with decoded-only user in dev scenarios
      console.warn('[Teach][Auth] Enrichment skipped due to DB error:', dbErr && dbErr.message);
    }

    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token.' });
  }
};

// In a real app, you would fetch the user from the database.
// For this example, we'll simulate user objects.
const mockUsers = {
  'teacher_token': { id: '652f8b5f3d3c8a4b8e8f8e8e', name: 'Dr. Emily Carter', role: 'teacher' },
  'student_token': { id: '652f8b5f3d3c8a4b8e8f8f8f', name: 'John Doe', role: 'student' }
};

const auth = async (req, res, next) => {
  try {
    // 1. Look for the 'Authorization' header.
    const authHeader = req.header('Authorization');

    // 2. Check if the header exists and is in the 'Bearer <token>' format.
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization denied. No token provided.' });
    }

    // 3. Extract the token from the header.
    const token = authHeader.replace('Bearer ', '');

    // In a real app with JWT, you would verify the token here:
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded._id);

    // For our demo, we look up the token in our mock user object:
    // const user = mockUsers[token];
    if (!req.user) {
      return res.status(401).json({ message: 'Authorization denied. Invalid token.' });
    }
    
    // 4. Attach the user object to the request and proceed.
    // req.user = user;
    next();

  } catch (error) {
    res.status(401).json({ message: 'Token is not valid or server error.' });
  }
};

// The isTeacher middleware does not need changes. It's already correct.
const isTeacher = (req, res, next) => {
  if (req.user && req.user.role === 'teacher') {
    return next();
  }
  return res.status(403).json({ message: 'Access denied. Teacher role required.' });
};

module.exports = { auth, isTeacher, authenticateToken };