const express = require('express');
const matchesController = require('../controllers/matches.controller');
const md_autenticacion = require('../middlewares/autenticacion');

var api = express.Router();

//rutas para Usuarios
api.post('/createMatch', md_autenticacion.Auth, matchesController.match);
api.delete('deleteMatch/:idMatch', md_autenticacion.Auth, matchesController.deleteMatch);
api.put('/goals/:idMatch/:faseId', md_autenticacion.Auth, matchesController.putMatches);
api.get('/futureMatches', md_autenticacion.Auth, matchesController.futureMatches);
api.get('/finishedMatches', md_autenticacion.Auth, matchesController.playedMatches);
api.get('/getMatches/:idFase', md_autenticacion.Auth, matchesController.getMatches);
api.get('/getMatchId/:idMatch', md_autenticacion.Auth, matchesController.getMatchById)

module.exports = api;