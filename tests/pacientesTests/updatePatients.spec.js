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
            "nombre": `Flor${Math.random()}`,
            "apellido": `Gomez${Math.random()}`,
            "escolaridad": `6`,
            "fechaNacimiento": `2021-04-05`,
            "sexo": `0`,
            "idDoctor": `48`
        }, 
        identifier: {
            "idPaciente": 30
        }
    }, //1 - Actualizar exitosa - ok
    {
        data: {
            "nombre": `Flor`,
            "apellido": `Gomez`,
            "escolaridad": `6`,
            "fechaNacimiento": `2021-04-05`,
            "sexo": `0`,
            "idDoctor": `48`
        }, 
        identifier: {
            "idPaciente": 27
        }
    }, //2 - Actualizar nombre repetidos - OK
    {
        data: {
            "nombre": `Flor${Math.random()}`,
            "apellido": `Gomez${Math.random()}`,
            "escolaridad": `a`,
            "fechaNacimiento": `2021-04-05`,
            "sexo": `0`,
            "idDoctor": `48`
        }, 
        identifier: {
            "idPaciente": 30
        }
    }, //3 - Actualizar valor no permitido para escolaridad - OK
    {
        data: {
            "nombre": `Flor${Math.random()}`,
            "apellido": `Gomez${Math.random()}`,
            "escolaridad": `6`,
            "fechaNacimiento": `05-04-2021`,
            "sexo": `0`,
            "idDoctor": `48`
        }, 
        identifier: {
            "idPaciente": 30
        }
    }, //4 - Actualizar fecha con formato erroneo - OK
    {
        data: {
            "nombre": `Flor${Math.random()}`,
            "apellido": `Gomez${Math.random()}`,
            "escolaridad": `6`,
            "fechaNacimiento": `2021-04-05`,
            "sexo": `a`,
            "idDoctor": `48`
        }, 
        identifier: {
            "idPaciente": 30
        }
    }, //5 - Valor no permitido para sexo - OK
    {
        data: {
            "nombre": `Flor${Math.random()}`,
            "apellido": `Gomez${Math.random()}`,
            "escolaridad": `6`,
            "fechaNacimiento": `2021-04-05`,
            "sexo": `2`,
            "idDoctor": `48`
        }, 
        identifier: {
            "idPaciente": 30
        }
    }, //6 - Valor myor para sexo (0 1) - ok
    {
        data: {
            "nombre": `Flor${Math.random()}`,
            "apellido": `Gomez${Math.random()}`,
            "escolaridad": `6`,
            "fechaNacimiento": `2021-04-05`,
            "sexo": `0`,
            "idDoctor": `a`
        }, 
        identifier: {
            "idPaciente": 30
        }
    }, //7 - Actualizar a doctor con valor no permitido - ok
    {
        data: {
            "nombre": `Flor${Math.random()}`,
            "apellido": `Gomez${Math.random()}`,
            "escolaridad": `6`,
            "fechaNacimiento": `2021-04-05`,
            "sexo": `0`,
            "idDoctor": `1`
        }, 
        identifier: {
            "idPaciente": 30
        }
    }, //8 - Actualizar a doctor que no existe  - ok
    {
        data: {
            "nombre": `Flor${Math.random()}`,
            "apellido": `Gomez${Math.random()}`,
            "escolaridad": `6`,
            "fechaNacimiento": `2021-04-05`,
            "sexo": `0`,
            "idDoctor": `48`
        }, 
        identifier: {
            "idPaciente": "30"
        }
    }, //9 - Psaar como parametro un texto - ok
    {
        data: {
            "nombre": `Flor${Math.random()}`,
            "apellido": `Gomez${Math.random()}`,
            "escolaridad": `6`,
            "fechaNacimiento": `2021-04-05`,
            "sexo": `0`,
            "idDoctor": `48`
        }, 
        identifier: {
            "idPaciente": "{}"
        }
    }, //10 - Pasar como parametro un vacio - ok
    {
        data: {
            "nombre": `Flor${Math.random()}`,
            "apellido": `Gomez${Math.random()}`,
            "escolaridad": `6`,
            "fechaNacimiento": `2021-04-05`,
            "sexo": `0`,
            "idDoctor": `48`
        }, 
        identifier: {
            "idPaciente": "abc"
        }
    }, //11 - Pasar como parametro una variable no permitida - OK
    {
        data: {
            "fechaNacimiento": `2021-04-05`,
            "sexo": `0`,
            "idDoctor": `48`
        }, 
        identifier: {
            "idPaciente": "30"
        }
    }, //12 - Pasar JSON incompleto1 - ok
    {
        data: {
            "nombre": `Flor${Math.random()}`,
            "apellido": `Gomez${Math.random()}`,
            "escolaridad": `10`,
        }, 
        identifier: {
            "idPaciente": "30"
        }
    }, //13 - Pasar JSON incompleto2
    {
        data: {
        }, 
        identifier: {
            "idPaciente": "30"
        }
    }, //14 - Pasar JSON nulo - ok
    {
        data: {
            "apellido": `Gomez${Math.random()}`,
            "escolaridad": `6`,
            "nombre": `Flor${Math.random()}`,
            "sexo": `0`,
            "idDoctor": `48`,
            "fechaNacimiento": `2021-04-05`
        }, 
        identifier: {
            "idPaciente": 30
        }
    }, //15 - Pasar JSON sin orden - ok
    // {
    //     data: {
    //         "apellido": ``,
    //         "escolaridad": ``,
    //         "nombre": ``,
    //         "sexo": ``,
    //         "idDoctor": ``,
    //         "fechaNacimiento": ``
    //     }, 
    //     identifier: {
    //         "idPaciente": 30
    //     }
    // }, //16 - Pasar JSON vacio - ok <-pendiente
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
        await fetch (`${url}/paciente/modificarPaciente/${registers[i].identifier.idPaciente}`, {
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