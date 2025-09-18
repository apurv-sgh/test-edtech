const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
      try{
           // Prefer explicit env vars for deployed database.
           // Local fallback removed for deployment stability.
           // const isProduction = process.env.NODE_ENV === 'production';
           const uri = process.env.MONGO_URI || process.env.MONGODB_URI; // || (!isProduction ? 'mongodb://localhost:27017/edtec' : null);
           if (!uri) {
               throw new Error('MONGO_URI is not set. Provide a MongoDB connection string via env.');
           }
           console.log('[DB] NODE_ENV:', process.env.NODE_ENV || 'development');
           console.log('[DB] Using URI:', uri.replace(/:\/\/([^:]+):([^@]+)@/, '://<redacted>@'));
           await mongoose.connect(uri, {
               useNewUrlParser: true,
               useUnifiedTopology: true
           });
           const dbName = mongoose.connection && mongoose.connection.name;
           const dbHost = mongoose.connection && mongoose.connection.host;
           console.log(`[DB] Connected. Host: ${dbHost}, DB: ${dbName}`);
      }
      catch (error) {
            console.error('[DB] Connection error:', error.message);
            process.exit();
      }
}

module.exports = connectDB;