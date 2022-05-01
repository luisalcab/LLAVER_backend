'use strict'
const { query } = require('../../conection_store/controllerStore.js');
const tablas = require('../utils/tablasDatabase.js');
const responseFormat = require('../utils/response.js');

/*
*/

async function addNewCarer(data){
    for (const key in data){
        if(data[key] == "") return responseFormat.response("Un campo esta vacio", 400, 1); 
    } 


    if(data["telefono"] == undefined || data["apellido"] == undefined)
        return responseFormat.response("JSON no valido", 400, 2); 
     
    

    let re = new RegExp(/(^\d{2}\-\d{4}\-\d{4}$)|(^\d{3}\-\d{3}\-\d{4}$)/, 's');

    /*
        Formato valido para esta expresion
        33-4557-7555
        124-758-7842
    */
    if(!(re.test(data.telefono)))
        return responseFormat.response(`El formato del telefono no es valido, formatos permitidos: 
                                        xx-xxxx-xxxx
                                        xxx-xxx-xxxx`, 400, 1); 
                                        adad
 
        return await verifyRepitName(data)
        .then(async ([ existName ]) => {
            if(existName.carers==0){
                return await addCarer(data)
                .then(() => {
                    return responseFormat.response("Se ha agregado al cuidador exitosamente", 201, 0);
                })
                .catch((error) => {
                    return responseFormat.response(error, 400, 3)
                });
            } else {
                return responseFormat.response("El \"nombre completo\" que se esta intentando poner ya existe", 400, 2);
            }
        })
        .catch((error) => {
            return responseFormat.response(error, 400, 3)
        });
    
}

async function getCarerById(element){
    return await getCarerId(element)
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

async function getCarerByName(data){
    if(data.nombre == "")  return responseFormat.response("El campo de esta vacio", 400, 1); 

    let resData = await getCarerName(data);
    if(resData[0] != undefined){
        return responseFormat.responseData(
            resData,
            200,
            2
        )
    } else {
        return responseFormat.responseData(
            [],
            404,
            0
        )
    }
}


async function updateDataCarer(data, element){
    return await updateCarer(data, element)
    .then(() => {
        return responseFormat.response("El cuidado se a modificado exitosamente", 200, 0);
    })
    .catch((error) => {
        return responseFormat.response(error, 400, 3);
    });
    
}

//Queries
async function addCarer(data){
    await query(`
        INSERT INTO ${ tablas.CUIDADORES } (nombre, apellido, telefono) 
            VALUES 
        ('${ data.nombre }', '${ data.apellido }', '${ data.telefono }');
    `);
}

async function getCarerId(element){
    return await query(`
        SELECT idCuidador, nombre, apellido, telefono 
        FROM ${ tablas.CUIDADORES } 
        WHERE idCuidador IN(${element.idCuidador});
    `);
}

async function getCarerName(data){
    return await query(`
        SELECT idCuidador, nombre, apellido, telefono
        FROM ${ tablas.CUIDADORES } 
        WHERE  CONCAT(nombre, apellido) LIKE '%${data.nombre}%';
    `);
}


async function updateCarer(data, element){
    await query(`
        UPDATE ${ tablas.CUIDADORES } SET 
        nombre = '${ data.nombre }', apellido = '${ data.apellido }', telefono = '${ data.telefono }'
        WHERE (idCuidador IN(${ element.idCuidador }));
    `);
}

async function verifyRepitName(data){
    return await query(`SELECT COUNT(idPaciente) AS carers FROM ${ tablas.CUIDADORES } 
                        WHERE CONCAT(nombre, apellido) = CONCAT('${ data.nombre }', '${ data.apellido }');`); 
}

module.exports	= {
    addNewCarer,
    getCarerById,
    getCarerByName,
    updateDataCarer
}