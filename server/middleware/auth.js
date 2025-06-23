
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

const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions.' });
    }

    next();
  };
};

module.exports = {
  authenticateToken,
  requireRole
};
