const express = require('express');
const matchesController = require('../Controllers/matches.controller');
const md_autenticacion = require('../middlewares/autenticacion');

var api = express.Router();

//rutas para Usuarios
api.post('/createMatch', md_autenticacion.Auth, matchesController.match);
api.delete('deleteMatch/:idMatch', md_autenticacion.Auth, matchesController.deleteMatch);
api.put('/goals/:idMatch', md_autenticacion.Auth, matchesController.editMatch);
api.get('/futureMatches', md_autenticacion.Auth, matchesController.futureMatches);
api.get('/finishedMatches', md_autenticacion.Auth, matchesController.playedMatches);

module.exports = api;