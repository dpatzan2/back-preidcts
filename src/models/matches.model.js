const mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Matches = Schema({ 
    idTeam1:{ type: Schema.Types.ObjectId, ref: 'teams'},
    goalsTeam1: Number,
    idTeam2:{ type: Schema.Types.ObjectId, ref: 'teams'},
    goalsTeam2:Number,
    idFase: { type: Schema.Types.ObjectId, ref: 'Fases'},
    state:String,
    date:Date
});

module.exports = mongoose.model('Matches', Matches);