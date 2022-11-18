const mongoose = require('mongoose');
var Schema = mongoose.Schema;


var PredictsSchema = Schema({ 
    idMatch: { type: Schema.Types.ObjectId, ref: 'Matches'},
    idUsuario: { type: Schema.Types.ObjectId, ref: 'usuarios'},
    idRoom: { type: Schema.Types.ObjectId, ref: 'rooms'},
    goalTeam1: Number,
    goalTeam2: Number
});
 
module.exports = mongoose.model('Predicts', PredictsSchema);