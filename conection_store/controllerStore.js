const connection = require('./connectionStore.js');

function query(query){
    return new Promise((resolve, reject) => {
        connection.query(`${query}`, (err, result) => {
            if(err){
                // console.log(`[ERROR] ${err}`); 
                let re = new RegExp(/Error: ER_DUP_ENTRY/, 's');
                let re2 = new RegExp(/Error: ER_NO_DEFAULT_FOR_FIELD/, 's');
                let error = 0
                if(re.test(err)){
                    error = 1;
                    // console.log('Dato duplicado')
                }
                if(re2.test(err)){
                    error = 2;
                    // console.log('Dato nulo')
                }
                
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