const Matches = require('../models/matches.model');

const match = (req,res)=>{
    let parameters = req.body;
    let matchesModel = new Matches();
    if(req.user.rol =='ADMIN'){
        if(parameters.idTeam1&&parameters.idTeam2&&parameters.idFase&&parameters.date){
            if(parameters.idTeam1===parameters.idTeam2){
                return res.status(500).send({message:'This is imposible'});
            }
            matchesModel.idTeam1 = parameters.idTeam1;
            matchesModel.idTeam2 = parameters.idTeam2;
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


module.exports = {
    match,
    deleteMatch,
    editMatch,
    futureMatches,
    playedMatches
}