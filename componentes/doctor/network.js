// Importar dependencias
const express = require('express');
const cors = require('cors');

// Importar capa de negocios
const controller = require('./index.js');

// Inicializando router
const router = express.Router();

//Utils
const { corsOptions } = require('../utils/cors.js');

//Rutas de este componente
router.get('/', cors(corsOptions), getDoctor);
router.post('/agregar', cors(corsOptions), addDoctor);

async function getDoctor(req, res){
    res.send({data: await controller.getDoctors()})
}

/*
recibe json:
    nombre
    apellido
    email
    password

Envia respuesta:
    status:
    1 ok
    2 Nombre ya existente (Nombre apellido)
    3 email
*/
async function addDoctor(req, res){
    res.send({
        status: await controller.addNewDoctor(req.body)
    });
}

module.exports = router;