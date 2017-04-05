'use strict';

let mongoose = require('mongoose');

//URL for docker deployment.
//let dbURL = 'mongo/away';

// URL for local deployment.
let dbURL = (process.env.MONGO_HOST || 'mongodb://localhost:27017') + '/template';

mongoose.connect(dbURL);

mongoose.connection.on('connected', () => {
    console.log('connected mongo on ' + dbURL);
});

mongoose.connection.on('error', (error) => {
    console.log('connect error : ' + error);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose default connection disconnected');
});

// If the Node process ends, close the Mongoose connection 
process.on('SIGINT', () => {
    mongoose.connection.close(() => {
        console.log('Mongoose default connection disconnected through app termination');
        process.exit(0);
    });
});


