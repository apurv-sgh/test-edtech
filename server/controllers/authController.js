const Student = require('../models/Student');
const asyncHandler = require('express-async-handler');

// @desc    Register a new teacher
// @route   POST /api/auth/register-teacher
// @access  Public
const registerTeacher = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    // Check if teacher exists
    const userExists = await Student.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    // Create teacher
    const user = await Student.create({
        name,
        email,
        password,
        userType: 'Teacher'
    });

    if (user) {
        const token = user.getSignedJwtToken();
        res.status(201).json({
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                userType: user.userType,
            }
        });
    } else {
        res.status(400);
        throw new Error('Invalid teacher data');
    }
});

// @desc    Register a new student
// @route   POST /api/auth/register
// @access  Public
const registerStudent = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    // Check if student exists
    const userExists = await Student.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('Student already exists');
    }

    // Create student
    const user = await Student.create({
        name,
        email,
        password,
        userType: 'Student'
    });

    if (user) {
        const token = user.getSignedJwtToken();
        res.status(201).json({
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                userType: user.userType,
            },
            token: token
        });
    } else {
        res.status(400);
        throw new Error('Invalid student data');
    }
});

// @desc    Authenticate student & get token
// @route   POST /api/auth/login
// @access  Public
const loginStudent = asyncHandler(async (req, res) => {

    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password) {
        res.status(400);
        throw new Error('Please provide both email and password');
    }

    // Check for student email
    const user = await Student.findOne({ email }).select('+password');

    if (!user) {
        res.status(401);
        throw new Error('Invalid credentials');
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        res.status(401);
        throw new Error('Invalid credentials');
    }

    // Update last login
    user.lastLogin = Date.now();
    await user.save();

    const token = user.getSignedJwtToken();
    res.json({
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            userType: user.userType,
        },
        token: token
    });
});

// @desc Authenticate teacher & get token
// @route POST /api/teachers/login
// @access Public
const loginTeacher = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    // Check for teacher email and userType
    const user = await Student.findOne({ email, userType: 'Teacher' }).select('+password');

    if (!user) {
        res.status(401);
        throw new Error('Invalid credentials');
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        res.status(401);
        throw new Error('Invalid credentials');
    }

    user.lastLogin = Date.now();
    await user.save();

    const token = user.getSignedJwtToken();
    res.json({
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            userType: user.userType,
        },
        token: token
    });
});

// @desc    Get student profile
// @route   GET /api/auth/profile
// @access  Private
const getStudentProfile = asyncHandler(async (req, res) => {
    const student = await Student.findById(req.user._id);

    if (student) {
        res.json(student);
    } else {
        res.status(404);
        throw new Error('Student not found');
    }
});

// @desc    Update student profile
// @route   PUT /api/auth/profile
// @access  Private
const updateStudentProfile = asyncHandler(async (req, res) => {
    const student = await Student.findById(req.user._id);

    if (student) {
        student.name = req.body.name || student.name;
        student.email = req.body.email || student.email;
        student.profilePicture = req.body.profilePicture || student.profilePicture;
        student.dateOfBirth = req.body.dateOfBirth || student.dateOfBirth;
        student.gender = req.body.gender || student.gender;
        student.phone = req.body.phone || student.phone;
        student.address = req.body.address || student.address;
        student.education = req.body.education || student.education;
        student.interests = req.body.interests || student.interests;

        if (req.body.password) {
            student.password = req.body.password;
        }

        const updatedStudent = await student.save();

        res.json({
            _id: updatedStudent._id,
            name: updatedStudent.name,
            email: updatedStudent.email,
            profilePicture: updatedStudent.profilePicture,
            dateOfBirth: updatedStudent.dateOfBirth,
            gender: updatedStudent.gender,
            phone: updatedStudent.phone,
            address: updatedStudent.address,
            education: updatedStudent.education,
            interests: updatedStudent.interests,
            token: updatedStudent.getSignedJwtToken()
        });
    } else {
        res.status(404);
        throw new Error('Student not found');
    }
});

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    const student = await Student.findById(req.user._id).select('+password');

    if (!student) {
        res.status(404);
        throw new Error('Student not found');
    }

    // Check current password
    const isMatch = await student.matchPassword(currentPassword);

    if (!isMatch) {
        res.status(401);
        throw new Error('Current password is incorrect');
    }

    student.password = newPassword;
    await student.save();

    res.json({ message: 'Password updated successfully' });
});

// @desc    Logout student
// @route   POST /api/auth/logout
// @access  Public
const logoutStudent = asyncHandler(async (req, res) => {
    // If using cookies:
    // res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
});

module.exports = {
    registerStudent,
    registerTeacher,
    loginStudent,
    loginTeacher,
    getStudentProfile,
    updateStudentProfile,
    changePassword,
    logoutStudent
};