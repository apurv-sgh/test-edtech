const mongoose = require('mongoose');
require('dotenv').config();

// db connection
const connectDB = async () => {
  try {
    mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/edtech_platform', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected')
  }
  catch (error) {
    console.log('MongoDB connection error:', error)
    process.exit();
  }
}

module.exports = connectDB;