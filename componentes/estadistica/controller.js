'use strict'
const { query } = require('../../conection_store/controllerStore.js');
const tablas = require('../utils/tablasDatabase.js');
const responseFormat = require('../utils/response.js');
// const moment = require('..')

async function promedioEdadPuntaje(){
    promedioPorEdadPuntaje()
}

async function promedioSexoPuntaje(){
    return await promedioPorPuntajeHombres()
    .then(async ([values3]) => {
        return await promedioPorPuntajeMujeres()
        .then(([values4]) =>{
            return {
                "puntajes promedio mujeres": values4.mujeres,
                "puntajes promedio hombres": values3.hombres
            }
        })
    })
}

async function promedioAnosPuntaje(){
    promedioPorAñosPuntaje()
}

async function NumPorSexo(){
    return await numPacientesMasculinos()
    .then(async ([values1]) => {
        return await numPacientesFemeninos()
        .then(([values2]) =>{
            return {
                "mujeres": values2.mujeres,
                "hombres": values1.hombres
            }
        })
    })
}

// Queries

async function promedioPorEdadPuntaje(){
    return await query(`
        SELECT edades, puntaje
        FROM pacientes, respuestas
        FROM edades AS rango1 WHERE rangoini <= '65' AND rangofin > '75'
        FROM edades AS rango2 WHERE rangoini <= '75' AND rangofin > '85'
        FROM edades AS rango3 WHERE rangoini <= '85' AND rangofin > '95'
        FROM edades AS rango4 WHERE rangoini <= '95' AND rangofin > '105'
        WHERE puntaje AVG(puntajeRango1) GROUP BY rango1
        WHERE puntaje AVG(puntajeRango2) GROUP BY rango2
        WHERE puntaje AVG(puntajeRango3) GROUP BY rango3
        WHERE puntaje AVG(puntajeRango4) GROUP BY rango4;
    `);
}

async function promedioPorPuntajeHombres(){
    return await query(`
    SELECT pacientes.sexo, AVG(respuestas.puntaje)
    AS hombres
    FROM pacientes, respuestas
    WHERE sexo ="0"
    GROUP BY sexo
    `);
}

async function promedioPorPuntajeMujeres(){
    return await query(`
    SELECT pacientes.sexo, AVG(respuestas.puntaje)
    AS mujeres
    FROM pacientes, respuestas
    WHERE sexo ="1"
    GROUP BY sexo
    `);
}

async function promedioPorAñosPuntaje(){
    return await query(`
        SELECT fechaConsulta, puntaje
        FROM consultas_geriiatricas, respuestas
        WHERE puntaje AVG(puntaje2019) GROUP BY consultas like '%2019%'
        WHERE puntaje AVG(puntaje2020) GROUP BY consultas like '%2020%'
        WHERE puntaje AVG(puntaje2021) GROUP BY consultas like '%2021%'
        WHERE puntaje AVG(puntaje2022) GROUP BY consultas like '%2022%';
        
    `);
}

async function numPacientesMasculinos(){return await query(`SELECT count(sexo) AS hombres FROM pacientes WHERE sexo="1"`);}

async function numPacientesFemeninos(){return await query(`SELECT count(sexo) AS mujeres FROM pacientes WHERE sexo="0"`);}

module.exports = {
promedioEdadPuntaje,
promedioSexoPuntaje,
promedioAnosPuntaje,
NumPorSexo
}
