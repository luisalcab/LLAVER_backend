'use strict'

module.exports = {
    api: {
        port: process.env.PORT || 3002  
    },
    frontend: {
        port: process.env.PORT || 3000 || 3001 || 3002 || 3004 || 3005
    },
    mysql: {
        host: process.env.MYSQL_HOST || 'localhost',
        database: process.env.MYSQL_HOST || 'proyecto_geriatra',
        user: process.env.MYSQL_HOST || 'root',
        password: process.env.MYSQL_HOST || 'Roter12'
    },
    jwt: {
        key: "Clave/Ultra_Secreta891",
        time: 14440
    },
    hash: {
        times: 8
    } 
}