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
        data: {
            "nombre": `Natalia${Math.random()}`,
	        "apellido": `Dominguez${Math.random()}`,
	        "telefono": `23-2235-5688`
        }, 
        identifier: {
            "idPaciente": 47
        }
    }, //1 - Actualizar exitosa - ok
    {
        data: {
            "nombre": `Natalia`,
            "apellido": `Dominguez`,
	        "telefono": `23-2345-5678`
        }, 
        identifier: {
            "idPaciente": 8
        }
    }, //2 - Actualizar nombre repetidos - OK
    {
        data: {
            "nombre": `Natalia${Math.random()}`,
	        "apellido": `Dominguez${Math.random()}`,
	        "telefono": `2323455678`
        }, 
        identifier: {
            "idPaciente": 47
        }
    }, //3 - Actualizar valor no permitido para escolaridad - OK
    {
        data: {
            "nombre": `Natalia${Math.random()}`,
	        "apellido": `Dominguez${Math.random()}`,
	        "telefono": `23-2345-5108`
        }, 
        identifier: {
            "idPaciente": "47"
        }
    }, //9 - Psaar como parametro un texto - ok
    {
        data: {
            "nombre": `Natalia${Math.random()}`,
	        "apellido": `Dominguez${Math.random()}`,
	        "telefono": `23-2095-5678`
        }, 
        identifier: {
            "idPaciente": "{}"
        }
    }, //10 - Pasar como parametro un vacio - ok
    {
        data: {
            "nombre": `Natalia${Math.random()}`,
	        "apellido": `Dominguez${Math.random()}`,
	        "telefono": `23-2005-5678`
        }, 
        identifier: {
            "idPaciente": "abc"
        }
    }, //11 - Pasar como parametro una variable no permitida - OK
    {
        data: {
            "nombre": `Natalia${Math.random()}`,
	        "telefono": `23-9345-5678`
        }, 
        identifier: {
            "idPaciente": 47
        }
    }, //12 - Pasar JSON incompleto1 - ok
    {
        data: {
        }, 
        identifier: {
            "idPaciente": 47
        }
    }, //14 - Pasar JSON nulo - ok
    {
        data: {
            "nombre": `Natalia${Math.random()}`,
	        "telefono": `23-8345-5678`,
            "apellido": `Dominguez${Math.random()}`
        }, 
        identifier: {
            "idPaciente": 47
        }
    }, //15 - Pasar JSON sin orden - ok
    {
        data: {
            "nombre": ``,
	        "apellido": ``,
	        "telefono": ``
        }, 
        identifier: {
            "idPaciente": 47
        }
    }, //16 - Pasar JSON vacio - ok
    {
        data: {
            "nombres": `Natalia${Math.random()}`,
	        "apellido": `Dominguez${Math.random()}`,
	        "telefonos": `84-2005-5678`
        }, 
        identifier: {
            "idPaciente": 47
        }
    }, //16 - Pasar JSON erroneos - ok

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
        await fetch (`${url}/cuidador/modificarCuidadores/${registers[i].identifier.idPaciente}`, {
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