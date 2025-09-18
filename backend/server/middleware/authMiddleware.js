const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const Student = require('../models/Student');
const User = require('../models/Counsellor');
const Teacher = require('../models/Teacher');
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
      
      // Normalize role from token: support `role` or `type`, any case
      const tokenRoleRaw = decoded.role || decoded.type || decoded.userType;
      const tokenRole = tokenRoleRaw ? String(tokenRoleRaw).toLowerCase() : undefined;
      
      console.log('Auth middleware - decoded token:', decoded); // Debug log
      console.log('Auth middleware - normalized role:', tokenRole); // Debug log
      
      // Try to find user robustly by ID across user collections
      let user = null;
      // Prefer student first since most routes expect students
      user = await Student.findById(decoded.id).select('-password');
      if (!user && tokenRole === 'teacher') {
        user = await Teacher.findById(decoded.id).select('-password');
      }
      if (!user && (tokenRole === 'counsellor' || tokenRole === 'industry_expert')) {
        user = await User.findById(decoded.id).select('-password');
      }
      // As a fallback, try other models if still not found
      if (!user) {
        user = await Teacher.findById(decoded.id).select('-password') || user;
      }
      if (!user) {
        user = await User.findById(decoded.id).select('-password') || user;
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
      
      // If a specific role is required, check it
      if (role) {
        // Determine effective role string for this user
        let effectiveRole = tokenRole;
        if (!effectiveRole) {
          effectiveRole = user.role ? String(user.role).toLowerCase() : (user.userType ? String(user.userType).toLowerCase() : undefined);
        }
        console.log('Auth middleware - checking role:', { required: role, userRole: effectiveRole }); // Debug log
        if (!effectiveRole || effectiveRole !== role) {
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