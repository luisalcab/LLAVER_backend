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
router.get('/promedioPuntajeIntervaloEdad', cors(), authController.isAuthenticated, promedioPuntajeIntervaloEdad)
router.get('/promedioSexoPuntaje', cors(), authController.isAuthenticated, promedioSexoPuntaje); // ok
router.post('/promedioGeneralIntervaloAnual', cors(), authController.isAuthenticated, promedioGeneralIntervaloAnual); // ok
router.get('/NumPorSexo', cors(), authController.isAuthenticated, NumPorSexo); // ok
router.get('/obtenerTotalExamem/:idConsulta/:idPaciente/:idExamen', cors(), authController.isAuthenticated, totalExamenByIdConsult); // ok

async function promedioPuntajeIntervaloEdad(req, res){
    res.send({
        response: await controller.promedioPuntajeIntervaloEdad(req.body, req.params)
    });  
}

async function promedioSexoPuntaje(req, res){
    res.send({
        response: await controller.promedioSexoPuntaje(req.body, req.params)
    })  
}

async function promedioGeneralIntervaloAnual(req, res){
    res.send({
        response: await controller.promedioGeneralIntervaloAnual(req.body, req.params)
    });
}


async function NumPorSexo(req, res){
    res.send({
        response: await controller.NumPorSexo(req.body, req.params)
    });
}

async function totalExamenByIdConsult(req, res){
    res.send({
        response: await controller.totalExamenByIdConsult(req.params)
    });
}
module.exports = router;