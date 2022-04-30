const fetch = require('node-fetch-commonjs');
const testUtils = require('../testUtils.js');

const url = 'http://localhost:3002';
//This test tests the user creation process (remember that our user is a doctor)
var credentials = {
    "email": "mina@gmail.com",
    "password": "1234"
}

var registers = [
  {
	"idPaciente": 25,
  }, //1 - Paciente que existe
  {
	"idPaciente": 25,
  }, //2 - Volvemos a pasar el mismo paciente
  {
	"idPaciente": 1,
  }, //3 - Paciente que no existe en la DB
  {
	"idPaciente": "a",
  }, //4 - Pasamos valor no permitido - ok
  {
	"idPaciente": {"data": 1},
  }, //5 - Pasamos valor no permitido - ok
  {
  }, //6 - Pasamos JSON vacío - ok
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
        await fetch (`${url}/paciente/desactivarStatusPaciente/${registers[i].idPaciente}`, {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json',
            'x-access-token': token,
            },
            // body: JSON.stringify(registers[i])
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