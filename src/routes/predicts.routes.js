const express = require('express');
const predictsControoler = require('../controllers/predicts.controller')
const md_autenticacion = require('../middlewares/autenticacion');

var api = express.Router();


api.post('/createPredict/:idMatch/:idRoom', md_autenticacion.Auth, predictsControoler.setPredicts);
api.get('/getPredicts/:idRoom', md_autenticacion.Auth, predictsControoler.getPredicts)

module.exports = api;