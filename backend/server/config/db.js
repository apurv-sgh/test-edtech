const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
      try{
           mongoose.connect('mongodb://localhost:27017/edtech_platform');
           console.log('Mongo connected');
      }
      catch (error) {
            console.error(error);
            process.exit();
      }
}

module.exports = connectDB;