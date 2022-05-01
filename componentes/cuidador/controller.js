'use strict'
const { query } = require('../../conection_store/controllerStore.js');
const tablas = require('../utils/tablasDatabase.js');
const responseFormat = require('../utils/response.js');



async function addNewCarer(data){
    for (const key in data){
        if(data[key] == "") return responseFormat.response("Un campo esta vacio", 400, 1); 
    } 

    if(data["telefono"] == undefined || data["apellido"] == undefined || data["nombre"] == undefined)
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
            return responseFormat.responseData(data, 200, 1)
        } else {
            return responseFormat.responseData('El ID que ingreo no existe', 200, 0)
        }
    })
    .catch((error) => {
        return responseFormat.response(error, 400, 2);
    });

}

async function getCarerByName(data){
    if(data.nombre == "")  return responseFormat.response("El campo de esta vacio", 400, 1); 

    if(data["nombre"] == undefined)
    return responseFormat.response("JSON no valido", 400, 2);  

    let resData = await getCarerName(data);
    if(resData[0] != undefined){
        return responseFormat.responseData(resData, 200, 2)
    } else {
        return responseFormat.responseData('El nombre que ingreso no existe', 404, 0)
    }
}

async function updateDataCarer(data, element){
    if (JSON.stringify(data) === '{}')
        return responseFormat.response("No hubo información para actualizar", 400, 4)

    if(data["telefono"] == undefined || data["apellido"] == undefined || data["nombre"] == undefined)
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

        return await getCarerId(element)
            .then(async ([ currentCarer ]) => {
                //Fill all the empty fields
                for (const key in data) 
                    if(data[key] != "")
                        currentCarer[key] = `${data[key]}`

                //Verify that the name does not exist
                if(data.nombre != undefined || data.apellido != undefined){
                    if(data.nombre != "" || data.apellido != ""){
                        let [ existcarer ] = await verifyRepitName(currentCarer);
                        if (existcarer.carers > 0){
                            return responseFormat.response("Se esta intentando poner un nombre que ya existe", 200, 1)
                        }
                    }
                }
                
                return await updateCarer(currentCarer, element)
                .then(() => {
                    return responseFormat.response("Cuidador modificado exitosamente", 200, 0);
                })
                .catch((error) => {
                    return responseFormat.response(error, 400, 3)
                });
            })
        .catch((error) => {
            return responseFormat.response(error, 400, 3)
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
    return await query(`
        UPDATE ${ tablas.CUIDADORES } SET 
        nombre = '${ data.nombre }', apellido = '${ data.apellido }', telefono = '${ data.telefono }'
        WHERE (idCuidador IN(${ element.idCuidador }));
    `);
}

async function verifyRepitName(data){
    return await query(`SELECT COUNT(idCuidador) AS carers FROM ${ tablas.CUIDADORES } 
                        WHERE CONCAT(nombre, apellido) = CONCAT('${ data.nombre }', '${ data.apellido }');`); 
}

module.exports	= {
    addNewCarer,
    getCarerById,
    getCarerByName,
    updateDataCarer
}