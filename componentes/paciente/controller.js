'use strict'
const { query } = require('../../conection_store/controllerStore.js');
const tablas = require('../utils/tablasDatabase.js');
const responseFormat = require('../utils/response.js');

async function addNewPatient(data){
    for (const key in data){
        if(data[key] == "") return responseFormat.response("Un campo esta vacio", 400, 1); 
    } 
        
    let [ existName ] = await verifyRepitName(data);
    if(existName.patients==0){
        return await addPatient(data)
        .then(() => {
            return responseFormat.response("Se ha agregado al paciente exitosamente", 201, 0);
        })
        .catch((error) => {
            return responseFormat.response(error, 400, 3)
        });
    } else {
        return responseFormat.response("El 'nombre completo' que se esta intentando poner ya existe", 400, 2);
    }
}

async function getPatientById(element){
    return await getPatientId(element)
    .then((data) => {
        if(data[0] != undefined){
            return responseFormat.responseData(
                data,
                200,
                1
            )
        } else {
            return responseFormat.responseData(
                [],
                200,
                0
            )
        }
    })
    .catch((error) => {
        return responseFormat.response(error, 400, 2);
    });

}

async function getPatientByName(data){
    // if(data.nombre == "")  return responseFormat.response("El campo de esta vacio", 400, 1); 

    let searchActiveAndInactives = "AND status = 1";

    if(data.ademasInactivos == 1)
        searchActiveAndInactives = ""

    return await getPatientName(data, searchActiveAndInactives)
    .then((values) => {
        return responseFormat.responseData(values, 200, 0);
    })
    .catch((error) => {
        return responseFormat.response(error, 400, 3);
    });
}

async function updateDataPatient(data, element){
    let [ currentPatient ] = await getPatientId(element);
    
    //Fill all the empty fields
    for (const key in data) 
        if(data[key] != "")
            currentPatient[key] = data[key]

    
    //Verify that the name does not exist
    if(data.nombre != "" || data.apellido != ""){
        let [ existPatient ] = await verifyRepitName(currentPatient);
        if (existPatient.patients > 0){
            return responseFormat.response("Se esta intentando poner un nombre que ya existe", 200, 1)
        }
    }

    return await updatePatient(currentPatient, element)
    .then(() => {
        return responseFormat.response("Paciente modificado exitosamente", 200, 0);
    })
    .catch((error) => {
        return responseFormat.response(error, 400, 3);
    });
    
}

async function activateStatusById(element){
    return await activateStatus(element)
    .then(() => {
        return responseFormat.response("Se ha cambiado el estatus a 'activo' del paciente", 200, 0);
    })
    .catch((error) => {
        return responseFormat.response(error, 400, 3);
    })
}

async function desactivateStatusById(element){
    return await desactivateStatus(element)
    .then(() => {
        return responseFormat.response("Se ha cambiado el estatus a 'desactivo' del paciente", 200, 0);
    })
    .catch((error) => {
        return responseFormat.response(error, 400, 3);
    });
}

//Queries
async function addPatient(data){
    await query(`
        INSERT INTO ${ tablas.PACIENTES } (nombre, apellido, escolaridad, fechaNacimiento, sexo, idDoctor) 
            VALUES 
        ('${ data.nombre }', '${ data.apellido }', '${ data.escolaridad }', '${ data.fechaNacimiento }', '${ data.sexo }', '${ data.idDoctor }');
    `);
}

async function getPatientId(element){
    return await query(`
        SELECT idPaciente, nombre, apellido, escolaridad, fechaNacimiento, sexo, idDoctor FROM ${ tablas.PACIENTES } 
        WHERE idPaciente IN(${element.idPaciente});
    `);
}

async function getPatientName(data, searchActiveAndInactives){
    return await query(`
        SELECT idPaciente, nombre, apellido, escolaridad, fechaNacimiento, sexo, idDoctor, status
        FROM ${ tablas.PACIENTES } 
        WHERE  CONCAT(nombre, apellido) LIKE '%${ data.nombre }%' ${ searchActiveAndInactives };
    `);
}

async function updatePatient(data, element){
    await query(`
        UPDATE ${ tablas.PACIENTES } SET 
        nombre = '${ data.nombre }', apellido = '${ data.apellido }', escolaridad = '${ data.escolaridad }', 
        fechaNacimiento='${ data.fechaNacimiento }', sexo='${ data.sexo }', idDoctor='${ data.idDoctor }'
        WHERE (idPaciente IN(${ element.idPaciente }));
    `);
}

async function verifyRepitName(data){
    return await query(`SELECT COUNT(idPaciente) AS patients FROM ${ tablas.PACIENTES } 
                        WHERE CONCAT(nombre, apellido) = CONCAT('${ data.nombre }', '${ data.apellido }')`); 
}

async function activateStatus(element){
    await query(`
        UPDATE ${ tablas.PACIENTES } SET status = '1'
        WHERE (idPaciente IN(${ element.idPaciente }));
    `);
}

async function desactivateStatus(element){
    await query(`
        UPDATE ${ tablas.PACIENTES } SET status = '0'
        WHERE (idPaciente IN(${ element.idPaciente }));
    `);
}

module.exports	= {
    addNewPatient,
    getPatientById,
    getPatientByName,
    updateDataPatient,
    activateStatusById,
    desactivateStatusById
}