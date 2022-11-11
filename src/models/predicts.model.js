const mongoose = require('mongoose');
var Schema = mongoose.Schema;


var PredictsSchema = Schema({ 
    idMatch: { type: Schema.Types.ObjectId, ref: 'match'},
    idUsuario: { type: Schema.Types.ObjectId, ref: 'usuarios'},
    idRoom: { type: Schema.Types.ObjectId, ref: 'rooms'},
    goalTeam1: number,
    goalTeam2: number
});

module.exports = mongoose.model('Predicts', PredictsSchema);