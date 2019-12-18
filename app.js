// Requires
var express = require('express');
var mongoose = require('mongoose');



// Inicialitzar variables
var app = express();



// Comexió a la base de dades
mongoose.connect('mongodb://localhost:27017/hospitalDB', { useNewUrlParser: true, useCreateIndex: true }, (err) => {
    if (err) throw err;

    console.log('Base de datos: \x1b[32m%s\x1b[0m', ' online');

});



// Rutes
app.get('/', (req, res, next) => {

    res.status(200).json({
        ok: true,
        mensaje: 'Petició realitzada correctament'
    });

});



// Excoltar peticions
app.listen(3000, () => {
    console.log('Express server port 3000: \x1b[32m%s\x1b[0m', ' online');
});
