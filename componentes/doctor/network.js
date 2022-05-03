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
router.put('/modificar/:idDoctor', cors(), authController.isAuthenticated, updateDataDoctor);
router.delete('/eliminar/:idDoctor', cors(), authController.isAuthenticated, deleteDataDoctor);
router.get('/obtenerDoctorId/:idDoctor', cors(), authController.isAuthenticated, getDoctorId);
router.post('/obtenerDoctoresNombre', cors(), authController.isAuthenticated, getDoctorName);
router.put('/activarStatusDoctor/:idDoctor', cors(), authController.isAuthenticated, activateStatusById);
router.put('/desactivarStatusPaciente/:idDoctor', cors(), authController.isAuthenticated, desactivateStautsById);
router.delete('/eliminarDoctor/:idDoctor', cors(), authController.isAuthenticated, deleteDoctorById);

async function updateDataDoctor(req, res){
    res.send({
        response: await controller.updateDataDoctor(req.body, req.params)
    })  
}

async function deleteDataDoctor(req, res){
    res.send({
        response: await controller.deleteDataDoctor(req.params)
    })
}

async function getDoctorId(req, res){
    res.send({
        response: await controller.getDoctorById(req.params)
    })
}

async function getDoctorName(req, res){
    res.send({
        response: await controller.getDoctorByName(req.body)
    })
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

async function deleteDoctorById(req, res){
    res.send({
        response: await controller.deleteDoctorById(req.params)
    });
}
module.exports = router;