const express = require('express');
const roomsController = require('../Controllers/rooms.controller');
const md_autenticacion = require('../middlewares/autenticacion');

var api = express.Router();

//rutas para Usuarios
api.post('/crearRoom', md_autenticacion.Auth, roomsController.createRoom);
api.delete('eliminarRoom/:idRoom', md_autenticacion.Auth, roomsController.deleteRoom);
api.post('/joinRoom/:roomId', md_autenticacion.Auth, roomsController.joinRoom);

api.post('/crearFase', md_autenticacion.Auth, roomsController.crearFases);
api.get('/getPhases', md_autenticacion.Auth, roomsController.onbetenrFases);
api.get('/getRooms', md_autenticacion.Auth, roomsController.obtenerRoomsParticipando);
api.get('/getPoints/:idRoom', md_autenticacion.Auth, roomsController.obtenerPuntosPorFase);

module.exports = api;