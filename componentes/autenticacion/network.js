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
router.post('/login', cors(), loginProcess);
router.post('/register', cors(), registerProcess);
router.put('/changePassword/:idDoctor', cors(), changePassword);
// router.get('/sessionOf', cors(), authController.sessionOF);

async function registerProcess(req, res){
    res.send({
        response: await authController.register(req.body)
    })
}

async function loginProcess(req, res){
    res.send({
        response: await authController.login(req.body)
    });
}

async function changePassword(req, res){
    res.send({
        response: await authController.changePassword(req.body, req.params)
    });
}
module.exports = router;