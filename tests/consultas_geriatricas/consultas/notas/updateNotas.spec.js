const fetch = require('node-fetch-commonjs');
const testUtils = require('../../../testUtils.js');

const url = 'http://localhost:3002';
//This test tests the user creation process (remember that our user is a doctor)
var credentials = {
    "email": "mina@gmail.com",
    "password": "1234"
}

var registers = [
    {
        data: {
            "nota": `Otra nota mas123`
        }, 
        identifier: {
            "idExamen": 1,
            "idConsulta": 50
        }
    }, //1 - Actualizar exitosa - ok
    {
        data: {
            "nota": ``
        }, 
        identifier: {
            "idExamen": 1,
            "idConsulta": 50
        }
    }, //2 - Nota vacia - ok
    {
        data: {
        }, 
        identifier: {
            "idExamen": 1,
            "idConsulta": 50
        }
    }, //3 - Sin JSON - ok
    {
        data: {
            "nota": {nota: "data"}
        }, 
        identifier: {
            "idExamen": 1,
            "idConsulta": 50
        }
    }, //4 - JSON compuesto - ok
    {
        data: {
            "nota": "data"
        }, 
        identifier: {
            "idExamen": "avd",
            "idConsulta": 50
        }
    }, //5 - param invalido - ok
    {
        data: {
            "nota": "data"
        }, 
        identifier: {
            "idExamen": 1,
            "idConsulta": "qwqw"
        }
    }, //6 - param invalido - ok
    {
        data: {
            "nota": {}
        }, 
        identifier: {
            "idExamen": 1,
            "idConsulta": "qwqw"
        }
    }, //7 - JSON vacio - ok
    {
        data: {
        }, 
        identifier: {
            "idExamen": 1,
            "idConsulta": "qwqw"
        }
    }, //8 - Sin body - ok
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
        await fetch (`${url}/consultaGeriatrica/modificarNota/${registers[i].identifier.idConsulta}/${registers[i].identifier.idExamen}`, {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json',
            'x-access-token': token,
            },
            body: JSON.stringify(registers[i].data)
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