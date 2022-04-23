'use strict'
const connect = require('../../conection_store/controllerStore.js');
const tablas = require('../utils/tablasDatabase.js');

async function getDoctors(){
    return await getAllDoctors();
}

async function addNewDoctor(data){
    if(data.nombre == ""){
        return 2 //Algun dato esta vacio        
    } else {
        await addDoctor(data);
        return 1; //Todo ok
    }
}

// Queries
async function getAllDoctors(){ 
    return await connect.query(`
        SELECT * FROM ${ tablas.DOCTORES };
    `);
}

async function addDoctor(data){
    await connect.query(`
    INSERT INTO ${ tablas.DOCTORES } (nombre, apellido, password, email) 
        VALUES ('${data.nombre}', '${data.apellido}', '${data.password}', '${data.email}');
    `);
}

module.exports	= {
    addNewDoctor,
    getDoctors
}