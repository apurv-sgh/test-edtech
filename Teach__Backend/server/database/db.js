const express = require('express');
const mongoose = require('mongoose');

// db connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/edtech_platform', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));