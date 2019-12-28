var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Hospital = require('../models/hospital');

/*******************************************
 * Obtenir tots els hospitals
 *******************************************/
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Hospital.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .exec((err, hospitales) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error carregant hospitals',
                    errors: err
                });
            }

            Hospital.count({}, (err, conteo) => {
                res.status(200).json({
                    ok: true,
                    hospitales: hospitales,
                    total: conteo
                });

            });


        });
});





/*******************************************
 * Modificar hospital
 *******************************************/
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Hospital.findById(id, (err, hospital) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar hospital.',
                errors: err
            });
        }

        if (!hospital) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El hospital amb id ' + id + ' no existeix.',
                errors: { message: 'No existeix un hospital amb aquest ID.' }
            });
        }

        hospital.nombre = body.nombre;
        hospital.usuario = req.usuario._id;

        hospital.save((err, hospitalGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al guardar hospital.',
                    errors: err
                });
            }


            res.status(200).json({
                ok: true,
                hospital: hospitalGuardado
            });


        });



    });



});



/*******************************************
 * Crear nou hospital
 *******************************************/
app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var hospital = new Hospital({
        nombre: body.nombre,
        usuario: req.usuario._id
    });

    hospital.save((err, hospitalGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear hospital',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            hospital: hospitalGuardado
        });

    });



});


/*******************************************
 * Eliminar hospital per l'ID
 *******************************************/
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Hospital.findByIdAndRemove(id, (err, hospitalBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar hospital',
                errors: err
            });
        }

        if (!hospitalBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existeix cap hospital amb aquest ID',
                errors: { message: 'No existeix cap hospital amb el ID ' + id }
            });
        }

        res.status(200).json({
            ok: true,
            hospital: hospitalBorrado
        });
    });
});



module.exports = app;