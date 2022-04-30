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
	"idExamen": 1,
  }, //1 - Obtener examen exitoso - ok
  {
    "idExamen": 27,
  }, //2 - Obtener examen que no existe - ok
  {
    "idConsulta": 60,
    "idPaciente": "a",
    "idExamen": "a",
  }, //3 - Pasando parametros no permitidos - ok
  {
  }, //4 - Pasamos JSON vacío - ok
  {
    "idConsulta": {"idConsulta": 60},
    "idPaciente": {"idPaciente": 25},
    "idExamen": {"idExamen": 1},
  }, //5 - Pasamos objeto complejo - ok
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
        await fetch (`${url}/consultaGeriatrica/obtenerExamen/${registers[i].idExamen}`, {
            method: 'GET',
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