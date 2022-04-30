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
router.post('/agregarNuevoPaciente', cors(corsOptions), authController.isAuthenticated,  addNewPatient);
router.get('/obtenerPacienteId/:idPaciente', cors(corsOptions), authController.isAuthenticated,  getPatientById);
router.post('/obtenerPacientesNombre', cors(corsOptions), authController.isAuthenticated, getPatientByName);
router.put('/modificarPaciente/:idPaciente', cors(corsOptions), authController.isAuthenticated,  updateDataPatient);
router.put('/activarStatusPaciente/:idPaciente', cors(corsOptions), authController.isAuthenticated, activateStatusById);
router.put('/desactivarStatusPaciente/:idPaciente', cors(corsOptions), authController.isAuthenticated, desactivateStautsById);
router.delete('/eliminarPaciente/:idPaciente', cors(corsOptions), authController.isAuthenticated, deletePacienteById)
// Queda pendiente la eliminacion del paciente, hasta ahorita tenemos su estatus cambiara a "0"

async function addNewPatient(req, res){
    res.send({
        response: await controller.addNewPatient(req.body)
    });
}

async function getPatientById(req, res){
    res.send({
        response: await controller.getPatientById(req.params)
    });
}

async function getPatientByName(req, res){
    res.send({
        response: await controller.getPatientByName(req.body)
    });
}

//Pendiente a agregar validacion
async function updateDataPatient(req, res){
    res.send({
        response: await controller.updateDataPatient(req.body, req.params)
    });
}

async function activateStatusById(req, res){
    res.send({
        response: await controller.activateStatusById(req.params)
    });   
}

async function desactivateStautsById(req, res){
    res.send({
        response: await controller.desactivateStatusById(req.params)
    });  
}

async function deletePacienteById(req, res){
    res.send({
        response: await controller.deletePacienteById(req.params)
    });  
}
module.exports = router;