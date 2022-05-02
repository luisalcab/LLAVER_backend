const mysql = require('mysql');
const config = require('../config.js');


const dbconfig = {
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database
}

let connection;

async function handleCon(){
    connection = mysql.createConnection(dbconfig); //Creamos conexción
    connection.connect((err)=>{
        if(err){
            console.error('[db err]', err);
            setTimeout(handleCon(), 2000); //En caso de que haya problemas se manda a llamar de nuevo
        }else{
        }
    connection.on('error', err => {
            console.log('[db err]', err);
            if(err.code === 'PROTOCOL_CONNECTION_LOST'){
                handleCon(); //Manejamos el error de conexción perdida
            }else{
                throw error; //En caso de no solucionarse lanzamos un error
            }
        })
    })
}


async function  query(query){
    return await handleCon()
    .then(() => {
        return new Promise((resolve, reject) => {
            connection.query(`${query}`, (err, result) => {
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
                    connection.end()               
                    return reject(console.log("conexion cerrada")); //Todo este proceso es para manejar errores de base de datos
                }else {
                    connection.end();
                    return resolve(result); //Retornamos el resultado obtenido
                }  
            })
        })
    })
    .catch((error) => {
        console.log(error)
    })

}

module.exports = {
    query
};