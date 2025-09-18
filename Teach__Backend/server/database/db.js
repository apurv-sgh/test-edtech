const express = require('express');
const mongoose = require('mongoose');

// db connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://zegnitetestserver_db_user:ImDkOpPZVIjcVaXr@teacherdatabase.nujbpdo.mongodb.net/teacherdatabase?retryWrites=true&w=majority',
//                  {
//   // useNewUrlParser: true,
//   // useUnifiedTopology: true,
// }    
                )
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));
