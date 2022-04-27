'use strict'
const { query } = require('../../conection_store/controllerStore.js');
const tablas = require('../utils/tablasDatabase.js');


async function updateDataDoctor(data, element){
    await updateDoctor(data, element);
    return 1
}

async function deleteDataDoctor(element){
    await deleteDoctor(element);
    return 1;
}

async function getDoctorById(data){
    return await getDoctorId(data);
}

async function getDoctorByName(data){
    return await getDoctorName(data);
}

// Queries
async function updateDoctor(data, element){
    await query(`
        UPDATE ${tablas.DOCTORES} SET nombre = '${ data.nombre }', apellido = '${ data.apellido }', email = '${ data.email }' 
        WHERE (idDoctor IN(${ element.idDoctor }));
    `)
}

async function deleteDoctor(element){
    await query(`
        DELETE FROM ${tablas.DOCTORES} WHERE (idDoctor IN(${ element.idDoctor }));
    `);
}

async function getDoctorId(data){ 
    return await query(`
        SELECT idDoctor, nombre, apellido, email FROM ${ tablas.DOCTORES } WHERE idDoctor IN(${data.idDoctor});
    `);
}

async function getDoctorName(data){
    return await query(`
        SELECT idDoctor, nombre, apellido, email FROM ${ tablas.DOCTORES } 
        WHERE  CONCAT(nombre, apellido) LIKE '%${data.nombre}%';
    `)
}

module.exports	= {
    updateDataDoctor,
    deleteDataDoctor,
    getDoctorById,
    getDoctorByName

}