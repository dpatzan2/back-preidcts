const Predicts = require('../models/predicts.model');


export const getPredicts = (req, res) => {
    Predicts.find({idUsuario: req.user.sub, idRoom: req.params.idRoom}, (err, dataFound) => {
        if (err) return res.status(500).send({message: 'Inter error server, try again later'});
        if (!dataFound) return res.status(404).send({message: 'data not found'});

        return res.status(200).send({predicts: dataFound})
    })
}

export const setPredicts = (req, res) => {
    const info = req.body;
    const modelPredict = new Predicts();
    if(info.goalTeam1 && info.goalTeam2) {
        modelPredict.idMatch = req.params.idMatch;
        modelPredict.idUsuario = req.user.sub;
        modelPredict.idRoom = req.params.idRoom;
        modelPredict.goalTeam1 = info.goalTeam1;
        modelPredict.goalTeam2 = info.goalTeam2;
        Predicts.findOne({idUsuario: req.user.sub, idRoom: req.params.idRoom}, (err, predictFound) => {
            if (err) return res.status(500).send({message: 'Inter server error, try again later'});
            if (predictFound) return res.status(500).send({message: 'Ya hiciste una prediccion sobre este partido y no se puede cambiar'})

            modelPredict.save((err, predictSaved) => {
                if (err) return res.status(500).send({message: 'Inter server error, try again later'});

                return res.status(200).send({message: 'Predict has been created'})
            })
        })
    }else{
        return res.status(500).send({message: 'Debes colocar el marcador de ambos equipos'})
    }
}