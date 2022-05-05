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
var patiens = [41]

var date = "2023-01-15";



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

//Set nota invalida - ok
var registers1 = [
    {
      data: {
        "notas": {nota: "Hola mundo"},
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
                "imagen": "1"
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

//Set Examen sin respuestas - ok
var registers6 = [
    {
      data: {
        "notas": "Una nota1",
        "respuestasExamen": {}
    }, 
      identifier: {
          "idConsulta": 30,
          "idPaciente": 30,
          "idExamen": 30
      }
  },
]

//Set Examen incompleto (faltan las respuestas a las preguntas 3, 4, 5, 10) - ok
var registers2 = [
    {
      data: {
        "notas": "Una nota",
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
                "imagen": "1"
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

//Datos no permitidos en campos (id) - ok
var registers3 = [
    {
      data: {
        "notas": "Esto es una nota",
        "respuestasExamen": [
            {
                "idPregunta": "a",
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
                "imagen": "1"
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
 
//Datos no permitidos en campos (puntje) - ok
var registers4 = [
    {
      data: {
        "notas": "Esto es una nota",
        "respuestasExamen": [
            {
                "idPregunta": 1,
                "respuesta": "Respuesta1",
                "puntaje": "a",
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

//Datos no permitidos en campos (imagen) - ok
var registers5 = [
    {
      data: {
        "notas": "Esto es una nota",
        "respuestasExamen": [
            {
                "idPregunta": 1,
                "respuesta": "Respuesta1",
                "puntaje":  random(5, 1),
                "imagen": "a"
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
                "imagen": "a"
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

    //Start creating the consults
    for(var i = 0; i < patiens.length; i++){
        await fetch (`${url}/consultaGeriatrica/crearNuevaConsulta`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'x-access-token': token,
            },
            body: JSON.stringify({ "fechaConsulta": date, "idPaciente": patiens[i] })
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

test(credentials, patiens, date, registers); //Begin test