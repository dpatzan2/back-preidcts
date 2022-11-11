const mongoose = require('mongoose');
var Schema = mongoose.Schema;


var FasesSchema = Schema({ 
    nombreFase: String,
});

module.exports = mongoose.model('Fases', FasesSchema);