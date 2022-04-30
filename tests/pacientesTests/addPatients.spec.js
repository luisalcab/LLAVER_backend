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
	"nombre": `Flor${Math.random()}`,
	"apellido": `Gomez${Math.random()}`,
	"escolaridad": `6`,
	"fechaNacimiento": `2021-04-05`,
	"sexo": `0`,
	"idDoctor": `48`
  }, //1 - Nuevo paciente - OK
  {
	"nombre": `Flor`,
	"apellido": `Gomez`,
	"escolaridad": `6`,
	"fechaNacimiento": `2021-04-05`,
	"sexo": `0`,
	"idDoctor": `48`
  }, //2 - Repeticion de nombre completo - OK
  {
	"nombre": `Flor${Math.random()}`,
	"apellido": `Gomez${Math.random()}`,
	"escolaridad": `a`,
	"fechaNacimiento": `2021-04-05`,
	"sexo": `0`,
	"idDoctor": `48`
  }, //3 - Dato erroneo escolaridad - OK
  {
	"nombre": `Flor${Math.random()}`,
	"apellido": `Gomez${Math.random()}`,
	"escolaridad": `6`,
	"fechaNacimiento": `2021-04-05 00:00:00 a`,
	"sexo": `0`,
	"idDoctor": `48`
  }, //4 - Dato erroeno fecha - OK
  {
	"nombre": `Flor${Math.random()}`,
	"apellido": `Gomez${Math.random()}`,
	"escolaridad": `6`,
	"fechaNacimiento": `2021-04-05`,
	"sexo": `a`,
	"idDoctor": `48`
  }, //5 - Dato erroneo sexo - OK
  {
	"nombre": `Flor${Math.random()}`,
	"apellido": `Gomez${Math.random()}`,
	"escolaridad": `6`,
	"fechaNacimiento": `2021-04-05`,
	"sexo": `0`,
	"idDoctor": `b`
  }, //6 - Dato erroeno idDoctor - OK
  {
	"nombre": `Flor${Math.random()}`,
	"apellido": `Gomez${Math.random()}`,
	"escolaridad": `6`,
	"fechaNacimiento": `2021-04-05`,
	"sexo": `0`,
	"idDoctor": `1`
  }, //7 - id doctor que no existe - OK
  {
    "nombre": `Flor${Math.random()}`,
	"apellido": `Gomez${Math.random()}`,
	"escolaridad": `6`,
	"fechaNacimiento": `05-04-2021`,
	"sexo": `0`,
	"idDoctor": `48`
  }, //8 - Formato incorrecto fecha - ok
  {
	"apellido": `Gomez${Math.random()}`,
	"fechaNacimiento": `2021-04-05`,
	"sexo": `0`,
  }, //9 - Json incompleto - OK
  {

  }, //10 - JSON vacio - OK
  {
  "apellido": `Gomez${Math.random()}`,
  "nombre": `Flor${Math.random()}`,
	"fechaNacimiento": `2021-04-05`,
	"idDoctor": `48`,
	"sexo": `0`,
	"escolaridad": `6`,
  }, //11 - JSON en desorden - OK
  {
    "apellido": `Gomez${Math.random()}`,
    "nombre": `Flor${Math.random()}`,
	"fechaNacimiento": `2011-01-03T06:00:00.000Z`,
	"idDoctor": `48`,
	"sexo": `0`,
	"escolaridad": `6`,
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