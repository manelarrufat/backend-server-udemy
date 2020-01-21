// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');



// Inicialitzar variables
var app = express();


// CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:4200"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    next();
});


// Body Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());




// Importar Rutes
var appRoutes = require('./routes/app');
var usuariosRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');
var hospitalesRoutes = require('./routes/hospital');
var medicosRoutes = require('./routes/medico');
var busquedaRoutes = require('./routes/busqueda');
var uploadRoutes = require('./routes/upload');
var imagenesRoutes = require('./routes/imagenes');



// Comexió a la base de dades
mongoose.connect('mongodb://localhost:27017/hospitalDB', { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true }, (err) => {
    if (err) throw err;

    console.log('Base de datos: \x1b[32m%s\x1b[0m', ' online');

});


// Server index config
// var serveIndex = require('serve-index');
// app.use(express.static(__dirname + '/'));
// app.use('/uploads', serveIndex(__dirname + '/uploads'));



// Rutes
app.use('/usuario', usuariosRoutes);
app.use('/hospital', hospitalesRoutes);
app.use('/medico', medicosRoutes);
app.use('/login', loginRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/upload', uploadRoutes);
app.use('/img', imagenesRoutes);
app.use('/', appRoutes);



// Excoltar peticions
app.listen(3000, () => {
    console.log('Express server port 3000: \x1b[32m%s\x1b[0m', ' online');
});