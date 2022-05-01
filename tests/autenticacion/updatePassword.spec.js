const fetch = require('node-fetch-commonjs');
const testUtils = require('../testUtils.js');

const url = 'http://localhost:3002';
//This test tests the user creation process (remember that our user is a doctor)

var registers = [
    {
        data: {
            "password": `asa123`,
        },
        identifier: {
            "idDoctor": 52
        }
    }, //1 - Cambio de contraseña exitosa - ok
    {
        data: {
            "password": ``,
        },
        identifier: {
            "idDoctor": 52
        }
    }, //2 - JSON vacio - ok
    {
        data: {
            "password": ` a `,
        },
        identifier: {
            "idDoctor": 52
        }
    }, //3 - Contraseña con espacio <- pendiente
    {
        data: {
            "password": `aw`,
        },
        identifier: {
            "idDoctor": {}
        }
    }, //4 - Id invalido <- ok
    {
        data: {
            "password": `aw`,
        },
        identifier: {
            "idDoctor": "a"
        }
    }, //5 - Id invalido <- ok
    {
        data: {
            "password": `as`
        },
        identifier: {
            "idDoctor": 0
        }
    }, //6 - id invalido <- ok
    {
        data: {
            "otroNombre": `as`
        },
        identifier: {
            "idDoctor": 52
        }
    }, //7 - Otro nombre
    {
        data: {
            "password": {data: "complejo"}
        },
        identifier: {
            "idDoctor": 52
        }
    }, //8 - json compuesto - ok
]


async function test( registers){
     for(var i = 0; i < registers.length; i++){
        await fetch (`${url}/autenticacion/changePassword/${registers[i].identifier.idDoctor}`, {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json',
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

test(registers);