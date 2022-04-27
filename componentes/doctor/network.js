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
router.put('/modificar/:idDoctor', cors(corsOptions), authController.isAuthenticated, updateDataDoctor);
router.delete('/eliminar/:idDoctor', cors(corsOptions), authController.isAuthenticated, deleteDataDoctor);
router.get('/obtenerDoctorId/:idDoctor', cors(corsOptions), authController.isAuthenticated, getDoctorId);
router.post('/obtenerDoctoresNombre', cors(corsOptions), authController.isAuthenticated, getDoctorName);

async function updateDataDoctor(req, res){
    res.send({
        status: await controller.updateDataDoctor(req.body, req.params)
    })  
}

async function deleteDataDoctor(req, res){
    res.send({
        status: await controller.deleteDataDoctor(req.params)
    })
}

async function getDoctorId(req, res){
    res.send({
        status: await controller.getDoctorById(req.params)
    })
}

async function getDoctorName(req, res){
    res.send({
        status: await controller.getDoctorByName(req.body)
    })
}
module.exports = router;