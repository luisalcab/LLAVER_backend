//Importando dependencias
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");

//Importando componentes
const DOCTOR = require('./componentes/doctor/network.js');
const CUIDADOR = require('./componentes/cuidador/network.js');
const PACIENTE = require('./componentes/paciente/network.js');
const AUTENTICACION = require('./componentes/autenticacion/network.js');
const CONSULTA_GERIATRICA = require('./componentes/consulta_geriatrica/network.js');

//Importando archivo de configuracion
const config = require('./configPersonal.js');

//Inicializando servidor
const app = express();


//Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());


//Swagger docuemntation
const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: "Documentacion API proyecto geriatria",
            version: "1.0.0",
            description: "",
        },
        server: ["http://localhost:3002"]
    },
    basePath: "/",
    apis:   [
                "./componentes/autenticacion/*.js",
                "./componentes/consulta_geriatrica/*.js",
                "./componentes/cuidador/*.js",
                "./componentes/doctor/*.js",
                "./componentes/paciente/*.js",
            ]
}

const specs = swaggerJsDoc(swaggerOptions);

// const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

//Componentes
app.use('/doctor', DOCTOR);
app.use('/cuidador', CUIDADOR);
app.use('/paciente', PACIENTE);
app.use('/autenticacion', AUTENTICACION);
app.use('/consultaGeriatrica', CONSULTA_GERIATRICA);


//Asignando puerto
app.listen(config.api.port, ()=>{
    // if(!false){
    //     console.log = function(){}
    //  }
    console.log(`Escuchando en el puerto: ${ config.api.port }`);
});