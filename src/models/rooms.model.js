const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RoomsSchema = Schema({
    nombre: String,
    idUnion: String,
    dueñoSala: { type: Schema.Types.ObjectId, ref: 'usuarios'}
})

module.exports = mongoose.model('rooms', RoomsSchema);