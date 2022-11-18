const mongoose = require('mongoose');
const app = require('./app')
const usuariosControlleri = require('./src/controllers/usuarios.controller')
const Usuarios = require('./src/models/usuarios.model');
const bcrypt = require('bcrypt-nodejs');
const https = require('https');


mongoose.Promise = global.Promise;


mongoose.connect('mongodb+srv://predicts:admin123456@cluster0.30co9.mongodb.net/predicts?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true}).then(() =>{
    console.log("Se encuentra conectado a la base de datos");

    const port = process.env.PORT || 3000;

    const server = https.createServer(app);

    server.listen(port, function() {
        console.log(port)
        usuariosControlleri.crearAdminPorDefecto();
              
    })
}).catch(error => console.log(error))
   
