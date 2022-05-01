const fetch = require('node-fetch-commonjs');
const testUtils = require('../testUtils.js');

const url = 'https://geriatric-app.herokuapp.com/autenticacion/login';

//This test tests the login
var credentials = 
[
    {
        "email": "ferma@gmail.com",
        "password": "1234"
    }, //1 - Usuario que actualmente existe - ok
    {
        "email": "minas@gmail.com",
        "password": "1234"
    }, //2 - email erroneo - ok
    {
        "email": "mina@gmail.com",
        "password": "12345"
    }, //3 - contraseña erronea - ok
    {
        "email": "alguien@gmail.com",
        "password": "1234"
    }, //4 - Usuario no existe - ok
    {
        "email": "",
        "password": "1234"
    }, //5 - Envio email vacio
    {
        "email": "mina@gmail.com",
        "password": ""
    }, //6 - Envio contraseña vacia - ok
    {
        "email": "",
        "password": ""
    }, //7 - Envio todo vacio - ok
    {
        "password": ""
    }, //8 - Sin campo de email - ok
    {
        "email": "",
    }, //9 - Sin campo de password - ok
    {
    }, //10 - Sin campo - ok
]

async function test(credentials){
    for(var i = 0; i < credentials.length; i++){
        await fetch (url, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials[i])
        })
        .then(async (response) => {
            const data = await response.json();
            testUtils.result(i+1, credentials[i],  data.response )
        })
        .catch((error) => {
            console.log(error)
        });
    }
}

test(credentials);