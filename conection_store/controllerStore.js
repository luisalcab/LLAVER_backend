const mysql = require('mysql');
const config = require('../config.js');


const dbconfig = {
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database
}

let pool = mysql.createPool(dbconfig);

async function  query(query){
    return new Promise(async (resolve, reject) => {
        pool.query(`${query}`, (err, result) => {
            if(err){
                let error = 0
                if(err.errno == 1452)
                    error = "Se esta intentando asingar a una llave foraena que no existe"
                    
                if((err.errno == 1054) || (err.errno == 1064))
                    error = "Se paso como parametro un dato diferente al permitido"
                
                if(err.errno == 1366)
                    error = "Se esta intentando ingresar un dato no valido para un campo"

                if(err.errno == 1292)
                    error = "Formato invalido, error 1292"

                if(err.errno == 1062)
                    error = err.sqlMessage      

                return reject(error); //Todo este proceso es para manejar errores de base de datos
            }else {
                return resolve(result); //Retornamos el resultado obtenido
            }  
        })
    })
}

module.exports = {
    query
};