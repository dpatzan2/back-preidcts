const express =require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
var app = express();
app.use(cookieParser());

app.use(express.static("./files"));
  
const corsConfig = {
    credentials: true,
    origin: true,
};

//importaciones rutas
const UsuariosRutas = require('./src/routes/usuarios.routes');
const RoomsRoutes = require('./src/routes/rooms.routes');
const TeamRoutes = require('./src/routes/teams.routes')
const MatchesRoutes = require('./src/routes/matches.routes')
const PredictsRoutes = require('./src/routes/predicts.routes')

//middleware

app.use(express.urlencoded({extended: false}));
app.use(express.json());

//cabecera
app.use(cors(corsConfig));

//carga de rutas

app.use('/api', UsuariosRutas, RoomsRoutes,TeamRoutes, MatchesRoutes, PredictsRoutes);



module.exports = app;