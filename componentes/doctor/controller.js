'use strict'
const { query } = require('../../conection_store/controllerStore.js');
const tablas = require('../utils/tablasDatabase.js');
const responseFormat = require('../utils/response.js');

async function updateDataDoctor(data, element){
    if (JSON.stringify(data) === '{}')
       return responseFormat.response("No hubo información para actualizar", 400, 2)

    return await getDoctorId(element)
    .then(async ([ currentDoctor ]) => {
        //Fill all the empty fields
        for (const key in data) 
            if(data[key] != "")
                currentDoctor[key] = data[key]
       
        //Verify that the name does not exist
        if(data.nombre != undefined || data.apellido != undefined){
            if(data.nombre != "" || data.apellido != ""){
                let [ existDoctor ] = await verifyRepitName(currentDoctor);
                if (existDoctor.doctors > 0){
                    return responseFormat.response("Se esta intentando poner un nombre que ya existe", 200, 1)
                }
            }
        }

        // Verify that the email is in correct format
        let re = new RegExp(/(^([a-z]|[A-Z]|[0-9]|\.|\-)+\@(gmail|hotmail).com$)/, 's');
        if(!(re.test(data.email)))
            return responseFormat.response(`Formato de correo invalido, el correo solo puede contener numeros, 
            letras (tanto mayusculas como minusculas) y los simbolos: "." y "-".
            Ademas correo debe de finalizar con @gmail.com (tambien admite hotmail).
            El correo no puede tener espacios.`, 400, 4);

        return updateDoctor(currentDoctor, element)
        .then(() => {
            return responseFormat.response("Doctor modificado exitosamente", 200, 0);
        })
        .catch((error) => {
            return responseFormat.response(error, 400, 3);
        });
    })
    .catch((error) => {
        return responseFormat.response(error, 400, 3);
    });
}

async function deleteDoctorById(element){
    return await deleteDoctor(element)
    .then(() => {
        return responseFormat.response("Se ha borrado el doctor (y sus respectivas pacientes con sus consultas)", 200, 0);
    })
    .catch((error) => {
        return responseFormat.response(error, 400, 3);
    });
}

async function getDoctorById(data){
    return await getDoctorId(data)
    .then((value) => {
        return responseFormat.responseData(value, 200, 0);
    })
    .catch((error) => {
        return responseFormat.response(error, 400, 3);
    });
}

async function getDoctorByName(data){
    let searchActiveAndInactives = "AND status = 1";

    if(data.ademasInactivos == 1)
        searchActiveAndInactives = ""

    return await getDoctorName(data, searchActiveAndInactives)
    .then((values) => {
        return responseFormat.responseData(values, 200, 0)
    })
    .catch((error) => {
        return responseFormat.response(error, 400, 3)
    });
}

async function activateStatusById(element){
    return await activateStatus(element)
    .then(() => {
        return responseFormat.response("Se ha cambiado el estatus a 'activo' del doctor", 200, 0);
    })
    .catch((error) => {
        return responseFormat.response(error, 400, 3);
    })
}

async function desactivateStatusById(element){
    return await desactivateStatus(element)
    .then(() => {
        return responseFormat.response("Se ha cambiado el estatus a 'desactivo' del doctor", 200, 0);
    })
    .catch((error) => {
        return responseFormat.response(error, 400, 3);
    });
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
        SELECT  idDoctor, nombre, apellido, email, status FROM ${ tablas.DOCTORES } WHERE idDoctor IN(${data.idDoctor});
    `);
}

async function getDoctorName(data, searchActiveAndInactives){
    return await query(`
        SELECT idDoctor, nombre, apellido, email, status FROM ${ tablas.DOCTORES } 
        WHERE  CONCAT(nombre, apellido) LIKE '%${data.nombre}%' ${ searchActiveAndInactives };
    `)
}

async function verifyRepitName(data){
    return await query(`SELECT COUNT(idDoctor) AS doctors FROM ${ tablas.DOCTORES } WHERE CONCAT(nombre, apellido) = CONCAT('${ data.nombre }', '${ data.apellido }')`); 
}

async function activateStatus(element){
    await query(`
        UPDATE ${ tablas.DOCTORES } SET status = '1'
        WHERE (idDoctor IN(${ element.idDoctor }));
    `);
}

async function desactivateStatus(element){
    await query(`
        UPDATE ${ tablas.DOCTORES } SET status = '0'
        WHERE (idDoctor IN(${ element.idDoctor }));
    `);
}

module.exports	= {
    updateDataDoctor,
    deleteDoctorById,
    getDoctorById,
    getDoctorByName,
    activateStatusById,
    desactivateStatusById

}