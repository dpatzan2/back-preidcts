const Rooms = require('../models/rooms.model');
const Usuarios = require('../models/usuarios.model');
const Participants = require('../models/participants.model');
const Puntos = require('../models/puntos.model');
const Fases = require('../models/fases.model');
const uuid = require("uuid").v4;

const createRoom = (req, res) => {
    console.log(req.body)
    let parameters = req.body;
    let roomModel = new Rooms();
    let generateId = uuid();
    let participantsModel = new Participants();
    console.log(generateId)
    if( parameters.nameRoom){
        roomModel.nombreSala = parameters.nameRoom
        roomModel.dueñoSala = req.user.sub;
        roomModel.idUnion = generateId;
        
        roomModel.save((err, roomSaved) => {
            if (err) return res.status(500).send({message: 'Ocurrio un eror interno vuelve a intentarlo'});
            if (!roomSaved) return res.status(500).send({message: 'No se pudo crear la sala intentalo de nuevo mas tarde'});

            participantsModel.idUsuario = req.user.sub;
            participantsModel.idRoom = roomSaved._id;

            participantsModel.save((err, partcuipanSaved) => {
                if (err) return res.status(500).send({message: 'Ocurrio un eror interno vuelve a intentarlo'});
                Fases.find( async (err, fasesEncontradas)  =>{
                    if (err) return res.status(500).send({message: 'Ocurrio un eror interno vuelve a intentarlo 2'});
                    
                    for (let i = 0; i < fasesEncontradas.length; i++) {
                        console.log(roomSaved._id)
                        let puntosModel = new Puntos();
                        puntosModel.idUsuario = req.user.sub;
                        puntosModel.idRoom = roomSaved._id;
                        puntosModel.pts = 0
                        
                        puntosModel.fase = fasesEncontradas[i]._id;
    
                        console.log(puntosModel)
    
                        puntosModel.save((err, puntosGuardados) => {
                            
                            console.log('llegue aca')
                   
                        })
     
                    }
                    return res.status(200).send({message: 'Te has unido exitosamente a la sala' })
                });
            })
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
    console.log(req.user)
    let roomId = req.params.roomId;
    let participantsModel = new Participants();
    Rooms.findOne({idUnion: roomId}, (err, joinRoom) => {
        if (err) return res.status(500).send({message: 'Ocurrio un eror interno vuelve a intentarlo 1'});
        if (!joinRoom) return res.status(500).send({message: 'No hay ninguna sala con este id'});
        console.log(joinRoom)
        participantsModel.idUsuario = req.user.sub;
        participantsModel.idRoom = joinRoom._id;
        participantsModel.save((err, participanteAgregado) => {
            Fases.find( async (err, fasesEncontradas)  =>{
                if (err) return res.status(500).send({message: 'Ocurrio un eror interno vuelve a intentarlo 2'});
                
                for (let i = 0; i < fasesEncontradas.length; i++) {
                    let puntosModel = new Puntos();
                    puntosModel.idUsuario = req.user.sub;
                    puntosModel.idRoom = joinRoom._id;
                    puntosModel.pts = 0
                    
                    puntosModel.fase = fasesEncontradas[i]._id;

                    console.log(puntosModel)

                    puntosModel.save((err, puntosGuardados) => {

                    })
 
                }
                console.log('llegue aca')
                return res.status(200).send({message: 'Te has unido exitosamente a la sala' })
            });
        });
    });
}


const crearFases = (req, res) => {
    let parameters = req.body;
    let FasesModel = new Fases();
    if(parameters.nombreFase){
        FasesModel.nombreFase = parameters.nombreFase
        
        FasesModel.save((err, faseGuardad) => {
            if (err) return res.status(500).send({message: 'Ocurrio un eror interno vuelve a intentarlo'});
            
            return res.status(200).send({message: 'La fase se guardo exitosanente'});
        })
    }else{
        return res.status(500).send({message: 'El nombre de la fase es requerido'})
    }
}

const onbetenrFases = (req, res) => {
    Fases.find((err, fasesEncontradas) => {
        if (err) return res.status(500).send({message: 'Ocurrio un eror interno vuelve a intentarlo'});
        if (!fasesEncontradas) return res.status(500).send({message: 'Aun no hay fases registradas' })

        return res.status(200).send({fases: fasesEncontradas})
    });
}

const obtenerPuntosPorFase = (req, res) => {
    console.log(req.params.idRoom)
    Puntos.find({idRoom: req.params.idRoom}, (err, puntosEncontrados) => {
        if (err) return res.status(500).send({message: 'Ocurrio un eror interno vuelve a intentarlo'});

        console.log(puntosEncontrados)
        return res.status(200).send({puntos: puntosEncontrados});
    }).populate('idUsuario', 'usuario').sort({pts: -1})
}

const obtenerRoomsParticipando = (req, res) =>{
    Participants.find({idUsuario: req.user.sub}, (err, participacionesEncontradas) =>{
        if (err) return res.status(500).send({message: 'Ocurrio un eror interno vuelve a intentarlo'});
        if (!participacionesEncontradas) return res.status(404).send({message: 'No estas participando en ninguna sala' });

        return res.status(200).send({participaciones: participacionesEncontradas})
    }).populate('idRoom', 'nombreSala dueñoSala');
}


module.exports = {
    createRoom,
    deleteRoom,
    joinRoom,
    crearFases,
    obtenerRoomsParticipando,
    onbetenrFases,
    obtenerPuntosPorFase
}