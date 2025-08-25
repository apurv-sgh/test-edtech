const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticateToken = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Handle both user and teacher tokens
    let authenticatedUser = null;
    
    if (decoded.userId) {
      authenticatedUser = await User.findById(decoded.userId).select('-password');
    } else if (decoded.teacherId) {
      const Teacher = require('../models/Teacher');
      authenticatedUser = await Teacher.findById(decoded.teacherId).select('-password');
    }
    
    if (!authenticatedUser) {
      return res.status(401).json({ message: 'Invalid token.' });
    }

    req.user = { ...decoded, ...authenticatedUser.toObject() };
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token.' });
  }
};

// const requireRole = (roles) => {
//   return (req, res, next) => {
//     if (!req.user) {
//       return res.status(401).json({ message: 'Authentication required.' });
//     }

//     if (!roles.includes(req.user.role)) {
//       return res.status(403).json({ message: 'Insufficient permissions.' });
//     }

//     next();
//   };
// };

// module.exports = {
//   authenticateToken,
//   requireRole
// };
// middleware/auth.js

// In a real app, you would fetch the user from the database.
// For this example, we'll simulate user objects.
const mockUsers = {
  'teacher_token': { id: '652f8b5f3d3c8a4b8e8f8e8e', name: 'Dr. Emily Carter', role: 'teacher' },
  'student_token': { id: '652f8b5f3d3c8a4b8e8f8f8f', name: 'John Doe', role: 'student' }
};

const auth = (req, res, next) => {
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
    // req.user = await User.findById(decoded.id);

    // For our demo, we look up the token in our mock user object:
    const user = mockUsers[token];
    if (!user) {
      return res.status(401).json({ message: 'Authorization denied. Invalid token.' });
    }
    
    // 4. Attach the user object to the request and proceed.
    req.user = user;
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