const mongoose = require('mongoose');
var Schema = mongoose.Schema;


var ParticipantsSchema = Schema({ 
    idUsuario: { type: Schema.Types.ObjectId, ref: 'usuarios'},
    idRoom: { type: Schema.Types.ObjectId, ref: 'rooms'},
});

module.exports = mongoose.model('Participants', ParticipantsSchema);