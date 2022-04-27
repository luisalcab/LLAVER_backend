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
router.post('/login', cors(corsOptions), authController.login);
router.post('/register', cors(corsOptions), authController.register);
// router.get('/sessionOf', cors(corsOptions), authController.sessionOF);


module.exports = router;