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
router.post('/crearNuevaConsulta', cors(corsOptions), authController.isAuthenticated, createNewConsult);
router.get('/obtenerExamen/:idConsulta', cors(corsOptions), authController.isAuthenticated, getAllExamns);
router.get('/obtenerExamen/:idConsulta/:idPaciente/:idExamen', cors(corsOptions), authController.isAuthenticated, getExamnQuestionsById);
router.post('/obtenerExamen/:idConsulta/:idPaciente/:idExamen', cors(corsOptions), authController.isAuthenticated, setExamnQuestions);
router.get('/obtenerExamenPasado/:idConsulta/:idExamen', cors(corsOptions), authController.isAuthenticated, getExamnPastQuestions);

async function createNewConsult(req, res){
   
    res.send({ 
        status:  await controller.createNewConsult(req.body, await authController.sessionOF(req, res))
    })
}

async function getAllExamns(req, res){
    res.send({
        status: await controller.getAllExamns()
    });
}

async function getExamnQuestionsById(req, res){
    res.send({
        examenComplete: await controller.getExamnQuestionsById(req.params)
    })
}

async function setExamnQuestions(req, res){
    res.send({
        status: await controller.setExamnQuestions(req.body, req.params)
    });
}

async function getExamnPastQuestions(req, res){
    res.send({
        status: await controller.getExamnPastQuestions(req.params)
    });
}

module.exports = router;