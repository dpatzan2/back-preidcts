const Rooms = require('../models/rooms.model');
const Usuarios = require('../models/usuarios.model');
const Participants = require('../models/participants.model');
const Puntos = require('../models/puntos.model');


const createRoom = (req, res) => {
    let parameters = req.body;
    let roomModel = new Rooms();
    const generateId = () => Math.random().toString(36).substr(2, 18);
    if( parameters.nombreSala){
        roomModel.nombreSala = parameters.nombreSala
        roomModel.dueñoSala = req.user.sub;
        roomModel.idUnion = generateId;
        
        roomModel.save((err, roomSaved) => {
            if (err) return res.status(500).send({message: 'Ocurrio un eror interno vuelve a intentarlo'});
            if (!roomSaved) return res.status(500).send({message: 'No se pudo crear la sala intentalo de nuevo mas tarde'});

            return res.status(200).send({room: roomSaved});
        });
    }else{
        return res.status(500).send({message: 'Ingresa un nombre a la sala para poder continuar'});
    }
}

const deleteRoom = (req, res) =>{
    Rooms.findOne({_id: req.params.idRoom}, (err, findRoom) =>{
        if (err) return res.status(500).send({message: 'Ocurrio un eror interno vuelve a intentarlo'});
        if (findRoom.dueñoSala != req.user.sub) return res.status(500).send({message: 'No puedes eliminar esta sala, no te pertenece'});

        Participants.findOneAndDelete({idRoom: req.params.idRoom}, {new: true}, (err, participantesEliminados) =>{
            if (err) return res.status(500).send({message: 'Ocurrio un eror interno vuelve a intentarlo'});

            Puntos.findOneAndDelete({idRoom: req.params.idRoom}, {new: true}, (err, puntosEliminados) =>{
                if (err) return res.status(500).send({message: 'Ocurrio un eror interno vuelve a intentarlo'});

                Rooms.findByIdAndDelete({_id: req.params.idRoom}, {new: true}, (err, roomEliminada) =>{
                    if (err) return res.status(500).send({message: 'Ocurrio un eror interno vuelve a intentarlo'});

                    return res.status(200).send({message: 'Sala eliminada exitosamente'});
                });
            });
        });
    });
}

const joinRoom = (req, res) => {
    let roomId = req.body;
    let participantsModel = new Participants();
    let puntosModel = new Puntos();
    Rooms.findOne({idUnion: roomId}, (err, joinRoom) => {
        if (err) return res.status(500).send({message: 'Ocurrio un eror interno vuelve a intentarlo'});
        if(!joinRoom) return res.status(404).send({message: 'Ninguna sala coincide con este id'});
        participantsModel.idUsuario = req.user.sub;
        participantsModel.idRoom = joinRoom._id;
        participantsModel.save((err, participanteAgregado) => {
            if (err) return res.status(500).send({message: 'Ocurrio un eror interno vuelve a intentarlo'});
            puntosModel.idUsuario = req.user.sub;
            puntosModel.idRoom = joinRoom._id;
            puntosModel.pts = 0
            puntosModel.fase = 'GRUPOS';
            puntosModel.save((err, puntosGenerados) => {
                if (err) return res.status(500).send({message: 'Ocurrio un eror interno vuelve a intentarlo'});

                return res.status(200).send({message: 'Te has unido exitosamente a la sala' })
            });
        });
    });
}


module.exports = {
    createRoom,
    deleteRoom,
    joinRoom
}