const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const StudentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false
    },
    userType: {
        type: String,
        enum: ['Student', 'Teacher'],
        default: 'Student'
    },
    profilePicture: {
        type: String
    },
    dateOfBirth: {
        type: Date
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other']
    },
    phone: {
        type: String
    },
    address: {
        street: String,
        city: String,
        state: String,
        country: String,
        zipCode: String
    },
    education: [{
        institution: String,
        degree: String,
        field: String,
        startYear: Number,
        endYear: Number
    }],
    interests: [{
        type: String
    }],
    enrolledCourses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date
    }
}, {
    timestamps: true
});

// Encrypt password using bcrypt
StudentSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});


// Sign JWT and return
StudentSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({ id: this._id, type: this.userType }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '30d'
    });
};

// Match user entered password to hashed password in database
StudentSchema.methods.matchPassword = async function (enteredPassword) {
    if (!enteredPassword || !this.password) {
        console.log("enteredPassword:", enteredPassword);
        console.log("this.password exists:", !!this.password);
        throw new Error('Password comparison failed: missing values');
    }

    return await bcrypt.compare(enteredPassword, this.password);
};



module.exports = mongoose.model('Student', StudentSchema);