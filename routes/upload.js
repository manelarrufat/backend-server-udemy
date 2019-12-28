var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs'); // file system de nodejs

var app = express();

var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');

// default options
app.use(fileUpload());

app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    // tipus de col·lecció
    var tiposValidos = ['hospitales', 'medicos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipus de col·lecció no és vàlid',
            errors: { message: 'Tipus de col·lecció no és vàlid' }
        });
    }

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No s´ha seleccionat res',
            errors: { message: 'S´ha de seleccionar una imatge' }
        });
    }

    // Obtenir el nom del fitxer
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];

    // Només acceptem aquestes extensions
    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extensió de fitxer no vàlida',
            errors: { message: 'Les extensions vàlides són: ' + extensionesValidas.join(', ') }
        });
    }

    // Nom fitxer personalitzat - 123456789-123.png (identificador-random.png)
    var nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extensionArchivo }`;

    // moure el fitxer temporal a un path
    var path = `./uploads/${ tipo }/${ nombreArchivo }`;

    archivo.mv(path, err => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al moure el fitxer',
                errors: err
            });
        }

        subirPorTipo(tipo, id, nombreArchivo, res);



    });

});


function subirPorTipo(tipo, id, nombreArchivo, res) {

    if (tipo === 'usuarios') {

        Usuario.findById(id, (err, usuario) => {

            if (!usuario) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Usuari no existeix',
                    errors: err
                });
            }

            var pathViejo = './uploads/usuarios/' + usuario.img;

            // Si existeix, elimina la imatge anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }

            // Pugem la imatge nova
            usuario.img = nombreArchivo;
            usuario.save((err, usuarioActualizado) => {

                usuarioActualizado.password = ':)';

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error a l´actualitzar la imatge de l´usuari',
                        errors: err
                    });
                }

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imatge usuari actualitzada',
                    usuario: usuarioActualizado
                });

            });



        });

    }

    if (tipo === 'medicos') {

        Medico.findById(id, (err, medico) => {

            if (!medico) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Metge no existeix',
                    errors: err
                });
            }

            var pathViejo = './uploads/medicos/' + medico.img;

            // Si existeix, elimina la imatge anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }

            // Pugem la imatge nova
            medico.img = nombreArchivo;
            medico.save((err, medicoActualizado) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error a l´actualitzar la imatge del metge',
                        errors: err
                    });
                }

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imatge metge actualitzada',
                    medico: medicoActualizado
                });

            });



        });


    }

    if (tipo === 'hospitales') {

        Hospital.findById(id, (err, hospital) => {

            if (!hospital) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Hospital no existeix',
                    errors: err
                });
            }

            var pathViejo = './uploads/hospitales/' + hospital.img;

            // Si existeix, elimina la imatge anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }

            // Pugem la imatge nova
            hospital.img = nombreArchivo;
            hospital.save((err, hospitalActualizado) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error a l´actualitzar la imatge de l´hospital',
                        errors: err
                    });
                }

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imatge hospital actualitzada',
                    hospital: hospitalActualizado
                });

            });



        });
    }
}

module.exports = app;