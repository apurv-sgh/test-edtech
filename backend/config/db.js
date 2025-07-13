const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
      try{
           // mongoose.connect('mongodb://127.0.0.1:27017/edtec?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.8');
           // console.log('Mongo connected');

       mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
          })
          .then(() => console.log('Mongo connected'))
          .catch((err) => console.error('Mongo connection error:', err));
            
      }
      catch (error) {
            console.error(error);
            process.exit();
      }
}

module.exports = connectDB;
