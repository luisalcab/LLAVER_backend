const fetch = require('node-fetch-commonjs');
const testUtils = require('../../testUtils.js');

const url = 'http://localhost:3002';
//This test tests the user creation process (remember that our user is a doctor)
var credentials = {
    "email": "mina@gmail.com",
    "password": "1234"
}

var registers = [
  {
	"idConsulta": 60,
  }, //1 - Finalizamos una consulta - ok
  {
	"idConsulta": 60,
  }, //2 - Volvemos a finalizar la consulta - ok
  {
	"idConsulta": 1,
  }, //3 - Finalizamos una consulta que no existe - ok
  {
	"idConsulta": "a",
  }, //4 - Pasmos como parametro otro valor1 - ok
  {
	"idConsulta": {data: "message"},
  }, //5 - Pasmos como parametro otro valor1 - ok
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
        await fetch (`${url}/consultaGeriatrica/terminarConsultaGeriatrica/${registers[i].idConsulta}`, {
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