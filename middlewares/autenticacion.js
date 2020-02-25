var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

/*******************************************
 * Verificar token
 *******************************************/
exports.verificaToken = function(req, res, next) {

    var token = req.query.token;

    jwt.verify(token, SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Token no correcte',
                errors: err
            });
        }

        req.usuario = decoded.usuario;

        next();

    });
}

/*******************************************
 * Verificar ADMIN_ROLE
 *******************************************/
exports.verificaADMIN_ROLE = function(req, res, next) {

    var usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {

        next();
        return;

    } else {

        return res.status(401).json({
            ok: false,
            mensaje: 'Token no correcte - no admin',
            errors: { message: 'No és administrador, no pot fer això' }
        });

    }

}

/*******************************************
 * Verificar ADMIN_ROLE o mateix usuari
 *******************************************/
exports.verificaADMIN_o_MismoUsuario = function(req, res, next) {

    var usuario = req.usuario;
    var id = req.params.id;

    if (usuario.role === 'ADMIN_ROLE' || usuario._id === id) {

        next();
        return;

    } else {

        return res.status(401).json({
            ok: false,
            mensaje: 'Token no correcte - no és admin ni mateix usuari',
            errors: { message: 'No és administrador, no pot fer això' }
        });

    }

}