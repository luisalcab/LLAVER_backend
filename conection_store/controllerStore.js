const connection = require('./connectionStore.js');

function query(query){
    return new Promise((resolve, reject) => {
        connection.query(`${query}`, (err, result) => {
            if(err){
                console.log(`[ERROR] ${err}`); 
                return reject;
            }else {
                return resolve(result);
            }  
        })
    })
}

module.exports = {
    query
};