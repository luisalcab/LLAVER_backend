const connection = require('./connectionStore.js');

function query(query){
    return new Promise((resolve, reject) => {
        connection.query(`${query}`, (err, result) => {
            if(err){
                // console.log(`[ERROR] ${err}`); 
                let error = 0
                if(err.errno == 1452)
                    error = "Se esta intentando asingar a una llave foraena que no existe"
                    
                if(err.errno == 1054)
                    error = "Se paso como parametro un dato diferente al permitido"
                
                if(err.errno == 1366)
                    error = "Se esta intentando ingresar un dato no valido para un campo"

                if(err.errno == 1062)
                    error = err.sqlMessage
                    
                // console.log(err.errno)                
                // console.log(err)                
                // console.log(error)                
                return reject(error);
            }else {
                return resolve(result);
            }  
        })
    })
}

module.exports = {
    query
};