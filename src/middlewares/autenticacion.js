const jwt_simple = require('jwt-simple');
const moment = require('moment');
const secret = 'clave_secreta';

exports.Auth = function(req, res, next) {
    console.log(req.cookies.accessToken, 'asdfasdas')
    if ( !req.cookies.accessToken ) {
        return res.status(404)
            .send({ message: 'La peticion, no posee la cabecera de Autenticacion' });
    }

    var token = req.cookies.accessToken.replace(/['"]+/g, '');

    try {
        var payload = jwt_simple.decode(token, secret);
        if(payload.exp <= moment().unix()){
            return res.status(404)
                .send({ message:'El token ya ha expirado' });
        }
    } catch (error) {
        return res.status(500)
            .send({ message: 'El token no es valido'})
    }

    req.user = payload;
    next();
}