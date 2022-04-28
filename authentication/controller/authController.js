const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const config = require('../../configPersonal.js');
const { query } = require('../../conection_store/controllerStore.js');
const tablas = require('../../componentes/utils/tablasDatabase.js');
const responseFormat = require('../../componentes/utils/response.js');

exports.login = async(req, res) =>{

    if(req.body.email == "" && req.body.password == ""){
        res.send({response: responseFormat.response("Un campo esta vacio", 400, 3)});
    }

    const [ user ] = await query(`SELECT idDoctor, password FROM ${tablas.DOCTORES} WHERE email = "${req.body.email}";`);
    
    if(user && await bcryptjs.compare(req.body.password, user.password)){
        const payload = {
            check: true,
            idDoctor: user.idDoctor
        };

        const token = jwt.sign(payload, config.jwt.key, { expiresIn: config.jwt.time });
        
        res.send({ response: responseFormat.responseData(token, 200, 0) });

    } else {
        res.send({response: responseFormat.response('Usuario o contraseña incorrecta', 200, 0)})
    }
}

exports.isAuthenticated = async(req, res, next) => {
    const token = req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, config.jwt.key, (err, decoded) => {
            if (err) {
                res.send({response: responseFormat.response('Sesión expirada o token no valido', 403, 0)});
            } else {
                req.decoded = decoded
                next();
            }
        })
    } else {
        res.send({response: responseFormat.response('Usuario no identificado', 403, 0)});
        // res.send({ mensaje: "Usuario no identificado" })
    }
}

exports.sessionOF = async(req, res) => {
    const token = await req.headers['x-access-token'];
    if (token) {
        return await jwt.verify(token, config.jwt.key, (err, decoded) => {
            if (err) {
                // return res.json({ mensaje: 'Token invalido' });
            } else {
                // console.log(decoded.idDoctor)
                return decoded.idDoctor;
                // res.send({idDoctor: decoded.idDoctor});
            }
        })
    } else {
        return 0;
        res.send({ mensaje: "Usuario no identificado" })
    }
}

exports.register = async (data) => {
        for (const key in data){
            if(data[key] == "") return responseFormat.response("Un campo esta vacio", 400, 3); 
        } 

        let passHash = await bcryptjs.hash(data.password, config.hash.times);

        var [ verifyName ] = await query(`SELECT COUNT(idDoctor) as nameDoctor FROM ${ tablas.DOCTORES} 
                     WHERE CONCAT(nombre, apellido) = CONCAT('${data.nombre}', '${data.apellido}')`)
        
        if(verifyName.nameDoctor != 0)     
            return responseFormat.response("El 'nombre completo' que estas intentando poner ya existe", 400, 1);
 
        return await query(`INSERT INTO ${ tablas.DOCTORES } (nombre, apellido, email, password) 
                     VALUES ('${data.nombre}', '${data.apellido}', 
                     '${data.email}', '${passHash}');`)
        .then(() => {
            return responseFormat.response("Se agrego el nuevo doctor", 201, 0);
        })
        .catch((error)=>{
            return responseFormat.response(error, 400, 2);
        });
}