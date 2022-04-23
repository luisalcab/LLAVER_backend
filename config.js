'use strict'

module.exports = {
    api: {
        port: process.env.API_PORT || 3002
    },
    frontend: {
        port: process.env.API_PORT || 3000 
    },
    mysql: {
        host: process.env.MYSQL_HOST || 'localhost',
        database: process.env.MYSQL_HOST || 'proyecto_geriatra',
        user: process.env.MYSQL_HOST || 'Tu usuario',
        password: process.env.MYSQL_HOST || 'Tu contraseña'
    }
}