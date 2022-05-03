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
router.post('/crearNuevaConsulta', cors(), authController.isAuthenticated, createNewConsult);
router.get('/obtenerExamenes', cors(), authController.isAuthenticated, getAllExamns);
router.get('/obtenerExamen/:idExamen', cors(), authController.isAuthenticated, getExamnQuestionsById);
router.post('/obtenerExamen/:idConsulta/:idPaciente/:idExamen', cors(), authController.isAuthenticated, setExamnQuestions);
router.get('/obtenerExamenPasado/:idConsulta/:idExamen', cors(), authController.isAuthenticated, getExamnPastQuestions);
router.post('/buscarConsultaGeriatrica', cors(), authController.isAuthenticated, searchGeriatricConsults);
router.get('/obtenerConsultaGeriatrica/Pendiente', cors(), authController.isAuthenticated, getAllGeriatricConsultPending);
router.get('/obtenerConsultaGeriatrica/:idConsulta', cors(), authController.isAuthenticated, getGeriatricConsultById);
router.put('/terminarConsultaGeriatrica/:idConsulta', cors(), authController.isAuthenticated, finishGeriatricConsultById)
router.delete('/eliminarConsulta/:idConsulta', cors(), authController.isAuthenticated, deleteConsultById);

//Notas
router.get('/obtenerNotasConsulta/:idConsulta', cors(), authController.isAuthenticated, getAllnotesOfAConsult);
router.put('/modificarNota/:idConsulta/:idExamen', cors(), authController.isAuthenticated, modifyNoteById)

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
        response: await controller.setExamnQuestions(req.body, req.params)
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
    });
}

async function getGeriatricConsultById(req, res){
    res.send({
        response: await controller.getGeriatricConsultById(req.params)
    });
}

async function finishGeriatricConsultById(req, res){
    res.send({
        response: await controller.finishGeriatricConsultById(req.params)
    });
}

async function getAllGeriatricConsultPending(req, res){
    res.send({
        response: await controller.getAllGeriatricConsultPending()
    });
}

async function getAllnotesOfAConsult(req, res){
    res.send({
        response: await controller.getAllnotesOfAConsult(req.params)
    });
}

async function modifyNoteById(req, res){
    res.send({
        response: await controller.modifyNoteById(req.body, req.params)
    })
}

async function deleteConsultById(req, res){
    res.send({
        response: await controller.deleteConsultById(req.params)
    })   
}
module.exports = router;