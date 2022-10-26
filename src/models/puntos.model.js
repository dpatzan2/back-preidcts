const mongoose = require('mongoose');
var Schema = mongoose.Schema;


var PuntosSchema = Schema({ 
    idUsuario: { type: Schema.Types.ObjectId, ref: 'usuarios'},
    idRoom: { type: Schema.Types.ObjectId, ref: 'rooms'},
    pts: Number,
    fase: String
});

module.exports = mongoose.model('Puntos', PuntosSchema);