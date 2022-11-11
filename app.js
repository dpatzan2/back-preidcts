//importaciones
const express =require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
var app = express();
app.use(cookieParser());
  
const corsConfig = {
    credentials: true,
    origin: true,
};

//importaciones rutas
const UsuariosRutas = require('./src/routes/usuarios.routes');
const RoomsRoutes = require('./src/routes/rooms.routes');

//middleware

app.use(express.urlencoded({extended: false}));
app.use(express.json());

//cabecera
app.use(cors(corsConfig));

//carga de rutas

app.use('/api', UsuariosRutas, RoomsRoutes);



module.exports = app;