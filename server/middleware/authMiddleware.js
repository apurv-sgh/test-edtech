const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const Student = require('../models/Student');
require('dotenv').config();

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

// Middleware to check if the user is an admin
const isAdmin = (req, res, next) => {
    if (req.user && req.user.userType === 'admin') {
        next();
    } else {
        return res.status(403).json({ message: 'Access denied, admin only' });
    }
};

module.exports = { protect, isAdmin };
// This code defines middleware functions for authentication and authorization in a Node.js application using JWT. The `protect` function checks for a valid JWT token in the request headers, verifies it, and attaches the user information to the request object. If the token is invalid or not present, it responds with a 401 status. The `isAdmin` function checks if the authenticated user has an admin role, allowing access to certain routes only for admins. If not, it responds with a 403 status. Both functions are exported for use in other parts of the application.