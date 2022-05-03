const fetch = require('node-fetch-commonjs');
const testUtils = require('../../testUtils.js');

const url = 'http://localhost:3002';
//In this test we create several geriatric consults which the patient make an examn a send the answer,
//and close the geriatric consult


//Proccess
// 1 - Create an geriatric consult
// 2 - Do examn and sent it
// 3 - Close the geriatric consult

var credentials = {
    "email": "mina@gmail.com",
    "password": "1234"
}

// var patiens = [27, 30, 33, 35, 38, 39, 41, 42, 44, 45, 47, 49, 51, 52]
var patiens = [41, 42, 44, 45, 47, 49, 51, 52]

var date = ["2021-04-15", "2021-04-16", "2021-04-17", "2021-04-18", "2021-04-19", "2022-04-15", "2022-04-16", "2022-04-17", "2022-04-18", "2022-04-19"];

console.log(date)

function random(min, max) {
    return Math.floor((Math.random()  * (max - min + 1)) + min);
}


//Set registros examen correcto - ok
var registers = [
  {
    data: {
      "notas": "Esto es una nota",
      "respuestasExamen": [
          {
              "idPregunta": 1,
              "respuesta": "Respuesta1",
              "puntaje": random(5, 1),
              "imagen": 0
          },
          {
              "idPregunta": 2,
              "respuesta": "Respuesta2",
              "puntaje": random(5, 1),
              "imagen": 0
          },
          {
              "idPregunta": 3,
              "respuesta": "Respuesta3",
              "puntaje": random(3, 1),
              "imagen": 0
          },
          {
              "idPregunta": 4,
              "respuesta": "Respuesta4",
              "puntaje": random(5, 1),
              "imagen": 0
          },
          {
              "idPregunta": 5,
              "respuesta": "Respuesta5",
              "puntaje": random(3, 1),
              "imagen": 0
          },
          {
              "idPregunta": 6,
              "respuesta": "Respuesta6",
              "puntaje": random(1, 1),
              "imagen": 0
          },
          {
              "idPregunta": 7,
              "respuesta": "Respuesta7",
              "puntaje": random(1, 1),
              "imagen": 0
          },
          {
              "idPregunta": 8,
              "respuesta": "Respuesta8",
              "puntaje": random(3, 1),
              "imagen": 0
          },
          {
              "idPregunta": 9,
              "respuesta": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gIoSUNDX1BST0ZJTEUAAQEAAAIYAAAAAAQwAABtbnRyUkdCIFhZWiAAAAAAAAAAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAAHRyWFlaAAABZAAAABRnWFlaAAABeAAAABRiWFlaAAABjAAAABRyVFJDAAABoAAAAChnVFJDAAABoAAAAChiVFJDAAABoAAAACh3dHB0AAAByAAAABRjcHJ0AAAB3AAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAFgAAAAcAHMAUgBHAEIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA ...",
              "puntaje": random(1, 1),
              "imagen": 1
          },
          {
              "idPregunta": 10,
              "respuesta": "Respuesta10",
              "puntaje": random(2, 1),
              "imagen": 0
          },
          {
              "idPregunta": 11,
              "respuesta": "Respuesta11",
              "puntaje": random(1, 1),
              "imagen": 0
          },
      ]
  }, 
    identifier: {
        "idConsulta": 30,
        "idPaciente": 30,
        "idExamen": 30
    }
},
]


//Test function
async function login(credentials){
    return await fetch (`${url}/autenticacion/login`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials)
    })
    .then(async (response) => {
        const data = await response.json();
        return data.response.data;
    })
    .catch((error) => {
        console.log(error)
    });
}
async function test(credentials, patiens, date, registers){
    let token = await login(credentials); //The doctor login in the app

    for(var j = 0; j < date.length; j++){
        //Start creating the consults
        for(var i = 0; i < patiens.length; i++){
            await fetch (`${url}/consultaGeriatrica/crearNuevaConsulta`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                'x-access-token': token,
                },
                body: JSON.stringify({ "fechaConsulta": date[j], "idPaciente": patiens[i] })
            })
            .then(async (responseIdConsults) => {
                const data = await responseIdConsults.json();
    
                if(data.response.statusInternCode == 0){
                    //Add the answers of the examn to DB
                    await fetch (`${url}/consultaGeriatrica/obtenerExamen/${data.response.data.idConsulta}/${patiens[i]}/1`, {
                        method: 'POST',
                        headers: {
                        'Content-Type': 'application/json', 
                        'x-access-token': token,
                        },
                        body: JSON.stringify(registers[0].data)
                    })
                    .then(async (response) => {
                        const resSetAnswers = await response.json();
                        if(resSetAnswers.response.statusInternCode==0){
                            //Finish consult
                            await fetch (`${url}/consultaGeriatrica/terminarConsultaGeriatrica/${data.response.data.idConsulta}`, {
                                method: 'PUT',
                                headers: {
                                'Content-Type': 'application/json',
                                'x-access-token': token,
                                },
                                // body: JSON.stringify(registers[i])
                            })
                            .then(async (response) => {
                                const resFinsihConsult = await response.json();
                                testUtils.result(i+1, 
                                    {
                                        "idConsulta": data.response.data.idConsulta,
                                        "idPaciente": patiens[i],
                                        "calificacion": resSetAnswers.response.data,
                                    },  
                                    resFinsihConsult.response)
                            })
                            .catch((error) => {
                                console.log(error)
                            });
                        } else {
                            //there are a problem
                            console.log(resSetAnswers)
                        }
                    })
                    .catch((error) => {
                        console.log(error)
                    }); 
                } else {
                    // There is a problem
                    console.log(data.response)
                }
    
    
            })
            .catch((error) => {
                console.log(error)
            });
        }

    }
}

test(credentials, patiens, date, registers); //Begin test