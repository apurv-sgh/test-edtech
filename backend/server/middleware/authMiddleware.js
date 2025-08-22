const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const Student = require('../models/Student');
const User = require('../models/Counsellor'); 
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key_here_2024';

const protect = asyncHandler(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // console.log(decoded);
            
            req.user = await Student.findById(decoded.id).select('-password');
            if (!req.user) {
                res.status(401);
                throw new Error('Not authorized, user not found');
            }

            return next(); // Exit early if all good
        } catch (error) {
            console.error(error);
            res.status(401);
            throw new Error('Not authorized, token failed');
        }
    }

    // This only runs if the "Bearer" condition was false
    res.status(401);
    throw new Error('Not authorized, no token');
});

const authMiddleware = (role) => asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      
      console.log('Auth middleware - decoded token:', decoded); // Debug log
      console.log('Auth middleware - token payload:', { id: decoded.id, role: decoded.role }); // Debug log
      
      let user = null;
      if (['counsellor', 'industry_expert'].includes(decoded.role)) {
        user = await User.findById(decoded.id).select('-password');
      } else if (decoded.role === 'student') {
        user = await Student.findById(decoded.id).select('-password');
      } else if (decoded.role === 'teacher') {
        user = await Teacher.findById(decoded.id).select('-password');
      } else if (decoded.role === 'admin') {
        // For admin, you may have a separate Admin model or flag on Student/Teacher
        user = await Student.findById(decoded.id).select('-password');
        if (!user || user.userType !== 'admin') {
          return res.status(403).json({ message: 'Access denied, admin only' });
        }
      }
      
      console.log('Auth middleware - found user:', user ? { id: user._id, userType: user.userType, role: user.role } : 'No user found'); // Debug log
      
      if (!user) {
        res.status(401);
        throw new Error('Not authorized, user not found');
      }
      req.user = user;
      // Ensure _id is available for consistency
      if (req.user && !req.user._id && req.user.id) {
        req.user._id = req.user.id;
      }
      console.log('Auth middleware - final user object:', { id: req.user._id, userType: req.user.userType, role: req.user.role });
      // If role is specified, check it
      if (role) {
        let userRole;
        if (['counsellor', 'industry_expert'].includes(decoded.role)) {
          userRole = user.role;
        } else {
          userRole = user.userType ? user.userType.toLowerCase() : 'student';
        }
        console.log('Auth middleware - checking role:', { required: role, userRole }); // Debug log
        if (userRole !== role) {
          return res.status(403).json({ message: `Access denied, ${role} only` });
        }
      }
      return next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      console.error('Token received:', token ? token.substring(0, 20) + '...' : 'No token');
      console.error('JWT_SECRET available:', !!JWT_SECRET);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }
  res.status(401);
  throw new Error('Not authorized, no token');
});

// Middleware to check if the user is an admin
const isAdmin = (req, res, next) => {
    if (req.user && req.user.userType === 'admin') {
        next();
    } else {
        return res.status(403).json({ message: 'Access denied, admin only' });
    }
};

module.exports = { protect, authMiddleware, isAdmin };
// This code defines middleware functions for authentication and authorization in a Node.js application using JWT. The `protect` function checks for a valid JWT token in the request headers, verifies it, and attaches the user information to the request object. If the token is invalid or not present, it responds with a 401 status. The `isAdmin` function checks if the authenticated user has an admin role, allowing access to certain routes only for admins. If not, it responds with a 403 status. Both functions are exported for use in other parts of the application.