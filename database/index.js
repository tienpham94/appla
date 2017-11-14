'use strict';

var constants   = require('../config/constants');
var Mongoose 	= require('mongoose');

// Connect to the database
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/deploy_me')

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
