const mongoose = require('mongoose');
var Schema = mongoose.Schema;


var PuntosSchema = Schema({ 
    idUsuario: { type: Schema.Types.ObjectId, ref: 'Usuarios'},
    idRoom: { type: Schema.Types.ObjectId, ref: 'rooms'},
    pts: Number,
    fase: { type: Schema.Types.ObjectId, ref: 'Fases'},
});

module.exports = mongoose.model('Puntos', PuntosSchema);