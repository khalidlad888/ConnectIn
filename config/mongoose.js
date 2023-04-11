const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/faceloop_development');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error in connecting database'));

db.once('open', function(){
    console.log('Connected to database MongoDB');
});


module.exports = db;