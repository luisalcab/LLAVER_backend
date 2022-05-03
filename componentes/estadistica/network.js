// Importar dependencias
const express = require('express');
const cors = require('cors');

// Importar capa de negocios
const controller = require('./index.js');

// Importar capa de autenticación
const authController = require('../../authentication/controller/authController.js');

// Inicializando router
const router = express.Router();

//Utils
const { corsOptions } = require('../utils/cors.js');

//Rutas de este componente
router.post('/promedioEdadPuntaje', cors(corsOptions), authController.isAuthenticated, promedioEdadPuntaje);
router.post('/promedioSexoPuntaje', cors(corsOptions), authController.isAuthenticated, promedioSexoPuntaje);
router.post('/promediosAnosPuntaje', cors(corsOptions), authController.isAuthenticated, promedioAnosPuntaje);
router.post('/NumPorSexo', cors(corsOptions), authController.isAuthenticated, NumPorSexo);


async function promedioEdadPuntaje(req, res){
    res.send({
        response: await controller.promedioEdadPuntaje(req.body, req.params)
    })  
}

async function promedioSexoPuntaje(req, res){
    res.send({
        response: await controller.promedioSexoPuntaje(req.body, req.params)
    })  
}

async function promedioAnosPuntaje(req, res){
    res.send({
        response: await controller.promedioAnosPuntaje(req.body, req.params)
    })  
}

async function NumPorSexo(req, res){
    res.send({
        response: await controller.NumPorSexo(req.body, req.params)
    })  
}

module.exports = router;