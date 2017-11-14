'use strict';

var constants   = require('../config/constants');
var Mongoose 	= require('mongoose');

// Connect to the database
mongoose.connect(process.env.MONGODB_URI || 'mongodb://heroku_wnj6mwlh:nfkljht5lu3aqt5erk3si3qh9h@ds257495.mlab.com:57495/heroku_wnj6mwlh')

// Throw an error if the connection fails
Mongoose.connection.on('error', function(err) {
    if(err) throw err;
});

Mongoose.Promise = global.Promise;

module.exports = { Mongoose: Mongoose,
    models: {
        user: require('./schemas/User.js'),
        room: require('./schemas/Room.js'),
        message: require('./schemas/Message.js')
    }
};
