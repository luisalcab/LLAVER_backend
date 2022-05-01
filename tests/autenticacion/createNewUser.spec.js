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
  }, //json desordenado - ok
  {
    "apellido": `Data${Math.random()}`,
    "nombre": `User${Math.random()}`,
    "email": `ferma@yahoo.com`,
    "password": `1234`
  }, //Extension de correo invalido - ok
  {
    "apellido": `Data${Math.random()}`,
    "nombre": `User${Math.random()}`,
    "email": `#ferma@yahoo.com`,
    "password": `1234`
  }, //Extension uso de caracteres no permitidos en correo - ok
  {
    "apellido": `Data${Math.random()}`,
    "nombre": `User${Math.random()}`,
    "email": `ferma${Math.random()}@hotmail.com `,
    "password": `1234`
  }, //Extension correo con espacios final - ok
  {
    "apellido": `Data${Math.random()}`,
    "nombre": `User${Math.random()}`,
    "email": ` ferma${Math.random()}@hotmail.com`,
    "password": `1234`
  }, //Extension correo con espacios inicio - ok
  {
    "apellido": `Data${Math.random()}`,
    "nombre": `User${Math.random()}`,
    "email": `ferma ${Math.random()}@hotmail.com`,
    "password": `1234`
  }, //Extension correo con espacios en medio - ok
  {
    "apellido": `Data${Math.random()}`,
    "nombre": `User${Math.random()}`,
    "email": `ferma${Math.random()}@hotmail.net`,
    "password": `1234`
  }, //Dominio no permitido - ok
  {
    "apellido": `Data${Math.random()}`,
    "nombre": `User${Math.random()}`,
    "email": `ferma${Math.random()}@hotmail.com`,
    "password": `1234`
  }, //Extension agregado exitoso pero con extension hotmail - ok
  {
    "apellido": ``,
    "nombre": ``,
    "email": ``,
    "password": ``
  }, //Body vacio
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