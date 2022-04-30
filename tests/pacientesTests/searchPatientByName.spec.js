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
	"nombre": "Flor",
	"ademasInactivos": 0
  }, //1 - Busqueda exitosa sin inactivo - ok
  {
	"nombre": "Flor",
	"ademasInactivos": 1
  }, //2 - Busqueda exitosa con inactivos - ok
  {
	"nombre": "",
	"ademasInactivos": 0
  }, //3 - Sin parametro de busqeuda - ok
  {
	"ademasInactivos": 0
  }, //4 - Formato incompleto1 - ok
  {
	"nombre": "Brianna",
  }, //5 - Formato incompleto2 - ok
  {
  }, //6 - Sin JSON - ok
  {
    "nombre": "47858", 
    "ademasInactivos": 0
  }, //7 - Datos incorrectos - ok
  {
    "nombre": "Briana",
    "ademasInactivos": "a"
  }, //8 - Datos incorrectos - ok
  {
    "nombre": "Briana",
    "ademasInactivos": "0"
  }, //9 - Numero string - ok
  {
    "nombresPacientes": "Briana",
    "ademasInactivos": "0"
  }, //9 - json con otros nombre -ok
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
        await fetch (`${url}/paciente/obtenerPacientesNombre`, {
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