const express = require('express');
const teamsController = require('../controllers/teams.controller');
const md_autenticacion = require('../middlewares/autenticacion');
const multer = require("multer");


var api = express.Router();

// const storage = multer.diskStorage({
//     filename: function (res, file, cb) {
//       const ext = file.originalname.split(".").pop();
//       const fileName = Date.now(); 
//       cb(null, `${fileName}.${ext}`); 
//     },
//     destination: function (res, file, cb) {
//       const ext = file.originalname.split(".").pop();
//       cb(null, `./files`);
//     },
//   });
// const upload = multer({ storage, limits: { fileSize: 1000000000, files: 20 } });
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./files");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage: storage });
  

//rutas para teams
api.post('/addTeam',md_autenticacion.Auth, teamsController.createTeam);
api.post("/upload", upload.single("files"), (req, res) => {
  const file = req.file;
  return res.status(200).json(file.filename);
});
api.delete('/deleteTeam/:idTeam',md_autenticacion.Auth, teamsController.deleteTeam);
api.put('/editTeam/:idTeam', md_autenticacion.Auth, teamsController.editTeam);
api.get('/teams', md_autenticacion.Auth, teamsController.teams);
api.get('/idTeam/:idTeam',md_autenticacion.Auth,teamsController.serchTeamById);
api.get('/searchTeam/:name',md_autenticacion.Auth, teamsController.searchTeamByName);

module.exports = api;