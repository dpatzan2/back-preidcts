const mongoose = require('mongoose');
var Schema = mongoose.Schema;


var UsuariosSchema = Schema({ 
    nombre: String,
    password: String,
    rol: String,
    usuario: String,
    pts: Number,
    romId: { type: Schema.Types.ObjectId, ref: 'rooms'}
});

module.exports = mongoose.model('Usuarios', UsuariosSchema);