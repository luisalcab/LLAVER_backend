const fetch = require('node-fetch-commonjs');
const testUtils = require('../testUtils.js');

const url = 'http://localhost:3002';
//This test tests the user creation process (remember that our user is a doctor)
var registers = [
  {
    "nombre": `User${Math.random()}`,
    "apellido": `Data${Math.random()}`,
    "email": `ferma${Math.random()}@gmail.com`,
    "password": `1234`
  }, //Usuario nuevo - OK
  {
    "nombre": "Fernando",
    "apellido": "Macedo",
    "email": "ferma@gmail.com",
    "password": "1234"
  }, //Repeticion de nombre completo - OK
  {
    "nombre": `User${Math.random()}`,
    "apellido": `Data${Math.random()}`,
    "email": "ferma@gmail.com",
    "password": "1234"
  }, //Repeticion de correo - OK
  {
    "nombre": `User${Math.random()}`,
    "apellido": `Data${Math.random()}`,
  }, //Eliminando campos 1 - ok
  {
    "email": `ferma${Math.random()}@gmail.com`,
    "password": `1234`
  }, //Eliminando campos 2 - ok
  {

  }, //json vacio - ok
  {
    "apellido": `Data${Math.random()}`,
    "nombre": `User${Math.random()}`,
    "email": `ferma${Math.random()}@gmail.com`,
    "password": `1234`
  } //json desordenado - ok
]

async function register(registers){
  for(var i = 0; i < registers.length; i++ ){
    await fetch (`${url}/autenticacion/register`, {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
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


register(registers);