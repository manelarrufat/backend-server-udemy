var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Medico = require('../models/medico');

/*******************************************
 * Obtenir tots els metges
 *******************************************/
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Medico.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .exec((err, medicos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error carregant metges',
                    errors: err
                });
            }

            Medico.count({}, (err, conteo) => {
                res.status(200).json({
                    ok: true,
                    medicos: medicos,
                    total: conteo
                });

            });


        });
});





/*******************************************
 * Modificar metge
 *******************************************/
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Medico.findById(id, (err, medico) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar metge.',
                errors: err
            });
        }

        if (!medico) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El metge amb id ' + id + ' no existeix.',
                errors: { message: 'No existeix un metge amb aquest ID.' }
            });
        }

        medico.nombre = body.nombre;
        medico.usuario = req.usuario._id;
        medico.hospital = body.hospital;

        medico.save((err, medicoGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al guardar metge.',
                    errors: err
                });
            }


            res.status(200).json({
                ok: true,
                medico: medicoGuardado
            });


        });



    });



});



/*******************************************
 * Crear nou metge
 *******************************************/
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var medico = new Medico({
        nombre: body.nombre,
        usuario: req.usuario._id,
        hospital: body.hospital
    });

    medico.save((err, medicoGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear metge',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            medico: medicoGuardado
        });

    });



});


/*******************************************
 * Eliminar metge per l'ID
 *******************************************/
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Medico.findByIdAndRemove(id, (err, medicoBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar metge',
                errors: err
            });
        }

        if (!medicoBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existeix cap metge amb aquest ID',
                errors: { message: 'No existeix cap metge amb el ID ' + id }
            });
        }

        res.status(200).json({
            ok: true,
            medico: medicoBorrado
        });
    });
});



module.exports = app;