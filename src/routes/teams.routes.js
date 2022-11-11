const express = require('express');
const teamsController = require('../Controllers/teams.controller');
const md_autenticacion = require('../middlewares/autenticacion');


var api = express.Router();

const storage = multer.diskStorage({
    filename: function (res, file, cb) {
      const ext = file.originalname.split(".").pop();
      const fileName = Date.now(); 
      cb(null, `${fileName}.${ext}`); 
    },
    destination: function (res, file, cb) {
      const ext = file.originalname.split(".").pop();
      cb(null, `./files`);
    },
  });
  
  const upload = multer({ storage, limits: { fileSize: 1000000000, files: 20 } });

//rutas para teams
api.post('/addTeam',md_autenticacion.Auth, upload.array("files"), teamsController.createTeam);
api.delete('/deleteTeam/:idTeam',md_autenticacion, teamsController.deleteTeam);
api.put('/editTeam/:idTeam', md_autenticacion.Auth, teamsController.editTeam);
api.get('/teams', md_autenticacion.Auth, teamsController.teams);
api.get('/idTeam/:idTeam',md_autenticacion.Auth,teamsController.serchTeamById);
api.get('/searchTeam/:name',md_autenticacion.Auth, teamsController.searchTeamByName);

module.exports = api;