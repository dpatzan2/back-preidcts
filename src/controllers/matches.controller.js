const Matches = require('../models/matches.model');
const Predicts = require('../models/predicts.model');
const Fases = require('../models/fases.model');
const Puntos = require('../models/puntos.model')

const match = (req,res)=>{
    let parameters = req.body;
    let matchesModel = new Matches();
    if(req.user.rol =='ADMIN'){
        if(parameters.idTeam1&&parameters.idTeam2&&parameters.idFase&&parameters.date){
            if(parameters.idTeam1===parameters.idTeam2){
                return res.status(500).send({message:'This is imposible'});
            }
            matchesModel.idTeam1 = parameters.idTeam1;
            matchesModel.goalsTeam1 = 0;
            matchesModel.idTeam2 = parameters.idTeam2;
            matchesModel.goalsTeam2 = 0;
            matchesModel.idFase = parameters.idFase;
            matchesModel.date = parameters.date;
            matchesModel.state = 'Progress';
            matchesModel.save((err,matchSaved)=>{
                if(err){
                    return res.status(500).send({message:'Intern error, try it again'});
                }
                if(!matchSaved){
                    return res.status(500).send({message:'Error creating the match'});
                }
                return res.status(200).send({match:matchSaved});
            })
        }else{
            return res.status(500).send({message:'Fill al parameters'});
        }
    }else{
        return res.status(500).send({message:'You are not an Admin'});
    }
}

const deleteMatch = (req,res)=>{
    let idMatch = req.params.idMatch;
    if(req.user.rol === 'ADMIN'){
        Matches.findByIdAndDelete(idMatch,(err,matchDeleted)=>{
            if(err){
                return res.status(500).send({message:'Intern error, try it again'});
            }
            if(!matchDeleted){
                return res.status(500).send({message:'Error deleting the match'});
            }
            return res.status(200).send({match:matchDeleted});
        })
    }else{
        return res.status(500).send({message:'You are not an Admin'});
    }
}

const editMatch = (req,res)=>{
    let idMatch = req.params.idMatch;
    let parameters = req.body;
    if(req.user.rol === 'ADMIN'){
        if(!parameters.goals1 || !parameters.goals2){
            Matches.findByIdAndUpdate(idMatch,({goalsTeam1:parameters.goals1, goalsTeam2:parameters.goals2,state:'Finished'}),(err,matchEdited)=>{
                if(err){
                    return res.status(500).send({message:'Intern error, try it again'});
                }
                if(!matchEdited){
                    return res.status(500).send({message:'Error updating the match'});
                }
                return res.status(200).send({match:matchEdited});
            })   
        }
    }else{
        return res.status(500).send({message:'You are not an Admin'});
    }
}

const futureMatches = (req,res)=>{
    Matches.findOne({state:'Progress'},(err,matchesFound)=>{
        if(err){
            return res.status(500).send({message:'Intern error, try it again'});
        }
        if(!matchesFound){
            return res.status(500).send({message:'Error finding matches'});
        }
        return res.status(200).send({matches:matchesFound});
    }).sort((date1,date2)=>date1-date2);
}

const playedMatches = (req,res)=>{
    Matches.findOne({state:'Finished'},(err,matchesFound)=>{
        if(err){
            return res.status(500).send({message:'Intern error, try it again'});
        }
        if(!matchesFound){
            return res.status(500).send({message:'Error finding matches'});
        }
        return res.status(200).send({matches:matchesFound});
    }).sort((date1,date2)=>date1-date2);
}
const getMatches = (req, res) => {
    Matches.find({idFase: req.params.idFase}, (err, dataFound) => {
        if (err) return res.status(500).send({message:'Intern error, try it again'});
        if (!dataFound) return res.status(500).send({message:'Error finding matches'});
        return res.status(200).send({matches:dataFound});
    }).sort({date: 1}).populate('idTeam1').populate('idTeam2')
}

const getMatchById = (req, res) => {
    Matches.findById({_id: req.params.idMatch}, (err, dataFound) => {
        if (err) return res.status(500).send({message:'Intern error, try it again'});
        if (!dataFound) return res.status(500).send({message:'Error finding matches'});
        return res.status(200).send({matches:dataFound});
    }).populate('idTeam1').populate('idTeam2')
}

const putMatches = (req, res) => {
    const inputs = req.body;
    let pts = 0;
    Matches.findById({_id: req.params.idMatch}, (err, dataFound) => {
        if (err) return res.status(500).send({message:'Intern error, try it again'});
        if (!dataFound) return res.status(500).send({message:'Error finding matches'});
        
        Predicts.find({idMatch: dataFound._id}, (err, predictsFound) => {
            if (err) return res.status(500).send({message:'Intern error, try it again'});
            if (!predictsFound) return res.status(500).send({message:'Error finding predicts'});
            console.log(predictsFound.length)
            for (let i = 0; i < predictsFound.length; i++) {
                
                if (predictsFound[i].goalTeam1 == predictsFound[i].goalTeam2 == inputs.goalTeam2 ) {
                    pts = 1
                }
                if (inputs.goalTeam1 > inputs.goalTeam2 && predictsFound[i].goalTeam1 > predictsFound[i].goalTeam2) {
                    pts = 1
                }else if (inputs.goalTeam2 > inputs.goalTeam1 && predictsFound[i].goalTeam2 > predictsFound[i].goalTeam1) {
                    pts = 1
                }else{
                    pts = 0
                }
                if (predictsFound[i].goalTeam1 == inputs.goalTeam1 && predictsFound[i].goalTeam2 == inputs.goalTeam2){
                    pts = 3
                }
                putPts(pts, req.params.faseId, predictsFound[i].idUsuario)
            }
            Matches.findByIdAndUpdate({_id: req.params.idMatch}, {goalsTeam1:inputs.goalTeam1, goalsTeam2:inputs.goalTeam2,state:'Finished'}, {new:true}, (err, actualizatedMatch) =>{
                if (err) return res.status(500).send({message:'Intern error, try it again'});
                if (!actualizatedMatch) return res.status(500).send({message:'Error updating Match'});

                return res.status(200).send({message: 'Match has been actulizated' })
            })
        })
    })
}

const finishMatchReq = (req, res)  => {
    const inputs = req.body;
    let pts = 0;
    Matches.findById({_id: req.params.idMatch}, (err, dataFound) => {
        if (err) return res.status(500).send({message:'Intern error, try it again'});
        if (!dataFound) return res.status(500).send({message:'Error finding matches'});
        
        Predicts.find({idMatch: dataFound._id}, (err, predictsFound) => {
            if (err) return res.status(500).send({message:'Intern error, try it again'});
            if (!predictsFound) return res.status(500).send({message:'Error finding predicts'});
            console.log(predictsFound.length)
            for (let i = 0; i < predictsFound.length; i++) {
                if (predictsFound[i].goalTeam1 === inputs.goalTeam1 && predictsFound[i].goalTeam2 === inputs.goalTeam2){
                    pts = 3
                }
                if (predictsFound[i].goalTeam1 === predictsFound[i].goalTeam2 === inputs.goalTeam2 ) {
                    pts = 1
                }
                if (inputs.goalTeam1 > inputs.goalTeam2 && predictsFound[i].goalTeam1 > predictsFound[i].goalTeam2) {
                    pts = 1
                }else if (inputs.goalTeam2 > inputs.goalTeam1 && predictsFound[i].goalTeam2 > predictsFound[i].goalTeam1) {
                    pts = 1
                }else{
                    pts = 0
                }
                putPts(pts, req.params.faseId, predictsFound[i].idUsuario)
            }
            Matches.findByIdAndUpdate({_id: req.params.idMatch}, {goalsTeam1:inputs.goalTeam1, goalsTeam2:inputs.goalTeam2,state:'Finished'}, {new:true}, (actualizatedMatch) =>{
                if (err) return res.status(500).send({message:'Intern error, try it again'});
                if (!actualizatedMatch) return res.status(500).send({message:'Error updating Match'});

                return res.status(200).send({message: 'Match has been actulizated' })
            })
        })
    })
}
const putPts = (pts, faseId,user) => {
    Puntos.updateMany({fase: faseId,idUsuario:user}, { $inc: { pts: pts} }, { new: true }, (err, actulazitedPoints) => {
        if (err) return res.status(500).send({message:'Intern error, try it again'});
        if (!actulazitedPoints) return res.status(500).send({message:'Error updating Points'});
    })
}

module.exports = {
    match,
    deleteMatch,
    editMatch,
    futureMatches,
    getMatches,
    playedMatches,
    putMatches,
    getMatchById
}