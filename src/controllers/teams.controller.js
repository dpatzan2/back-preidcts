const Teams = require('../models/teams.model');


//Create
const createTeam = (req,res)=>{
    let parameters = req.body;
    console.log(parameters)
    let teamModel = new Teams();
    if(req.user.rol === 'ADMIN'){
        if(parameters.name && parameters.image){
            Teams.findOne({name:parameters.name},(err,nameFound) => {
                if(err){
                    return res.status(500).send({message:'Internt error, try it again'});
                }
                if(!nameFound){
                    teamModel.name = parameters.name;
                    teamModel.image = parameters.image;
                    teamModel.save((err,teamSaved)=>{
                        if(err){
                            return res.status(500).send({message:'Intern error, try it again'});
                        }
                        if(!teamSaved){
                            return res.status(500).send({message:"Error creating the team, try it again"});
                        }
                        return res.status(200).send({team:teamSaved});
                    })
                }else{
                    return res.status(500).send({message:'This team already exists'});
                }
            })
        }else{
            return res.status(500).send({message:'Fill all parameters'});
        }
    }else{
        return res.status(500).send({message:'You are not an Admin'});
    }
};

//Edit
const editTeam = (req,res)=>{
    let idTeam = req.params.idTeam;
    let parameters = req.body;
    let teamModel = new Teams();

    if(req.user.rol === 'ADMIN'){
        Teams.findById(idTeam,(err,infoTeam)=>{
            if(err){
                return res.status(500).send({message:'Intern error, try it again'});
            }
            if(infoTeam){
                teamModel.findOne({name:parameters.name},(err,teamFound)=>{
                    if(err){
                        return res.status(500).send({message:'Intern error, try it again'});
                    }
                    if(!teamFound || (infoTeam.name ===parameters.name)){
                        Teams.findByIdAndUpdate(idTeam,parameters,{new:true},(err,teamEdited)=>{
                            if(err){
                                return res.status(500).send({message:'Intern error, try it again'});
                            }
                            if(!teamEdited){
                                return res.status(500).send({message:'Error editing the team'});
                            }
                            return res.status(200).send({team:teamEdited});
                        })
                    }else{
                        return res.status(500).send({message:'This team already exists'});
                    }
                })
            }else{
                return res.status(500).send({message:'Error finding the team'});
            }
        })
    }else{
        return res.status(500).send({message:'You are not an Admin'});
    }
};

//Delete
const deleteTeam = (req,res)=>{
    let idTeam = req.params.idTeam;
    if(req.user.rol==='ADMIN'){
        Teams.findByIdAndDelete(idTeam, (err,teamDeleted)=>{
            if(err){
                return res.status(500).send({message:'Intern error, try it again'});
            }
            if(!teamDeleted){
                return res.status(500).send({message:'Error deleting the team'});
            }

            return res.status(200).send({team:teamDeleted});
        })
    }else{
        return res.status(500).send({message:'You are not an Admin'});
    }
}


//Search

const serchTeamById = (req,res)=>{
    let idTeam = req.params.idTeam;
    Teams.findById(idTeam,(err,teamFound)=>{
        if(err){
            return res.status(500).send({message:'Intern error, try it again'});
        }
        if(!teamFound){
            return res.status(500).send({message:'Error finding the team'})
        }
    })
}

const teams = (req,res)=>{
    Teams.find((err,teamsFound)=>{
        if(err){
            return res.status(500).send({message:'Intern error, try it again'});
        }
        if(!teamsFound){
            return res.status(500).send({message:'Error finding teams'});
        }

        return res.status(200).send({teams:teamsFound});
    })
}

const searchTeamByName = (req,res)=>{
    let name = req.params.name;
    Teams.find({name:{ $regex: name, $options: 'i' }},(err,teamsFound)=>{
        if(err){
            return res.status(500).send({message:'Intern error, try it again'});
        }
        if(!teamsFound){
            return res.status(500).send({message:'Error finding teams'});
        }
        return res.status(200).send({teams:teamsFound})
    })
}


module.exports = {
    createTeam,
    deleteTeam,
    editTeam,
    searchTeamByName,
    serchTeamById,
    teams
}
