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
	"nombre": "Mia"
  }, //1 - Busqueda exitosa sin inactivo - ok
  {
	"nombre": ""
  }, //3 - Sin parametro de busqeuda - ok
  {
  }, //6 - Sin JSON - ok
  {
    "nombre": "Brianas"
  }, //8 - Datos incorrectos - ok
  {
    "nombres": "Briana"
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
        await fetch (`${url}/cuidador/obtenerCuidadoresNombre`, {
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