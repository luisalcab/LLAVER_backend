'use strict'
const { query } = require('../../conection_store/controllerStore.js');
const tablas = require('../utils/tablasDatabase.js');

async function addNewPatient(data){
    await addPatient(data);
    return 1
}

async function getPatientById(element){
    return await getPatientId(element);
}

async function getPatientByName(data){
    return await getPatientName(data);
}

async function updateDataPatient(data, element){
    await updatePatient(data, element);
    return 1
}



//Queries
async function addPatient(data){
    await query(`
        INSERT INTO ${ tablas.PACIENTES } (nombre, apellido, escolaridad, fechaNacimiento, sexo, idDoctor) 
            VALUES 
        ('${ data.nombre }', '${ data.apellido }', '${ data.escolaridad }', '${ data.fechaNacimiento }', '${ data.sexo }', '${ data.idDoctor }');
    `)
}

async function getPatientId(element){
    return await query(`
        SELECT idPaciente, nombre, apellido, escolaridad, fechaNacimiento, sexo, idDoctor FROM ${ tablas.PACIENTES } 
        WHERE idPaciente IN(${element.idPaciente});
    `);
}

async function getPatientName(data){
    return await query(`
        SELECT idPaciente, nombre, apellido, escolaridad, fechaNacimiento, sexo, idDoctor 
        FROM ${ tablas.PACIENTES } 
        WHERE  CONCAT(nombre, apellido) LIKE '%${data.nombre}%';
    `)
}

async function updatePatient(data, element){
    await query(`
        UPDATE ${ tablas.PACIENTES } SET 
        nombre = '${ data.nombre }', apellido = '${ data.apellido }', escolaridad = '${ data.escolaridad }', 
        fechaNacimiento='${ data.fechaNacimiento }', sexo='${ data.sexo }', idDoctor='${ data.idDoctor }'
        WHERE (idPaciente IN(${ element.idPaciente }));
    `)
}

module.exports	= {
    addNewPatient,
    getPatientById,
    getPatientByName,
    updateDataPatient
}