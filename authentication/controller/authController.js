const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const config = require('../../configPersonal.js');
const { query } = require('../../conection_store/controllerStore.js');
const tablas = require('../../componentes/utils/tablasDatabase.js');

exports.login = async(req, res) =>{
    const [ user ] = await query(`SELECT idDoctor, password FROM ${tablas.DOCTORES} WHERE email = "${req.body.email}";`);
    
    if(user && await bcryptjs.compare(req.body.password, user.password)){
        const payload = {
            check: true,
            idDoctor: user.idDoctor
        };

        const token = jwt.sign(payload, config.jwt.key, { expiresIn: config.jwt.time });
        
        res.json({
            mensaje: 'Autenticación correcta',
            token: token
        });

    } else {
        res.json({mensaje: 'Usuario o contraseña incorrecta'})
    }
}

exports.isAuthenticated = async(req, res, next) => {
    const token = req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, config.jwt.key, (err, decoded) => {
            if (err) {
                return res.json({ mensaje: 'Token invalido' });
            } else {
                req.decoded = decoded
                next();
            }
        })
    } else {
        res.send({ mensaje: "Usuario no identificado" })
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

exports.register = async(req, res) => {
    try {
        let passHash = await bcryptjs.hash(req.body.password, config.hash.times);
        await query(`INSERT INTO ${ tablas.DOCTORES } (nombre, apellido, email, password) 
        VALUES ('${req.body.nombre}', '${req.body.apellido}', '${req.body.email}', '${passHash}');`)
        .catch((error)=>{
            res.send({"code": error})
        });

        res.send({"status": 1});

    } catch (error) {
        console.log(error)
    }   
}