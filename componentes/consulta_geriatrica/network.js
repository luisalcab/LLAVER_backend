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
router.get('/obtenerExamenes', cors(corsOptions), authController.isAuthenticated, getAllExamns);
router.get('/obtenerExamen/:idConsulta/:idPaciente/:idExamen', cors(corsOptions), authController.isAuthenticated, getExamnQuestionsById);
router.post('/obtenerExamen/:idConsulta/:idPaciente/:idExamen', cors(corsOptions), authController.isAuthenticated, setExamnQuestions);
router.get('/obtenerExamenPasado/:idConsulta/:idExamen', cors(corsOptions), authController.isAuthenticated, getExamnPastQuestions);
router.post('/buscarConsultaGeriatrica', cors(corsOptions), authController.isAuthenticated, searchGeriatricConsults);
router.get('/obtenerConsultaGeriatrica/Pendiente', cors(corsOptions), authController.isAuthenticated, getAllGeriatricConsultPending);
router.get('/obtenerConsultaGeriatrica/:idConsulta', cors(corsOptions), authController.isAuthenticated, getGeriatricConsultById);
router.put('/terminarConsultaGeriatrica/:idConsulta', cors(corsOptions), authController.isAuthenticated, finishGeriatricConsultById)

async function createNewConsult(req, res){
    res.send({ 
        response:  await controller.createNewConsult(req.body, await authController.sessionOF(req, res))
    })
}

async function getAllExamns(req, res){
    res.send({
        response: await controller.getAllExamns()
    });
}

async function getExamnQuestionsById(req, res){
    res.send({
        response: await controller.getExamnQuestionsById(req.params)
    })
}

async function setExamnQuestions(req, res){
    res.send({
        status: await controller.setExamnQuestions(req.body, req.params)
    });
}

async function getExamnPastQuestions(req, res){
    res.send({
        response: await controller.getExamnPastQuestions(req.params)
    });
}

async function searchGeriatricConsults(req, res){
    res.send({
        response: await controller.searchGeriatricConsults(req.body)
    })
}

async function getGeriatricConsultById(req, res){
    res.send({
        response: await controller.getGeriatricConsultById(req.params)
    })
}

async function finishGeriatricConsultById(req, res){
    res.send({
        response: await controller.finishGeriatricConsultById(req.params)
    })
}

async function getAllGeriatricConsultPending(req, res){
    res.send({
        response: await controller.getAllGeriatricConsultPending()
    })
}
module.exports = router;