const fetch = require('node-fetch-commonjs');
const testUtils = require('../../testUtils.js');

//Pendiente

const url = 'http://localhost:3002';
//This test tests the user creation process (remember that our user is a doctor)
var credentials = {
    "email": "mina@gmail.com",
    "password": "1234"
}

var registers = [
  {
    "fechaConsulta": "2021-04-10",
    "idPaciente": "25"
  }, //1 - Agregar nueva consulta - ok
  {
    "fechaConsulta": "2021-04-10",
    "idPaciente": "25"
  }, //2 - Otra vez la misma consulta - ok
  {
    "fechaConsulta": "04-09-2021",
    "idPaciente": "25"
  }, //3 - Fecha con mal formato - ok
  {
    "fechaConsulta": "2021-04-09",
    "idPaciente": "1"
  }, //4 - idPaciente que no exista - ok
  {
    "fechaConsulta": "",
    "idPaciente": "25"
  }, //5 - Fecha nula - ok
  {
    "fechaConsulta": "2021-04-09",
    "idPaciente": ""
  }, //6 - idPaciente nulo - ok
  {
    "fechaConsulta": {},
    "idPaciente": {}
  }, //7 - json vacios - ok
  {
    "fechaConsulta": {"a": "a"},
    "idPaciente": {"a": "a"}
  }, //8 - json compuestos - ok
  {
    "idPaciente": {"a": "a"}
  }, //9 - Sin fechas - ok
  {
    "fechaConsulta": "2021-04-10",
  }, //10 - Sin id - ok
  {
  }, //11 - Sin  elementos - ok
  {
    "fechaConsulta": "2021-04-09",
    "idPaciente": "[]"
  }, //12 - Pasando arrays - ok
  {
    "fechaConsulta": "2021-04-09",
    "idPaciente": []
  }, //13 - Pasando arrays - ok
  {
    "fechaConsulta": "2021-04-09",
    "idPaciente": [1]
  }, //14 - Pasando arrays con datos - ok
  {
    "idPaciente": "25"
  }, //15 - Sin fecha - ok
  {
    "fechaConsulta": "",
    "idPaciente": ""
  }, //16 - Inputs vacios - ok
  {
    "fechaConsulta": "2011-01-03T06:00:00.000Z",
    "idPaciente": "25"
  }, //17 - Formato fecha JS - ok
  {
    "fechaConsultas": "2011-01-03T06:00:00.000Z",
    "idPaciente": "25"
  }, //18 - Otro nmbre para "fechaConsulta" - ok
  {
    "fechaConsulta": "2011-01-03T06:00:00.000Z",
    "data": "2011-01-03T06:00:00.000Z",
    "idPaciente": "25"
  }, //19 - JSON con otros valores - ok
  {
    "fechaConsulta": "2011-01-03T06:00:00.000Z",
    "fechaConsulta": "2011-01-03T06:00:00.000Z",
    "idPaciente": "25"
  }, //20 - JSON con otros valores duplicados - ok
]


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
async function test(credentials, registers){
    let token = await login(credentials);
    for(var i = 0; i < registers.length; i++){
        await fetch (`${url}/consultaGeriatrica/crearNuevaConsulta`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'x-access-token': token,
            },
            body: JSON.stringify(registers[i])
        })
        .then(async (response) => {
            const data = await response.json();
            testUtils.result(i+1, registers[i],  data.response )
        })
        .catch((error) => {
            console.log(error)
        });
    }
}

test(credentials, registers);