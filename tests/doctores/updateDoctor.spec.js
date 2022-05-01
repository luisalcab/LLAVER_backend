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
            "email": `fermasz${Math.random()}@gmail.com`
        }, 
        identifier: {
            "idPaciente": 52
        }
    }, //1 - Actualizar exitosa - ok
    {
        data: {
            "nombre": "Fernando",
            "apellido": "Macedo",
            "email": "ferma@gmail.com"
        }, 
        identifier: {
            "idPaciente": 51
        }
    }, //2 - Actualizar nombre repetidos - OK
    {
        data: {
            "nombre": `Flor${Math.random()}`,
            "apellido": `Gomez${Math.random()}`,
            "email": `fermasz${Math.random()}@gmail.com`
        }, 
        identifier: {
            "idPaciente": "52"
        }
    }, //3 - Pasar como parametro un texto - ok
    {
        data: {
            "nombre": `Flor${Math.random()}`,
            "apellido": `Gomez${Math.random()}`,
            "email": `fermasz${Math.random()}@gmail.com`
        }, 
        identifier: {
            "idPaciente": "{}"
        }
    }, //4 - Pasar como parametro un vacio - ok
    {
        data: {
            "nombre": `Flor${Math.random()}`,
            "apellido": `Gomez${Math.random()}`,
            "email": `fermasz${Math.random()}@gmail.com`
        }, 
        identifier: {
            "idPaciente": "abc"
        }
    }, //5 - Pasar como parametro una variable no permitida - OK
    {
        data: {
            "nombre": `Flor${Math.random()}`,
        }, 
        identifier: {
            "idPaciente": "52"
        }
    }, //6 - Pasar JSON incompleto1 - ok
    {
        data: {
            "apellido": `Gomez${Math.random()}`,
            "email": `fermasz${Math.random()}@gmail.com`
        }, 
        identifier: {
            "idPaciente": "52"
        }
    }, //7 - Pasar JSON incompleto2
    {
        data: {
        }, 
        identifier: {
            "idPaciente": "52"
        }
    }, //8 - Pasar JSON nulo - ok
    {
        data: {
            "apellido": `Gomez${Math.random()}`,
            "email": `fermasz${Math.random()}@gmail.com`,
            "nombre": `Flor${Math.random()}`,
        }, 
        identifier: {
            "idPaciente": 52
        }
    }, //9 - Pasar JSON sin orden - ok
    {
        data: {
            "holaMundo": `Gomez${Math.random()}`,
            "apellido": `Gomez${Math.random()}`,
            "email": `fermasz${Math.random()}@gmail.com`,
            "nombre": `Flor${Math.random()}`,
        }, 
        identifier: {
            "idPaciente": 52
        }
    }, //10 - Pasar JSON con otra tupla - ok
    {
        data: {
            "apellido": ``,
            "escolaridad": ``,
            "nombre": ``,
            "sexo": ``,
            "idDoctor": ``,
            "fechaNacimiento": ``
        }, 
        identifier: {
            "idPaciente": 52
        }
    }, //11 - Pasar JSON vacio - ok <-pendiente
    {
        data: {
            "email": `fermasz${Math.random()}@gmail.com`,
        }, 
        identifier: {
            "idPaciente": 52
        }
    }, //12 - Solo actualizar email - ok
    {
        data: {
            "nombre": `Flor${Math.random()}`,
        }, 
        identifier: {
            "idPaciente": 52
        }
    }, //13 - Solo actualizar nombre - ok
    {
        data: {
            "apellido": `Gomez${Math.random()}`,
        }, 
        identifier: {
            "idPaciente": 52
        }
    }, //14 - Solo actualizar apellido - ok
    {
        data: {
            "email": `mina@gmail.com`,
        }, 
        identifier: {
            "idPaciente": 52
        }
    }, //15 - Email repetido - ok
    {
        data: {
            "email": `ferma@yahoo.com`,
        },
        identifier: {
            "idPaciente": 52
        }
    }, //16 - Extension de correo invalido - ok
    {
        data: {
            "email": `#ferma@yahoo.com`,
        },
        identifier: {
            "idPaciente": 52
        }
    }, //17 - Extension uso de caracteres no permitidos en correo - ok
    {
        data: {
            "email": `ferma${Math.random()}@hotmail.com `,
        },
        identifier: {
            "idPaciente": 52
        }
    }, //18 - Extension correo con espacios final - ok
    {
        data: {
            "email": ` ferma${Math.random()}@hotmail.com`,
        },
        identifier: {
            "idPaciente": 52
        }
    }, //19 - Extension correo con espacios inicio - ok
    {
        data: {
            "email": `ferma ${Math.random()}@hotmail.com`,
        },
        identifier: {
            "idPaciente": 52
        }
    }, //20 - Extension correo con espacios en medio - ok
    {
        data: {
            "email": `ferma${Math.random()}@hotmail.net`,
        },
        identifier: {
            "idPaciente": 52
        }
    }, //21 - Dominio no permitido - ok
    {
        data: {
            "email": `ferma${Math.random()}@hotmail.com`,
        },
        identifier: {
            "idPaciente": 52
        }
    }, //22 - Extension agregado exitoso pero con extension hotmail - ok
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
        await fetch (`${url}/doctor/modificar/${registers[i].identifier.idPaciente}`, {
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