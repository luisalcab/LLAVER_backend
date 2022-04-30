// Importar dependencias
const express = require('express');
const cors = require('cors');

// Importando capa de negocios
const controller = require('./index.js');

// Importando capa de seguridad
const authController = require('../../authentication/controller/authController.js');

// Inicializando router
const router = express.Router();

// Utils
const { corsOptions } = require('../utils/cors.js');

// Rutas
router.post('/agregarNuevoCuidador', cors(corsOptions), authController.isAuthenticated,  addNewCarer);
router.get('/obtenerCuidadorId/:idCuidador', cors(corsOptions), authController.isAuthenticated,  getCarerById);
router.post('/obtenerCuidadoresNombre', cors(corsOptions), authController.isAuthenticated, getCarerByName);
router.put('/modificarCuidadores/:idCuidador', cors(corsOptions), authController.isAuthenticated,  updateDataCarer);
// Queda pendiente la eliminacion del Cuidador, hasta ahorita tenemos su estatus cambiara a "0"

async function addNewCarer(req, res){
    res.send({
        response: await controller.addNewCarer(req.body)
    });
}

async function getCarerById(req, res){
    res.send({
        response: await controller.getCarerById(req.params)
    });
}

async function getCarerByName(req, res){
    res.send({
        response: await controller.getCarerByName(req.body)
    });
}

//Pendiente a agregar validacion
async function updateDataCarer(req, res){
    res.send({
        response: await controller.updateDataCarer(req.body, req.params)
    });
}


module.exports = router;