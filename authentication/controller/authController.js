const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const config = require('../../configPersonal.js');
const { query } = require('../../conection_store/controllerStore.js');
const tablas = require('../../componentes/utils/tablasDatabase.js');
const responseFormat = require('../../componentes/utils/response.js');
const preventions = require('../../componentes/utils/preventions.js');

exports.login = async(data) =>{
    if(data.email == "" || data.password == "" || JSON.stringify(data) === '{}'){
        return responseFormat.response('Un espacio esta vacio', 200, 1);
    }

    const [ user ] = await query(`SELECT idDoctor, password FROM ${tablas.DOCTORES} WHERE email = "${data.email}";`);
    
    if(user && await bcryptjs.compare(data.password, user.password)){
        const payload = {
            check: true,
            idDoctor: user.idDoctor
        };

        const token = jwt.sign(payload, config.jwt.key, { expiresIn: config.jwt.time });
        
        return responseFormat.responseData(token, 200, 0);

    } else {
        return responseFormat.response('Usuario o contraseña incorrecta', 200, 1);
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
                return err;
            } else {
                return decoded.idDoctor;
            }
        })
    } else {
        return 0;
    }
}

exports.register = async (data) => {
        let resultPreventVoidJson = preventions.voidJson(["nombre", "apellido", "email", "password"], data);

        if(resultPreventVoidJson != 0)
            return responseFormat.response("Un campo esta vacio", 400, 3);

        let passHash = await bcryptjs.hash(data.password, config.hash.times);

        var [ verifyName ] = await query(`SELECT COUNT(idDoctor) as nameDoctor FROM ${ tablas.DOCTORES} 
                     WHERE CONCAT(nombre, apellido) = CONCAT('${data.nombre}', '${data.apellido}')`)
        
        if(verifyName.nameDoctor != 0)     
            return responseFormat.response("El 'nombre completo' que estas intentando poner ya existe", 400, 1);
        
            // Verify that the email is in correct format 
        let re = new RegExp(/(^([a-z]|[A-Z]|[0-9]|\.|\-)+\@(gmail|hotmail).com$)/, 's');
        if(!(re.test(data.email)))
            return responseFormat.response(`Formato de correo invalido, el correo solo puede contener numeros, 
            letras (tanto mayusculas como minusculas) y los simbolos: "." y "-".
            Ademas correo debe de finalizar con @gmail.com (tambien admite hotmail).
            El correo no puede tener espacios.
                                            `, 400, 4);

        return await query(`INSERT INTO ${ tablas.DOCTORES } (nombre, apellido, email, password) 
                     VALUES ('${data.nombre}', '${data.apellido}', 
                     '${data.email}', '${passHash}');`)
        .then(() => {
            return responseFormat.response("Se agrego un nuevo doctor", 201, 0);
        })
        .catch((error)=>{
            return responseFormat.response(error, 400, 2);
        });
}

exports.changePassword = async (data, element) => {
    let resultPreventVoidJson = preventions.voidJson(["password"], data);

    
    if(resultPreventVoidJson != 0 || typeof(data.password) == "object")
        return responseFormat.response("Formato JSON no valido", 400, 1);

    let passHash = await bcryptjs.hash(data.password, config.hash.times);
    return await query(`UPDATE ${ tablas.DOCTORES } SET password = '${ passHash }' WHERE (idDoctor = '${ element.idDoctor }');`)
    .then(() => {
        return responseFormat.response("Se actualizo la contraseña exitosamente", 200, 0);
    })
    .catch((error)=>{
        return responseFormat.response(error, 400, 3);
    });;
}