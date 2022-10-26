const Usuarios = require('../models/usuarios.model');
const Rooms = require('../models/rooms.model');
const Participants = require('../models/participants.model');
const Puntos = require('../models/puntos.model');

const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');

function crearAdminPorDefecto() {
    var usuarioModelo = new Usuarios();
    Usuarios.findOne({ usuario: 'ADMIN' }, (err, usuarioEncontrado) => {

        if (!usuarioEncontrado) {
            usuarioModelo.usuario = 'ADMIN'
            usuarioModelo.rol = 'ADMIN'

            bcrypt.hash('123456', null, null, (err, passwordEncriptada) => {
                usuarioModelo.password = passwordEncriptada
                usuarioModelo.save(() => {

                })
            })
        } else {
            console.log('no me cree')
        }
    })
}

const creaerUsuarios = (req, res) => {
    let parameters = req.body;
    let usuarioModel = new Usuarios();
}

function Login(req, res) {
    var parametros = req.body;
    Usuarios.findOne({ usuario: parametros.usuario }, (err, usuarioEncontrado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (usuarioEncontrado) {
            // COMPARO CONTRASENA SIN ENCRIPTAR CON LA ENCRIPTADA
            bcrypt.compare(parametros.password, usuarioEncontrado.password,
                (err, verificacionPassword) => {//TRUE OR FALSE
                    // VERIFICO SI EL PASSWORD COINCIDE EN BASE DE DATOS
                    if (verificacionPassword) {
                        // SI EL PARAMETRO OBTENERTOKEN ES TRUE, CREA EL TOKEN
                        if (parametros.obtenerToken === 'true') {
                            return res.status(200)
                                .send({ token: jwt.crearToken(usuarioEncontrado) })
                        } else {
                            usuarioEncontrado.password = undefined;
                            return res.status(200)
                                .send({ usuario: usuarioEncontrado })
                        }


                    } else {
                        return res.status(500)
                            .send({ mensaje: 'Las contrasena no coincide' });
                    }
                })

        } else {
            return res.status(500)
                .send({ mensaje: 'Error, el correo no se encuentra registrado.' })
        }
    })
}

const obtenerListaUsuarios = (req, res) => {
    Puntos.findOne({idRoom: req.params.idRoom, idUsuario: req.user.sub}, (err, listaFound) =>{
        if (err) return res.status(500).send({message: 'Ocurrio un eror al tratar de obtener los usuarios'});
        if(!listaFound) return res.status(500).send({message: 'No pertenes a esta sala o no existe' });

        return res.status(200).send({lista: listaFound});
    }).populate('idUsuario', 'usuario').populate('idRoom', 'nombreSala');
}

const eliminarUsuariosSala = (req, res) => {
    if(req.user.rol == 'participant') return res.status(500).send({message: 'Los participantes no pueden eliminar a usuarios de la sala'});

    Usuarios.findOne({_id: req.params.idUser}, (err, usuarios) => {
        if (err) return res.status(500).send({message: 'Ocurrio un eror al tratar de obtener los usuarios'});
        if (!usuarios) return res.status(500).send({message: 'No se pudo encontrar el usuario'});
        Participants.findOneAndDelete({idRoom: req.params.idRoom, idUsuario: req.params.idUser}, {new: true}, (err, participanteEliminado) =>{
            if (err) return res.status(500).send({message: 'Ocurrio un eror al tratar de obtener los usuarios'});
            if (!participanteEliminado) return res.status(500).send({message: 'Este usuario no pertenece a tu sala'});

            return res.status(200).send({participanteEliminado: participanteEliminado});
        })
    });
}

module.exports = {
    Login,
    crearAdminPorDefecto,
    obtenerListaUsuarios,
    eliminarUsuariosSala
}