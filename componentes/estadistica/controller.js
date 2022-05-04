'use strict'
const { query } = require('../../conection_store/controllerStore.js');
const tablas = require('../utils/tablasDatabase.js');
const responseFormat = require('../utils/response.js');
const moment = require('moment');
const { isDate } = require('moment');
const { invalid } = require('moment');



async function promedioPuntajeIntervaloEdad(){
    var intervals = 
        [
            {
                "invervaloEdadMenor": "65",
                "invervaloEdadMayor": "75",
                "startInterval": await moment(moment().format()).add(-75, 'Y').add(1, 'd').format('YYYY-MM-DD'),
                "endInterval":     await moment(moment().format()).add(-65, 'Y').format('YYYY-MM-DD')
            },
            {
                "invervaloEdadMenor": "75",
                "invervaloEdadMayor": "85",
                "startInterval": await moment(moment().format()).add(-75, 'Y').add(1, 'd').format('YYYY-MM-DD'),
                "endInterval":     await moment(moment().format()).add(-85, 'Y').format('YYYY-MM-DD')
            },
            {
                "invervaloEdadMenor": "85",
                "invervaloEdadMayor": "95",
                "startInterval": await moment(moment().format()).add(-95, 'Y').add(1, 'd').format('YYYY-MM-DD'),
                "endInterval":     await moment(moment().format()).add(-85, 'Y').format('YYYY-MM-DD')
            },
            {
                "invervaloEdadMenor": "95",
                "invervaloEdadMayor": "105",
                "startInterval": await moment(moment().format()).add(-105, 'Y').format('YYYY-MM-DD'),
                "endInterval":     await moment(moment().format()).add(-95, 'Y').format('YYYY-MM-DD')
            },
        ]

    var avgIntervals = [];
    for(var i = 0; i < intervals.length; i++){
        let resQuery = await avgGeneralIntervaloEdades(intervals[i].startInterval, intervals[i].endInterval)
        .then(([ data ]) => {
            return {"id": 0, "avg": data.puntajePromedioAnualIntervalo}
        }).catch((error) => {
            return {"id": -1, "error": error}
        });


        //Manage error (if it has)
        if(resQuery.id == -1){
            return responseFormat.response(resQuery.error, 400, 3);
        } else {
            if(resQuery.avg == null)
                resQuery.avg = 0;

            avgIntervals.push({ "startInterval": intervals[i].invervaloEdadMenor, 
                                "endIntercal": intervals[i].invervaloEdadMayor, 
                                "anualIntervalAvg": resQuery.avg });
        }


    }

    return responseFormat.responseData(avgIntervals, 200, 0)

}

async function promedioSexoPuntaje(){
    return await totalAvgBySex()
    .then((data) => {
        return responseFormat.responseData(data);
    })
    .catch((error) => {
        return responseFormat.response(error, 400, 3);
    })
}

async function promedioGeneralIntervaloAnual(data){
    
    if(data.startDate == undefined || data.finishDate == undefined)
        return responseFormat.response("JSON no valido", 400, 1); 

    if(data.startDate == "" || data.finishDate=="")
        return responseFormat.response("No puede haber campos vacios para las fechas", 400, 2); 
    // console.log(new Date(data.startDate == 'Invalid Date')) 
    // if(isDate(data.startDate) == false || isDate(data.finishDate) == false)
    //     return responseFormat.response("Estas intentando poner un valor diferente a fecha en uno de los inputs", 400, 4); 

    //Creamos varaibles con valores iniciales
    let startInterval = await moment(moment(data.startDate)).format('YYYY-MM-DD');
    let finishInterval = await moment(moment(data.startDate)).add(364, 'd').format('YYYY-MM-DD');
    let endDateAnalitic = await moment(moment(data.finishDate)).add(364, 'd').format('YYYY-MM-DD');

    if(startInterval > endDateAnalitic)
        return responseFormat.response("Intervalo de fechas invalido (la fecha inicial es mayor a la fecha final)", 400, 3);

    let avgIntervals = [];
    while(await moment(startInterval).add(1, 'd').format('YYYY-MM-DD') < endDateAnalitic){
        //Call query
        let resQuery = await avgGeneralIntervaloAnual(startInterval, finishInterval)
        .then(([ data ]) => {
            return {"id": 0, "date": startInterval, "avg": data.puntajePromedioAnualIntervalo}
        }).catch((error) => {
            return {"id": -1, "error": error}
        });

        //Manage error (if it has)
        if(resQuery.id == -1){
            return responseFormat.response(resQuery.error, 400, 3);
        } else {
            if(resQuery.avg == null)
                resQuery.avg = 0;

            avgIntervals.push({ "date": resQuery.date, "anualAvg": resQuery.avg });
        }

        //Update the variables for next iteration
        startInterval = await moment(startInterval).add(1, 'Y').format('YYYY-MM-DD');
        finishInterval = await moment(startInterval).add(364, 'd').format('YYYY-MM-DD');
        

    }

    
    return responseFormat.responseData(avgIntervals, 200, 0)
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
async function totalAvgBySex(){
    return await query(`
    SELECT A.sexo, AVG(C.puntaje) AS promedioTotal
    FROM ${ tablas.PACIENTES } AS A
    JOIN ${ tablas.CONSULTA_GERIATRICA} AS B
    ON A.idPaciente = B.idPaciente
    JOIN ${ tablas.RESPUESTAS } AS C
    ON B.idConsulta = C.idConsulta
    GROUP BY A.sexo
    `)
}

async function avgGeneralIntervaloEdades(initInterval, finishInterval){
    return await query(`
        SELECT AVG(B.puntaje) AS puntajePromedioAnualIntervalo
        FROM ${ tablas.CONSULTA_GERIATRICA } AS A
        JOIN ${ tablas.RESPUESTAS } AS B
        ON A.idConsulta = B.idConsulta
        JOIN ${ tablas.PACIENTES} AS C
        ON A.idPaciente = C.idPaciente
        WHERE C.fechaNacimiento BETWEEN '${ initInterval }' AND '${ finishInterval }'`);
}

async function avgGeneralIntervaloAnual(initInterval, finishInterval){
    return await query( `
        SELECT AVG(B.puntaje) AS puntajePromedioAnualIntervalo
        FROM ${ tablas.CONSULTA_GERIATRICA } AS A
        JOIN ${ tablas.RESPUESTAS } AS B
        ON A.idConsulta = B.idConsulta
        WHERE A.fechaConsulta BETWEEN '${ initInterval }' AND '${ finishInterval }'`);
}

async function numPacientesMasculinos(){return await query(`SELECT count(sexo) AS hombres FROM pacientes WHERE sexo="1"`);}

async function numPacientesFemeninos(){return await query(`SELECT count(sexo) AS mujeres FROM pacientes WHERE sexo="0"`);}

module.exports = {
promedioPuntajeIntervaloEdad,
promedioSexoPuntaje,
promedioGeneralIntervaloAnual,
NumPorSexo
}
