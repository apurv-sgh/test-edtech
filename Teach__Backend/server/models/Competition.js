const mongoose = require('mongoose');
const CompetitionSchema = new mongoose.Schema({
title: {
type: String,
// required: true,
},
category: {
type: String,
enum: ['Coding', 'Quiz', 'Hackathon'], // Enforce specific categories
required: true,
},
prize: {
type: String,
required: true,
},
startsOn: {
type: Date,
required: true,
},
endsOn: {
type: Date,
required: true,
},
teacher: { // The teacher who created the competition
type: mongoose.Schema.Types.ObjectId,
ref: 'Teacher',
required: true,
}
}, {
timestamps: true,
toJSON: { virtuals: true }, // Ensure virtuals are included when sending JSON
toObject: { virtuals: true }
});
// A "virtual" field that is not stored in the database
// It dynamically calculates the status based on the current date
CompetitionSchema.virtual('status').get(function() {
const now = new Date();
if (now < this.startsOn) {
return 'upcoming';
} else if (now >= this.startsOn && now <= this.endsOn) {
return 'live';
} else {
return 'past';
}
});
module.exports = mongoose.model('Competition', CompetitionSchema);