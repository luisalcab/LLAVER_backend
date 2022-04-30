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
    "fechaConsulta": "2021-04-09",
    "idPaciente": "25"
  }, //1 - Agregar nueva consulta
  {
    "fechaConsulta": "2021-04-09",
    "idPaciente": "25"
  }, //2 - Otra vez la misma consulta 
  {
    "fechaConsulta": "04-09-2021",
    "idPaciente": "25"
  }, //3 - Fecha con mal formato
  {
    "fechaConsulta": "2021-04-09",
    "idPaciente": "1"
  }, //4 - idPaciente que no exista
  {
    "fechaConsulta": "",
    "idPaciente": "25"
  }, //5 - Fecha nula
  {
    "fechaConsulta": "2021-04-09",
    "idPaciente": ""
  }, //6 - idPaciente nulo
  {
    "fechaConsulta": {},
    "idPaciente": {}
  }, //7 - json vacios
  {
    "fechaConsulta": {"a": "a"},
    "idPaciente": {"a": "a"}
  }, //8 - json compuestos
  {
    "idPaciente": {"a": "a"}
  }, //9 - Sin fechas
  {
    "fechaConsulta": {"a": "a"},
  }, //10 - Sin id
  {
  }, //11 - Sin  elementos
]


async function login(credentials){
    return await fetch (`${url}/consultaGeriatrica/crearNuevaConsulta`, {
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
        await fetch (`${url}/paciente/agregarNuevoPaciente`, {
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