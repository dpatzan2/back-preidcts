const Rooms = require('../models/rooms.model');
const Usuarios = require('../models/usuarios.model');


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

        Usuarios.find({romId: req.params.idRoom}, (err, usuariosEncontrados) => {
            if (err) return res.status(500).send({message: 'Ocurrio un eror interno vuelve a intentarlo'});
            for (let i = 0; i < usuariosEncontrados.length; i++) {
                Usuarios.findByIdAndUpdate({_id: usuariosEncontrados[i]._id},{romId: ''}, {new: true}, (err, usuarioEliminado) =>{
                    if (err) return res.status(500).send({message: 'Ocurrio un eror interno vuelve a intentarlo'});

                    Rooms.findByIdAndDelete({_id: req.params.idRoom}, {new: true}, (err, roomDeleted) => {
                        if (err) return res.status(500).send({message: 'Ocurrio un eror interno vuelve a intentarlo'});

                        return res.status(200).send({message: 'Room eliminada exitosamente'});
                    })
                });
            }
        });
    });
}


module.exports = {
    createRoom,
    deleteRoom
}