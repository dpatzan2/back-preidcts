//importaciones
const express =require('express');
const cors = require('cors');
var app = express();

//importaciones rutas
const UsuariosRutas = require('./src/routes/usuarios.routes');

//middleware

app.use(express.urlencoded({extended: false}));
app.use(express.json());

//cabecera
app.use(cors());

//carga de rutas

app.use('/api', UsuariosRutas);



module.exports = app;