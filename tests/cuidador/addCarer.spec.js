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
	"nombre": `Natalia${Math.random()}`,
	"apellido": `Dominguez${Math.random()}`,
	"telefono": `23-2345-5678`
  }, //1 - Nuevo paciente - OK
  {
	"nombre": `Natalia`,
	"apellido": `Dominguez`,
	"telefono": `24-2345-5678`
  }, //2 - Repeticion de nombre completo - OK
  {
  "nombre": `Flor${Math.random()}`,
	"apellido": `Gomez${Math.random()}`,
	"telefono": `2323455678`
  }, //8 - Formato incorrecto fecha - ok
  {
    "nombre": `Flor${Math.random()}`,
    "telefono": `23-234-55678`
  }, //9 - Json incompleto - OK
  {

  }, //10 - JSON vacio - OK
  {
    "nombre": `Natalia${Math.random()}`,
    "telefono": `27-2345-5678`,
    "apellido": `Dominguez${Math.random()}`
  }, //11 - JSON en desorden - OK
  {
    "nombres": `Natalia${Math.random()}`,
    "apellido": `Dominguez${Math.random()}`,
    "telefono": `23-2345-5678`
  } //12 - Fecha formato JS - OK
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
      // console.log(registers[i])
        await fetch (`${url}/cuidador/agregarNuevoCuidador`, {
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