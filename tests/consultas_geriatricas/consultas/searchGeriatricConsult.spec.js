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
    "fechaInicio": "2011-01-01",
    "fechaFinal": "2021-04-20",
    "nombrePaciente": "Brianna",
    "nombreDoctor": "Minerva",
    "ademasInactivos": "0"
  },//1 -	Consulta multiparametro - OK
  {
    "fechaInicio": "2011-01-01",
    "fechaFinal": "2021-04-20",
    "nombrePaciente": "",
    "nombreDoctor": "",
    "ademasInactivos": "0"
  },//2	- Consulta monoparametro intervalo fechas - OK
  {
    "fechaInicio": "",
    "fechaFinal": "",
    "nombrePaciente": "Brianna",
    "nombreDoctor": "",
    "ademasInactivos": "0"
  },//3	- Consulta monoparametro nombre paciente - ok
  {
    "fechaInicio": "",
    "fechaFinal": "",
    "nombrePaciente": "",
    "nombreDoctor": "Minerva",
    "ademasInactivos": "0"
  },//4	- Consulta monoparametro nombre doctor - ok
  {
    "fechaInicio": "2011-01-01",
    "fechaFinal": "2021-04-20",
    "nombrePaciente": "Brianna",
    "nombreDoctor": "Minerva",
    "ademasInactivos": ""
  },//5 -	Se manda busqueda con el campo "ademasInactivos" - ok
  {
    "fechaInicio": "2011-01-01",
    "fechaFinal": "2021-04-20",
    "nombrePaciente": "Brianna",
  },//6 -	Se manda busqueda sin algunos campos1 - ok
  {
    "fechaInicio": "2011-01-01",
    "nombrePaciente": "Brianna",
    "nombreDoctor": "Minerva",
    "ademasInactivos": "0"
  },//7 -	Se manda busqueda sin uno de los campos de fechas - ok
  {
  },//8 -	JSON vacio - ok
  {
    "fechaFinal": "2021-04-20",
    "nombrePaciente": "Brianna",
    "fechaInicio": "2011-01-01",
    "ademasInactivos": "0",
    "nombreDoctor": "Minerva",
  },//9 -	JSON sin orden - ok
  {
    "fechaInicio": "asd",
    "fechaFinal": "2021-04-20",
    "nombrePaciente": "Brianna",
    "nombreDoctor": "Minerva",
    "ademasInactivos": "0"
  },//10 -	Fecha con otros valores1 <- ok
  {
    "fechaInicio": "2011-01-01",
    "fechaFinal": "asd",
    "nombrePaciente": "Brianna",
    "nombreDoctor": "Minerva",
    "ademasInactivos": "0"
  },//11 -	Fecha con otros valores2 <- ok
  {
    "fechaInicio": "",
    "fechaFinal": "",
    "nombrePaciente": "",
    "nombreDoctor": "",
    "ademasInactivos": ""
  },//12 -	Todo = "" - ok
  {
    "fechaInicio": "2011-01-01T06:00:00.000Z",
    "fechaFinal": "2021-04-20T06:00:00.000Z",
    "nombrePaciente": "Brianna",
    "nombreDoctor": "Minerva",
    "ademasInactivos": "0"
  },//13 -	Fechas formato JS  - ok
  {
    "fechaInicio": {data: "2011-01-03T06:00:00.000Z"},
    "fechaFinal": {data: "2021-04-20T06:00:00.000Z"},
    "nombrePaciente": "Brianna",
    "nombreDoctor": "Minerva",
    "ademasInactivos": "0"
  },//14 -	Fechas con objetos - ok
  {
    "fechaInicio": "2011-01-03T06:00:00.000Z",
    "fechaFinal": "2021-04-20T06:00:00.000Z",
    "nombrePaciente": {data: "Brianna"},
    "nombreDoctor": "Minerva",
    "ademasInactivos": "0"
  },//15 -	nombre objeto 
  {
    "fechaInicio": "2011-01-03T06:00:00.000Z",
    "fechaFinal": "2021-04-20T06:00:00.000Z",
    "nombrePaciente": {data: "Brianna"},
    "nombreDoctor": "Minerva",
    "ademasInactivos": {inactivo: "0"}
  },//15 -	admasInactivos como objeto
  {
    "fechaInicio": "2021-04-20",
    "fechaFinal": "2011-01-01",
    "nombrePaciente": "Brianna",
    "nombreDoctor": "Minerva",
    "ademasInactivos": "0"
  },//16 -	Fecha final menor a la fecha inicial
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
        await fetch (`${url}/consultaGeriatrica/buscarConsultaGeriatrica`, {
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