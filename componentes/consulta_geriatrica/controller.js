'use strict'
const { query } = require('../../conection_store/controllerStore.js');
const tablas = require('../utils/tablasDatabase.js');

async function createNewConsult(data, element){
    let [ idConsulta ] = await createConsult(data, element);
    return idConsulta;
}

async function getAllExamns(){
    return await getExamns(); 
}

async function getExamnQuestionsById(element){
    var [ examn ] = await getExamenId(element);
    // var questions = await getQuestionsExemanId(element);
    var examnSections = await getExamnSection(element);
    
    var questions = [];
    for(var i=0; i< examnSections.length; i++){
        
        questions = await getQuestions(examnSections[i]);
        examnSections[i]['preguntas'] = questions; 
    }

    var examnComplete = {
        examn,
        examnSections
    }

    return examnComplete; 
}

async function setExamnQuestions(data, element){
    //Agregamos el examen que se realizo
    await setExamn(data, element);

    //Agregamos respuestas del examen
    await data.respuestasExamen.forEach(async dataRow => {
        await setExamnAnswers(dataRow, element)
    });  
    return await sumTotalevaluationMinimental(element);
}

async function getExamnAnswerById(element){
    var [ examn ] = await getExamenId(element);

    var examnSections = await getExamnSection(element);
    
    var questions = [];
    for(var i=0; i< examnSections.length; i++){
        
        questions = await getQuestionsWithAnswers(examnSections[i]);
        examnSections[i]['preguntas'] = questions; 
    }

    var examnComplete = {
        examn,
        examnSections
    }

    return examnComplete; 
}

async function getExamnPastQuestions(element){
    var [ examn ] = await getExamenId(element);

    var examnSections = await getExamnSection(element);
    
    var questions = [];
    for(var i=0; i< examnSections.length; i++){
        
        questions = await getQuestionsWithAnswers(examnSections[i], element);
        examnSections[i]['preguntas'] = questions; 
    }

    var examnComplete = {
        examn,
        examnSections
    }

    return examnComplete; 
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
    return await query(`CALL spCreateNewConsult('${ data.fechaConsulta }', '${ data.idPaciente }', '${ element }');`);
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
    return await query(`SELECT idPregunta, pregunta FROM ${ tablas.PREGUNTAS } WHERE idSeccionExamen = ${ element.idSeccionExamen }`);
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
    await query(`INSERT INTO ${ tablas.EXAMENES_REALIZADOS } (idConsulta, idExamen, notas)
                VALUES ('${ element.idConsulta }', '${ element.idExamen }', '${ data.notas }');`);
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

//Otros queries ---
async function getPatientId(element){
    return await query(`
        SELECT idPaciente, nombre, apellido, escolaridad, fechaNacimiento, sexo, idDoctor FROM ${ tablas.PACIENTES } 
        WHERE idPaciente IN(${element.idPaciente});
    `);
}
module.exports	= {
    createNewConsult,
    getExamnQuestionsById,
    getAllExamns,
    setExamnQuestions,
    getExamnPastQuestions
}