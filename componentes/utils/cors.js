const config = require('../../config.js')

//Cors
var whilelist = [`http://localhost:${ config.frontend.port }`];
var corsOptions = {
    origin: function(origin, callback) {
        if(whilelist.indexOf(origin) !== -1 || origin == undefined){
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}

module.exports = {
    corsOptions
}