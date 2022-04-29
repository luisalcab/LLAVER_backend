'use strict'
const { query } = require('../../conection_store/controllerStore.js');
const tablas = require('../utils/tablasDatabase.js');
const responseFormat = require('../utils/response.js');
const { EXAMENES } = require('../utils/tablasDatabase.js');
const { format } = require('express/lib/response');
async function createNewConsult(data, element){
    for (const key in data){
        if(data[key] == "") return responseFormat.response("Un campo esta vacio", 400, 1); 
    }  
    
    let [ patient ] = await getPatientId(data);
    if(patient.status == 0)
        return responseFormat.response("Se esta intentando crear una consulta para un paciente con status inactivo", 200, 2); 
    
    let [ doctor ] = await getDoctorId({idDoctor: element});
    if(doctor.status == 0)
        return responseFormat.response("No se puede crear una consulta para un doctor con estatus inactivo", 200, 2); 
    
    return await createConsult(data, element)
    .then(([ [ data ] ]) => {
        if(data.repetido != undefined){
            return responseFormat.response("Se esta intentando agregar la misma consulta 2 veces", 200, 2);
        } else {
            return responseFormat.responseData(data, 200, 0);
        }
    })
    .catch((error) => {
        return responseFormat.response(error, 400, 3);
    });
}

async function getAllExamns(){
    return await getExamns()
    .then((data) => {
            return responseFormat.responseData(data, 200, 0)
    })
    .catch((error) => {
        return responseFormat.response(error, 400, 1);   
    }); 
}

async function getExamnQuestionsById(element){
    // var [ examn ] = await getExamenId(element);
    // var examnSections = await getExamnSection(element);
    
    // var questions = [];
    // for(var i=0; i< examnSections.length; i++){
        
    //     questions = await getQuestions(examnSections[i]);
    //     examnSections[i]['preguntas'] = questions; 
    // }

    // var examnComplete = {
    //     examn,
    //     examnSections
    // }

    // return examnComplete; 
    var examn = await getExamenId(element)
    .then(([ examn ]) => {
        return  getExamnSection(element)
        .then(async ( examnSections ) => {
            let questions = [];
            for(let i=0; i< examnSections.length; i++){
        
                questions = await getQuestions(examnSections[i]);
                examnSections[i]['preguntas'] = questions; 
            }
            return {
                examn,
                examnSections
            };
        })
        .catch((error) =>{
            return responseFormat.response(error, 400, 3);
        });   
    })
    .catch((error) =>{
        return responseFormat.response(error, 400, 3);
    });
    return responseFormat.responseData(examn, 200, 0)
}

async function setExamnQuestions(data, element){


    //Verify if there is not an empty element component of the answer
    let verify = 0;
    data.respuestasExamen.forEach(element => {
        for (const key in element) {
            if(element[key] == ""){
                verify = 1
                break;
            }
        }
    });

    if(verify)
        return responseFormat.response("No puede haber ningun elemento vacío", 400, 1)

    //Add exam that was done
    return await setExamn(data, element)
    .then(async (data) => {
        if(data[0] == undefined){
            // Add answers
            await data.respuestasExamen.forEach(async dataRow => {
                await setExamnAnswers(dataRow, element)
            });
            //Get total evaluation
            return responseFormat.responseData(await sumTotalevaluationMinimental(element), 200, 0)
        } else {
            return responseFormat.response("Se esta intentando hacer otro examen del mismo tipo, para la misma consulta", 300, 1)

        }
    }).catch((error) =>{ 
        return responseFormat.response(error, 400, 3);
    });

    
}

// async function getExamnAnswerById(element){
//     var [ examn ] = await getExamenId(element);

//     var examnSections = await getExamnSection(element);
    
//     var questions = [];
//     for(var i=0; i< examnSections.length; i++){
        
//         questions = await getQuestionsWithAnswers(examnSections[i]);
//         examnSections[i]['preguntas'] = questions; 
//     }

//     var examnComplete = {
//         examn,
//         examnSections
//     }

//     return examnComplete; 
// }

async function getExamnPastQuestions(element){
    // let [ examn ] = await getExamenId(element);

    // var examnSections = await getExamnSection(element);
    
    // var questions = [];
    // for(var i=0; i< examnSections.length; i++){
        
    //     questions = await getQuestionsWithAnswers(examnSections[i], element);
    //     examnSections[i]['preguntas'] = questions; 
    // }

    // var examnComplete = {
    //     examn,
    //     examnSections
    // }

    // return examnComplete; 

    var examn = await getExamenId(element)
    .then(([ examn ]) => {
        return  getExamnSection(element)
        .then(async ( examnSections ) => {
            let questions = [];
            for(let i=0; i< examnSections.length; i++){
        
                questions = await getQuestionsWithAnswers(examnSections[i], element);
                examnSections[i]['preguntas'] = questions; 
            }
            return {
                examn,
                examnSections
            };
        })
        .catch((error) =>{
            return responseFormat.response(error, 400, 3);
        });   
    })
    .catch((error) =>{
        return responseFormat.response(error, 400, 3);
    });
    return responseFormat.responseData(examn, 200, 0)
}

async function searchGeriatricConsults(data){
    let serachVariable = [];
    //It means that in the search there will be a date range
    if(data.fechaInicio != "" && data.fechaFinal != ""){
        if(data.fechaInicio == "" || data.fechaFinal == ""){
            return responseFormat.response("Se necesita un intervalo de fechas permitido", 400, 1);
        }
    
        let date1 = await Date.parse(data.fechaInicio);
        let date2 = await Date.parse(data.fechaInicio);
        
        if(isNaN(date1) || isNaN(date2))
            return responseFormat.response("Fecha no reconocido", 400, 4); 
        
        if(date1 > date2)
            return responseFormat.response("Intervalo de fechas invalido", 400, 2); 

        serachVariable.push(`fechaConsulta BETWEEN '${data.fechaInicio}' AND '${data.fechaFinal}'`);
    }
    
    //It means that in the search there will be a name patient
    if(data.nombrePaciente != "")
        serachVariable.push(`CONCAT(B.nombre, B.apellido) LIKE '%${ data.nombrePaciente }%'`);

    //It means that in the search there will be a name doctor
    if(data.nombreDoctor != "")
        serachVariable.push(`CONCAT(C.nombre, C.apellido) LIKE '%${ data.nombreDoctor }%'`);
    
    if(serachVariable.length == 0)
        return responseFormat.response("No hubo parametros para buscar", 400, 1);
        
        
    //Join the params for the search
    let searchQuery = '';
    for(var i = 0; i < serachVariable.length; i++){
        if(i > 0){
            searchQuery += `AND ${ serachVariable[i] }`  
        } else {
            searchQuery = serachVariable[i]
        }
    }
    
    if(data.ademasInactivos == 0)
        searchQuery += ' AND B.status = 1 AND C.status = 1'

    return await searchConsults(searchQuery)
    .then((data) => {
        return responseFormat.responseData(data, 200, 0);
    })
    .catch((error) => {
        return responseFormat.responseData(error, 400, 3);
    })
}

async function getGeriatricConsultById(element){
    return await getGeriatricConsult(element)
    .then((data) => {
        return responseFormat.responseData(data, 200, 0);
    })
    .catch((error) => {
        return responseFormat.response(error, 400, 3);
    });
}

async function finishGeriatricConsultById(element){
    return await finishGeriatricConsult(element)
    .then(() => {
        return responseFormat.response("Se finalizo la consulta exitosamente", 200, 0)
    })
    .catch((error) => {
        return responseFormat.response(error, 400, 1)
    });
}


async function getAllGeriatricConsultPending(){
    return await getGeriatricConsultPending()
    .then((data) => {
        return responseFormat.responseData(data, 200, 0);
    })
    .catch((error) => {
        return responseFormat.response(error, 400, 1)
    });
}

async function getAllnotesOfAConsult(element){
    return await getNotesConsult(element)
    .then((data) => {
        return responseFormat.responseData(data, 200, 0);
    })
    .catch((error) => {
        return responseFormat.response(error, 400, 1)
    })
}

async function modifyNoteById(data, element){
    if(data.nota == "")
        return responseFormat.response("no hubo información para actualizar", 400, 1)

    return await updateNote(data, element)
    .then(() => {
        return responseFormat.response("La nota se actualizo correctamente", 200, 0)
    })
    .catch((error) => {
        return responseFormat.response(error, 400, 3)
    });
}

// Cuestiones de logica 
async function sumTotalevaluationMinimental(element){
    let [ totalExamn ] = await getTotalSumEvaluationMinimental(element);
    let [ patient ] = await getPatientId(element);

    if(patient.escolaridad <= 3) totalExamn.puntajeTotal += 8;
    
    return totalExamn.puntajeTotal;
}

// Queries
async function createConsult(data, element){
    return await query(`CALL spCreateNewConsult('${ data.fechaConsulta }', '${ data.idPaciente }', '${ element }');
                        `);
}

async function getExamns(){
   return await query(`SELECT * FROM ${ tablas.EXAMENES };`)
}

async function getExamenId(element){
    return await query(`SELECT * FROM ${ tablas.EXAMENES } WHERE idExamen = ${ element.idExamen }`);
}

async function getExamnSection(element){
    return await query(`SELECT idSeccionExamen, nombreSeccion 
                        FROM ${ tablas.SECCIONES_EXAMENES } WHERE idExamen = ${ element.idExamen }`);
}

async function getQuestions(element){
    return await query(`SELECT idPregunta, pregunta, puntajeMaximo FROM ${ tablas.PREGUNTAS } WHERE idSeccionExamen = ${ element.idSeccionExamen }`);
}

async function getQuestionsWithAnswers(data, element){
    return await query(`
        SELECT X.*, Y.imagen FROM (SELECT A.idPregunta, A.pregunta, B.idRespuesta, B.respuesta, B.puntaje
            FROM ${ tablas.PREGUNTAS } AS A
            JOIN ${ tablas.RESPUESTAS } AS B
            ON A.idPregunta = B.idPregunta
            WHERE A.idSeccionExamen = ${data.idSeccionExamen} AND B.idConsulta = ${element.idConsulta}) AS X
        LEFT JOIN ${ tablas.RESPUESTAS_IMAGENES }  AS Y
        ON X.idRespuesta = Y.idRespuestaImagen
    `);
}

async function setExamn(data, element){
    return await query(`CALL spExamnDone(${element.idConsulta}, ${ element.idExamen }, '${ data.notas }')`)
    // await query(`INSERT INTO ${ tablas.EXAMENES_REALIZADOS } (idConsulta, idExamen, notas)
    //             VALUES ('${ element.idConsulta }', '${ element.idExamen }', '${ data.notas }');`);
}

async function setExamnAnswers(data, element){
    await query(`CALL spCreateNewAnswer(${ element.idConsulta }, ${ data.idPregunta }, 
        '${ data.respuesta }', ${ data.puntaje }, ${ data.imagen });`);
}

async function getTotalSumEvaluationMinimental(element){
    return await query(`
        SELECT SUM(D.puntaje) AS puntajeTotal 
        FROM ${ tablas.EXAMENES } AS A
        JOIN ${ tablas.SECCIONES_EXAMENES } AS B
        ON A.idExamen = B.idExamen
        JOIN ${ tablas.PREGUNTAS }  AS C
        ON B.idSeccionExamen = C.idSeccionExamen
        JOIN ${ tablas.RESPUESTAS }  AS D
        ON C.idPregunta = D.idPregunta
        WHERE D.idConsulta = ${ element.idConsulta } AND A.idExamen = ${ element.idExamen }
    `);
}

async function searchConsults(element){
    return await query(`    
        SELECT A.idConsulta, A.fechaConsulta, B.idPaciente, B.nombre  AS nombrePaciente, 
        B.apellido AS apellidoPaciente, C.idDoctor, C.nombre AS nombreDoctor, C.apellido AS apellidoDoctor
        FROM ${ tablas.CONSULTA_GERIATRICA } AS A
        JOIN ${ tablas.PACIENTES } AS B
        ON A.idPaciente = B.idPaciente
        JOIN ${ tablas.DOCTORES } AS C
        ON A.idDoctor = C.idDoctor
        WHERE ${ element };
    `);
}

async function getGeriatricConsult(element){
    return await query(`
        SELECT A.idConsulta, A.fechaConsulta, A.consultaTerminada, B.idPaciente, B.nombre AS nombrePaciente, 
        B.apellido AS apellidoPaciente, C.idDoctor, C.nombre AS nombreDoctor, C.apellido AS apellidoDoctor,
        D.idExamen, D.notas, E.nombreExamen
            FROM ${ tablas.CONSULTA_GERIATRICA } AS A
            JOIN ${ tablas.PACIENTES } AS B
            ON A.idPaciente = B.idPaciente
            JOIN ${ tablas.DOCTORES } AS C
            ON A.idDoctor = C.idDoctor
            LEFT JOIN ${ tablas.EXAMENES_REALIZADOS } AS D
            ON A.idConsulta = D.idConsulta
            LEFT JOIN ${ tablas.EXAMENES } AS E
            ON D.idExamen = E.idExamen
            WHERE A.idConsulta IN(${element.idConsulta});
    `);
}

async function finishGeriatricConsult(element){
    return await query(`UPDATE ${ tablas.CONSULTA_GERIATRICA } SET consultaTerminada = 1 WHERE idConsulta = ${ element.idConsulta }`)
}

async function getGeriatricConsultPending(element){
    return await query(`
        SELECT A.idConsulta, A.fechaConsulta, B.idPaciente, B.nombre AS nombrePaciente, 
        B.apellido AS apellidoPaciente, C.idDoctor AS nombreDoctor, C.nombre, C.apellido AS apellidoDoctor,
        D.idExamen, D.notas, E.nombreExamen
            FROM ${ tablas.CONSULTA_GERIATRICA } AS A
            JOIN ${ tablas.PACIENTES } AS B
            ON A.idPaciente = B.idPaciente
            JOIN ${ tablas.DOCTORES } AS C
            ON A.idDoctor = C.idDoctor
            LEFT JOIN ${ tablas.EXAMENES_REALIZADOS } AS D
            ON A.idConsulta = D.idConsulta
            LEFT JOIN ${ tablas.EXAMENES } AS E
            ON D.idExamen = E.idExamen
            WHERE A.consultaTerminada = 0;
    `)
}

async function getNotesConsult(element){
    return query(`
        SELECT A.idConsulta, A.fechaConsulta, B.notas, C.idExamen, C.nombreExamen 
        FROM ${ tablas.CONSULTA_GERIATRICA } AS A
        JOIN ${ tablas.EXAMENES_REALIZADOS} AS B
        ON A.idConsulta = B.idConsulta
        JOIN ${ tablas,EXAMENES } AS C
        ON B.idExamen = C.idExamen
        WHERE A.idConsulta = ${ element.idConsulta }
    `)
}

async function updateNote(data, element){
    return await query(`UPDATE ${ tablas.EXAMENES_REALIZADOS } SET notas = "${ data.nota }" 
            WHERE idConsulta = ${ element.idConsulta } AND idExamen = ${ element.idExamen };`);
}

//Otros queries ---
async function getPatientId(element){
    return await query(`
        SELECT idPaciente, nombre, apellido, escolaridad, fechaNacimiento, sexo, idDoctor, status FROM ${ tablas.PACIENTES } 
        WHERE idPaciente IN(${element.idPaciente});
    `);
}

async function getDoctorId(data){ 
    console.log(data)
    console.log(`
    SELECT  idDoctor, nombre, apellido, email, status FROM ${ tablas.DOCTORES } WHERE idDoctor IN(${data.idDoctor});
`);
    return await query(`
        SELECT  idDoctor, nombre, apellido, email, status FROM ${ tablas.DOCTORES } WHERE idDoctor IN(${data.idDoctor});
    `);
}

module.exports	= {
    createNewConsult,
    getExamnQuestionsById,
    getAllExamns,
    setExamnQuestions,
    getExamnPastQuestions,
    searchGeriatricConsults,
    getGeriatricConsultById,
    finishGeriatricConsultById,
    getAllGeriatricConsultPending,
    getAllnotesOfAConsult,
    modifyNoteById
}