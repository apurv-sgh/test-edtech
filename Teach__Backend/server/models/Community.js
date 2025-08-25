const mongoose = require('mongoose');

const communitySchema = new mongoose.Schema({
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    team: {
        type: String,
        required: true
    },
    bio: {
        type: String,
        required: true
    },
    logo: {
        type: String
    },
}, { timestamps: true });

module.exports = mongoose.model('Community', communitySchema);